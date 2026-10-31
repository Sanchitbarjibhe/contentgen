"use server";

import { prisma } from "@/lib/prisma";
import type {
  BillboardSlot,
  BusinessListingItem,
} from "@/lib/marketplace-types";
import {
  getFallbackFreeListingStats,
  getFreeListingStatsForCount,
} from "@/lib/marketplace-listings";
import {
  marketplaceCategories,
  type MarketplaceCategorySlug,
} from "@/optimizations/SEO/marketplace-categories";

const FALLBACK_BILLBOARD_SLOTS: BillboardSlot[] = [
  {
    id: "fallback-northstar",
    title: "Northstar Studio",
    category: "SaaS · AI Automation",
    tier: "FEATURED",
    pricePerWeek: 80,
    views: 3420,
    clicks: 128,
    imageUrl: null,
    websiteUrl: null,
  },
  {
    id: "fallback-goodkind",
    title: "Goodkind Coffee",
    category: "Food · Artisan Cafe",
    tier: "FEATURED",
    pricePerWeek: 40,
    views: 2810,
    clicks: 94,
    imageUrl: null,
    websiteUrl: null,
  },
  {
    id: "fallback-pixel-pine",
    title: "Pixel & Pine",
    category: "Retail · Minimalist Gear",
    tier: "MEDIUM",
    pricePerWeek: 25,
    views: 2490,
    clicks: 76,
    imageUrl: null,
    websiteUrl: null,
  },
];

const FALLBACK_BUSINESS_LISTINGS: BusinessListingItem[] = [
  {
    id: "fallback-northstar",
    name: "Northstar Studio",
    slug: "northstar-studio",
    category: "SaaS",
    tag: "AI Automation",
    websiteUrl: "https://northstar-studio.example",
    logoUrl: null,
  },
  {
    id: "fallback-goodkind",
    name: "Goodkind Coffee",
    slug: "goodkind-coffee",
    category: "Food",
    tag: "Artisan Cafe",
    websiteUrl: "https://goodkind-coffee.example",
    logoUrl: null,
  },
  {
    id: "fallback-pixel-pine",
    name: "Pixel & Pine",
    slug: "pixel-and-pine",
    category: "Retail",
    tag: "Minimalist Gear",
    websiteUrl: "https://pixel-and-pine.example",
    logoUrl: null,
  },
  {
    id: "fallback-orbit",
    name: "Orbit Analytics",
    slug: "orbit-analytics",
    category: "Tech",
    tag: "Data Intelligence",
    websiteUrl: "https://orbit-analytics.example",
    logoUrl: null,
  },
];

export interface FreeListingStats {
  claimed: number;
  capacity: number;
  remaining: number;
}

export async function getLiveBillboardSlots(): Promise<BillboardSlot[]> {
  console.info("[marketplace] Fetching live billboard slots from Prisma.");

  try {
    const slots = await prisma.adSlot.findMany({
      where: {
        isLive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: [{ tier: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        category: true,
        tier: true,
        pricePerWeek: true,
        views: true,
        clicks: true,
        imageUrl: true,
        websiteUrl: true,
      },
    });

    console.log("Fetched billboard slots:", slots);
    if (slots.length === 0) {
      console.warn(
        "[marketplace] No live billboard slots found; serving fallback data.",
      );
      return FALLBACK_BILLBOARD_SLOTS;
    }

    return slots;
  } catch (error) {
    console.error(
      "[marketplace] Could not load live billboard slots; serving fallback data:",
      error,
    );
    return FALLBACK_BILLBOARD_SLOTS;
  }
}

export async function getActiveBusinessListings(): Promise<BusinessListingItem[]> {
  console.info("[marketplace] Fetching approved business listings from Prisma.");

  try {
    const businesses = await prisma.businessListing.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        tag: true,
        websiteUrl: true,
        logoUrl: true,
      },
    });

    console.log("Fetched businesses:", businesses);
    if (businesses.length === 0) {
      console.warn(
        "[marketplace] No approved business listings found; serving fallback data.",
      );
      return FALLBACK_BUSINESS_LISTINGS;
    }

    return businesses;
  } catch (error) {
    console.error(
      "[marketplace] Could not load approved business listings; serving fallback data:",
      error,
    );
    return FALLBACK_BUSINESS_LISTINGS;
  }
}

const FALLBACK_CREATOR_BUSINESSES: BusinessListingItem[] = [
  {
    id: "fallback-feastables",
    name: "Feastables",
    slug: "feastables",
    category: "Creator Brand",
    tag: "Consumer Products",
    websiteUrl: "https://feastables.com",
    logoUrl: null,
    description:
      "A creator-led consumer brand example. Visit its official website to learn more.",
  },
  {
    id: "fallback-prime-hydration",
    name: "Prime Hydration",
    slug: "prime-hydration",
    category: "Creator Brand",
    tag: "Food & Beverage",
    websiteUrl: "https://drinkprime.com",
    logoUrl: null,
    description:
      "A creator-led beverage brand example. Visit its official website to learn more.",
  },
  {
    id: "fallback-viewstats",
    name: "Viewstats",
    slug: "viewstats",
    category: "Creator Tools",
    tag: "Creator Analytics",
    websiteUrl: "https://viewstats.com",
    logoUrl: null,
    description:
      "A creator-focused analytics platform example. Visit its official website to learn more.",
  },
  {
    id: "fallback-mrbeast-store",
    name: "MrBeast Store",
    slug: "mrbeast-store",
    category: "Creator Brand",
    tag: "Creator Merchandise",
    websiteUrl: "https://mrbeast.store",
    logoUrl: null,
    description:
      "A creator merchandise business example. Visit its official website to learn more.",
  },
];

export async function getCategoryBusinessListings(
  categorySlug: MarketplaceCategorySlug,
): Promise<BusinessListingItem[]> {
  const category = marketplaceCategories[categorySlug];
  if (!category) {
    throw new Error(`Unknown marketplace category: ${categorySlug}`);
  }

  try {
    const businesses = await prisma.businessListing.findMany({
      where: {
        isApproved: true,
        OR: [
          ...category.categoryMatches.map((value) => ({
            category: { equals: value, mode: "insensitive" as const },
          })),
          ...category.tagMatches.map((value) => ({
            tag: { contains: value, mode: "insensitive" as const },
          })),
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 24,
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        tag: true,
        websiteUrl: true,
        logoUrl: true,
        description: true,
      },
    });

    if (businesses.length > 0) return businesses;

    console.warn(
      `[marketplace] No approved listings matched ${categorySlug}; serving creator-business examples.`,
    );
    return FALLBACK_CREATOR_BUSINESSES;
  } catch (error) {
    console.error(
      `[marketplace] Could not load listings for ${categorySlug}; serving creator-business examples:`,
      error,
    );
    return FALLBACK_CREATOR_BUSINESSES;
  }
}

export async function getFreeListingStats(): Promise<FreeListingStats> {
  try {
    const claimed = await prisma.businessListing.count({
      where: { isApproved: true },
    });

    return getFreeListingStatsForCount(claimed);
  } catch (error) {
    console.error(
      "[marketplace] Could not load approved listing count; using the 20-listing display estimate:",
      error,
    );
    return getFallbackFreeListingStats();
  }
}
