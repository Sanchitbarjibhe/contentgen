// app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "@/app/globals.css";
import AuthActions from "@/components/AuthActions";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hooktos.com'),
  title: {
    default: 'HookTos AI — Viral Hook Generator & SEO Content Assistant',
    template: '%s | HookTos AI',
  },
  description:
    'Generate 10x viral hooks for Instagram Reels, YouTube Shorts, and TikTok in seconds. Boost reach, engagement, and video retention with AI-driven content generation.',
  icons: {
    icon: '/hooktos.png', // किंवा '/icon.png'
    shortcut: '/hooktos.png',
    apple: '/hooktos.png', // iOS डिव्हाईससाठी (180x180 png)
  },
  keywords: [
    'HookTos AI',
    'Viral Hook Generator',
    'AI Content Generator',
    'Instagram Reels Hooks',
    'YouTube Shorts Hooks',
    'TikTok Viral Captions',
    'Social Media Content Assistant',
    'Video Retention Hooks',
  ],
  authors: [{ name: 'HookTos AI Team' }],
  creator: 'HookTos AI',
  publisher: 'HookTos AI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.hooktos.com',
    siteName: 'HookTos AI',
    title: 'HookTos AI — Generate Viral Hooks & High-Ranking Content',
    description:
      'Stop losing viewers! Generate high-retention viral hooks for Reels, Shorts, and TikTok instantly using HookTos AI.',
    images: [
      {
        url: '/hooktos.png', // Public folder मध्ये 1200x630px चा फोटो टाका
        width: 1200,
        height: 630,
        alt: 'HookTos AI Dashboard & Viral Hook Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HookTos AI — Create Viral Social Media Hooks in Seconds',
    description:
      'Supercharge your social media growth with AI-generated hooks and high-converting content.',
    images: ['public/hooktos.png'],
    creator: '@HookTosai',
  },
  alternates: {
    canonical: 'https://www.hooktos.com',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen bg-slate-950 font-sans text-zinc-100 antialiased`}>
        <ClerkProvider appearance={{ variables: { colorPrimary: "#4F46E5" } }}>
          <header className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 bg-slate-950 px-6 py-4 sm:flex-row sm:gap-0">
            <div className="flex items-center gap-2 whitespace-nowrap font-extrabold text-lg tracking-tight text-white">
              <Link href="/" className="whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                HookTos AI
              </Link>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-white">
              <Link href="/changelog" className="whitespace-nowrap transition hover:text-purple-300">
                What&apos;s New
              </Link>
              <Link href="/audio" className="whitespace-nowrap transition hover:text-purple-300">
                Trending Audio
              </Link>
              <Link href="/hashtag" className="whitespace-nowrap transition hover:text-purple-300">
                Top Hashtags
              </Link>
              <Link href="/about" className="whitespace-nowrap transition hover:text-purple-300">
                About
              </Link>
              <Link href="/blog" className="whitespace-nowrap transition hover:text-purple-300">
                Blog
              </Link>
              {/* <AuthActions /> */}
            </nav>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
