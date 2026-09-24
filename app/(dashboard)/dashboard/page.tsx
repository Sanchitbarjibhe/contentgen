// app/(dashboard)/dashboard/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Flame, History, Sparkles, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser, getUsageSnapshot, effectivePlan } from "@/lib/subscription";
import { PLAN_LIMITS } from "@/lib/types";
import { formatNiche, formatPlatform, retentionTier, startOfUtcDay } from "@/lib/utils";
import { StatCard } from "@/components/StatCard";
import { UsageChart } from "@/components/UsageChart";
import { DashboardGenerator } from "@/components/DashboardGenerator";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? `${clerkId}@unknown.hookcraft.ai`;

  const user = await getOrCreateUser(clerkId, email);
  const plan = effectivePlan(user.subscription!.plan, user.subscription!.status);
  const planConfig = PLAN_LIMITS[plan];

  const [usage, recentGenerations, totalGenerations, last7DaysUsage] = await Promise.all([
    getUsageSnapshot(user.id, plan),
    prisma.generation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.generation.count({ where: { userId: user.id } }),
    getLast7DaysUsage(user.id),
  ]);

  const avgRetention =
    recentGenerations.length > 0
      ? Math.round(
          recentGenerations.reduce((sum, g) => sum + g.avgRetentionScore, 0) / recentGenerations.length
        )
      : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">
            Welcome back{clerkUser?.firstName ? `, ${clerkUser.firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Here&apos;s how your hooks are performing.</p>
        </div>
        <Badge tone="indigo" className="px-3 py-1.5 text-sm">
          {planConfig.label} plan
        </Badge>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Credits left today"
          value={usage.limit === null ? "Unlimited" : `${usage.remaining} / ${usage.limit}`}
          icon={Sparkles}
          accent
        />
        <StatCard label="Total generations" value={totalGenerations.toString()} icon={History} />
        <StatCard
          label="Avg. retention score"
          value={recentGenerations.length > 0 ? `${avgRetention}%` : "—"}
          icon={TrendingUp}
          hint={recentGenerations.length > 0 ? retentionTier(avgRetention).label : "No data yet"}
        />
        <StatCard
          label="Current streak"
          value={`${computeStreak(last7DaysUsage)} day${computeStreak(last7DaysUsage) === 1 ? "" : "s"}`}
          icon={Flame}
        />
      </div>

      <UsageChart data={last7DaysUsage} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Quick generator */}
        <div className="lg:col-span-3">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Quick generate
          </h2>
          <DashboardGenerator initialUsage={usage} />
        </div>

        {/* Recent generations */}
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Recent generations
          </h2>
          <Card>
            <CardBody className="divide-y divide-white/[0.06] p-0">
              {recentGenerations.length === 0 ? (
                <p className="p-6 text-center text-sm text-zinc-600">
                  Nothing yet — generate your first set of hooks to see it here.
                </p>
              ) : (
                recentGenerations.map((g) => {
                  const tier = retentionTier(g.avgRetentionScore);
                  return (
                    <div key={g.id} className="p-4">
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-zinc-500">
                          {formatNiche(g.niche)} · {formatPlatform(g.platform)}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${tier.className}`}
                        >
                          {g.avgRetentionScore}% avg
                        </span>
                      </div>
                      <p className="line-clamp-2 text-sm text-zinc-300">{g.topic}</p>
                      <p className="mt-1 text-xs text-zinc-600">
                        {new Date(g.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  );
                })
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

async function getLast7DaysUsage(userId: string) {
  const today = startOfUtcDay();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);

  const rows = await prisma.dailyUsage.findMany({
    where: { userId, date: { gte: sevenDaysAgo } },
  });

  const byDate = new Map(rows.map((r) => [r.date.toISOString().slice(0, 10), r.count]));

  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(sevenDaysAgo);
    d.setUTCDate(d.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    return {
      label: d.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2),
      count: byDate.get(key) ?? 0,
    };
  });
}

function computeStreak(days: { count: number }[]): number {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) streak++;
    else break;
  }
  return streak;
}
