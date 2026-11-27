import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Building2,
  Sparkles,
  Users,
} from "lucide-react";
import AdminDashboardClient from "@/app/admin/AdminDashboardClient";
import IncidentLog from "@/app/admin/IncidentLog";
import type { AdminIncidentRecord } from "@/lib/admin-incidents";
import { prisma } from "@/lib/prisma";
import { hasAdminAllowlist, isAdminEmail } from "@/lib/admin-access";
import { SITE } from "@/lib/seo/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

const FREE_LISTING_CAPACITY = 100;
const DAY_MS = 24 * 60 * 60 * 1000;

type IncidentQueryRow = Omit<AdminIncidentRecord, "createdAt" | "resolvedAt"> & {
  createdAt: Date;
  resolvedAt: Date | null;
};

async function optionalQuery<T>(
  label: string,
  query: () => Promise<T>,
): Promise<T | null> {
  try {
    return await query();
  } catch (error) {
    console.error(`[admin] ${label} query unavailable:`, error);
    return null;
  }
}

function formatMetric(value: number | null) {
  return value === null ? "—" : value.toLocaleString();
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Activity;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-xl shadow-black/10">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
        <Icon aria-hidden="true" className="size-4 text-indigo-300" />
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Status({
  children,
  ready,
}: {
  children: React.ReactNode;
  ready: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${
        ready
          ? "bg-emerald-400/10 text-emerald-200"
          : "bg-amber-400/10 text-amber-200"
      }`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${ready ? "bg-emerald-300" : "bg-amber-300"}`}
      />
      {children}
    </span>
  );
}

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=%2Fadmin");
  if (!isAdminEmail(user.primaryEmailAddress?.emailAddress)) {
    return <AdminAccessNotice isConfigured={hasAdminAllowlist()} />;
  }

  const now = new Date();
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(now.getTime() - 7 * DAY_MS);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * DAY_MS);
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - DAY_MS);

  const [
    activeUsers15m,
    activeUsers1h,
    activeUsers24h,
    databaseProbe,
    incidentRows,
    totalUsers,
    newUsers7d,
    newUsers30d,
    paidSubscriptions,
    recentUsers,
    totalHooks,
    hooksToday,
    hooks7d,
    legacyPremiumUsers,
    usageUserCount,
    totalListings,
    approvedListings,
    pendingListings,
    paidListings,
    recentListings,
    liveAds,
    adViews,
    adClicks,
    waitlistCount,
    recentWaitlist,
  ] = await Promise.all([
    getActiveUsersSince(fifteenMinutesAgo, "active users (15m)"),
    getActiveUsersSince(oneHourAgo, "active users (1h)"),
    getActiveUsersSince(oneDayAgo, "active users (24h)"),
    optionalQuery("database connectivity", async () => {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    }),
    optionalQuery("admin incident log", () =>
      prisma.$queryRaw<IncidentQueryRow[]>`
        SELECT "id", "title", "details", "status", "createdAt", "resolvedAt"
        FROM "AdminIncident"
        ORDER BY "createdAt" DESC
        LIMIT 50
      `,
    ),
    optionalQuery("total users", () => prisma.user.count()),
    optionalQuery("new users (7d)", () =>
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ),
    optionalQuery("new users (30d)", () =>
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    ),
    optionalQuery("paid subscriptions", () =>
      prisma.subscription.count({
        where: {
          plan: { in: ["PRO", "AGENCY"] },
          status: { in: ["ACTIVE", "TRIALING"] },
        },
      }),
    ),
    optionalQuery("recent users", () =>
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          subscription: { select: { plan: true } },
          _count: { select: { generations: true } },
        },
      }),
    ),
    optionalQuery("total hook generations", () => prisma.generatedHook.count()),
    optionalQuery("today's hook generations", () =>
      prisma.generatedHook.count({ where: { createdAt: { gte: today } } }),
    ),
    optionalQuery("weekly hook generations", () =>
      prisma.generatedHook.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ),
    optionalQuery("premium usage records", () =>
      prisma.userUsage.count({ where: { isPremium: true } }),
    ),
    optionalQuery("usage accounts", () => prisma.userUsage.count()),
    optionalQuery("marketplace listings", () => prisma.businessListing.count()),
    optionalQuery("approved listings", () =>
      prisma.businessListing.count({ where: { isApproved: true } }),
    ),
    optionalQuery("pending listings", () =>
      prisma.businessListing.count({ where: { isApproved: false } }),
    ),
    optionalQuery("paid listings", () =>
      prisma.businessListing.count({ where: { isPaid: true } }),
    ),
    optionalQuery("recent listings", () =>
      prisma.businessListing.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          tag: true,
          websiteUrl: true,
          isApproved: true,
          isPaid: true,
          createdAt: true,
        },
      }),
    ),
    optionalQuery("live billboard slots", () =>
      prisma.adSlot.count({
        where: {
          isLive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        },
      }),
    ),
    optionalQuery("billboard views", () =>
      prisma.adSlot.aggregate({
        where: { isLive: true },
        _sum: { views: true },
      }),
    ),
    optionalQuery("billboard clicks", () =>
      prisma.adSlot.aggregate({
        where: { isLive: true },
        _sum: { clicks: true },
      }),
    ),
    optionalQuery("waitlist count", () => prisma.waitlistEntry.count()),
    optionalQuery("recent waitlist entries", () =>
      prisma.waitlistEntry.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          email: true,
          feedback: true,
          source: true,
          createdAt: true,
        },
      }),
    ),
  ]);

  const incidentRecords =
    incidentRows?.map((incident): AdminIncidentRecord => ({
      ...incident,
      createdAt: incident.createdAt.toISOString(),
      resolvedAt: incident.resolvedAt?.toISOString() ?? null,
    })) ?? null;
  const coreMetricsUnavailable = [
    totalUsers,
    totalHooks,
    approvedListings,
    waitlistCount,
  ].some((value) => value === null);
  const databaseStatus =
    databaseProbe === null
      ? "Unreachable"
      : coreMetricsUnavailable || incidentRows === null
        ? "Degraded"
        : "Connected";

  const freeListings =
    totalListings === null || paidListings === null
      ? null
      : Math.max(totalListings - paidListings, 0);
  const freeSpotsRemaining =
    approvedListings === null
      ? null
      : Math.max(FREE_LISTING_CAPACITY - approvedListings, 0);
  const totalHookCount = totalHooks;
  const averageHooksPerUser =
    totalHookCount === null
      ? null
      : usageUserCount && usageUserCount > 0
        ? totalHookCount / usageUserCount
        : totalUsers && totalUsers > 0
          ? totalHookCount / totalUsers
          : totalHookCount === 0
            ? 0
            : null;

  const userRows =
    recentUsers?.map((account) => ({
      id: account.id,
      email: account.email,
      name: account.name,
      createdAt: account.createdAt.toISOString(),
      plan: account.subscription?.plan ?? "FREE",
      generationCount: account._count.generations,
    })) ?? null;
  const listingRows =
    recentListings?.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    })) ?? null;
  const waitlistRows =
    recentWaitlist?.map((entry) => ({
      ...entry,
      createdAt: entry.createdAt.toISOString(),
    })) ?? null;

  const gaMeasurementConfigured = Boolean(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim(),
  );
  const gaReportingConfigured = Boolean(
    process.env.GA4_PROPERTY_ID?.trim() &&
      process.env.GA4_CLIENT_EMAIL?.trim() &&
      process.env.GA4_PRIVATE_KEY?.trim(),
  );
  const searchConsoleConfigured = Boolean(
    process.env.GSC_SITE_URL?.trim() &&
      process.env.GSC_CLIENT_EMAIL?.trim() &&
      process.env.GSC_PRIVATE_KEY?.trim(),
  );
  const canonicalHealthy = /^https:\/\/[^/]+$/i.test(SITE.url);

  return (
    <main className="min-h-screen bg-[#0d1021] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-52 left-1/3 size-[36rem] rounded-full bg-indigo-600/10 blur-[150px]" />
        <div className="absolute right-[-12rem] top-[35rem] size-[30rem] rounded-full bg-blue-600/[0.07] blur-[140px]" />
      </div>
      <div className="relative mx-auto max-w-7xl space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
              HookTos AI · Operations
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Admin dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Funnel health, growth, and marketplace activity at a glance.
            </p>
          </div>
          <p className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400">
            Signed in as {user.primaryEmailAddress?.emailAddress}
          </p>
        </header>

        <section aria-label="Key performance indicators" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            icon={Users}
            label="SaaS accounts"
            value={formatMetric(totalUsers)}
            detail={`${formatMetric(newUsers7d)} new / 7d · ${formatMetric(newUsers30d)} / 30d`}
            footnote={`Paid subscriptions: ${formatMetric(paidSubscriptions)}${legacyPremiumUsers === null ? "" : ` · Premium usage: ${legacyPremiumUsers.toLocaleString()}`}`}
          />
          <KpiCard
            icon={Sparkles}
            label="Hook generations"
            value={formatMetric(totalHooks)}
            detail={`${formatMetric(hooksToday)} today · ${formatMetric(hooks7d)} last 7 days`}
            footnote={`Average ${averageHooksPerUser === null ? "—" : averageHooksPerUser.toFixed(1)} per usage account`}
          />
          <KpiCard
            icon={Building2}
            label="Marketplace listings"
            value={formatMetric(approvedListings)}
            detail={`${formatMetric(pendingListings)} pending · ${formatMetric(paidListings)} paid · ${formatMetric(freeListings)} free`}
            footnote={`${formatMetric(freeSpotsRemaining)} free spots remaining of ${FREE_LISTING_CAPACITY}`}
          />
          <KpiCard
            icon={Activity}
            label="Early access"
            value={formatMetric(waitlistCount)}
            detail="Waitlist signups"
            footnote={
              recentWaitlist === null
                ? "Recent submissions unavailable"
                : `${recentWaitlist.length.toLocaleString()} recent submissions loaded`
            }
          />
        </section>

        <section aria-label="Traffic and SEO monitoring" className="grid gap-4 lg:grid-cols-2">
          <Panel icon={BarChart3} title="Traffic &amp; SEO">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Status ready={gaMeasurementConfigured}>
                  {gaMeasurementConfigured ? "GA4 collection configured" : "GA4 measurement ID missing"}
                </Status>
                <Status ready={gaReportingConfigured}>
                  {gaReportingConfigured
                    ? "GA4 credentials found · integration pending"
                    : "GA4 reporting not configured"}
                </Status>
                <Status ready={searchConsoleConfigured}>
                  {searchConsoleConfigured
                    ? "Search Console credentials found · integration pending"
                    : "Search Console not configured"}
                </Status>
              </div>
              <p className="text-sm leading-6 text-slate-400">
                Route-level traffic, search queries, and 404 counts are not stored in the app database.
                External reporting APIs are not wired yet; these badges only reflect environment setup.
              </p>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <HealthRow label="Sitemap" value="Dynamic sitemap available" ready />
                <HealthRow label="Robots" value="robots.txt available" ready />
                <HealthRow
                  label="Canonical host"
                  value={SITE.url}
                  ready={canonicalHealthy}
                />
                <HealthRow label="404 alerts" value="Not tracked yet" ready={false} />
              </div>
              <div className="border-t border-white/[0.07] pt-3">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Priority routes
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {[
                    ["/", "Home"],
                    ["/hooks", "Hooks"],
                    ["/marketplace", "Marketplace"],
                    ["/blog", "Blog"],
                    ["/tools", "Tools"],
                  ].map(([href, label]) => (
                    <a
                      className="inline-flex items-center gap-1 text-sm text-indigo-300 hover:text-indigo-200"
                      href={href}
                      key={href}
                    >
                      {label}
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </a>
                  ))}
                </div>
              </div>
              <p className="text-xs leading-5 text-slate-500">
                Setup: GA4 reporting uses GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, and GA4_PRIVATE_KEY.
                Search Console uses GSC_SITE_URL, GSC_CLIENT_EMAIL, and GSC_PRIVATE_KEY.
              </p>
            </div>
          </Panel>

          <Panel icon={Activity} title="Marketplace billboard">
            <div className="grid grid-cols-3 gap-3">
              <MiniMetric label="Live slots" value={liveAds} />
              <MiniMetric label="Views" value={adViews?._sum.views ?? null} />
              <MiniMetric label="Clicks" value={adClicks?._sum.clicks ?? null} />
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Totals reflect live ad slots. Expired slots are excluded from the live count.
              Missing or unavailable tables are shown as dashes.
            </p>
          </Panel>
        </section>

        <section
          aria-label="Active users and system health"
          className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]"
        >
          <Panel icon={Users} title="Active users">
            <div className="grid grid-cols-3 gap-3">
              <MiniMetric label="Last 15m" value={activeUsers15m} />
              <MiniMetric label="Last 1h" value={activeUsers1h} />
              <MiniMetric label="Last 24h" value={activeUsers24h} />
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Distinct user IDs with a saved hook generation in each time window.
              A dash means activity data could not be queried.
            </p>
          </Panel>

          <Panel icon={Activity} title="Site &amp; system health">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.07] bg-slate-950/35 p-4">
                <p className="text-xs text-slate-500">Database connectivity</p>
                <HealthBadge status={databaseStatus} />
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Checked with a live database query during this page load.
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-slate-950/35 p-4">
                <p className="text-xs text-slate-500">Recent server / API errors</p>
                <Status ready={false}>Not persisted in app</Status>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Review deployment logs for recent 4xx/5xx errors; this app has no durable request-error log.
                </p>
              </div>
            </div>
            <nav aria-label="Site health checks" className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {[
                ["/api/health", "Health endpoint"],
                ["/", "Home"],
                ["/hooks", "Hooks"],
                ["/marketplace", "Marketplace"],
                ["/blog", "Blog"],
              ].map(([href, label]) => (
                <Link
                  className="inline-flex items-center gap-1 text-sm text-indigo-300 hover:text-indigo-200"
                  href={href}
                  key={href}
                >
                  {label}
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </Link>
              ))}
            </nav>
          </Panel>
        </section>

        <IncidentLog incidents={incidentRecords} />

        <AdminDashboardClient
          recentUsers={userRows}
          listings={listingRows}
          waitlistEntries={waitlistRows}
        />
      </div>
    </main>
  );
}

