import { Flame, History, Sparkles, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { FREE_CREDITS, getAnonId, getOrCreateUsage, usageSnapshot } from "@/lib/anonymous";
import { retentionTier } from "@/lib/utils";
import { StatCard } from "@/components/StatCard";
import { UsageChart } from "@/components/UsageChart";
import { DashboardWorkspace } from "@/components/DashboardWorkspace";
import type { RecentGeneration } from "@/components/RecentGenerations";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const userId = await getAnonId();
    const usageRecord = await getOrCreateUsage(userId);
    const usage = usageSnapshot(usageRecord.freeCreditsLeft, usageRecord.isPremium);
    const [recentGenerations, totalGenerations, last7DaysUsage] = await Promise.all([
        prisma.generatedHook.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
        prisma.generatedHook.count({ where: { userId } }),
        getLast7DaysUsage(userId),
    ]);

    const avgRetention = recentGenerations.length
        ? Math.round(recentGenerations.reduce((sum, generation) => sum + generation.avgRetentionScore, 0) / recentGenerations.length)
        : 0;

    return (
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-100">Welcome to HookCraft AI</h1>
                    <p className="mt-1 text-sm text-zinc-500">Your private dashboard is ready. No account required.</p>
                </div>
                <Badge tone={usageRecord.isPremium ? "indigo" : "neutral"} className="px-3 py-1.5 text-sm">
                    {usageRecord.isPremium ? "Premium" : "Free plan"}
                </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Free generations left" value={usage.remaining === null ? "Unlimited" : `${usage.remaining} / ${FREE_CREDITS}`} icon={Sparkles} accent />
                <StatCard label="Total generations" value={totalGenerations.toString()} icon={History} />
                <StatCard label="Avg. retention score" value={recentGenerations.length ? `${avgRetention}%` : "—"} icon={TrendingUp} hint={recentGenerations.length ? retentionTier(avgRetention).label : "No data yet"} />
                <StatCard label="Current streak" value={`${computeStreak(last7DaysUsage)} day${computeStreak(last7DaysUsage) === 1 ? "" : "s"}`} icon={Flame} />
            </div>

            <UsageChart data={last7DaysUsage} />

            <DashboardWorkspace
                initialUsage={usage}
                initialRecent={recentGenerations.map((generation): RecentGeneration => ({
                    id: generation.id,
                    topic: generation.topic,
                    niche: generation.niche,
                    platform: generation.platform,
                    avgRetentionScore: generation.avgRetentionScore,
                    createdAt: generation.createdAt.toISOString(),
                }))}
            />
        </div>
    );
}

async function getLast7DaysUsage(userId: string) {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    start.setUTCDate(start.getUTCDate() - 6);
    const rows = await prisma.generatedHook.findMany({ where: { userId, createdAt: { gte: start } }, select: { createdAt: true } });
    const counts = new Map<string, number>();
    for (const row of rows) {
        const key = row.createdAt.toISOString().slice(0, 10);
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(start);
        date.setUTCDate(date.getUTCDate() + index);
        const key = date.toISOString().slice(0, 10);
        return { label: date.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2), count: counts.get(key) ?? 0 };
    });
}

function computeStreak(days: { count: number }[]): number {
    let streak = 0;
    for (let index = days.length - 1; index >= 0; index--) {
        if (days[index].count > 0) streak++;
        else break;
    }
    return streak;
}
