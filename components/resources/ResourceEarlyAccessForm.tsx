"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type WaitlistResponse = {
  ok?: boolean;
  message?: string;
  error?: string;
};

function isWaitlistResponse(value: unknown): value is WaitlistResponse {
  if (typeof value !== "object" || value === null) return false;
  const response = value as Record<string, unknown>;
  return (
    (response.ok === undefined || typeof response.ok === "boolean") &&
    (response.message === undefined || typeof response.message === "string") &&
    (response.error === undefined || typeof response.error === "string")
  );
}

export default function ResourceEarlyAccessForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "resources" }),
      });
      const payload: unknown = await response.json();

      if (!isWaitlistResponse(payload)) {
        throw new Error("The waitlist returned an unexpected response.");
      }
      if (!response.ok || payload.ok !== true) {
        setError(payload.error ?? "Could not join the waitlist. Please try again.");
        return;
      }

      setMessage(payload.message ?? "You’re on the early-access waitlist.");
      setEmail("");
    } catch (requestError) {
      console.error("[resources] unable to join the early-access waitlist:", requestError);
      setError("Could not join the waitlist right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (message) {
    return (
      <p
        aria-live="polite"
        className="flex items-start gap-2 text-sm leading-6 text-emerald-200 sm:max-w-64"
        role="status"
      >
        <CheckCircle2 aria-hidden="true" className="mt-1 size-4 shrink-0" />
        {message}
      </p>
    );
  }

  return (
    <form className="flex min-w-0 flex-col gap-2" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="resource-waitlist-email">
        Email address for early access
      </label>
      <input
        autoComplete="email"
        className="min-h-11 min-w-0 rounded-lg border border-slate-700 bg-slate-950/60 px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-500/20"
        id="resource-waitlist-email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email for early access"
        required
        type="email"
        value={email}
      />
      <button
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Joining..." : "Join Early Access"}
        {!isSubmitting && <ArrowRight aria-hidden="true" className="size-4" />}
      </button>
      {error && (
        <p aria-live="polite" className="text-xs leading-5 text-rose-300" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
