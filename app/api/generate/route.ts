import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateHooks, HookGenerationError } from "@/lib/openai";
import {
    ANON_COOKIE_MAX_AGE,
    ANON_ID_COOKIE,
    FREE_CREDITS,
    newAnonId,
    usageSnapshot,
} from "@/lib/anonymous";
import { NICHES, PLATFORMS } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
    topic: z.string().trim().min(10, "Give me at least a sentence about the video so the hooks have something to work with.").max(1200, "Keep the topic/script summary under 1200 characters."),
    niche: z.enum(NICHES),
    platform: z.enum(PLATFORMS),
});

export async function POST(req: NextRequest) {
    const existingAnonId = req.cookies.get(ANON_ID_COOKIE)?.value;
    const userId = existingAnonId ?? newAnonId();

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return respond({ error: "Request body must be JSON." }, 400, !existingAnonId, userId);
    }

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
        return respond({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, 422, !existingAnonId, userId);
    }

    const { topic, niche, platform } = parsed.data;
    const usage = await reserveCredit(userId);

    if (!usage.allowed) {
        return respond(
            {
                error: "LIMIT_REACHED",
                message: "Daily free generations limit reached.",
                usage: usageSnapshot(usage.record.freeCreditsLeft, usage.record.isPremium),
            },
            403,
            !existingAnonId,
            userId
        );
    }

    try {
        const result = await generateHooks({ topic, niche, platform });
        const generation = await prisma.generatedHook.create({
            data: {
                userId,
                topic,
                niche,
                platform,
                generatedHooks: {
                    hooks: result.hooks,
                    description: result.description,
                    hashtags: result.hashtags,
                } as unknown as Prisma.InputJsonValue,
                avgRetentionScore: result.avgRetentionScore,
            },
        });
        const latestUsage = await prisma.userUsage.findUniqueOrThrow({ where: { userId } });

        return respond(
            {
                id: generation.id,
                createdAt: generation.createdAt,
                topic,
                niche,
                platform,
                ...result,
                usage: usageSnapshot(latestUsage.freeCreditsLeft, latestUsage.isPremium),
            },
            200,
            !existingAnonId,
            userId
        );
    } catch (error) {
        if (usage.consumed) {
            await prisma.userUsage.update({
                where: { userId },
                data: { freeCreditsLeft: { increment: 1 } },
            });
        }

        if (error instanceof HookGenerationError) {
            console.error("[generate] hook generation failed:", error.message, error.cause);
            return respond({ error: "The AI engine couldn't produce hooks for that input. Please try rephrasing your topic." }, 502, !existingAnonId, userId);
        }

        console.error("[generate] unexpected error:", error);
        return respond({ error: "Something went wrong. Please try again." }, 500, !existingAnonId, userId);
    }
}

async function reserveCredit(userId: string) {
    return prisma.$transaction(async (tx) => {
        let record = await tx.userUsage.upsert({
            where: { userId },
            update: {},
            create: { userId },
        });

        if (!record.isPremium && Date.now() - record.lastResetDate.getTime() >= 24 * 60 * 60 * 1000) {
            record = await tx.userUsage.update({
                where: { id: record.id },
                data: { freeCreditsLeft: FREE_CREDITS, lastResetDate: new Date() },
            });
        }

        if (record.isPremium) return { allowed: true, consumed: false, record };

        const consumed = await tx.userUsage.updateMany({
            where: { id: record.id, isPremium: false, freeCreditsLeft: { gt: 0 } },
            data: { freeCreditsLeft: { decrement: 1 } },
        });
        const latest = await tx.userUsage.findUniqueOrThrow({ where: { id: record.id } });
        return { allowed: consumed.count === 1, consumed: consumed.count === 1, record: latest };
    });
}

function respond(body: unknown, status: number, setCookie: boolean, userId: string) {
    const response = NextResponse.json(body, { status });
    if (setCookie) {
        response.cookies.set({
            name: ANON_ID_COOKIE,
            value: userId,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: ANON_COOKIE_MAX_AGE,
            path: "/",
        });
    }
    return response;
}
