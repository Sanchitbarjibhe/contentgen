import type { Metadata } from "next";
import HomeLanding from "@/components/HomeLanding";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "AI Content Generator for Reels and TikTok",
  description:
    "Turn ideas into scroll-stopping hooks, captions, and short-form content with HookTos AI. Create stronger Reels, TikTok, and YouTube Shorts openings.",
  path: "/",
});

export default function HomePage() {
  return <HomeLanding />;
}