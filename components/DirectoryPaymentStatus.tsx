"use client";

import { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { z } from "zod";

const VerificationResponseSchema = z.object({ verified: z.boolean() });

export default function DirectoryPaymentStatus() {
  const [message, setMessage] = useState<{
    provider: "stripe" | "razorpay";
    verified: boolean;
  } | null>(null);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    if (search.get("success") !== "true") return;
    const paymentProvider = search.get("provider");
    const reference =
      paymentProvider === "stripe"
        ? search.get("session_id")
        : paymentProvider === "razorpay"
          ? search.get("order_id")
          : null;
    if (
      (paymentProvider !== "stripe" && paymentProvider !== "razorpay") ||
      !reference
    ) {
      return;
    }

    let active = true;
    const parameter = paymentProvider === "stripe" ? "session_id" : "order_id";
    void fetch(
      `/api/verify-checkout?provider=${paymentProvider}&${parameter}=${encodeURIComponent(reference)}`,
      { cache: "no-store" },
    )
      .then(async (response) => {
        const body: unknown = await response.json();
        const parsed = VerificationResponseSchema.safeParse(body);
        if (!response.ok || !parsed.success) {
          throw new Error("Payment status could not be verified.");
        }
        if (active) {
          setMessage({ provider: paymentProvider, verified: parsed.data.verified });
        }
      })
      .catch((error: unknown) => {
        console.error("[ad checkout] unable to verify return status:", error);
        if (active) setMessage({ provider: paymentProvider, verified: false });
      });

    return () => {
      active = false;
    };
  }, []);

  if (!message) return null;

  return (
    <p
      aria-live="polite"
      className={`mb-5 flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${
        message.verified
          ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-100"
          : "border-amber-400/20 bg-amber-400/[0.08] text-amber-100"
      }`}
      role="status"
    >
      <BadgeCheck aria-hidden="true" className="size-5 shrink-0" />
      {message.verified
        ? `Payment confirmed with ${message.provider === "stripe" ? "Stripe" : "Razorpay"}. Thank you for booking!`
        : "Payment is still processing or could not be confirmed. Refresh in a moment or contact support if you were charged."}
    </p>
  );
}
