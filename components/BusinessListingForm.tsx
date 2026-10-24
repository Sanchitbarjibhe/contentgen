"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BadgeCheck, Check, Sparkles, X } from "lucide-react";

const CATEGORIES = ["Tech", "Food", "Retail", "SaaS", "Services"] as const;

interface ListingDetails {
  businessName: string;
  website: string;
  category: (typeof CATEGORIES)[number];
  tag: string;
  country: string;
  city: string;
  logoUrl: string;
  description: string;
}

const INITIAL_DETAILS: ListingDetails = {
  businessName: "",
  website: "",
  category: "Tech",
  tag: "",
  country: "",
  city: "",
  logoUrl: "",
  description: "",
};

const fieldClassName =
  "mt-2 w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-400/70 focus:ring-2 focus:ring-purple-500/20";

export default function BusinessListingForm({
  onClose,
}: {
  onClose?: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<ListingDetails>(INITIAL_DETAILS);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdSlug, setCreatedSlug] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function updateDetails<K extends keyof ListingDetails>(
    field: K,
    value: ListingDetails[K],
  ) {
    setDetails((current) => ({ ...current, [field]: value }));
  }

  function advanceStep() {
    if (!formRef.current?.reportValidity()) return;
    setStep((current) => Math.min(current + 1, 3));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: details.businessName,
          category: details.category,
          tag: details.tag,
          websiteUrl: details.website,
          logoUrl: details.logoUrl || undefined,
          description: `${details.description.trim()}\n\nLocation: ${details.city.trim()}, ${details.country.trim()}`,
        }),
      });
      const responseBody: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const error =
          typeof responseBody === "object" &&
            responseBody !== null &&
            "error" in responseBody &&
            typeof responseBody.error === "string"
            ? responseBody.error
            : "Unable to save your listing. Please try again.";
        throw new Error(error);
      }

      if (
        typeof responseBody !== "object" ||
        responseBody === null ||
        !("listing" in responseBody) ||
        typeof responseBody.listing !== "object" ||
        responseBody.listing === null ||
        !("slug" in responseBody.listing) ||
        typeof responseBody.listing.slug !== "string"
      ) {
        throw new Error("The listing was submitted, but the server response was invalid.");
      }

      setCreatedSlug(responseBody.listing.slug);
      setSubmitted(true);
      router.refresh();
    } catch (error: unknown) {
      console.error("[business listing] submission failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save your listing. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      id="list-your-business"
      className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-white shadow-2xl shadow-purple-950/10 backdrop-blur-xl sm:p-8"
    >
      {onClose && (
        <button
          aria-label="Close"
          className="absolute top-4 right-4 z-20 rounded-full bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      )}
      {submitted ? (
        <div className="flex min-h-[28rem] flex-col items-center justify-center text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            <Check aria-hidden="true" className="size-7" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-white">You&apos;re on the list!</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
            <span className="font-semibold text-slate-200">{details.businessName}</span>{" "}
            has been saved to the HookTos directory.
          </p>
          <p className="mt-2 text-xs text-slate-500">Listing slug: {createdSlug}</p>
          <button
            className="mt-6 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            onClick={() => {
              setDetails(INITIAL_DETAILS);
              setStep(1);
              setSubmitted(false);
              setCreatedSlug("");
              setErrorMessage("");
            }}
            type="button"
          >
            Add another business
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4 pt-10">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                <Sparkles aria-hidden="true" className="size-3.5" />
                Free Listing
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                Get your business listed
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Join the HookTos directory in just a few quick steps.
              </p>
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-300">
              Step {step} of 3
            </span>
          </div>

          <div
            aria-label={`Step ${step} of 3`}
            className="mt-6 grid grid-cols-3 gap-2"
          >
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`h-1 rounded-full ${stepNumber <= step
                  ? "bg-gradient-to-r from-purple-500 to-blue-500"
                  : "bg-slate-800"
                  }`}
              />
            ))}
          </div>

          <form
            ref={formRef}
            className="mt-7"
            onSubmit={handleSubmit}
          >
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label
                    className="text-sm font-medium text-slate-200"
                    htmlFor="business-name"
                  >
                    Business name
                  </label>
                  <input
                    autoComplete="organization"
                    className={fieldClassName}
                    id="business-name"
                    maxLength={100}
                    onChange={(event) => updateDetails("businessName", event.target.value)}
                    placeholder="e.g. Northstar Studio"
                    required
                    value={details.businessName}
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-medium text-slate-200"
                    htmlFor="business-website"
                  >
                    Website URL
                  </label>
                  <input
                    autoComplete="url"
                    className={fieldClassName}
                    id="business-website"
                    onChange={(event) => updateDetails("website", event.target.value)}
                    placeholder="https://yourbusiness.com"
                    required
                    type="url"
                    value={details.website}
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-medium text-slate-200"
                    htmlFor="business-category"
                  >
                    Category
                  </label>
                  <select
                    className={fieldClassName}
                    id="business-category"
                    onChange={(event) =>
                      updateDetails(
                        "category",
                        event.target.value as ListingDetails["category"],
                      )
                    }
                    value={details.category}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-sm font-medium text-slate-200"
                    htmlFor="business-tag"
                  >
                    Short business tag
                  </label>
                  <input
                    className={fieldClassName}
                    id="business-tag"
                    maxLength={80}
                    onChange={(event) => updateDetails("tag", event.target.value)}
                    placeholder="e.g. AI Automation"
                    required
                    value={details.tag}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      className="text-sm font-medium text-slate-200"
                      htmlFor="business-city"
                    >
                      City
                    </label>
                    <input
                      autoComplete="address-level2"
                      className={fieldClassName}
                      id="business-city"
                      maxLength={80}
                      onChange={(event) => updateDetails("city", event.target.value)}
                      placeholder="Austin"
                      required
                      value={details.city}
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium text-slate-200"
                      htmlFor="business-country"
                    >
                      Country
                    </label>
                    <input
                      autoComplete="country-name"
                      className={fieldClassName}
                      id="business-country"
                      maxLength={80}
                      onChange={(event) =>
                        updateDetails("country", event.target.value)
                      }
                      placeholder="United States"
                      required
                      value={details.country}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="text-sm font-medium text-slate-200"
                    htmlFor="business-logo"
                  >
                    Logo URL <span className="text-slate-500">(optional)</span>
                  </label>
                  <input
                    className={fieldClassName}
                    id="business-logo"
                    onChange={(event) => updateDetails("logoUrl", event.target.value)}
                    placeholder="https://yourbusiness.com/logo.png"
                    type="url"
                    value={details.logoUrl}
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-medium text-slate-200"
                    htmlFor="business-description"
                  >
                    Description
                  </label>
                  <textarea
                    className={`${fieldClassName} min-h-32 resize-y`}
                    id="business-description"
                    maxLength={500}
                    onChange={(event) =>
                      updateDetails("description", event.target.value)
                    }
                    placeholder="Tell people what makes your business special..."
                    required
                    value={details.description}
                  />
                  <p className="mt-1 text-right text-xs text-slate-500">
                    {details.description.length}/500
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="text-sm leading-6 text-slate-400">
                  Check your details before adding your Free Listing.
                </p>
                <dl className="mt-5 divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-950/50 px-4">
                  {[
                    ["Business", details.businessName],
                    ["Website", details.website],
                    ["Category", details.category],
                    ["Tag", details.tag],
                    ["Location", `${details.city}, ${details.country}`],
                    ["Logo", details.logoUrl || "Not provided"],
                    ["Description", details.description],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="grid gap-1 py-3 sm:grid-cols-[7rem_1fr] sm:gap-3"
                    >
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {label}
                      </dt>
                      <dd className="break-words text-sm leading-5 text-slate-200">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-200">
                  <BadgeCheck aria-hidden="true" className="size-4 shrink-0" />
                  Free listing. No credit card required.
                </p>
              </div>
            )}

            {errorMessage && (
              <p
                aria-live="polite"
                className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/[0.08] px-4 py-3 text-sm text-rose-200"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            <div className="mt-7 flex items-center justify-between gap-3 border-t border-slate-800 pt-5">
              {step > 1 ? (
                <button
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 px-4 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                  onClick={() => setStep((current) => current - 1)}
                  type="button"
                >
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  Back
                </button>
              ) : (
                <span />
              )}
              {step < 3 ? (
                <button
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-purple-950/30 transition hover:from-purple-500 hover:to-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300"
                  onClick={advanceStep}
                  type="button"
                >
                  Continue
                  <ArrowRight aria-hidden="true" className="size-4" />
                </button>
              ) : (
                <button
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-purple-950/30 transition hover:from-purple-500 hover:to-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading}
                  type="submit"
                >
                  <Check aria-hidden="true" className="size-4" />
                  {loading ? "Saving listing..." : "Add free listing"}
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
