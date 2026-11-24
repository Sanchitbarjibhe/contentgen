"use client";

import { useState, type FormEvent } from "react";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PaywallModalProps {
    open: boolean;
    onClose: () => void;
}

export function PaywallModal({ open, onClose }: PaywallModalProps) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    if (!open) return null;

    async function joinWaitlist(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setNotice(null);
        try {
            const response = await fetch("/api/premium-waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const responseText = await response.text();
            let responseBody: unknown = null;
            if (responseText.trim()) {
                try {
                    responseBody = JSON.parse(responseText);
                } catch {
                    throw new Error("We couldn't process that response. Please try again later.");
                }
            }

            const message =
                typeof responseBody === "object" &&
                responseBody !== null &&
                "message" in responseBody &&
                typeof responseBody.message === "string"
                    ? responseBody.message
                    : null;

            if (!response.ok) {
                throw new Error(message ?? "Unable to submit your request. Please try again.");
            }
            setNotice(message ?? "Premium is coming soon. Please check back later.");
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Unable to submit your request. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
            <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
                <button type="button" onClick={onClose} aria-label="Close upgrade dialog" className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-100">
                    <X className="size-5" />
                </button>
                <p className="text-sm font-medium text-indigo-300">Premium is coming soon</p>
                <h2 id="upgrade-title" className="mt-2 text-2xl font-semibold text-zinc-100">Keep creating with Premium</h2>
                <p className="mt-2 text-sm text-zinc-400">Get updates about early access to unlimited hook generations and your private generation history.</p>
                <ul className="space-y-3 text-sm text-zinc-300">
                    {["Unlimited daily generations", "Retention scores and saved history", "No account or password required"].map((benefit) => <li key={benefit} className="flex items-center gap-2"><Check className="size-4 text-emerald-400" />{benefit}</li>)}
                </ul>
                <form className="mt-6 space-y-3" onSubmit={joinWaitlist}>
                    <label htmlFor="premium-waitlist-email" className="sr-only">Email address</label>
                    <input
                        id="premium-waitlist-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        className="h-12 w-full rounded-lg border border-white/10 bg-zinc-950 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                    {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
                    {notice && <p role="status" className="text-sm text-indigo-200">{notice}</p>}
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="size-4 animate-spin" />}
                        Join Early Access Waitlist
                    </Button>
                </form>
            </div>
        </div>
    );
}