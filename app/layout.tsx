// app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL('https://contentgen-eight.vercel.app'),
  title: {
    default: 'hooktos AI — Viral Hook Generator & SEO Content Assistant',
    template: '%s | hooktos AI',
  },
  description:
    'Generate 10x viral hooks for Instagram Reels, YouTube Shorts, and TikTok in seconds. Boost reach, engagement, and video retention with AI-driven content generation.',
  keywords: [
    'hooktos AI',
    'Viral Hook Generator',
    'AI Content Generator',
    'Instagram Reels Hooks',
    'YouTube Shorts Hooks',
    'TikTok Viral Captions',
    'Social Media Content Assistant',
    'Video Retention Hooks',
  ],
  authors: [{ name: 'hooktos AI Team' }],
  creator: 'hooktos AI',
  publisher: 'hooktos AI',
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
    url: 'https://contentgen-eight.vercel.app',
    siteName: 'hooktos AI',
    title: 'hooktos AI — Generate Viral Hooks & High-Ranking Content',
    description:
      'Stop losing viewers! Generate high-retention viral hooks for Reels, Shorts, and TikTok instantly using hooktos AI.',
    images: [
      {
        url: '/og-image.png', // Public folder मध्ये 1200x630px चा फोटो टाका
        width: 1200,
        height: 630,
        alt: 'hooktos AI Dashboard & Viral Hook Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'hooktos AI — Create Viral Social Media Hooks in Seconds',
    description:
      'Supercharge your social media growth with AI-generated hooks and high-converting content.',
    images: ['/og-image.png'],
    creator: '@hooktosai',
  },
  alternates: {
    canonical: 'https://contentgen-eight.vercel.app',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased`}>
        <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-semibold text-zinc-100">
            hooktos AI
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="text-sm text-zinc-400 hover:text-white transition"
            >
              Blog
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
