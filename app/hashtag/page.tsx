import type { Metadata } from "next";
import HashtagExplorer from "./HashtagExplorer";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Instagram Hashtag Finder",
  description: "Explore high-momentum Instagram hashtags by niche and build a targeted hashtag stack.",
  path: "/hashtag",
});

export default function HashtagPage() {
  return <HashtagExplorer />;
}