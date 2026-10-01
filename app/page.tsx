import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'HookTos AI — Viral Hook Generator & Social Content Assistant',
  description:
    'Generate psychology-backed viral hooks, retention scores, SEO descriptions, and hashtags for Instagram Reels, YouTube Shorts, and TikTok.',
};

export default function HomePage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between selection:bg-purple-500 selection:text-white">
      {/* Header Navigation */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            HookTos AI
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/changelog" className="hover:text-white transition">
            What&apos;s New
          </Link>
          <Link href="/about" className="hover:text-white transition">
            About
          </Link>
          <Link href="/blog" className="hover:text-white transition">
            Blog
          </Link>
        </nav>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-20 text-center space-y-8 my-auto">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          Powered by HookCraft AI
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Stop losing viewers in the <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
            first 3 seconds.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
          Generate 10 psychology-backed hooks, a retention score, an SEO description, and 15 hashtags — for every Reel, Short, and TikTok you make.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/auth/signin"
            className="px-6 py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white transition duration-200 shadow-lg"
          >
            Sign In &rarr;
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white transition duration-200 shadow-lg shadow-purple-500/20"
          >
            Explore Dashboard
          </Link>

          <Link
            href="/blog"
            className="px-6 py-3 rounded-xl font-semibold text-sm bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 transition duration-200"
          >
            Read Blogs
          </Link>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-8 text-center text-xs text-slate-600 border-t border-slate-900">
        &copy; {new Date().getFullYear()} HookTos AI. All rights reserved.
      </footer>
    </div>
  );
}
