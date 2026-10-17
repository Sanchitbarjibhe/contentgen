import {
  FALLBACK_HASHTAGS,
  type TrendingHashtag,
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

function toHashtagItems(value: unknown): TrendingHashtag[] | null {
  if (!Array.isArray(value)) return null;

  const items = value.flatMap((entry, index) => {
    if (!isRecord(entry)) return [];
    const rawName = firstString(entry, ["hashtag", "name", "tag", "hashtagName", "hashtag_name"]);
    const name = rawName?.replace(/^#/, "");
    if (!name) return [];

    return [{
      id: `apify-hashtag-${index}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name,
      postVolume: firstNumber(entry, ["postVolume", "post_volume", "postCount", "post_count", "posts", "count"]) ?? 0,
      viralityScore: firstNumber(entry, ["viralityScore", "virality_score", "reachScore", "reach_score", "score"]) ?? 0,
      category: firstString(entry, ["category", "niche", "industry"]) ?? "Marketing",
      growthRate: firstNumber(entry, ["growthRate", "growth_rate", "growthPercent", "growth_percent"]) ?? 0,
    }];
  });

  return items.length > 0 ? items : null;
}

async function getApifyHashtags(): Promise<TrendingHashtag[] | null> {
  const apiKey = process.env.APIFY_API_KEY;
  const taskId = process.env.APIFY_TRENDING_HASHTAG_TASK_ID;
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
    throw new Error(`Apify hashtag task failed with status ${response.status}.`);
  }
  return toHashtagItems(await response.json());
}

export async function GET() {
  try {
    const hashtags = await getApifyHashtags();
    if (hashtags) {
      return Response.json({ data: hashtags, source: "apify" as const });
    }
    if (process.env.APIFY_API_KEY && process.env.APIFY_TRENDING_HASHTAG_TASK_ID) {
      console.error("[trending-hashtags] Apify returned no usable hashtag records; serving fallback data.");
    }
  } catch (error) {
    console.error("[trending-hashtags] unable to fetch Apify trends; serving fallback data:", error);
  }

  return Response.json({ data: FALLBACK_HASHTAGS, source: "fallback" as const });
}
