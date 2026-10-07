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
          <header className=" max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-white">
              <Link href="/" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                HookTos AI
              </Link>
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
              {/* <AuthActions /> */}
            </nav>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
