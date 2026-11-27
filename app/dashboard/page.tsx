import { Suspense } from "react";
import { Flame, History, Sparkles, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { FREE_CREDITS, getAnonId, getOrCreateUsage, usageSnapshot } from "@/lib/anonymous";
import { retentionTier } from "@/lib/utils";
import { StatCard } from "@/components/StatCard";
import { UsageChart } from "@/components/UsageChart";
import { DashboardWorkspace } from "@/components/DashboardWorkspace";
import type { RecentGeneration } from "@/components/RecentGenerations";
import { Badge } from "@/components/ui/Badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<{ prompt?: string | string[] }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const promptParam = (await searchParams).prompt;
  const initialPrompt = Array.isArray(promptParam)
    ? promptParam[0]
    : promptParam;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent initialPrompt={initialPrompt?.slice(0, 1200)} />
      </Suspense>
    </div>
  );
}

async function DashboardContent({ initialPrompt }: { initialPrompt?: string }) {
  const userId = await getAnonId();
  const usageRecord = await getOrCreateUsage(userId);
  const usage = usageSnapshot(usageRecord.freeCreditsLeft, usageRecord.isPremium);
  const [recentGenerations, totalGenerations, last7DaysUsage] = await Promise.all([
    prisma.generatedHook.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        topic: true,
        niche: true,
        platform: true,
        avgRetentionScore: true,
        createdAt: true,
      },
    }),
    prisma.generatedHook.count({ where: { userId } }),
    getLast7DaysUsage(userId),
  ]);

  const avgRetention = recentGenerations.length
    ? Math.round(recentGenerations.reduce((sum, generation) => sum + generation.avgRetentionScore, 0) / recentGenerations.length)
    : 0;
  const streak = computeStreak(last7DaysUsage);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Welcome to HookTos AI</h1>
          <p className="mt-1 text-sm text-zinc-500">Your private dashboard is ready. No account required.</p>
        </div>
        <Badge tone={usageRecord.isPremium ? "indigo" : "neutral"} className="px-3 py-1.5 text-sm">
          {usageRecord.isPremium ? "Premium" : "Free plan"}
        </Badge>
      </div>

      <DashboardWorkspace
        initialUsage={usage}
        initialPrompt={initialPrompt}
        initialRecent={recentGenerations.map((generation): RecentGeneration => ({
          id: generation.id,
          topic: generation.topic,
          niche: generation.niche,
          platform: generation.platform,
          avgRetentionScore: generation.avgRetentionScore,
          createdAt: generation.createdAt.toISOString(),
        }))}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Free generations left" value={usage.remaining === null ? "Unlimited" : `${usage.remaining} / ${FREE_CREDITS}`} icon={Sparkles} accent />
        <StatCard label="Total generations" value={totalGenerations.toString()} icon={History} />
        <StatCard label="Avg. retention score" value={recentGenerations.length ? `${avgRetention}%` : "—"} icon={TrendingUp} hint={recentGenerations.length ? retentionTier(avgRetention).label : "No data yet"} />
        <StatCard label="Current streak" value={`${streak} day${streak === 1 ? "" : "s"}`} icon={Flame} />
      </div>

      <UsageChart data={last7DaysUsage} />
    </>
  );
}

async function getLast7DaysUsage(userId: string) {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - 6);
  const rows = await prisma.$queryRaw<{ day: string; count: bigint }[]>`
    SELECT TO_CHAR(DATE_TRUNC('day', "createdAt"), 'YYYY-MM-DD') AS day, COUNT(*) AS count
    FROM "GeneratedHook"
    WHERE "userId" = ${userId} AND "createdAt" >= ${start}
    GROUP BY DATE_TRUNC('day', "createdAt")
  `;
  const counts = new Map(rows.map((row) => [row.day, Number(row.count)]));
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + index);
    const key = date.toISOString().slice(0, 10);
    return { label: date.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2), count: counts.get(key) ?? 0 };
  });
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="h-7 w-56 rounded bg-zinc-800" />
          <div className="mt-2 h-4 w-72 max-w-full rounded bg-zinc-800" />
        </div>
        <div className="h-9 w-24 rounded-full bg-zinc-800" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-3">
          <div className="h-4 w-32 rounded bg-zinc-800" />
          <div className="h-56 rounded-xl bg-zinc-900" />
        </div>
        <div className="space-y-3 lg:col-span-2">
          <div className="h-4 w-40 rounded bg-zinc-800" />
          <div className="h-56 rounded-xl bg-zinc-900" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-28 rounded-xl bg-zinc-900" />
        ))}
      </div>
      <div className="h-56 rounded-xl bg-zinc-900" />
    </div>
  );
}

function computeStreak(days: { count: number }[]): number {
  let streak = 0;
  for (let index = days.length - 1; index >= 0; index--) {
    if (days[index].count > 0) streak++;
    else break;
  }
  return streak;
}