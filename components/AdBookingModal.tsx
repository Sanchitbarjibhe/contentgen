"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type {
  StripeCheckoutElementsSdk,
  StripePaymentElement,
} from "@stripe/stripe-js";
import {
  ArrowLeft,
  Check,
  CreditCard,
  LoaderCircle,
  MapPin,
  Upload,
  X,
} from "lucide-react";
import { z } from "zod";
import {
  formatAdPrice,
  type AdCurrency,
  type AdDuration,
  type AdGateway,
} from "@/lib/ad-pricing";

interface AdBookingModalProps {
  slot: number;
  onClose: () => void;
}

type Country = "IN" | "US" | "FR";

const COUNTRY_CURRENCY: Record<Country, AdCurrency> = {
  IN: "INR",
  US: "USD",
  FR: "EUR",
};

const CreateCheckoutResponseSchema = z.discriminatedUnion("gateway", [
  z.object({
    gateway: z.literal("stripe"),
    sessionId: z.string().min(1),
    clientSecret: z.string().min(1),
  }),
  z.object({
    gateway: z.literal("razorpay"),
    orderId: z.string().min(1),
    amount: z.number().positive(),
    currency: z.literal("INR"),
    keyId: z.string().min(1),
  }),
]);

const ErrorResponseSchema = z.object({ error: z.string() });

interface RazorpaySuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  theme: { color: string };
  handler: (result: RazorpaySuccess) => void;
  modal: { ondismiss: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", handler: (response: {
    error?: { description?: string };
  }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let razorpayScriptPromise: Promise<boolean> | undefined;

function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => {
      razorpayScriptPromise = undefined;
      resolve(false);
    };
    document.body.appendChild(script);
  });
  return razorpayScriptPromise;
}

type StripeActions = Extract<
  Awaited<ReturnType<StripeCheckoutElementsSdk["loadActions"]>>,
  { type: "success" }
>["actions"];

