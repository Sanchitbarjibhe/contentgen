"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PaywallModalProps {
    open: boolean;
    onClose: () => void;
}

export function PaywallModal({ open, onClose }: PaywallModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!open) return null;

    async function startCheckout() {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/checkout", { method: "POST" });
            const data = await response.json();
            if (!response.ok || !data.url) throw new Error(data.error ?? "Unable to start checkout.");
            window.location.assign(data.url);
        } catch (checkoutError) {
            setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.");
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
            <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
                <button type="button" onClick={onClose} aria-label="Close upgrade dialog" className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-100">
                    <X className="size-5" />
                </button>
                <p className="text-sm font-medium text-indigo-300">You used today&apos;s free credits</p>
                <h2 id="upgrade-title" className="mt-2 text-2xl font-semibold text-zinc-100">Keep creating with Premium</h2>
                <p className="mt-2 text-sm text-zinc-400">Unlimited hook generations, plus your private generation history.</p>
                <div className="my-6 flex items-baseline gap-1"><span className="text-4xl font-semibold text-zinc-100">$9.99</span><span className="text-sm text-zinc-500">/ month</span></div>
                <ul className="space-y-3 text-sm text-zinc-300">
                    {['Unlimited daily generations', 'Retention scores and saved history', 'No account or password required'].map((benefit) => <li key={benefit} className="flex items-center gap-2"><Check className="size-4 text-emerald-400" />{benefit}</li>)}
                </ul>
                {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
                <Button type="button" size="lg" className="mt-6 w-full" onClick={startCheckout} disabled={loading}>
                    {loading && <Loader2 className="size-4 animate-spin" />}
                    Upgrade to Premium
                </Button>
            </div>
        </div>
    );
}