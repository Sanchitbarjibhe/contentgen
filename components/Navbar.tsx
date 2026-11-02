"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FALLBACK_AUDIO,
  FALLBACK_HASHTAGS,
  isTrendingAudioList,
  isTrendingHashtagList,
  type TrendingAudio,
  type TrendingHashtag,
} from "@/lib/trending-data";

const links = [
  { href: "/changelog", label: "What's New" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

const platformHashtags = [
  { platform: "TikTok", tags: ["aitools", "buildinpublic"] },
  { platform: "Reels", tags: ["fitnessmotivation", "hybridtraining"] },
  { platform: "YouTube", tags: ["contentmarketing", "socialmediastrategy"] },
];

function isActiveLink(pathname: string, href: string) {
  return href === "/blog"
    ? pathname === href || pathname.startsWith(`${href}/`)
    : pathname === href;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatCount(count: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count);
}

async function fetchTrendingHashtags(signal: AbortSignal): Promise<TrendingHashtag[]> {
  const response = await fetch("/api/trending-hashtags", { signal });
  if (!response.ok) {
    throw new Error(`Trending hashtags request failed with status ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (!isRecord(payload) || !isTrendingHashtagList(payload.data)) {
    throw new Error("Trending hashtags response has an invalid shape.");
  }
  return payload.data;
}

async function fetchTrendingAudio(signal: AbortSignal): Promise<TrendingAudio[]> {
  const response = await fetch("/api/trending-audio", { signal });
  if (!response.ok) {
    throw new Error(`Trending audio request failed with status ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (!isRecord(payload) || !isTrendingAudioList(payload.data)) {
    throw new Error("Trending audio response has an invalid shape.");
  }
  return payload.data;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileTrendingOpen, setIsMobileTrendingOpen] = useState(false);
  const [isTrendingOpen, setIsTrendingOpen] = useState(false);
  const [hashtags, setHashtags] = useState(FALLBACK_HASHTAGS);
  const [audio, setAudio] = useState(FALLBACK_AUDIO);
  const trendingRef = useRef<HTMLDivElement>(null);
  const trendingButtonRef = useRef<HTMLButtonElement>(null);

  const isTrendingActive =
    pathname.startsWith("/audio") || pathname.startsWith("/hashtag");
  const trendingTopics = [...hashtags]
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, 3);
  const audioTracks = [...audio]
    .sort((a, b) => b.reelsCount - a.reelsCount)
    .slice(0, 3);
  const hashtagByName = new Map(hashtags.map((hashtag) => [hashtag.name, hashtag]));

  useEffect(() => {
    setIsOpen(false);
    setIsMobileTrendingOpen(false);
    setIsTrendingOpen(false);
  }, [pathname]);

  useEffect(() => {
    const controller = new AbortController();

    void Promise.allSettled([
      fetchTrendingHashtags(controller.signal),
      fetchTrendingAudio(controller.signal),
    ]).then(([hashtagResult, audioResult]) => {
      if (controller.signal.aborted) return;

      if (hashtagResult.status === "fulfilled") {
        setHashtags(hashtagResult.value);
      } else {
        console.error("[navbar] unable to load trending hashtags; using fallback data:", hashtagResult.reason);
      }

      if (audioResult.status === "fulfilled") {
        setAudio(audioResult.value);
      } else {
        console.error("[navbar] unable to load trending audio; using fallback data:", audioResult.reason);
      }
    });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!isTrendingOpen) return;

    function closeOnOutsidePointer(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !trendingRef.current?.contains(event.target)
      ) {
        setIsTrendingOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [isTrendingOpen]);

  function closeTrendingAndFocus() {
    setIsTrendingOpen(false);
    trendingButtonRef.current?.focus();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-[#0B0F17]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="flex items-center gap-3.5 whitespace-nowrap text-lg font-extrabold tracking-tight"
          >
            <Image
              src="/android-chrome-512x512.png"
              alt="HookTos AI logo"
              width={44}
              height={44}
              className="size-11 rounded-full border border-slate-700 object-cover shadow-sm"
            />
            <span className="bg-gradient-to-r from-[#2962FF] to-cyan-300 bg-clip-text text-transparent">
              HookTos AI
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 text-sm font-semibold text-slate-300 md:flex sm:gap-8 sm:text-base"
          >
            {links.slice(0, 2).map(({ href, label }) => {
              const active = isActiveLink(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative whitespace-nowrap py-2 transition-colors duration-200 hover:text-white ${
                    active
                      ? "text-white after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-[#2962FF]"
                      : ""
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            <div
              ref={trendingRef}
              className="relative"
              onMouseEnter={() => setIsTrendingOpen(true)}
              onMouseLeave={() => {
                if (
                  trendingRef.current &&
                  !trendingRef.current.contains(document.activeElement)
                ) {
                  setIsTrendingOpen(false);
                }
              }}
              onBlur={(event) => {
                const nextTarget = event.relatedTarget;
                if (
                  !(nextTarget instanceof Node &&
                    event.currentTarget.contains(nextTarget)) &&
                  !event.currentTarget.matches(":hover")
                ) {
                  setIsTrendingOpen(false);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") closeTrendingAndFocus();
              }}
            >
              <button
                ref={trendingButtonRef}
                type="button"
                aria-expanded={isTrendingOpen}
                aria-controls="trending-dropdown"
                onClick={() => setIsTrendingOpen((open) => !open)}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap py-2 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2962FF] ${
                  isTrendingActive || isTrendingOpen
                    ? "text-white"
                    : "text-slate-300"
                }`}
              >
                Trending
                <svg
                  aria-hidden="true"
                  className={`size-4 transition-transform duration-200 ${
                    isTrendingOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                id="trending-dropdown"
                aria-hidden={!isTrendingOpen}
                className={`absolute right-0 top-full z-50 mt-3 w-[min(56rem,calc(100vw-2rem))] origin-top-right transition-[opacity,transform,visibility] duration-200 ease-out ${
                  isTrendingOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-2 opacity-0"
                }`}
              >
                <div className="overflow-hidden rounded-2xl border border-[#2962FF]/35 bg-[#0B0F17]/[.98] shadow-[0_0_36px_rgba(41,98,255,0.14)] ring-1 ring-white/5 backdrop-blur-2xl">
                  <div className="flex items-center justify-between border-b border-white/[.07] px-5 py-4 sm:px-6">
                    <div>
                      <p className="text-sm font-extrabold tracking-wide text-white">
                        The signal right now
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Fresh momentum for your next post
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#00E676]/20 bg-[#00E676]/[.08] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#00E676]">
                      <span className="size-1.5 animate-pulse rounded-full bg-[#00E676]" />
                      Trending
                    </span>
                  </div>

                  <div className="grid gap-0 md:grid-cols-3">
                    <section className="border-b border-white/[.07] p-5 md:border-b-0 md:border-r md:border-white/[.07] sm:p-6">
                      <div className="mb-4 flex items-center gap-2">
                        <svg
                          aria-hidden="true"
                          className="size-4 text-[#00E676]"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M3 14.5 7.2 10l3 2.5L17 5.5M12.5 5.5H17v4.5"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <h2 className="text-xs font-bold uppercase tracking-[.12em] text-slate-300">
                          Viral shifts
                        </h2>
                      </div>
                      <ul className="space-y-3">
                        {trendingTopics.map((topic) => (
                          <li key={topic.id}>
                            <Link
                              href="/hashtag"
                              tabIndex={isTrendingOpen ? 0 : -1}
                              className="group flex items-center justify-between gap-3 rounded-lg py-1 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-[#2962FF]"
                            >
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold text-slate-100 group-hover:text-white">
                                  #{topic.name}
                                </span>
                                <span className="mt-0.5 block text-xs text-slate-500">
                                  {topic.category}
                                </span>
                              </span>
                              <span className="shrink-0 text-xs font-bold tabular-nums text-[#00E676]">
                                +{topic.growthRate}%
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/hashtag"
                        tabIndex={isTrendingOpen ? 0 : -1}
                        className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#7FA1FF] transition-colors hover:text-white"
                      >
                        Explore trends <span aria-hidden="true">→</span>
                      </Link>
                    </section>

                    <section className="border-b border-white/[.07] p-5 md:border-b-0 md:border-r md:border-white/[.07] sm:p-6">
                      <div className="mb-4 flex items-center gap-2">
                        <svg
                          aria-hidden="true"
                          className="size-4 text-[#2962FF]"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M4.5 6.5h11m-11 3.5h8m-8 3.5h5"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                          <path
                            d="M3 3.5h14v13H3z"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <h2 className="text-xs font-bold uppercase tracking-[.12em] text-slate-300">
                          Top hashtags
                        </h2>
                      </div>
                      <div className="space-y-3.5">
                        {platformHashtags.map(({ platform, tags }) => (
                          <div key={platform}>
                            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">
                              {platform}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {tags.map((tag) => {
                                const hashtag = hashtagByName.get(tag);
                                return (
                                  <Link
                                    key={tag}
                                    href="/hashtag"
                                    tabIndex={isTrendingOpen ? 0 : -1}
                                    title={
                                      hashtag
                                        ? `${formatCount(hashtag.postVolume)} posts`
                                        : undefined
                                    }
                                    className="rounded-md border border-white/[.08] bg-white/[.03] px-2 py-1 text-xs font-medium text-slate-300 transition hover:border-[#2962FF]/50 hover:bg-[#2962FF]/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#2962FF]"
                                  >
                                    #{tag}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link
                        href="/hashtag"
                        tabIndex={isTrendingOpen ? 0 : -1}
                        className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#7FA1FF] transition-colors hover:text-white"
                      >
                        Browse hashtags <span aria-hidden="true">→</span>
                      </Link>
                    </section>

                    <section className="p-5 sm:p-6">
                      <div className="mb-4 flex items-center gap-2">
                        <svg
                          aria-hidden="true"
                          className="size-4 text-[#7FA1FF]"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M8 14V4l8-1v10M8 14c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2Zm8-1c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <h2 className="text-xs font-bold uppercase tracking-[.12em] text-slate-300">
                          Trending audio
                        </h2>
                      </div>
                      <ul className="space-y-3">
                        {audioTracks.map((track) => (
                          <li key={track.id}>
                            <a
                              href={track.previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              tabIndex={isTrendingOpen ? 0 : -1}
                              className="group flex items-center justify-between gap-3 rounded-lg py-1 focus-visible:outline-2 focus-visible:outline-[#2962FF]"
                            >
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold text-slate-100 transition-colors group-hover:text-white">
                                  {track.title}
                                </span>
                                <span className="mt-0.5 block truncate text-xs text-slate-500">
                                  {track.artist}
                                </span>
                              </span>
                              <span className="shrink-0 text-right">
                                <span className="block text-xs font-bold tabular-nums text-[#7FA1FF]">
                                  {formatCount(track.reelsCount)}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  uses
                                </span>
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/audio"
                        tabIndex={isTrendingOpen ? 0 : -1}
                        className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#7FA1FF] transition-colors hover:text-white"
                      >
                        Find your sound <span aria-hidden="true">→</span>
                      </Link>
                    </section>
                  </div>
                </div>
              </div>
            </div>

            {links.slice(2).map(({ href, label }) => {
              const active = isActiveLink(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative whitespace-nowrap py-2 transition-colors duration-200 hover:text-white ${
                    active
                      ? "text-white after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-[#2962FF]"
                      : ""
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-700/80 text-slate-200 transition hover:border-[#2962FF]/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2962FF] md:hidden"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((open) => !open)}
          >
            <svg
              aria-hidden="true"
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {isOpen ? (
                <path d="m6 6 12 12M18 6 6 18" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div
          id="mobile-navigation"
          aria-hidden={!isOpen}
          className={`overflow-hidden transition-[max-height,opacity,visibility] duration-200 ease-out md:hidden ${
            isOpen
              ? "visible max-h-[34rem] opacity-100"
              : "invisible max-h-0 opacity-0 delay-200"
          }`}
        >
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col border-t border-slate-800/60 py-2"
          >
            {links.slice(0, 2).map(({ href, label }) => {
              const active = isActiveLink(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-3 py-3 text-sm font-semibold transition-colors duration-200 hover:bg-slate-800/60 hover:text-white ${
                    active ? "text-[#7FA1FF]" : "text-slate-300"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            <button
              type="button"
              aria-expanded={isMobileTrendingOpen}
              aria-controls="mobile-trending-panel"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => setIsMobileTrendingOpen((open) => !open)}
              className={`flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold transition-colors duration-200 hover:bg-slate-800/60 hover:text-white ${
                isTrendingActive ? "text-[#7FA1FF]" : "text-slate-300"
              }`}
            >
              Trending
              <svg
                aria-hidden="true"
                className={`size-4 transition-transform duration-200 ${
                  isMobileTrendingOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="m5 7.5 5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              id="mobile-trending-panel"
              aria-hidden={!isMobileTrendingOpen}
              className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${
                isMobileTrendingOpen
                  ? "max-h-48 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="ml-3 border-l border-[#2962FF]/30 py-1 pl-3">
                {[
                  { href: "/hashtag", label: "Trending Topics & Hashtags" },
                  { href: "/audio", label: "Trending Audio" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    tabIndex={isOpen && isMobileTrendingOpen ? 0 : -1}
                    onClick={() => {
                      setIsMobileTrendingOpen(false);
                      setIsOpen(false);
                    }}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[.04] hover:text-white"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {links.slice(2).map(({ href, label }) => {
              const active = isActiveLink(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-3 py-3 text-sm font-semibold transition-colors duration-200 hover:bg-slate-800/60 hover:text-white ${
                    active ? "text-[#7FA1FF]" : "text-slate-300"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
