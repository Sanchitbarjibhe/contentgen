export const FREE_LISTING_CAPACITY = 100;
export const FALLBACK_CLAIMED_LISTINGS = 20;

export function getFreeListingStatsForCount(claimed: number) {
  return {
    claimed: Math.min(claimed, FREE_LISTING_CAPACITY),
    capacity: FREE_LISTING_CAPACITY,
    remaining: Math.max(FREE_LISTING_CAPACITY - claimed, 0),
  };
}

export function getFallbackFreeListingStats() {
  return getFreeListingStatsForCount(FALLBACK_CLAIMED_LISTINGS);
}

export function getListingCountryHint(locale: string | undefined) {
  if (!locale) return "GLOBAL";

  try {
    return new Intl.Locale(locale).region === "IN" ? "IN" : "GLOBAL";
  } catch {
    return "GLOBAL";
  }
}
