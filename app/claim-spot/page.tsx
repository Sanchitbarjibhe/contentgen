import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, ExternalLink, Sparkles } from "lucide-react";
import BusinessListingDialog from "@/components/BusinessListingDialog";
import {
  getActiveBusinessListings,
  getFreeListingStats,
} from "@/app/actions/marketplace";
import ScarcityBanner from "@/components/ScarcityBanner";

export const metadata: Metadata = {
  title: "Claim Your Marketplace Listing",
  description:
    "Claim a free HookTos Marketplace listing while creator spots remain, or reserve a featured placement.",
  alternates: { canonical: "https://www.hooktos.com/claim-spot" },
};

export const dynamic = "force-dynamic";

export default async function ClaimSpotPage() {
  const [listings, freeListingStats] = await Promise.all([
    getActiveBusinessListings(),
    getFreeListingStats(),
  ]);
  const onboardedBusinesses = listings.filter(
    (listing) => !listing.id.startsWith("fallback-"),
  );
  const creatorNames = onboardedBusinesses
    .slice(0, 5)
    .map((listing) => listing.name);

  return (
    <main className="relative isolate min-h-[calc(100svh-73px)] overflow-hidden bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-36 top-0 size-[32rem] rounded-full bg-purple-600/20 blur-[150px]" />
        <div className="absolute -right-32 top-48 size-[30rem] rounded-full bg-blue-600/15 blur-[150px]" />
      </div>

      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-700/70 bg-slate-900/55 p-6 shadow-2xl shadow-purple-950/20 backdrop-blur-2xl sm:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-purple-400/[0.08] px-3 py-1.5 text-xs font-bold tracking-wide text-purple-200">
            <Sparkles aria-hidden="true" className="size-3.5" />
            HOOKTOS CREATOR MARKETPLACE
          </span>
          <h1 className="mt-6 text-balance text-4xl font-black tracking-tight text-white sm:text-6xl">
            Get discovered by{" "}
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
              the right audience.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Put your business in front of creators and curious customers with a
            permanent directory listing and a direct link to your website.
          </p>

          <ScarcityBanner stats={freeListingStats} listings={listings} />
          <div className="mx-auto max-w-2xl rounded-2xl border border-orange-400/25 bg-orange-400/[0.08] px-5 py-4">
            <p className="mt-1 text-xs text-orange-100/70">
              After the free spots fill, featured listings are $29 USD or ₹2,000 INR.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <BusinessListingDialog
              freeSpotsRemaining={freeListingStats?.remaining}
            />
          </div>

          <div className="mt-12 grid gap-3 text-left sm:grid-cols-3">
            {[
              {
                title: "Permanent website backlink",
                description: "Give directory visitors a direct path to your business.",
              },
              {
                title: "Daily organic discovery",
                description: "Give visitors another way to discover your business as they explore the marketplace.",
              },
              {
                title: "Creator community trust",
                description: "Join the businesses already listed in the marketplace.",
              },
            ].map((benefit) => (
              <article
                className="rounded-2xl border border-slate-800 bg-slate-950/55 p-5"
                key={benefit.title}
              >
                <BadgeCheck aria-hidden="true" className="size-5 text-emerald-300" />
                <h2 className="mt-3 text-sm font-bold text-white">{benefit.title}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-400">{benefit.description}</p>
              </article>
            ))}
          </div>

          {onboardedBusinesses.length > 0 && (
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/40 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {onboardedBusinesses.length} businesses in the directory
              </p>
              <p className="mt-2 text-sm text-slate-200">
                {creatorNames.join(" · ")}
                {onboardedBusinesses.length > creatorNames.length ? " · and more" : ""}
              </p>
            </div>
          )}

          <a
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
            href="/marketplace"
          >
            Explore the marketplace
            <ArrowRight aria-hidden="true" className="size-4" />
            <ExternalLink aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </section>
    </main>
  );
}
