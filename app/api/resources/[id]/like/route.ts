import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  isResourceVisitorKey,
  RESOURCE_VISITOR_COOKIE,
} from "@/lib/creator-resources";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({ liked: z.boolean() }).strict();
const MAX_BODY_BYTES = 512;

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isRetryablePrismaError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2002" || error.code === "P2034")
  );
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function setVisitorCookie(
  response: NextResponse,
  visitorKey: string,
  shouldSetCookie: boolean,
) {
  if (!shouldSetCookie) return;
  response.cookies.set(RESOURCE_VISITOR_COOKIE, visitorKey, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== request.nextUrl.origin) {
        return errorResponse("Like requests must come from this site.", 403);
      }
    } catch {
      return errorResponse("The request origin is invalid.", 403);
    }
  }

  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  ) {
    return errorResponse("Request body must be JSON.", 415);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return errorResponse("Request body is too large.", 413);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return errorResponse("Request body is too large.", 413);
    }
  } catch {
    return errorResponse("Request body could not be read.", 400);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return errorResponse("Request body must be valid JSON.", 400);
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      parsed.error.issues[0]?.message ?? "Invalid like request.",
      422,
    );
  }

  const { id } = await params;
  if (!id || id.length > 100) {
    return errorResponse("Resource was not found.", 404);
  }

  const cookieStore = await cookies();
  const currentVisitorKey = cookieStore.get(RESOURCE_VISITOR_COOKIE)?.value;
  const validVisitorKey = isResourceVisitorKey(currentVisitorKey);
  const visitorKey = validVisitorKey ? currentVisitorKey : crypto.randomUUID();

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await prisma.$transaction(
        async (transaction) => {
          const resource = await transaction.creatorResource.findUnique({
            where: { id },
            select: { id: true },
          });
          if (!resource) return null;

          const uniqueLike = {
            resourceId_visitorKey: { resourceId: id, visitorKey },
          };
          const existingLike = await transaction.resourceLike.findUnique({
            where: uniqueLike,
            select: { id: true },
          });

          if (parsed.data.liked && !existingLike) {
            await transaction.resourceLike.create({
              data: { resourceId: id, visitorKey },
            });
            await transaction.creatorResource.update({
              where: { id },
              data: { likesCount: { increment: 1 } },
            });
          } else if (!parsed.data.liked && existingLike) {
            const deleted = await transaction.resourceLike.deleteMany({
              where: { resourceId: id, visitorKey },
            });
            if (deleted.count > 0) {
              await transaction.creatorResource.update({
                where: { id },
                data: { likesCount: { decrement: 1 } },
              });
            }
          }

          const [updatedResource, like] = await Promise.all([
            transaction.creatorResource.findUniqueOrThrow({
              where: { id },
              select: { likesCount: true },
            }),
            transaction.resourceLike.findUnique({
              where: uniqueLike,
              select: { id: true },
            }),
          ]);

          return { likesCount: updatedResource.likesCount, liked: Boolean(like) };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );

      if (!result) return errorResponse("Resource was not found.", 404);

      const response = NextResponse.json(result);
      setVisitorCookie(response, visitorKey, !validVisitorKey);
      return response;
    } catch (error) {
      if (isRetryablePrismaError(error) && attempt < 2) continue;
      if (isRetryablePrismaError(error)) {
        return errorResponse("Like changed concurrently. Please try again.", 409);
      }
      console.error("[resources] unable to update resource like:", error);
      return errorResponse("Unable to update this like right now.", 500);
    }
  }

  return errorResponse("Unable to update this like right now.", 500);
}
