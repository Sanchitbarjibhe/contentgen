import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'HookTos AI | AI Viral Hook Generator & Creator Marketplace',
  description: 'Generate viral hooks, captions, and SEO content for TikTok, Reels, and YouTube Shorts.',
  path: '/',
});


export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-transparent text-slate-100 selection:bg-purple-500 selection:text-white">
      {/* Header Navigation */}
      {/* Main Hero Section */}
      <main className="mx-auto my-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <section className="relative z-10 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-1.5 text-xs font-medium text-slate-300 shadow-inner">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            Powered by HookTos AI
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
            AI viral hook generator for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Reels, Shorts & TikTok
            </span>
          </h1>

          <h2 className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-slate-300 sm:text-xl lg:mx-0">
            Create scroll-stopping content in seconds
          </h2>

          <p className="mx-auto max-w-2xl text-sm font-normal leading-relaxed text-slate-400 sm:text-base lg:mx-0">
            Generate 10 psychology-backed hooks, a retention score, an SEO description, and 15 hashtags — for every Reel, Short, and TikTok you make.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 lg:justify-start">
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:bg-slate-800"
            >
              Sign In &rarr;
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition duration-200 hover:from-purple-500 hover:to-blue-500"
            >
              Generate Hook
            </Link>

            <Link
              href="/blog"
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-300 transition duration-200 hover:bg-slate-800/80"
            >
              Read Blogs
            </Link>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
              <dd className="text-xl font-bold text-white sm:text-2xl">1M+</dd>
              <dt className="mt-1 text-[10px] leading-tight text-slate-400 sm:text-sm">
                Hooks Generated
              </dt>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
              <dd className="text-xl font-bold text-white sm:text-2xl">98%</dd>
              <dt className="mt-1 text-[10px] leading-tight text-slate-400 sm:text-sm">
                Avg. Retention Score
              </dt>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
              <dd className="text-xl font-bold text-white sm:text-2xl">15K+</dd>
              <dt className="mt-1 text-[10px] leading-tight text-slate-400 sm:text-sm">
                Active Creators
              </dt>
            </div>
          </dl>
        </section>

        <div className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl">
          <section
            aria-label="Trending hook preview"
            className="relative z-0 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-purple-950/30 sm:p-7"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-300">
                  Trending preview
                </p>
                <p className="mt-1 text-sm font-medium text-slate-200">
                  Creator starter pack
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Ready to post
              </span>
            </div>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Your opening hook
              </p>
              <p className="mt-3 text-lg font-semibold leading-relaxed text-white sm:text-xl">
                “I tried this for 7 days—here’s what nobody tells you.”
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs text-slate-500">Retention score</p>
                <p className="mt-2 text-2xl font-bold text-emerald-300">92%</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs text-slate-500">Platform fit</p>
                <p className="mt-2 text-2xl font-bold text-slate-100">Reels</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["#creator", "#reels", "#howto", "#trending"].map((hashtag) => (
                <span
                  key={hashtag}
                  className="rounded-full bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300"
                >
                  {hashtag}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-8 text-center text-xs text-slate-600 border-t border-slate-900">
        &copy; {new Date().getFullYear()} HookTos AI. All rights reserved.
      </footer>
    </div>
  );
}