async function getActiveUsersSince(since: Date, label: string) {
  return optionalQuery(label, async () => {
    const activeUsers = await prisma.generatedHook.findMany({
      where: { createdAt: { gte: since } },
      distinct: ["userId"],
      select: { userId: true },
    });
    return activeUsers.length;
  });
}

function AdminAccessNotice({ isConfigured }: { isConfigured: boolean }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0d1021] px-4 py-12 text-slate-100">
      <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
          HookTos AI · Admin
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-white">
          {isConfigured ? "Admin access denied" : "Admin access not configured"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {isConfigured
            ? "This Clerk account is not on the admin allowlist."
            : "No admin email has been configured yet. Add your Clerk primary email to the server-side allowlist to enable the dashboard."}
        </p>
        <p className="mt-4 rounded-lg border border-indigo-300/10 bg-indigo-400/[0.07] px-3 py-2 font-mono text-xs text-indigo-100">
          ADMIN_EMAILS=your-clerk-primary-email@example.com
        </p>
        <p className="mt-3 text-xs leading-5 text-slate-400">
          Add this to the project&apos;s .env file, then restart the dev server.
          Separate multiple admin emails with commas.
        </p>
        <Link
          className="mt-6 inline-flex rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-indigo-300/30 hover:text-white"
          href="/"
        >
          Return to HookTos AI
        </Link>
      </section>
    </main>
  );
}

function HealthBadge({
  status,
}: {
  status: "Connected" | "Degraded" | "Unreachable";
}) {
  const tone =
    status === "Connected"
      ? "bg-emerald-400/10 text-emerald-200"
      : status === "Degraded"
        ? "bg-amber-400/10 text-amber-200"
        : "bg-rose-400/10 text-rose-200";

  return (
    <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs ${tone}`}>
      {status}
    </span>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  detail,
  footnote,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  detail: string;
  footnote: string;
}) {
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-xl shadow-black/10 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{label}</p>
        <Icon aria-hidden="true" className="size-4 text-indigo-300" />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-300">{detail}</p>
      <p className="mt-1 text-xs text-slate-500">{footnote}</p>
    </article>
  );
}

function HealthRow({
  label,
  value,
  ready,
}: {
  label: string;
  value: string;
  ready: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-slate-950/30 px-3 py-2">
      <span className="text-slate-400">{label}</span>
      <span className={ready ? "text-emerald-200" : "text-amber-200"}>
        {value}
      </span>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-slate-950/35 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{formatMetric(value)}</p>
    </div>
  );
}
