"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FALLBACK_AUDIO,
  isTrendingAudioList,
  type TrendingAudio,
} from "@/lib/trending-data";

const categories = ["All", "Pop", "Lifestyle", "Dance", "Creator", "Business"];

export default function AudioExplorer() {
  const [audio, setAudio] = useState<TrendingAudio[]>(FALLBACK_AUDIO);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sourceMessage, setSourceMessage] = useState("Loading the latest trend snapshot…");
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAudio() {
      try {
        const response = await fetch("/api/trending-audio");
        if (!response.ok) {
          throw new Error(`Trending audio request failed (${response.status}).`);
        }

        const result: unknown = await response.json();
        if (
          typeof result !== "object" ||
          result === null ||
          !("data" in result) ||
          !("source" in result) ||
          !isTrendingAudioList(result.data) ||
          (result.source !== "apify" && result.source !== "fallback")
        ) {
          throw new Error("Trending audio response had an unexpected format.");
        }

        if (active) {
          setAudio(result.data);
          setSourceMessage(
            result.source === "apify"
              ? "Live trend snapshot from Apify."
              : "Showing sample trend data. Configure an Apify task to load live trends.",
          );
        }
      } catch (error) {
        console.error("[audio] unable to load trends:", error);
        if (active) {
          setSourceMessage("Showing sample trend data; live trends could not be loaded.");
        }
      }
    }

    void loadAudio();
    return () => {
      active = false;
    };
  }, []);

  const categoryOptions = useMemo(
    () => ["All", ...new Set([...categories.slice(1), ...audio.map((item) => item.category)])],
    [audio],
  );

  const visibleAudio = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return audio.filter((item) => {
      const matchesCategory = category === "All" || item.category.toLowerCase() === category.toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${item.title} ${item.artist} ${item.category}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [audio, category, query]);

  async function copyHookIdea(item: TrendingAudio) {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard access is unavailable.");
      }
      await navigator.clipboard.writeText(item.hookIdea);
      setCopyMessage(`Hook idea for “${item.title}” copied.`);
    } catch (error) {
      console.error("[audio] unable to copy hook idea:", error);
      setCopyMessage("Copy failed. Check your browser clipboard permissions and try again.");
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-transparent px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-purple-200">
            THE CREATOR SOUND BOARD
          </span>
          <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Top Viral Sounds <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">&amp; Audios</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Find sounds gaining momentum and turn them into a stronger opening for your next Reel.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/50 p-4 shadow-2xl shadow-purple-950/10 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="block w-full lg:max-w-sm">
              <span className="sr-only">Search audio</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search sounds, artists, or categories"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400/70 focus:ring-2 focus:ring-purple-400/20"
              />
            </label>
            <div aria-label="Filter audio by category" className="flex flex-wrap gap-2">
              {categoryOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    category === item
                      ? "border-purple-400/50 bg-purple-400/15 text-purple-100"
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

        {visibleAudio.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleAudio.map((item) => (
              <article key={item.id} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition hover:border-purple-400/40 hover:bg-slate-900/80">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">{item.category}</p>
                    <h2 className="mt-2 text-lg font-bold text-white">{item.title}</h2>
                    <p className="mt-1 text-sm text-slate-400">{item.artist}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    +{item.velocityScore}% this week
                  </span>
                </div>
                <div className="mt-6 flex items-end justify-between border-t border-slate-800 pt-5">
                  <div>
                    <p className="text-xs text-slate-500">Reels using this audio</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-white">{item.reelsCount.toLocaleString()}</p>
                  </div>
                  <a
                    href={item.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-blue-300 underline decoration-blue-300/30 underline-offset-4 transition hover:text-blue-200"
                  >
                    Preview audio
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => void copyHookIdea(item)}
                  className="mt-6 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/20 transition hover:from-blue-500 hover:to-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Copy Audio Hook Idea
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400">
            No sounds match those filters. Try a different search or category.
          </p>
        )}
        <p className="sr-only" aria-live="polite">{copyMessage}</p>
      </section>
    </main>
  );
}
