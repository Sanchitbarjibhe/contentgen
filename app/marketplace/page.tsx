import { ArrowDown, Sparkles } from "lucide-react";
import {
  getFreeListingStats,
  getActiveBusinessListings,
} from "@/app/actions/marketplace";
import BusinessListingDialog from "@/components/BusinessListingDialog";
import BusinessMarqueeRows from "@/components/BusinessMarqueeRows";
import ListingPaymentStatus from "@/components/ListingPaymentStatus";
import ScarcityBanner from "@/components/ScarcityBanner";
import { Metadata } from "next";
import Link from "next/link";
import { marketplaceCategories } from "@/optimizations/SEO/marketplace-categories";
import { buildMetadata } from "@/lib/seo/metadata";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: 'Creator Business Marketplace and Directory',
  description: 'Discover creator businesses, verified brands, and tools in the HookTos AI Marketplace. Browse categories, find resources, and list your business free.',
  path: '/marketplace',
});

export const revalidate = 300;

export default async function MarketplacePage() {
  const [businessListings, freeListingStats] = await Promise.all([
    getActiveBusinessListings(),
    getFreeListingStats(),
  ]);

  return (
    <main className="relative isolate overflow-hidden bg-transparent text-slate-100">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Marketplace", url: "/marketplace" },
        ])}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-48 left-1/3 size-[34rem] rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute right-[-15rem] top-[55rem] size-[32rem] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScarcityBanner stats={freeListingStats} listings={businessListings} />

        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-400">
          <Link className="hover:text-white" href="/">Home</Link>
          <span aria-hidden="true" className="px-2">/</span>
          <span aria-current="page" className="text-slate-200">Marketplace</span>
        </nav>

        <nav aria-label="Browse marketplace categories" className="mb-8 flex flex-wrap justify-center gap-2">
          {Object.values(marketplaceCategories).map((category) => (
            <Link
              className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-purple-400/60 hover:text-white sm:text-sm"
              href={`/marketplace/${category.slug}`}
              key={category.slug}
            >
              {category.label}
            </Link>
          ))}
        </nav>

        <div aria-hidden="true" className="border-t border-slate-800/70" />

        <section
          aria-labelledby="business-directory-title"
          className="flex min-h-[calc(100svh-73px)] flex-col justify-center py-14 sm:py-20"
          id="business-directory"
        >
          <ListingPaymentStatus />
          <div className="mx-auto w-full max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.08] px-3 py-1 text-xs font-semibold tracking-wide text-blue-200">
                <Sparkles aria-hidden="true" className="size-3.5" />
                MEET YOUR NEIGHBORS
              </span>
              <h1
                className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl"
                id="business-directory-title"
              >
                Discover creator businesses and tools.{" "}
                <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                  Find your next favorite.
                </span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
                Explore independent businesses from the HookTos community.
                Your next favorite might be just around the corner.
              </p>
            </div>

            <div className="mt-8 space-y-1 sm:mt-10">
              <BusinessMarqueeRows listings={businessListings} />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
              <BusinessListingDialog
                freeSpotsRemaining={freeListingStats?.remaining}
              />
              <Link
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                href="/blog"
              >
                Read creator growth guides
                <ArrowDown aria-hidden="true" className="size-4 -rotate-90" />
              </Link>
            </div>
          </div>
        </section>

        <nav
          aria-label="Related creator tools"
          className="mb-12 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-slate-800/70 py-8 text-sm"
        >
          <Link className="text-blue-300 hover:text-blue-200" href="/hooks">
            Explore AI hook frameworks
          </Link>
          <Link className="text-blue-300 hover:text-blue-200" href="/dashboard">
            Open the AI content dashboard
          </Link>
        </nav>
      </div>
    </main>
  );
}
