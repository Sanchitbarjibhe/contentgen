"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FALLBACK_HASHTAGS,
  isTrendingHashtagList,
  type TrendingHashtag,
} from "@/lib/trending-data";

const categories = ["All", "SaaS", "Fitness", "AI", "Marketing"];

export default function HashtagExplorer() {
  const [hashtags, setHashtags] = useState<TrendingHashtag[]>(FALLBACK_HASHTAGS);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sourceMessage, setSourceMessage] = useState("Loading the latest trend snapshot…");
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHashtags() {
      try {
        const response = await fetch("/api/trending-hashtags");
        if (!response.ok) {
          throw new Error(`Trending hashtags request failed (${response.status}).`);
        }

        const result: unknown = await response.json();
        if (
          typeof result !== "object" ||
          result === null ||
          !("data" in result) ||
          !("source" in result) ||
          !isTrendingHashtagList(result.data) ||
          (result.source !== "apify" && result.source !== "fallback")
        ) {
          throw new Error("Trending hashtags response had an unexpected format.");
        }

        if (active) {
          setHashtags(result.data);
          setSourceMessage(
            result.source === "apify"
              ? "Live trend snapshot from Apify."
              : "Showing sample trend data. Configure an Apify task to load live trends.",
          );
        }
      } catch (error) {
        console.error("[hashtags] unable to load trends:", error);
        if (active) {
          setSourceMessage("Showing sample trend data; live trends could not be loaded.");
        }
      }
    }

    void loadHashtags();
    return () => {
      active = false;
    };
  }, []);

  const visibleHashtags = useMemo(() => {
    const normalizedQuery = query.trim().replace(/^#/, "").toLowerCase();
    return hashtags.filter((item) => {
      const matchesCategory = category === "All" || item.category.toLowerCase() === category.toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${item.name} ${item.category}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, hashtags, query]);

  async function copyHashtagStack(item: TrendingHashtag) {
    const sameCategory = hashtags
      .filter((candidate) => candidate.category === item.category)
      .sort((left, right) => right.viralityScore - left.viralityScore)
      .slice(0, 5);
    const stack = Array.from(new Set([item, ...sameCategory])).map((hashtag) => `#${hashtag.name}`).join(" ");

    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard access is unavailable.");
      }
      await navigator.clipboard.writeText(stack);
      setCopyMessage(`Hashtag stack for ${item.category} copied.`);
    } catch (error) {
      console.error("[hashtags] unable to copy hashtag stack:", error);
      setCopyMessage("Copy failed. Check your browser clipboard permissions and try again.");
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-96 max-w-5xl bg-linear-to-r from-blue-600/20 via-purple-500/10 to-transparent blur-3xl" />
      <section className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-blue-200">
            SMARTER DISCOVERY, BETTER REACH
          </span>
          <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            High-Converting <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Hashtag Finder</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Discover niche-relevant tags with momentum and put together a focused hashtag stack for your next post.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/50 p-4 shadow-2xl shadow-blue-950/10 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="block w-full lg:max-w-sm">
              <span className="sr-only">Search hashtags</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search hashtags or niches"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/70 focus:ring-2 focus:ring-blue-400/20"
              />
            </label>
            <div aria-label="Filter hashtags by category" className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    category === item
                      ? "border-blue-400/50 bg-blue-400/15 text-blue-100"
                      : "border-slate-700 bg-slate-950/60 text-slate-400 hover:border-slate-500 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500" aria-live="polite">{sourceMessage}</p>
        </div>

        {visibleHashtags.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleHashtags.map((item) => (
              <article key={item.id} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition hover:border-blue-400/40 hover:bg-slate-900/80">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-300">{item.category}</p>
                    <h2 className="mt-2 text-2xl font-bold text-white">#{item.name}</h2>
                  </div>
                  <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    +{item.growthRate}% growth
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-5">
                  <div>
                    <p className="text-xs text-slate-500">Post count</p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-white">{item.postVolume.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Reach score</p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-blue-300">{item.viralityScore}<span className="text-sm text-slate-500">/100</span></p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void copyHashtagStack(item)}
                  className="mt-6 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:from-blue-500 hover:to-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Copy Hashtag Stack
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400">
            No hashtags match those filters. Try another category or search.
          </p>
        )}
        <p className="sr-only" aria-live="polite">{copyMessage}</p>
      </section>
    </main>
  );
}
