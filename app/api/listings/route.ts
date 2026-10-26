import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16_384;
const requestSchema = z
  .object({
    name: z.string().trim().min(1, "Business name is required.").max(100),
    category: z.string().trim().min(1, "Category is required.").max(60),
    tag: z.string().trim().min(1, "Business tag is required.").max(80),
    websiteUrl: z
      .string()
      .trim()
      .url("Enter a valid website URL.")
      .max(2048)
      .regex(/^https?:\/\//i, "Website URL must use HTTP or HTTPS."),
    logoUrl: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z
        .string()
        .trim()
        .url("Enter a valid logo URL.")
        .max(2048)
        .regex(/^https?:\/\//i, "Logo URL must use HTTP or HTTPS.")
        .optional(),
    ),
    description: z
      .string()
      .trim()
      .min(1, "A business description is required.")
      .max(800, "Description must be 800 characters or fewer."),
  })
  .strict();

function createSlug(name: string) {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "business-listing";
}

function isUniqueConflict(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: NextRequest) {
  const originHeader = request.headers.get("origin");
  if (originHeader) {
    try {
      if (new URL(originHeader).origin !== request.nextUrl.origin) {
        return errorResponse("Listing requests must come from this site.", 403);
      }
    } catch {
      return errorResponse("The request origin is invalid.", 403);
    }
  }

  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return errorResponse("Request body must be JSON.", 415);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return errorResponse("Request body is too large.", 413);
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return errorResponse("Request body is too large.", 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return errorResponse("Request body must be valid JSON.", 400);
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid listing details.", 422);
  }

  const { name, category, tag, websiteUrl, logoUrl, description } = parsed.data;
  const baseSlug = createSlug(name);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;

    try {
      const listing = await prisma.businessListing.create({
        data: {
          name,
          slug,
          category,
          tag,
          websiteUrl,
          logoUrl,
          description,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          tag: true,
          websiteUrl: true,
          description: true,
          createdAt: true,
        },
      });

      return NextResponse.json({ listing }, { status: 201 });
    } catch (error) {
      if (isUniqueConflict(error)) continue;

      console.error("[business listing] database create failed:", error);
      return errorResponse("Unable to save your listing right now. Please try again.", 500);
    }
  }

  return errorResponse("A listing with this business name already exists. Please contact support.", 409);
}
