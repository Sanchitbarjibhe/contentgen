"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import { SITE } from "@/lib/seo/config";

export default function ResourceShareButton({
  href,
  title,
  summary,
}: {
  href: string;
  title: string;
  summary: string;
}) {
  const [feedback, setFeedback] = useState("");
  const [failed, setFailed] = useState(false);

  async function copyShareUrl(url: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("textarea");
        input.value = url;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.append(input);
        input.select();
        const copied = document.execCommand("copy");
        input.remove();
        if (!copied) throw new Error("Clipboard copy was not available.");
      }

      setFeedback("Link copied!");
      setFailed(false);
    } catch (error) {
      console.error("[resources] unable to copy share link:", error);
      setFeedback("Could not copy the link. Check clipboard permissions and try again.");
      setFailed(true);
    }
  }

  async function shareResource() {
    const url = new URL(href, SITE.url).toString();
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text: summary, url });
        setFeedback("Shared successfully.");
        setFailed(false);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setFeedback("Share cancelled.");
          setFailed(false);
          return;
        }
        console.error("[resources] native share failed; copying link instead:", error);
      }
    }

    await copyShareUrl(url);
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.06] hover:text-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        onClick={() => void shareResource()}
        type="button"
      >
        <Share2 aria-hidden="true" className="size-4" />
        Share
      </button>
      {feedback && (
        <p
          aria-live="polite"
          className={`max-w-56 text-xs ${failed ? "text-rose-300" : "text-emerald-300"}`}
          role={failed ? "alert" : "status"}
        >
          {feedback}
        </p>
      )}
    </div>
  );
}
