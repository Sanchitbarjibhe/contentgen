"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronRight,
  Clapperboard,
  Clipboard,
  Clock3,
  Eye,
  Lightbulb,
  LoaderCircle,
  MessageSquareText,
  Play,
  Rocket,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

const hookSamples = [
  {
    framework: "Curiosity gap",
    category: "OPEN LOOP",
    hook: "I changed one thing in my morning routine. I didn't expect this part.",
    score: 92,
    insight: "Creates an open loop, then promises a specific payoff.",
  },
  {
    framework: "Storytelling",
    category: "PERSONAL STORY",
    hook: "The first video I posted got 17 views. Here's what I changed next.",
    score: 89,
    insight: "A specific moment gives the audience a reason to follow along.",
  },
  {
    framework: "Negative framing",
    category: "PATTERN INTERRUPT",
    hook: "Stop adding more to your videos before fixing this first 3 seconds.",
    score: 86,
    insight: "Challenges a common instinct and points toward a practical fix.",
  },
  {
    framework: "Problem → solution",
    category: "QUICK WIN",
    hook: "Can't get past the blank page? Try this 10-second idea starter.",
    score: 90,
    insight: "Names a familiar problem and offers a clear next step.",
  },
];

const frameworks = [
  {
    title: "Storytelling",
    description: "Start in a moment, build tension, and lead to an earned takeaway.",
    href: "/hooks/instagram-reels/storytelling",
    label: "PERSONAL STORY",
    icon: MessageSquareText,
  },
  {
    title: "Curiosity gap",
    description: "Open a question your audience wants answered, then deliver the payoff.",
    href: "/hooks/instagram-reels/curiosity",
    label: "OPEN LOOP",
    icon: Eye,
  },
  {
    title: "Negative framing",
    description: "Call out a real risk and turn it into a useful, constructive lesson.",
    href: "/hooks/instagram-reels/negativity-bias",
    label: "PATTERN INTERRUPT",
    icon: Target,
  },
  {
    title: "Visual hooks",
    description: "Pair a clear opening line with an attention-grabbing first frame.",
    href: "/hooks/instagram-reels",
    label: "FIRST FRAME",
    icon: Clapperboard,
  },
];

