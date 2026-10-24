// app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "@/app/globals.css";
import Navbar from "@/app/components/Navbar";
import ConsentBanner from "@/components/ConsentBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import JsonLd from "@/components/JsonLd";
import {
  organizationSchema,
  softwareApplicationSchema,
  websiteSchema,
} from "@/lib/schema";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hooktos.com'),
  title: {
    default: 'HookTos AI | AI Viral Hook Generator',
    template: '%s | HookTos AI',
  },
  description:
    'Generate viral hooks, captions, and SEO content for TikTok, Reels, and YouTube Shorts with HookTos AI.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
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
    title: 'HookTos AI | Viral Hooks for Social Video',
    description:
      'Create high-retention hooks and SEO-ready content for TikTok, Instagram Reels, and YouTube Shorts in seconds.',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'HookTos AI Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Viral Hook Generator | HookTos AI',
    description:
      'Create viral hooks, captions, and SEO content for TikTok, Reels, and YouTube Shorts.',
    images: ['/android-chrome-512x512.png'],
    creator: '@HookTosai',
  },
  alternates: {
    canonical: 'https://www.hooktos.com',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} min-h-screen bg-slate-950 font-sans text-zinc-100 antialiased`}
        suppressHydrationWarning
      >
        <JsonLd
          data={[
            organizationSchema,
            websiteSchema,
            softwareApplicationSchema,
          ]}
        />
        <GoogleAnalytics />
        <ClerkProvider appearance={{ variables: { colorPrimary: "#4F46E5" } }}>
          <Navbar />
          {children}
        </ClerkProvider>
        <ConsentBanner />
      </body>
    </html>
  );
}
