// components/HookGeneratorForm.tsx
"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { cn, formatNiche, formatPlatform } from "@/lib/utils";
import type { GenerationResult, Niche, Platform, UsageInfo } from "@/lib/types";
import { NICHES, PLATFORMS } from "@/lib/types";

interface HookGeneratorFormProps {
  onGenerated: (result: GenerationResult & { id: string; usage: UsageInfo }) => void;
  initialUsage?: UsageInfo;
}

const MIN_TOPIC_LENGTH = 10;

export function HookGeneratorForm({ onGenerated, initialUsage }: HookGeneratorFormProps) {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState<Niche>("TECH");
  const [platform, setPlatform] = useState<Platform>("SHORTS");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageInfo | undefined>(initialUsage);

  const isOutOfCredits = usage?.limit !== null && usage?.remaining === 0;
  const canSubmit = topic.trim().length >= MIN_TOPIC_LENGTH && !loading && !isOutOfCredits;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, niche, platform }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        if (data.usage) setUsage(data.usage);
        return;
      }

      setUsage(data.usage);
      onGenerated(data);
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardBody className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Topic input */}
          <div>
            <label htmlFor="topic" className="mb-2 block text-sm font-medium text-zinc-300">
              Video topic or script summary
            </label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={4}
              maxLength={1200}
              placeholder="e.g. I tried the 5am routine every billionaire swears by for 30 days, and it almost wrecked my sleep..."
              className={cn(
                "w-full resize-none rounded-lg border border-white/10 bg-zinc-950/60 px-3.5 py-3 text-sm text-zinc-100",
                "placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              )}
            />
            <div className="mt-1 flex justify-between text-xs text-zinc-600">
              <span>{topic.trim().length < MIN_TOPIC_LENGTH ? `${MIN_TOPIC_LENGTH - topic.trim().length} more characters needed` : " "}</span>
              <span>{topic.length}/1200</span>
            </div>
          </div>

          {/* Niche dropdown */}
          <div>
            <label htmlFor="niche" className="mb-2 block text-sm font-medium text-zinc-300">
              Niche
            </label>
            <select
              id="niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value as Niche)}
              className="w-full rounded-lg border border-white/10 bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {NICHES.map((n) => (
                <option key={n} value={n}>
                  {formatNiche(n)}
                </option>
              ))}
            </select>
          </div>

          {/* Platform badges */}
          <div>
            <span className="mb-2 block text-sm font-medium text-zinc-300">Platform</span>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const active = platform === p;
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPlatform(p)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium ring-1 ring-inset transition-colors",
                      active
                        ? "bg-indigo-600 text-white ring-indigo-500"
                        : "bg-white/5 text-zinc-400 ring-white/10 hover:text-zinc-100"
                    )}
                  >
                    {formatPlatform(p)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Usage indicator */}
          {usage && usage.limit !== null && (
            <p className="text-xs text-zinc-500">
              {usage.remaining} of {usage.limit} free generations left today.{" "}
              <a href="/pricing" className="text-indigo-400 hover:underline">
                Upgrade for unlimited
              </a>
              .
            </p>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2 rounded-lg bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-300 ring-1 ring-inset ring-rose-500/20"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" size="lg" className="w-full" disabled={!canSubmit} loading={loading}>
            {!loading && (isOutOfCredits ? <Sparkles className="size-4" /> : <Wand2 className="size-4" />)}
            {loading
              ? "Writing your hooks..."
              : isOutOfCredits
              ? "Upgrade to keep generating"
              : "Generate 10 hooks"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