const capabilities = [
  { icon: Sparkles, title: "10 hook variations", detail: "More angles for every topic" },
  { icon: Target, title: "Retention scores", detail: "Compare hooks at a glance" },
  { icon: Clipboard, title: "Copy & preview", detail: "Ready for your next post" },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export default function HomeLanding() {
  const [selectedHook, setSelectedHook] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [dashboardPreview, setDashboardPreview] = useState<number | null>(null);
  const [dashboardCopied, setDashboardCopied] = useState<number | null>(null);
  const [dashboardCopyError, setDashboardCopyError] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);
  const [waitlistNotice, setWaitlistNotice] = useState<string | null>(null);

  const sample = hookSamples[selectedHook];

  async function handleCopy() {
    const copied = await copyToClipboard(sample.hook);
    setCopyState(copied ? "copied" : "error");
  }

  async function copyDashboardHook(hook: string, index: number) {
    const copied = await copyToClipboard(hook);
    setDashboardCopied(copied ? index : null);
    setDashboardCopyError(copied ? null : index);
  }

  async function joinWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setWaitlistError(null);
    setWaitlistNotice(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          feedback,
          source: "homepage_early_access",
        }),
      });
      const responseText = await response.text();
      let responseBody: { ok?: boolean; message?: string; error?: string } | null = null;

      if (responseText.trim()) {
        try {
          const parsed: unknown = JSON.parse(responseText);
          if (isRecord(parsed)) {
            responseBody = {
              ok: typeof parsed.ok === "boolean" ? parsed.ok : undefined,
              message: typeof parsed.message === "string" ? parsed.message : undefined,
              error: typeof parsed.error === "string" ? parsed.error : undefined,
            };
          }
        } catch {
          responseBody = null;
        }
      }

      if (!response.ok || !responseBody?.ok) {
        setWaitlistError(
          responseBody?.error ?? "We couldn't save your request. Please try again.",
        );
        return;
      }

      setWaitlistNotice(
        responseBody.message ?? "You're on the early-access list. Thanks for your feedback!",
      );
      setEmail("");
      setFeedback("");
    } catch (error) {
      setWaitlistError(
        error instanceof Error
          ? error.message
          : "Network issue while saving. Please check your connection and retry.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-w-0 overflow-hidden bg-[#0d1021] text-slate-100">
      <section className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(ellipse_at_68%_4%,rgba(79,70,229,0.2),transparent_56%)]"
        />
        <div className="mx-auto grid min-w-0 max-w-7xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:pt-24">
          <div className="min-w-0 text-center lg:text-left">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.08] px-3.5 py-2 text-xs font-semibold text-indigo-200">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Your next scroll-stopper starts here
            </div>
            <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:mx-0">
              AI hook generator for{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
                Reels, TikTok, and Shorts.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-slate-300 sm:text-lg sm:leading-8 lg:mx-0">
              Turn any idea into sharp, psychology-backed hooks for TikTok, Reels, and Shorts.
              Get your next opening line in seconds.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
              {["Groq-powered speed", "Built on proven formulas", "5 free generations daily"].map(
                (pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-slate-300"
                  >
                    {pill}
                  </span>
                ),
              )}
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/dashboard"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-950/50 transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
              >
                Generate my hooks <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/hooks"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
              >
                Explore hook playbooks <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400 lg:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-emerald-400" /> No credit card
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-emerald-400" /> No account required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-emerald-400" /> Made for short-form
              </span>
            </div>
          </div>

          <section
            aria-label="Interactive hook preview"
            className="mx-auto w-full min-w-0 max-w-xl rounded-3xl border border-white/[0.09] bg-[#11152a]/90 p-4 shadow-[0_30px_100px_-40px_rgba(79,70,229,0.55)] backdrop-blur sm:p-6"
          >
            <div className="flex min-w-0 items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-400/10 text-indigo-300">
                  <Sparkles className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">HookTos hook preview</p>
                  <p className="mt-0.5 text-xs text-slate-400">A better opening, in a few seconds</p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300 sm:text-xs">
                <Zap className="size-3.5" /> Ready
              </span>
            </div>

            <div className="mt-5">
              <div className="flex flex-wrap gap-2" aria-label="Choose a hook framework">
                {hookSamples.map((hook, index) => (
                  <button
                    key={hook.framework}
                    type="button"
                    aria-pressed={selectedHook === index}
                    onClick={() => {
                      setSelectedHook(index);
                      setCopyState("idle");
                    }}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      selectedHook === index
                        ? "border-indigo-400/40 bg-indigo-400/15 text-indigo-200"
                        : "border-white/[0.08] bg-white/[0.025] text-slate-400 hover:border-white/20 hover:text-slate-200"
                    }`}
                  >
                    {hook.framework}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-white/[0.08] bg-[#0d1021] p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-bold tracking-[0.18em] text-indigo-300">
                    {sample.category}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    <Target className="size-3.5" /> {sample.score}% hook score
                  </span>
                </div>
                <p className="mt-5 break-words text-xl font-semibold leading-relaxed text-white sm:text-2xl">
                  “{sample.hook}”
                </p>
                <div className="mt-5 flex min-w-0 flex-col justify-between gap-3 border-t border-white/[0.07] pt-4 sm:flex-row sm:items-center">
                  <p className="min-w-0 text-xs leading-5 text-slate-400">{sample.insight}</p>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-indigo-300/40 hover:bg-indigo-300/10 sm:self-auto"
                  >
                    {copyState === "copied" ? (
                      <Check className="size-3.5 text-emerald-300" />
                    ) : (
                      <Clipboard className="size-3.5" />
                    )}
                    {copyState === "copied" ? "Copied" : "Copy hook"}
                  </button>
                </div>
                {copyState === "error" && (
                  <p role="status" className="mt-3 text-xs text-rose-300">
                    Clipboard access is unavailable in this browser.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
                <p className="text-[11px] text-slate-500">Built for</p>
                <p className="mt-1.5 text-sm font-semibold text-slate-200">Reels · Shorts · TikTok</p>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
                <p className="text-[11px] text-slate-500">Generation time</p>
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
                  <Clock3 className="size-3.5" /> Just seconds
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section aria-label="Why creators use HookTos" className="border-y border-white/[0.07] bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            {
              icon: Zap,
              title: "Groq-powered speed",
              text: "Go from a rough idea to ready-to-use hooks in seconds.",
              color: "text-amber-300",
            },
            {
              icon: Lightbulb,
              title: "Formula meets psychology",
              text: "Use clear structures like curiosity, contrast, and storytelling.",
              color: "text-indigo-300",
            },
            {
              icon: Rocket,
              title: "Practical creator workflow",
              text: "Compare, copy, and get back to making your video.",
              color: "text-emerald-300",
            },
          ].map(({ icon: Icon, title, text, color }) => (
            <div key={title} className="flex min-w-0 gap-4 rounded-2xl p-4 sm:p-5">
              <div className={`grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.05] ${color}`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-white">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="playbooks" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Pick your angle</p>
              <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Proven frameworks. Your voice.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Explore playbooks for the kind of opening your next video needs.
              </p>
            </div>
            <Link href="/hooks" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 transition hover:text-indigo-200">
              Browse all playbooks <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {frameworks.map(({ title, description, href, label, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group flex min-w-0 flex-col rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-indigo-300/30 hover:bg-indigo-300/[0.04]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-indigo-400/10 text-indigo-300">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-[9px] font-bold tracking-[0.13em] text-slate-500">{label}</span>
                </div>
                <h3 className="mt-5 text-base font-bold text-white">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 group-hover:text-indigo-200">
                  Explore framework <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#11152a]/55 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Inside your dashboard</p>
            <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Everything you need to choose your opening.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Generate a batch, compare the angles, then copy your favorite and get straight to filming.
            </p>
            <ul className="mt-7 space-y-4">
              {capabilities.map(({ icon: Icon, title, detail }) => (
                <li key={title} className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-300/10 text-emerald-300">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-100">{title}</span>
                    <span className="mt-0.5 block text-xs text-slate-400">{detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-400"
            >
              Open the free dashboard <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="min-w-0 rounded-3xl border border-white/[0.08] bg-[#0d1021] p-4 shadow-2xl shadow-black/25 sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
              <div>
                <p className="text-sm font-bold text-white">Your hook variations</p>
                <p className="mt-1 text-xs text-slate-500">Topic: grow a small creator account</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-indigo-400/10 px-2.5 py-1 text-xs font-semibold text-indigo-200">
                <Sparkles className="size-3.5" /> 10 hooks
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {hookSamples.slice(0, 3).map((hook, index) => (
                <div key={hook.framework} className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold text-slate-300">
                      {hook.framework}
                    </span>
                    <span className="text-xs font-semibold text-emerald-300">{hook.score}% score</span>
                  </div>
                  <p className="mt-3 break-words text-sm leading-6 text-slate-200">
                    {index === 0
                      ? "I posted every day for a month. Here's the one change that mattered."
                      : hook.hook}
                  </p>
                  {dashboardPreview === index && (
                    <p role="status" className="mt-2 text-xs text-indigo-200">
                      Preview selected — read it aloud and make it your own.
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
                    <button
                      type="button"
                      aria-pressed={dashboardPreview === index}
                      onClick={() => setDashboardPreview(dashboardPreview === index ? null : index)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200"
                    >
                      <Play className="size-3.5" /> {dashboardPreview === index ? "Previewing" : "Preview"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void copyDashboardHook(
                          index === 0
                            ? "I posted every day for a month. Here's the one change that mattered."
                            : hook.hook,
                          index,
                        )
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200"
                    >
                      {dashboardCopied === index ? (
                        <Check className="size-3.5 text-emerald-300" />
                      ) : (
                        <Clipboard className="size-3.5" />
                      )}
                      {dashboardCopied === index
                        ? "Copied"
                        : dashboardCopyError === index
                          ? "Try again"
                          : "Copy"}
                    </button>
                  </div>
                  {dashboardCopyError === index && (
                    <p role="status" className="mt-2 text-xs text-rose-300">
                      Clipboard access is unavailable in this browser.
                    </p>
                  )}
                </div>
              ))}
              <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-xs text-slate-500">
                <Sparkles className="size-3.5 text-indigo-300" /> Start with 5 free generations every day
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">A simple creator workflow</p>
            <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              From idea to opening line in 3 steps.
            </h2>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { number: "01", icon: Clapperboard, title: "Pick platform & topic", description: "Tell HookTos what you're making and where you're posting." },
              { number: "02", icon: Sparkles, title: "Generate & understand", description: "Compare hook variations with their formula and psychology." },
              { number: "03", icon: Clipboard, title: "Copy & post", description: "Choose your favorite, copy it, and make it your own." },
            ].map(({ number, icon: Icon, title, description }, index) => (
              <li key={number} className="relative min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
                {index < 2 && <ArrowDown className="absolute -bottom-5 left-1/2 z-10 size-5 rotate-[-90deg] text-indigo-300 md:-right-5 md:bottom-auto md:left-auto md:top-1/2 md:rotate-0" />}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.18em] text-indigo-300">{number}</span>
                  <Icon className="size-5 text-slate-400" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="early-access" className="scroll-mt-24 border-t border-white/[0.07] bg-[radial-gradient(ellipse_at_50%_100%,rgba(79,70,229,0.14),transparent_65%)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-3 py-1.5 text-xs font-bold text-amber-200">
              <Clock3 className="size-3.5" /> COMING SOON
            </span>
            <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              More ways to make every idea count.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Paid plans are not live yet. Join early access and tell us what would make HookTos more useful for your workflow.
            </p>
          </div>
          <form
            onSubmit={joinWaitlist}
            className="min-w-0 rounded-2xl border border-white/[0.09] bg-[#11152a]/80 p-5 sm:p-7"
          >
            <h3 className="text-lg font-bold text-white">Get early access updates</h3>
            <p className="mt-1 text-sm text-slate-400">One useful update when we launch. No spam.</p>
            <div className="mt-5">
              <label htmlFor="homepage-waitlist-email" className="text-xs font-semibold text-slate-300">
                Email address
              </label>
              <input
                id="homepage-waitlist-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 h-12 w-full min-w-0 rounded-lg border border-white/10 bg-[#0d1021] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="homepage-waitlist-feedback" className="text-xs font-semibold text-slate-300">
                What would help your workflow? <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <textarea
                id="homepage-waitlist-feedback"
                name="feedback"
                rows={3}
                maxLength={1000}
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                placeholder="Share a feature idea or tell us how you create..."
                className="mt-2 w-full min-w-0 resize-y rounded-lg border border-white/10 bg-[#0d1021] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>
            {waitlistError && (
              <p role="alert" className="mt-4 rounded-lg border border-rose-400/20 bg-rose-400/[0.08] px-3 py-2 text-sm text-rose-200">
                {waitlistError}
              </p>
            )}
            {waitlistNotice && (
              <p role="status" className="mt-4 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2 text-sm text-emerald-200">
                {waitlistNotice}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
              {isSubmitting ? "Joining..." : "Join the early-access list"}
              {!isSubmitting && <ArrowRight className="size-4" />}
            </button>
            <p className="mt-3 text-center text-[11px] leading-5 text-slate-500">
              Your email is only used for HookTos early-access updates.
            </p>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/[0.07] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="text-center sm:text-left">
            <Link href="/" className="text-sm font-extrabold tracking-tight text-white">HookTos AI</Link>
            <p className="mt-1 text-xs text-slate-500">Make your first seconds count.</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
            <Link href="/dashboard" className="transition hover:text-white">Dashboard</Link>
            <Link href="/hooks" className="transition hover:text-white">Hook playbooks</Link>
            <Link href="/marketplace" className="transition hover:text-white">Marketplace</Link>
            <Link href="/tools" className="transition hover:text-white">Tools</Link>
            <Link href="/blog" className="transition hover:text-white">Blog</Link>
            <Link href="/about" className="transition hover:text-white">About</Link>
          </nav>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} HookTos AI</p>
        </div>
      </footer>
    </main>
  );
}