function StripeCheckoutElement({
  clientSecret,
  sessionId,
}: {
  clientSecret: string;
  sessionId: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [actions, setActions] = useState<StripeActions | null>(null);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  useEffect(() => {
    let active = true;
    let paymentElement: StripePaymentElement | null = null;

    async function mountPaymentElement() {
      if (!publishableKey) {
        throw new Error("Stripe is unavailable. Add its publishable key and try again.");
      }
      const stripe = await loadStripe(publishableKey);
      if (!stripe) throw new Error("Unable to load Stripe. Check your connection and try again.");

      const checkout = stripe.initCheckoutElementsSdk({ clientSecret });
      const actionsResult = await checkout.loadActions();
      if (actionsResult.type === "error") {
        throw new Error(actionsResult.error.message);
      }

      if (!active) {
        return;
      }

      setActions(actionsResult.actions);
      const mountNode = mountRef.current;
      if (!mountNode) {
        throw new Error("The Stripe payment form could not be attached.");
      }
      paymentElement = checkout.createPaymentElement();
      paymentElement.mount(mountNode);
    }

    void mountPaymentElement().catch((checkoutError: unknown) => {
      console.error("[ad checkout] unable to mount Stripe payment element:", checkoutError);
      if (active) {
        setError(
          checkoutError instanceof Error
            ? checkoutError.message
            : "Unable to load Stripe checkout.",
        );
      }
    });

    return () => {
      active = false;
      paymentElement?.destroy();
    };
  }, [clientSecret, publishableKey, sessionId]);

  async function confirmPayment() {
    if (!actions) return;
    setPaying(true);
    setError("");
    const returnUrl = `${window.location.origin}/directory?success=true&provider=stripe&session_id=${encodeURIComponent(sessionId)}`;

    try {
      const result = await actions.confirm({ returnUrl, redirect: "always" });
      if (result.type === "error") {
        setError(result.error.message);
        setPaying(false);
        return;
      }
      window.location.assign(returnUrl);
    } catch (confirmationError) {
      console.error("[ad checkout] Stripe payment confirmation failed:", confirmationError);
      setError(
        confirmationError instanceof Error
          ? confirmationError.message
          : "Unable to confirm payment. Please try again.",
      );
      setPaying(false);
    }
  }

  return (
    <div className="mt-5">
      {error && (
        <p
          className="mb-3 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
          role="alert"
        >
          {error}
        </p>
      )}
      <div className="min-h-28 rounded-2xl border border-slate-700 bg-slate-950 p-3">
        <div aria-label="Loading Stripe payment form" className="sr-only" role="status">
          Loading secure Stripe payment form
        </div>
        <div ref={mountRef} />
      </div>
      <button
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 text-sm font-bold text-white transition hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!actions || paying}
        onClick={() => void confirmPayment()}
        type="button"
      >
        {paying && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
        {paying ? "Confirming payment…" : "Pay securely with Stripe"}
      </button>
    </div>
  );
}

export default function AdBookingModal({
  slot,
  onClose,
}: AdBookingModalProps) {
  const [country, setCountry] = useState<Country>("US");
  const [duration, setDuration] = useState<AdDuration>("week");
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutSession, setCheckoutSession] = useState<{
    sessionId: string;
    clientSecret: string;
  } | null>(null);
  const [razorpayOpened, setRazorpayOpened] = useState(false);

  const currency = COUNTRY_CURRENCY[country];
  const gateway: AdGateway = currency === "INR" ? "razorpay" : "stripe";

  useEffect(() => {
    const localeCountry = navigator.language.split("-")[1]?.toUpperCase();
    if (localeCountry === "IN") setCountry("IN");
    else if (localeCountry && ["FR", "DE", "ES", "IT", "NL"].includes(localeCountry)) {
      setCountry("FR");
    }
  }, []);

  useEffect(() => {
    if (!banner) {
      setBannerPreview("");
      return;
    }
    const url = URL.createObjectURL(banner);
    setBannerPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [banner]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  function handleBannerChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setBanner(null);
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file for your banner.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Your banner image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }
    setBanner(file);
  }

  async function verifyRazorpayPayment(result: RazorpaySuccess) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/verify-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      const resultBody: unknown = await response.json();
      if (!response.ok) {
        const parsedError = ErrorResponseSchema.safeParse(resultBody);
        throw new Error(
          parsedError.success
            ? parsedError.data.error
            : "Payment verification failed. Please contact support if you were charged.",
        );
      }
      window.location.assign(
        `/directory?success=true&provider=razorpay&order_id=${encodeURIComponent(result.razorpay_order_id)}`,
      );
    } catch (verificationError) {
      console.error("[ad checkout] Razorpay verification request failed:", verificationError);
      setError(
        verificationError instanceof Error
          ? verificationError.message
          : "Unable to verify payment. Please contact support if you were charged.",
      );
      setLoading(false);
      setRazorpayOpened(false);
    }
  }

  async function startCheckout() {
    if (!banner) {
      setError("Upload a banner image before continuing.");
      return;
    }
    if (gateway === "stripe" && !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setError("Stripe is not configured. Add the Stripe publishable key and try again.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot,
          duration,
          country,
          currency,
          gateway,
          bannerName: banner.name,
        }),
      });
      const responseBody: unknown = await response.json();
      if (!response.ok) {
        const parsedError = ErrorResponseSchema.safeParse(responseBody);
        throw new Error(
          parsedError.success
            ? parsedError.data.error
            : "Unable to create your checkout. Please try again.",
        );
      }

      const checkout = CreateCheckoutResponseSchema.safeParse(responseBody);
      if (!checkout.success) {
        throw new Error("The checkout service returned an invalid response.");
      }

      if (checkout.data.gateway === "stripe") {
        setCheckoutSession({
          sessionId: checkout.data.sessionId,
          clientSecret: checkout.data.clientSecret,
        });
        setLoading(false);
        return;
      }

      const scriptReady = await loadRazorpayScript();
      if (!scriptReady || !window.Razorpay) {
        throw new Error("Unable to load Razorpay Checkout. Please try again.");
      }

      const paymentWindow = new window.Razorpay({
        key: checkout.data.keyId,
        order_id: checkout.data.orderId,
        amount: checkout.data.amount,
        currency: checkout.data.currency,
        name: "Home Talk",
        description: `Billboard ad space #${slot} · ${duration}`,
        theme: { color: "#7c3aed" },
        handler: (paymentResult) => {
          void verifyRazorpayPayment(paymentResult);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setRazorpayOpened(false);
          },
        },
      });
      paymentWindow.on("payment.failed", (paymentFailure) => {
        setError(
          paymentFailure.error?.description ??
            "Payment failed. Please try again or choose another payment method.",
        );
        setLoading(false);
        setRazorpayOpened(false);
      });
      setRazorpayOpened(true);
      paymentWindow.open();
      setLoading(false);
    } catch (checkoutError) {
      console.error("[ad checkout] unable to start payment:", checkoutError);
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start checkout. Please try again.",
      );
      setLoading(false);
      setRazorpayOpened(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/85 p-3 backdrop-blur-md sm:p-5"
      onClick={(event) => {
        if (event.target === event.currentTarget && !loading && !razorpayOpened) {
          onClose();
        }
      }}
    >
      <section
        aria-labelledby="booking-title"
        aria-modal="true"
        className="relative my-auto max-h-[calc(100svh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-700/80 bg-slate-900 p-5 shadow-2xl shadow-purple-950/40 sm:max-h-[calc(100svh-2.5rem)] sm:p-7"
        role="dialog"
      >
        <button
          aria-label="Close ad booking dialog"
          className="absolute right-4 top-4 rounded-lg border border-slate-700 bg-slate-950/70 p-2 text-slate-400 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          disabled={loading || razorpayOpened}
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="size-5" />
        </button>

        {checkoutSession ? (
          <>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-200">
              <CreditCard aria-hidden="true" className="size-3.5" />
              SECURE STRIPE CHECKOUT
            </span>
            <h2 className="mt-4 text-2xl font-bold text-white" id="booking-title">
              Complete your booking
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Payment for billboard space #{slot} · {formatAdPrice(duration, currency)}
            </p>
            <StripeCheckoutElement
              clientSecret={checkoutSession.clientSecret}
              sessionId={checkoutSession.sessionId}
            />
            <button
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-700 px-4 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
              onClick={() => setCheckoutSession(null)}
              type="button"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to booking details
            </button>
          </>
        ) : (
          <>
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs font-semibold text-purple-200">
              <MapPin aria-hidden="true" className="size-3.5" />
              BILLBOARD SPACE #{slot}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-white" id="booking-title">
              Book your ad space
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Upload your creative, choose a campaign length, and pay securely.
            </p>

            <label
              className="mt-5 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 px-4 py-3 text-center transition hover:border-purple-400/60 hover:bg-purple-500/[0.05]"
              htmlFor={`ad-banner-${slot}`}
            >
              {bannerPreview ? (
                // The URL is generated from the selected local image.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Selected billboard banner preview"
                  className="mb-2 max-h-20 max-w-full rounded-lg object-contain"
                  src={bannerPreview}
                />
              ) : (
                <Upload aria-hidden="true" className="size-5 text-purple-300" />
              )}
              <span className="mt-1 text-sm font-semibold text-slate-200">
                {banner ? banner.name : "Upload your banner"}
              </span>
              <span className="mt-1 text-xs text-slate-500">
                Image file · 5 MB max
              </span>
              <input
                accept="image/*"
                className="sr-only"
                id={`ad-banner-${slot}`}
                onChange={handleBannerChange}
                type="file"
              />
            </label>

            <fieldset className="mt-5">
              <legend className="text-sm font-semibold text-slate-200">
                Campaign duration
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {(["week", "month"] as const).map((option) => (
                  <label
                    className={`cursor-pointer rounded-2xl border p-3 transition sm:p-4 ${
                      duration === option
                        ? "border-purple-400/60 bg-purple-500/[0.08] ring-1 ring-purple-400/30"
                        : "border-slate-700 bg-slate-950/50 hover:border-slate-500"
                    }`}
                    key={option}
                  >
                    <input
                      checked={duration === option}
                      className="sr-only"
                      name={`ad-duration-${slot}`}
                      onChange={() => setDuration(option)}
                      type="radio"
                      value={option}
                    />
                    <span className="block text-sm font-semibold text-slate-100">
                      {option === "week" ? "1 Week" : "1 Month"}
                    </span>
                    <span className="mt-1 block text-xs text-slate-400">
                      {formatAdPrice(option, currency)}
                      {option === "week" ? " / week" : " total"}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-5">
              <label
                className="text-sm font-semibold text-slate-200"
                htmlFor={`ad-country-${slot}`}
              >
                Billing country
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-purple-400/70 focus:ring-2 focus:ring-purple-500/20"
                id={`ad-country-${slot}`}
                onChange={(event) => setCountry(event.target.value as Country)}
                value={country}
              >
                <option value="IN">India · INR · Razorpay</option>
                <option value="US">United States · USD · Stripe</option>
                <option value="FR">France · EUR · Stripe</option>
              </select>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
              <div>
                <p className="text-xs text-slate-500">Total · {gateway === "razorpay" ? "Razorpay" : "Stripe"}</p>
                <p className="text-xl font-bold text-white">
                  {formatAdPrice(duration, currency)}
                </p>
              </div>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 text-sm font-bold text-white transition hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
                disabled={loading || razorpayOpened || !banner}
                onClick={() => void startCheckout()}
                type="button"
              >
                {loading ? (
                  <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                ) : (
                  <CreditCard aria-hidden="true" className="size-4" />
                )}
                {loading
                  ? "Preparing checkout…"
                  : razorpayOpened
                    ? "Complete payment in Razorpay…"
                    : "Continue to payment"}
              </button>
            </div>

            {error && (
              <p
                className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
                role="alert"
              >
                {error}
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
