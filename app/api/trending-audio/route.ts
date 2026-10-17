import {
  FALLBACK_AUDIO,
  type TrendingAudio,
} from "@/lib/trending-data";

export const revalidate = 7200;
export const dynamic = "force-static";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function firstString(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function firstNumber(record: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];
    const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value.replaceAll(",", "").replace(/%$/, "")) : Number.NaN;
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return undefined;
}

function toAudioItems(value: unknown): TrendingAudio[] | null {
  if (!Array.isArray(value)) return null;

  const items = value.flatMap((entry, index) => {
    if (!isRecord(entry)) return [];
    const title = firstString(entry, ["title", "audioTitle", "audio_title", "name", "trackName"]);
    if (!title) return [];

    const artist = firstString(entry, ["artist", "artistName", "artist_name", "author"]) ?? "Instagram creator";
    const previewCandidate = firstString(entry, ["previewUrl", "preview_url", "audioUrl", "audio_url", "url"]);
    let previewUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${artist} Instagram audio`)}`;
    if (previewCandidate) {
      try {
        const parsedUrl = new URL(previewCandidate);
        if (parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:") previewUrl = parsedUrl.toString();
      } catch {
        // Use the searchable preview fallback for malformed upstream URLs.
      }
    }

    return [{
      id: `apify-audio-${index}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title,
      artist,
      reelsCount: firstNumber(entry, ["reelsCount", "reels_count", "usageCount", "usage_count", "posts", "count"]) ?? 0,
      velocityScore: firstNumber(entry, ["velocityScore", "velocity_score", "growthRate", "growth_rate", "growthPercent"]) ?? 0,
      category: firstString(entry, ["category", "niche", "genre"]) ?? "Trending",
      previewUrl,
      hookIdea: firstString(entry, ["hookIdea", "hook_idea"]) ?? `Use “${title}” to build a quick visual reveal around your topic.`,
    }];
  });

  return items.length > 0 ? items : null;
}

async function getApifyAudio(): Promise<TrendingAudio[] | null> {
  const apiKey = process.env.APIFY_API_KEY;
  const taskId = process.env.APIFY_TRENDING_AUDIO_TASK_ID;
  if (!apiKey || !taskId) return null;

  const response = await fetch(
    `https://api.apify.com/v2/actor-tasks/${encodeURIComponent(taskId)}/run-sync-get-dataset-items?token=${encodeURIComponent(apiKey)}&format=json&clean=true&limit=100`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      signal: AbortSignal.timeout(15_000),
    },
  );
  if (!response.ok) {
    throw new Error(`Apify audio task failed with status ${response.status}.`);
  }
  return toAudioItems(await response.json());
}

export async function GET() {
  try {
    const audio = await getApifyAudio();
    if (audio) {
      return Response.json({ data: audio, source: "apify" as const });
    }
    if (process.env.APIFY_API_KEY && process.env.APIFY_TRENDING_AUDIO_TASK_ID) {
      console.error("[trending-audio] Apify returned no usable audio records; serving fallback data.");
    }
  } catch (error) {
    console.error("[trending-audio] unable to fetch Apify trends; serving fallback data:", error);
  }

  return Response.json({ data: FALLBACK_AUDIO, source: "fallback" as const });
}
