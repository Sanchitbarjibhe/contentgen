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
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    if (!open) return null;

    async function joinWaitlist(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setNotice(null);
        try {
            const response = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    feedback,
                    source: "dashboard_premium_modal",
                }),
            });
            const responseText = await response.text();
            let responseBody: { ok?: boolean; message?: string; error?: string } | null = null;
            if (responseText.trim()) {
                try {
                    const parsed: unknown = JSON.parse(responseText);
                    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
                        responseBody = parsed;
                    }
                } catch {
                    responseBody = null;
                }
            }

            if (!response.ok || !responseBody?.ok) {
                setError(responseBody?.error ?? "We couldn't save your request. Please try again.");
                return;
            }
            setNotice(responseBody.message ?? "You're on the waitlist! We'll notify you when Premium launches.");
            setEmail("");
            setFeedback("");
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Network issue while saving. Please check your connection and retry.");
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
                <span className="inline-flex items-center rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-300">
                    Coming Soon
                </span>
                <h2 id="upgrade-title" className="mt-2 text-2xl font-semibold text-zinc-100">Keep creating with Premium</h2>
                <p className="mt-2 text-sm text-zinc-400">Payment checkout isn&apos;t live yet. Join the early-access waitlist for unlimited hook generations and saved history, and tell us what matters most to you.</p>
                <ul className="space-y-3 text-sm text-zinc-300">
                    {["Unlimited daily generations", "Retention scores and saved history", "No account or password required"].map((benefit) => <li key={benefit} className="flex items-center gap-2"><Check className="size-4 text-emerald-400" />{benefit}</li>)}
                </ul>
                <form className="mt-6 space-y-3" onSubmit={joinWaitlist}>
                    <div>
                        <label htmlFor="premium-waitlist-email" className="block text-xs font-medium text-zinc-300">Email address *</label>
                        <input
                            id="premium-waitlist-email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            className="mt-1 h-12 w-full rounded-lg border border-white/10 bg-zinc-950 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                        />
                    </div>
                    <div>
                        <label htmlFor="premium-waitlist-feedback" className="block text-xs font-medium text-zinc-300">Feedback / What features do you want? (Optional)</label>
                        <textarea
                            id="premium-waitlist-feedback"
                            rows={3}
                            value={feedback}
                            onChange={(event) => setFeedback(event.target.value)}
                            placeholder="Batch hook generation, platform templates, custom tone..."
                            className="mt-1 w-full resize-y rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                        />
                    </div>
                    {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</p>}
                    {notice && <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">{notice}</p>}
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="size-4 animate-spin" />}
                        {loading ? "Saving..." : "Join Waitlist & Send Feedback"}
                    </Button>
                </form>
            </div>
        </div>
    );
}