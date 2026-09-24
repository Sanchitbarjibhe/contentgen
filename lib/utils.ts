// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely (handles conflicting utility classes). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** UTC-midnight truncation, used as the key for DailyUsage rows. */
export function startOfUtcDay(d: Date = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** 0-100 -> tailwind color tier for the retention score badge. */
export function retentionTier(score: number): {
  label: string;
  className: string;
} {
  if (score >= 80) {
    return { label: "High", className: "text-emerald-400 bg-emerald-400/10 ring-emerald-400/30" };
  }
  if (score >= 55) {
    return { label: "Medium", className: "text-amber-400 bg-amber-400/10 ring-amber-400/30" };
  }
  return { label: "Low", className: "text-rose-400 bg-rose-400/10 ring-rose-400/30" };
}

export function formatNiche(niche: string): string {
  return niche.charAt(0) + niche.slice(1).toLowerCase();
}

export function formatPlatform(platform: string): string {
  const map: Record<string, string> = {
    REELS: "Instagram Reels",
    SHORTS: "YouTube Shorts",
    TIKTOK: "TikTok",
  };
  return map[platform] ?? platform;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
