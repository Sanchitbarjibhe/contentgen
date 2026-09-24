// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateHooks, HookGenerationError } from "@/lib/openai";
import { getOrCreateUser, checkAndConsumeUsage, effectivePlan } from "@/lib/subscription";
import { NICHES, PLATFORMS } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(10, "Give me at least a sentence about the video so the hooks have something to work with.")
    .max(1200, "Keep the topic/script summary under 1200 characters."),
  niche: z.enum(NICHES),
  platform: z.enum(PLATFORMS),
});

export async function POST(req: NextRequest) {
  // 1. Auth ------------------------------------------------------------
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "You need to be signed in to generate hooks." }, { status: 401 });
  }

  // 2. Validate body -----------------------------------------------------
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 422 }
    );
  }
  const { topic, niche, platform } = parsed.data;

  // 3. Resolve user + plan -------------------------------------------------
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? `${clerkId}@unknown.hookcraft.ai`;

  const user = await getOrCreateUser(clerkId, email);
  const plan = effectivePlan(user.subscription!.plan, user.subscription!.status);

  // 4. Enforce daily usage cap for FREE plan ------------------------------
  const { allowed, usage } = await checkAndConsumeUsage(user.id, plan);
  if (!allowed) {
    return NextResponse.json(
      {
        error:
          "You've used today's 5 free generations. Upgrade to Pro for unlimited hooks, or come back tomorrow.",
        usage,
      },
      { status: 429 }
    );
  }

  // 5. Call the AI engine --------------------------------------------------
  try {
    const result = await generateHooks({ topic, niche, platform });

    // 6. Persist ------------------------------------------------------------
    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        topic,
        niche,
        platform,
        hooks: result.hooks,
        description: result.description,
        hashtags: [
          ...result.hashtags.broad,
          ...result.hashtags.medium,
          ...result.hashtags.lowCompetition,
        ],
        avgRetentionScore: result.avgRetentionScore,
      },
    });

    return NextResponse.json({
      id: generation.id,
      createdAt: generation.createdAt,
      ...result,
      usage,
    });
  } catch (err) {
    // Refund the credit we optimistically consumed above — a failed AI call
    // should never cost the user part of their daily quota.
    await refundUsageOnFailure(user.id, plan);

    if (err instanceof HookGenerationError) {
      console.error("[generate] hook generation failed:", err.message, err.cause);
      return NextResponse.json(
        { error: "The AI engine couldn't produce hooks for that input. Please try rephrasing your topic." },
        { status: 502 }
      );
    }

    console.error("[generate] unexpected error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

async function refundUsageOnFailure(userId: string, plan: string) {
  if (plan !== "FREE") return;
  try {
    const { startOfUtcDay } = await import("@/lib/utils");
    const today = startOfUtcDay();
    await prisma.dailyUsage.update({
      where: { userId_date: { userId, date: today } },
      data: { count: { decrement: 1 } },
    });
  } catch (err) {
    // Non-fatal: worst case the user loses one credit on a rare failure path.
    console.error("[generate] failed to refund usage credit:", err);
  }
}
