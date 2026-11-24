"use client";

import { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ListingPaymentStatus() {
  const router = useRouter();
  const [message, setMessage] = useState<"verified" | "pending" | null>(null);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    if (search.get("listing_payment") !== "success") return;

    const sessionId = search.get("session_id");
    if (search.get("provider") !== "stripe" || !sessionId) {
      setMessage("pending");
      return;
    }

    let active = true;
    void fetch(
      `/api/verify-listing-payment?session_id=${encodeURIComponent(sessionId)}`,
      { cache: "no-store" },
    )
      .then(async (response) => {
        const body: unknown = await response.json();
        if (
          !response.ok ||
          typeof body !== "object" ||
          body === null ||
          !("verified" in body) ||
          typeof body.verified !== "boolean"
        ) {
          throw new Error("Listing payment status could not be verified.");
        }

        if (active) {
          setMessage(body.verified ? "verified" : "pending");
          if (body.verified) router.refresh();
        }
      })
      .catch((error: unknown) => {
        console.error("[business listing] unable to confirm Stripe return:", error);
        if (active) setMessage("pending");
      });

    return () => {
      active = false;
    };
  }, [router]);

  if (!message) return null;

  return (
    <p
      aria-live="polite"
      className={`mb-5 flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${
        message === "verified"
          ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-100"
          : "border-amber-400/20 bg-amber-400/[0.08] text-amber-100"
      }`}
      role="status"
    >
      <BadgeCheck aria-hidden="true" className="size-5 shrink-0" />
      {message === "verified"
        ? "Payment confirmed — your featured listing is live."
        : "Payment is still processing or could not be confirmed. Refresh in a moment or contact support if you were charged."}
    </p>
  );
}
