"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy } from "lucide-react";

export default function ResourceDetailActions({
  copyText,
  copyLabel,
  generatorPrompt,
}: {
  copyText: string;
  copyLabel: string;
  generatorPrompt?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setCopyError(false);
    } catch (error) {
      console.error("[resources] unable to copy resource:", error);
      setCopied(false);
      setCopyError(true);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          onClick={() => void copyToClipboard()}
          type="button"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? `Copied ${copyLabel.replace("Copy ", "")}` : copyLabel}
        </button>
        {generatorPrompt && (
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-indigo-400/40 hover:text-white"
            href={`/dashboard?prompt=${encodeURIComponent(generatorPrompt)}`}
          >
            Try in Generator <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
      {(copied || copyError) && (
        <p
          aria-live="polite"
          className={`mt-3 text-xs ${copyError ? "text-rose-300" : "text-emerald-300"}`}
          role={copyError ? "alert" : "status"}
        >
          {copyError
            ? "Could not copy. Check clipboard permissions and try again."
            : "Copied to clipboard."}
        </p>
      )}
    </div>
  );
}
