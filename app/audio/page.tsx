import type { Metadata } from "next";
import AudioExplorer from "./AudioExplorer";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Trending Instagram Audio",
  description: "Discover viral Instagram audio, track growth, and find ideas for your next Reel.",
  path: "/audio",
});

export default function AudioPage() {
  return <AudioExplorer />;
}
