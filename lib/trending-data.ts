export type TrendingAudio = {
  id: string;
  title: string;
  artist: string;
  reelsCount: number;
  velocityScore: number;
  category: string;
  previewUrl: string;
  hookIdea: string;
};

export type TrendingHashtag = {
  id: string;
  name: string;
  postVolume: number;
  viralityScore: number;
  category: string;
  growthRate: number;
};

function youtubeSearchUrl(title: string, artist: string): string {
  const query = encodeURIComponent(`${title} ${artist} Instagram audio`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

function audio(
  id: string,
  title: string,
  artist: string,
  reelsCount: number,
  velocityScore: number,
  category: string,
  hookIdea: string,
): TrendingAudio {
  return {
    id,
    title,
    artist,
    reelsCount,
    velocityScore,
    category,
    previewUrl: youtubeSearchUrl(title, artist),
    hookIdea,
  };
}

export const FALLBACK_AUDIO: TrendingAudio[] = [
  audio("audio-01", "Golden Hour (Slowed)", "JVKE", 284000, 52, "Pop", "Open with a warm, cinematic reveal timed to the first beat."),
  audio("audio-02", "End of Beginning", "Djo", 196000, 44, "Lifestyle", "Show the before-and-after of a place, routine, or season that changed you."),
  audio("audio-03", "Beautiful Things", "Benson Boone", 171000, 39, "Pop", "Pair the build with a quick transformation and a personal payoff."),
  audio("audio-04", "Makeba", "Jain", 148000, 35, "Dance", "Start on the beat with a simple move, reveal, or satisfying process."),
  audio("audio-05", "Aesthetic (Loop)", "Toby Fox", 112000, 31, "Creator", "Use a clean loop to show three quick details viewers might miss."),
  audio("audio-06", "Espresso", "Sabrina Carpenter", 103000, 28, "Lifestyle", "Introduce a playful unpopular opinion before the chorus lands."),
  audio("audio-07", "Sunset Lover", "Petit Biscuit", 87000, 24, "Creator", "Create a calm montage that reveals the finished result in the final frame."),
  audio("audio-08", "Daylight", "David Kushner", 76000, 21, "Business", "Set up a common mistake, then reveal the better way on the drop."),
];

export const FALLBACK_HASHTAGS: TrendingHashtag[] = [
  { id: "tag-01", name: "saasgrowth", postVolume: 284000, viralityScore: 94, category: "SaaS", growthRate: 48 },
  { id: "tag-02", name: "buildinpublic", postVolume: 196000, viralityScore: 91, category: "SaaS", growthRate: 42 },
  { id: "tag-03", name: "fitnessmotivation", postVolume: 12800000, viralityScore: 89, category: "Fitness", growthRate: 37 },
  { id: "tag-04", name: "hybridtraining", postVolume: 412000, viralityScore: 92, category: "Fitness", growthRate: 53 },
  { id: "tag-05", name: "aitools", postVolume: 935000, viralityScore: 96, category: "AI", growthRate: 61 },
  { id: "tag-06", name: "aitips", postVolume: 523000, viralityScore: 93, category: "AI", growthRate: 46 },
  { id: "tag-07", name: "contentmarketing", postVolume: 3780000, viralityScore: 87, category: "Marketing", growthRate: 29 },
  { id: "tag-08", name: "socialmediastrategy", postVolume: 642000, viralityScore: 90, category: "Marketing", growthRate: 34 },
];

export function isTrendingAudioList(value: unknown): value is TrendingAudio[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item: unknown) =>
        isRecord(item) &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.artist === "string" &&
        typeof item.reelsCount === "number" &&
        typeof item.velocityScore === "number" &&
        typeof item.category === "string" &&
        typeof item.previewUrl === "string" &&
        typeof item.hookIdea === "string",
    )
  );
}

export function isTrendingHashtagList(value: unknown): value is TrendingHashtag[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item: unknown) =>
        isRecord(item) &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.postVolume === "number" &&
        typeof item.viralityScore === "number" &&
        typeof item.category === "string" &&
        typeof item.growthRate === "number",
    )
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
