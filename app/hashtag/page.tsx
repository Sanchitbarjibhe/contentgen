import type { Metadata } from "next";
import HashtagExplorer from "./HashtagExplorer";

export const metadata: Metadata = {
  title: "Instagram Hashtag Finder",
  description: "Explore high-momentum Instagram hashtags by niche and build a targeted hashtag stack.",
  alternates: { canonical: "https://www.hooktos.com/hashtag" },
};

export default function HashtagPage() {
  return <HashtagExplorer />;
}