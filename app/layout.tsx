// app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "@/app/globals.css";
import Navbar from "@/app/components/Navbar";

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
    icon: '/hooktos.jpg',
    shortcut: '/hooktos.jpg',
    apple: '/hooktos.jpg',
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
        url: '/hooktos.jpg',
        alt: 'HookTos AI logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HookTos AI — Create Viral Social Media Hooks in Seconds',
    description:
      'Supercharge your social media growth with AI-generated hooks and high-converting content.',
    images: ['/hooktos.jpg'],
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
          <Navbar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
