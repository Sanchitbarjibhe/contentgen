"use server";

import { prisma } from "@/lib/prisma";
import type {
  BillboardSlot,
  BusinessListingItem,
} from "@/lib/marketplace-types";

export async function getLiveBillboardSlots(): Promise<BillboardSlot[] | null> {
  try {
    return await prisma.adSlot.findMany({
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
  } catch (error) {
    console.error("[marketplace] Could not load live billboard slots:", error);
    return null;
  }
}

export async function getActiveBusinessListings(): Promise<BusinessListingItem[]> {
  return prisma.businessListing.findMany({
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
}
