"use client";

import Link from "next/link";
import { ArrowRight, Check, Copy, ExternalLink, X } from "lucide-react";
import { useState } from "react";
import {
  RESOURCE_CATEGORY_LABELS,
  type ResourceCardData,
} from "@/data/resources";
import ResourceLikeButton from "@/components/resources/ResourceLikeButton";
import ResourceShareButton from "@/components/resources/ResourceShareButton";

const categoryStyles = {
  "swipe-files": "border-indigo-400/25 bg-indigo-400/10 text-indigo-200",
  "prompt-packs": "border-violet-400/25 bg-violet-400/10 text-violet-200",
  checklists: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  templates: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
};

export default function ResourceCard({
  resource,
}: {
  resource: ResourceCardData;
}) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const copyText =
    resource.category === "swipe-files"
      ? resource.hook
      : resource.category === "prompt-packs"
        ? resource.prompt
        : resource.category === "templates"
          ? resource.content
          : "";

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopyError(false);
    } catch (error) {
      console.error("[resources] unable to copy resource:", error);
      setCopied(false);
      setCopyError(true);
    }
  }

  const generatorPrompt =
    resource.category === "swipe-files"
      ? `${resource.generatorPrompt}\n\n${resource.hook}\n\nMy video topic: `
      : "";
  const generatorHref = `/dashboard?prompt=${encodeURIComponent(generatorPrompt)}`;

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/40 p-5 shadow-xl shadow-black/10 ring-1 ring-white/[0.03] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-indigo-400/30 hover:bg-slate-900/60 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span
          className={`inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${categoryStyles[resource.category]}`}
        >
          {RESOURCE_CATEGORY_LABELS[resource.category]}
        </span>
        <div className="flex flex-col items-end gap-1">
          <ResourceLikeButton
            initialLiked={resource.liked}
            initialLikesCount={resource.likesCount}
            resourceId={resource.id}
          />
          {resource.category === "checklists" && checkedItems.length > 0 && (
            <span className="text-xs text-slate-500">
              {checkedItems.length}/{resource.items.length} complete
            </span>
          )}
        </div>
      </div>

      <h2 className="mt-4 break-words text-lg font-bold leading-snug text-white sm:text-xl">
        {resource.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        {resource.description}
      </p>

      {resource.category === "swipe-files" && (
        <blockquote className="mt-4 rounded-xl border border-indigo-400/15 bg-indigo-400/[0.06] p-4 text-sm leading-6 text-slate-200">
          &ldquo;{resource.hook}&rdquo;
        </blockquote>
      )}

      {resource.category === "checklists" && (
        <ul className="mt-4 space-y-2.5">
          {resource.items.map((item) => {
            const checked = checkedItems.includes(item);
            return (
              <li key={item}>
                <label className="flex min-w-0 cursor-pointer items-start gap-2.5 text-sm leading-5 text-slate-300">
                  <input
                    checked={checked}
                    className="mt-0.5 size-4 shrink-0 accent-emerald-400"
                    onChange={() =>
                      setCheckedItems((current) =>
                        checked
                          ? current.filter((entry) => entry !== item)
                          : [...current, item],
                      )
                    }
                    type="checkbox"
                  />
                  <span className={checked ? "text-slate-500 line-through" : ""}>
                    {item}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {resource.platforms.map((platform) => (
          <span
            key={platform}
            className="rounded-full border border-slate-700/80 bg-slate-950/50 px-2.5 py-1 text-[11px] font-medium text-slate-400"
          >
            {platform}
          </span>
        ))}
      </div>
      <div aria-label="Creator niches" className="mt-2 flex flex-wrap gap-1.5">
        {resource.niches.slice(0, 2).map((niche) => (
          <span
            key={niche}
            className="rounded-full border border-slate-800 bg-slate-950/30 px-2 py-1 text-[10px] text-slate-500"
          >
            {niche}
          </span>
        ))}
        {resource.niches.length > 2 && (
          <span className="rounded-full border border-slate-800 bg-slate-950/30 px-2 py-1 text-[10px] text-slate-500">
            +{resource.niches.length - 2} niches
          </span>
        )}
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {resource.category === "swipe-files" && (
          <>
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
              onClick={() => void copyToClipboard(resource.hook)}
              type="button"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied Hook" : "Copy Hook"}
            </button>
            <Link
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-indigo-400/40 hover:text-white"
              href={generatorHref}
            >
              Try in Generator <ArrowRight className="size-3.5" />
            </Link>
          </>
        )}
        {resource.category === "prompt-packs" && (
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
            onClick={() => void copyToClipboard(resource.prompt)}
            type="button"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied Prompt" : "Copy Prompt"}
          </button>
        )}
        {resource.category === "templates" && (
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
            onClick={() => setIsPreviewOpen(true)}
            type="button"
          >
            Preview Template <ExternalLink className="size-3.5" />
          </button>
        )}
        <Link
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition hover:text-white"
          href={`/resources/${resource.category}/${resource.slug}`}
        >
          Details <ArrowRight className="size-3.5" />
        </Link>
        <ResourceShareButton
          href={`/resources/${resource.category}/${resource.slug}`}
          summary={resource.description}
          title={resource.title}
        />
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

      {resource.category === "templates" && isPreviewOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsPreviewOpen(false);
          }}
        >
          <section
            aria-labelledby={`template-title-${resource.slug}`}
            aria-modal="true"
            className="my-auto w-full max-w-2xl rounded-2xl border border-slate-700 bg-[#0d1021] p-5 shadow-2xl shadow-black/50 sm:p-7"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                  Template Preview
                </p>
                <h3
                  className="mt-2 break-words text-xl font-bold text-white"
                  id={`template-title-${resource.slug}`}
                >
                  {resource.title}
                </h3>
              </div>
              <button
                aria-label="Close template preview"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                onClick={() => setIsPreviewOpen(false)}
                type="button"
              >
                <X className="size-5" />
              </button>
            </div>
            <pre className="mt-5 max-h-[55vh] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-slate-800 bg-slate-950/70 p-4 font-sans text-sm leading-6 text-slate-300">
              {resource.content}
            </pre>
            <button
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 sm:w-auto"
              onClick={() => void copyToClipboard(resource.content)}
              type="button"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied Template" : "Copy Template"}
            </button>
            {(copied || copyError) && (
              <p
                aria-live="polite"
                className={`mt-3 text-xs ${copyError ? "text-rose-300" : "text-emerald-300"}`}
                role={copyError ? "alert" : "status"}
              >
                {copyError
                  ? "Could not copy. Check clipboard permissions and try again."
                  : "Template copied to clipboard."}
              </p>
            )}
          </section>
        </div>
      )}
    </article>
  );
}
