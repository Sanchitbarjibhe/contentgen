import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getFallbackFreeListingStats,
  getFreeListingStatsForCount,
  getListingCountryHint,
} from "@/lib/marketplace-listings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const claimed = await prisma.businessListing.count({
      where: { isApproved: true },
    });
    const stats = getFreeListingStatsForCount(claimed);
    const vercelCountry = request.headers
      .get("x-vercel-ip-country")
      ?.toUpperCase();
    const country =
      vercelCountry &&
      /^[A-Z]{2}$/.test(vercelCountry) &&
      vercelCountry !== "XX"
        ? vercelCountry
        : getListingCountryHint(request.nextUrl.searchParams.get("locale") ?? undefined);

    return NextResponse.json(
      {
        ...stats,
        remainingSlots: stats.remaining,
        paymentRequired: stats.remaining === 0,
        gateway: country === "IN" ? "razorpay" : "stripe",
        currency: country === "IN" ? "INR" : "USD",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[business listing] failed to check free slots:", error);
    const stats = getFallbackFreeListingStats();
    const vercelCountry = request.headers
      .get("x-vercel-ip-country")
      ?.toUpperCase();
    const country =
      vercelCountry &&
      /^[A-Z]{2}$/.test(vercelCountry) &&
      vercelCountry !== "XX"
        ? vercelCountry
        : getListingCountryHint(request.nextUrl.searchParams.get("locale") ?? undefined);

    return NextResponse.json(
      {
        ...stats,
        remainingSlots: stats.remaining,
        paymentRequired: stats.remaining === 0,
        gateway: country === "IN" ? "razorpay" : "stripe",
        currency: country === "IN" ? "INR" : "USD",
        estimated: true,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
