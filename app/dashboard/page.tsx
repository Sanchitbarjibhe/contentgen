"use client";

import { useState, type FormEvent } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    name: "Live Trend Engine",
    description:
      "Spot rising sounds and hashtags before they peak with instant Instagram and TikTok velocity tracking.",
    icon: Activity,
    accent: "from-cyan-400 to-blue-500",
    preview: (
      <div className="space-y-3">
        {[
          { label: "Original audio · @mika", value: "+248%", width: "88%" },
          { label: "#dayinthelife", value: "+176%", width: "66%" },
          { label: "That one transition", value: "+121%", width: "48%" },
        ].map((trend) => (
          <div key={trend.label}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
              <span className="truncate text-slate-300">{trend.label}</span>
              <span className="shrink-0 font-semibold text-emerald-300">
                {trend.value}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                style={{ width: trend.width }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    name: "AI Hook Matrix",
    description:
      "Generate 10 psychology-backed hooks at once, each ranked with a predicted audience-retention score.",
    icon: Brain,
    accent: "from-violet-400 to-fuchsia-500",
    preview: (
      <div className="space-y-2.5">
        <div className="rounded-lg border border-violet-400/20 bg-violet-400/[0.06] p-3">
          <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-violet-200">
            <span>Curiosity gap</span>
            <span>94 retention</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-200">
            &ldquo;I tried the 5-minute routine everyone skips...&rdquo;
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="size-3.5 text-fuchsia-300" />
          9 more hooks, ready to refine
        </div>
      </div>
    ),
  },
  {
    name: "Cross-Platform Analytics",
    description:
      "Understand short-form performance and viral growth across every platform from one clear view.",
    icon: BarChart3,
    accent: "from-emerald-400 to-teal-500",
    preview: (
      <div className="flex h-[106px] items-end gap-2 border-b border-l border-slate-700/80 px-2 pb-0">
        {[35, 52, 43, 69, 56, 82, 63, 94, 75, 100, 80, 91].map(
          (height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-500/30 to-emerald-300/90"
              style={{ height: `${height}%` }}
            />
          ),
        )}
      </div>
    ),
  },
];

export default function DashboardPreviewPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  return (
    <main className="relative isolate min-h-[calc(100vh-73px)] overflow-hidden bg-slate-950 px-5 py-16 text-slate-100 sm:px-8 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-48 left-1/2 h-[34rem] w-[54rem] -translate-x-1/2 rounded-full bg-purple-600/15 blur-[130px]" />
        <div className="absolute right-[-12rem] top-[30rem] h-[28rem] w-[28rem] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-18rem] left-[-12rem] h-[32rem] w-[32rem] rounded-full bg-fuchsia-600/10 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <section className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-slate-900/70 px-4 py-2 text-xs font-semibold tracking-wide text-purple-100 shadow-lg shadow-purple-950/20 sm:text-sm">
            <span aria-hidden="true">🚀</span>
            HookTos AI v2.0 Platform Early Access
          </div>

          <h1 className="mt-8 text-balance text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-6xl md:text-7xl">
            The Next-Gen AI Creator Studio is{" "}
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
              Almost Here.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            We are putting the finishing touches on our real-time Apify trending
            soundboard, automated hook generator, and multi-platform scheduler.
          </p>

          <div className="mx-auto mt-9 max-w-xl rounded-2xl border border-slate-800 bg-slate-900/60 p-2.5 shadow-2xl shadow-purple-950/20 backdrop-blur-xl sm:p-3">
            {isSubmitted ? (
              <div
                aria-live="polite"
                className="flex min-h-14 items-center justify-center gap-3 px-4 py-3 text-left"
              >
                <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
                <p className="text-sm font-semibold text-emerald-100 sm:text-base">
                  You&apos;re on the list! We&apos;ll notify you when early
                  access opens.
                </p>
              </div>
            ) : (
              <form
                className="flex flex-col gap-2 sm:flex-row"
                onSubmit={handleSubmit}
              >
                <label className="sr-only" htmlFor="waitlist-email">
                  Creator email
                </label>
                <input
                  autoComplete="email"
                  className="min-h-14 min-w-0 flex-1 rounded-xl border border-transparent bg-slate-950/70 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20"
                  id="waitlist-email"
                  name="email"
                  placeholder="Enter your creator email..."
                  required
                  type="email"
                />
                <button
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-purple-900/30 transition hover:from-purple-500 hover:to-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300"
                  type="submit"
                >
                  Join VIP Waitlist
                  <ArrowRight aria-hidden="true" className="size-4" />
                </button>
              </form>
            )}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Early access is limited. Be first to create with HookTos AI v2.0.
          </p>
        </section>

        <section aria-labelledby="preview-heading" className="mt-20 sm:mt-24">
          <div className="mb-8 flex flex-col gap-3 text-center">
            <div className="mx-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              <Sparkles className="size-4 text-purple-300" />
              A first look inside
            </div>
            <h2
              className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
              id="preview-heading"
            >
              Your next creative advantage
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map(({ name, description, icon: Icon, accent, preview }) => (
              <article
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/70 sm:p-6"
                key={name}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-slate-950 shadow-lg`}
                  >
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{name}</h3>
                </div>
                <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-slate-400">
                  {description}
                </p>
                <div className="mt-5 rounded-xl border border-slate-800/80 bg-slate-950/70 p-4">
                  {preview}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-500">
          <TrendingUp aria-hidden="true" className="size-4 text-emerald-400" />
          Built for creators ready for their next growth curve.
        </div>
      </div>
    </main>
  );
}
