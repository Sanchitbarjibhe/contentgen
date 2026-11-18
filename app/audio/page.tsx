import type { Metadata } from "next";
import AudioExplorer from "./AudioExplorer";

export const metadata: Metadata = {
  title: "Trending Instagram Audio",
  description: "Discover viral Instagram audio, track growth, and find ideas for your next Reel.",
  alternates: { canonical: "https://www.hooktos.com/audio" },
};

export default function AudioPage() {
  return <AudioExplorer />;
}
