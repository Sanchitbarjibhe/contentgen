import type { Metadata } from "next";
import HomeLanding from "@/components/HomeLanding";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "HookTos AI | AI Viral Hook Generator & Creator Marketplace",
  description:
    "Generate psychology-backed hooks, captions, and SEO content for TikTok, Reels, and YouTube Shorts in seconds.",
  path: "/",
});

export default function HomePage() {
  return <HomeLanding />;
}