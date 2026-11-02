"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Copy, Sparkles } from "lucide-react";

type HookPreviewProps = {
  hooks: string[];
  platformName: string;
};

export default function HookPreview({
  hooks,
  platformName,
}: HookPreviewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copyMessage, setCopyMessage] = useState("");

  async function copyHook() {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard access is unavailable in this browser.");
      }

      await navigator.clipboard.writeText(hooks[selectedIndex]);
      setCopyMessage("Hook copied to clipboard.");
    } catch (error) {
      console.error("[hook-preview] unable to copy hook:", error);
      setCopyMessage("Copy failed. Check clipboard permissions and try again.");
    }
  }

  function showNextHook() {
    setSelectedIndex((index) => (index + 1) % hooks.length);
    setCopyMessage("");
  }

  return (
    <section
      aria-labelledby="hook-preview-title"
      className="overflow-hidden rounded-3xl border border-slate-700/80 bg-[#101722] shadow-2xl shadow-blue-950/30"
    >
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#2962FF]/15 text-[#78a0ff]">
            <Sparkles aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 id="hook-preview-title" className="font-bold text-white">
              AI hook generator preview
            </h2>
            <p className="text-xs text-slate-400">{platformName} hook ideas</p>
          </div>
        </div>
        <span className="rounded-full border border-[#00E676]/20 bg-[#00E676]/10 px-3 py-1 text-xs font-semibold text-[#00E676]">
          LIVE PREVIEW
        </span>
      </div>

      <div className="p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#78a0ff]">
          Sample hook {selectedIndex + 1} of {hooks.length}
        </p>
        <p className="mt-4 min-h-24 text-xl font-semibold leading-relaxed text-white sm:text-2xl">
          “{hooks[selectedIndex]}”
        </p>
        <p className="mt-3 text-sm text-slate-400">
          Replace the bracketed prompts with your topic, details, and real
          experience.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void copyHook()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2962FF] px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101722]"
          >
            {copyMessage === "Hook copied to clipboard." ? (
              <Check aria-hidden="true" className="size-4" />
            ) : (
              <Copy aria-hidden="true" className="size-4" />
            )}
            {copyMessage === "Hook copied to clipboard."
              ? "Copied"
              : "Copy Hook"}
          </button>
          <button
            type="button"
            onClick={showNextHook}
            className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Try another hook
          </button>
        </div>
        <p className="mt-3 min-h-5 text-sm text-slate-400" aria-live="polite">
          {copyMessage}
        </p>

        <div className="mt-5 border-t border-slate-800 pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Pick a sample
          </p>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
            {hooks.map((hook, index) => (
              <button
                key={hook}
                type="button"
                onClick={() => {
                  setSelectedIndex(index);
                  setCopyMessage("");
                }}
                aria-label={`Show sample hook ${index + 1}`}
                aria-pressed={selectedIndex === index}
                className={`rounded-lg border px-2 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                  selectedIndex === index
                    ? "border-[#2962FF] bg-[#2962FF]/15 text-white"
                    : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-800 bg-[#0d1420] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <p className="font-bold text-white">Want hooks tailored to your idea?</p>
          <p className="mt-1 text-sm text-slate-400">
            Generate personalized hooks with HookTos AI.
          </p>
        </div>
        <Link
          href="/sign-up"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#00E676] px-5 py-3 text-sm font-extrabold text-[#07120d] transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1420]"
        >
          Start creating free
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
