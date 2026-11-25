import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  CreatorResource,
  type PersistedCreatorResource,
  RESOURCE_CATEGORIES,
  type ResourceCategory,
} from "@/data/resources";
import {
  fromCreatorResourceRow,
  getResourceSearchText,
  isResourceVisitorKey,
  RESOURCE_VISITOR_COOKIE,
} from "@/lib/creator-resources";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isResourceCategory(value: string): value is ResourceCategory {
  return RESOURCE_CATEGORIES.some((category) => category === value);
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: NextRequest) {
  const categoryParam = request.nextUrl.searchParams.get("category")?.trim();
  const niche = request.nextUrl.searchParams.get("niche")?.trim();
  const search = request.nextUrl.searchParams.get("search")?.trim();

  if (categoryParam && !isResourceCategory(categoryParam)) {
    return errorResponse("Unknown resource category.", 400);
  }
  if (niche && niche.length > 100) {
    return errorResponse("Niche filter is too long.", 400);
  }
  if (search && search.length > 120) {
    return errorResponse("Search query is too long.", 400);
  }

  try {
    const cookieStore = await cookies();
    const currentVisitorKey = cookieStore.get(RESOURCE_VISITOR_COOKIE)?.value;
    const visitorKey = isResourceVisitorKey(currentVisitorKey)
      ? currentVisitorKey
      : crypto.randomUUID();

    const rows = await prisma.creatorResource.findMany({
      where: {
        ...(categoryParam ? { category: categoryParam } : {}),
        ...(niche
          ? { niche: { contains: niche, mode: "insensitive" as const } }
          : {}),
      },
      orderBy: [{ category: "asc" }, { title: "asc" }],
    });

    const likedRows = await prisma.resourceLike.findMany({
      where: { visitorKey, resourceId: { in: rows.map((row) => row.id) } },
      select: { resourceId: true },
    });
    const likedIds = new Set(likedRows.map((like) => like.resourceId));
    const mapped = rows.map((row) =>
      fromCreatorResourceRow(row, likedIds.has(row.id)),
    );

    const validResources = mapped.filter(
      (resource): resource is PersistedCreatorResource => resource !== null,
    );
    if (validResources.length !== rows.length) {
      console.error("[resources] database contains malformed resource content.");
      return errorResponse("Resource data is temporarily unavailable.", 500);
    }

    const normalizedSearch = search?.toLocaleLowerCase();
    const data = validResources.filter(
      (resource: CreatorResource) =>
        !normalizedSearch ||
        getResourceSearchText(resource).includes(normalizedSearch),
    );
    const response = NextResponse.json(
      { data, source: "database" },
      { headers: { "Cache-Control": "no-store" } },
    );

    if (!isResourceVisitorKey(currentVisitorKey)) {
      response.cookies.set(RESOURCE_VISITOR_COOKIE, visitorKey, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  } catch (error) {
    console.error("[resources] unable to fetch creator resources:", error);
    return errorResponse("Unable to load creator resources right now.", 500);
  }
}
