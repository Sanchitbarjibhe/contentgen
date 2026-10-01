import { cookies } from "next/headers";

export const ANON_ID_COOKIE = "anon_id";
export const FREE_CREDITS = 5;
export const ANON_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function newAnonId(): string {
    return crypto.randomUUID();
}

export async function getAnonId(): Promise<string> {
    const cookieStore = await cookies();
    return cookieStore.get(ANON_ID_COOKIE)?.value ?? newAnonId();
}
import { prisma } from "@/lib/prisma";

export function usageSnapshot(
    freeCreditsLeft: number,
    isPremium: boolean
) {
    return {
        plan: isPremium ? "PRO" : "FREE",
        used: isPremium ? 0 : FREE_CREDITS - freeCreditsLeft,
        limit: isPremium ? null : FREE_CREDITS,
        remaining: isPremium ? null : Math.max(freeCreditsLeft, 0),
    } as const;
}

export async function getOrCreateUsage(userId: string) {
    const usage = await prisma.userUsage.upsert({
        where: { userId },
        update: {},
        create: { userId },
    });

    if (!usage.isPremium && Date.now() - usage.lastResetDate.getTime() >= 24 * 60 * 60 * 1000) {
        return prisma.userUsage.update({
            where: { id: usage.id },
            data: { freeCreditsLeft: FREE_CREDITS, lastResetDate: new Date() },
        });
    }

    return usage;
}