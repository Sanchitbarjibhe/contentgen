// lib/subscription.ts
// Central place for "does this user get to do X" logic, so the API route,
// the dashboard, and the form don't each re-implement the freemium rules.
import { prisma } from "@/lib/prisma";
import { startOfUtcDay } from "@/lib/utils";
import { PLAN_LIMITS, type Plan, type UsageInfo } from "@/lib/types";

/**
 * Finds the user's DB row + subscription, creating both if this is their
 * first request (Clerk webhooks normally do this, but requests can race
 * ahead of the webhook, so the API route must be resilient to that).
 */
export async function getOrCreateUser(clerkId: string, email: string) {
  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: {
      clerkId,
      email,
      subscription: { create: { plan: "FREE" } },
    },
    include: { subscription: true },
  });

  if (!user.subscription) {
    const subscription = await prisma.subscription.create({
      data: { userId: user.id, plan: "FREE" },
    });
    return { ...user, subscription };
  }

  return user;
}

export function isSubscriptionActive(status: string): boolean {
  return status === "ACTIVE" || status === "TRIALING";
}

/**
 * Returns the user's *effective* plan — a lapsed/canceled paid plan falls
 * back to FREE limits even if the `plan` column hasn't been reset yet.
 */
export function effectivePlan(plan: Plan, status: string): Plan {
  return isSubscriptionActive(status) ? plan : "FREE";
}

/**
 * Atomically checks the daily cap and, if there's room, increments the
 * counter for today. Returns whether the generation is allowed plus the
 * resulting usage snapshot. Unlimited plans skip the DB round-trip.
 */
export async function checkAndConsumeUsage(
  userId: string,
  plan: Plan
): Promise<{ allowed: boolean; usage: UsageInfo }> {
  const limit = PLAN_LIMITS[plan].dailyGenerationLimit;

  if (limit === null) {
    return { allowed: true, usage: { plan, used: 0, limit: null, remaining: null } };
  }

  const today = startOfUtcDay();

  // Single round-trip: read current count, decide, then write — wrapped in
  // a transaction so two concurrent requests can't both slip past the cap.
  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.dailyUsage.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    const used = existing?.count ?? 0;

    if (used >= limit) {
      return { allowed: false, used };
    }

    if (existing) {
      await tx.dailyUsage.update({
        where: { id: existing.id },
        data: { count: { increment: 1 } },
      });
    } else {
      await tx.dailyUsage.create({
        data: { userId, date: today, count: 1 },
      });
    }

    return { allowed: true, used: used + 1 };
  });

  return {
    allowed: result.allowed,
    usage: {
      plan,
      used: result.used,
      limit,
      remaining: Math.max(limit - result.used, 0),
    },
  };
}

/** Read-only usage snapshot for the dashboard (does not consume a credit). */
export async function getUsageSnapshot(userId: string, plan: Plan): Promise<UsageInfo> {
  const limit = PLAN_LIMITS[plan].dailyGenerationLimit;
  if (limit === null) {
    return { plan, used: 0, limit: null, remaining: null };
  }

  const today = startOfUtcDay();
  const existing = await prisma.dailyUsage.findUnique({
    where: { userId_date: { userId, date: today } },
  });
  const used = existing?.count ?? 0;

  return { plan, used, limit, remaining: Math.max(limit - used, 0) };
}
