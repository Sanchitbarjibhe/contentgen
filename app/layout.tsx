// app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import AuthActions from "@/components/AuthActions";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "HookCraft AI — Viral Hook & SEO Generator",
  description: "Generate scroll-stopping hooks, SEO descriptions, and hashtags for Reels, Shorts, and TikTok.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased`}>
        <ClerkProvider appearance={{ variables: { colorPrimary: "#4F46E5" } }}>
          <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-sm font-semibold text-zinc-100">
              HookCraft AI
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/blog"
                className="text-sm text-zinc-400 hover:text-white transition"
              >
                Blog
              </Link>
              <AuthActions />
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
