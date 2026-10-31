import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBusinessListings, getFreeListingStats } from "@/app/actions/marketplace";
import BusinessListingDialog from "@/components/BusinessListingDialog";
import ScarcityBanner from "@/components/ScarcityBanner";
import { getSafeExternalUrl } from "@/lib/marketplace-types";
import { getKeywords } from "@/optimizations/SEO/keywords";
import {
  marketplaceCategories,
  type MarketplaceCategorySlug,
} from "@/optimizations/SEO/marketplace-categories";

interface PageProps {
  params: Promise<{ category: string }>;
}

export const revalidate = 3600;

export function generateStaticParams() {
  return Object.keys(marketplaceCategories).map((category) => ({ category }));
}

function getCategory(category: string) {
  return marketplaceCategories[category as MarketplaceCategorySlug];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const keywordMatrix = getKeywords("marketplace").filter((keyword) =>
    category.keywordHints.some((hint) =>
      keyword.toLowerCase().includes(hint.toLowerCase()),
    ),
  );

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    keywords: [...category.primaryKeywords, ...category.longTailKeywords, ...keywordMatrix],
    alternates: {
      canonical: `https://www.hooktos.com/marketplace/${category.slug}`,
    },
    openGraph: {
      title: category.metaTitle,
      description: category.metaDescription,
      url: `https://www.hooktos.com/marketplace/${category.slug}`,
      type: "website",
    },
  };
}

export default async function MarketplaceCategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const [listings, freeListingStats] = await Promise.all([
    getCategoryBusinessListings(slug as MarketplaceCategorySlug),
    getFreeListingStats(),
  ]);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: category.faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-transparent text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-20 size-[30rem] rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute right-[-12rem] top-[48rem] size-[30rem] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-sm text-slate-400">
          <Link className="transition hover:text-purple-300" href="/">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link className="transition hover:text-purple-300" href="/marketplace">
            Marketplace
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-slate-200">
            {category.label}
          </span>
        </nav>

        <header className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/[0.08] px-3 py-1 text-xs font-semibold tracking-wide text-purple-200">
            {category.tagline}
          </span>
          <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
              {category.headline}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            {category.description}
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            Discover independent brands in a creator marketplace and business listing directory.
            Find free business listing sites and explore businesses built by creators and founders.
          </p>
        </header>

        <ScarcityBanner stats={freeListingStats} listings={listings} />

        <section aria-labelledby="category-listings-title" className="scroll-mt-24">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-300">
                {listings.length} featured {category.itemLabel}
              </p>
              <h2
                className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl"
                id="category-listings-title"
              >
                Explore {category.label} in a {category.focusKeyword}
              </h2>
            </div>
            <BusinessListingDialog freeSpotsRemaining={freeListingStats.remaining} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => {
              const websiteUrl = getSafeExternalUrl(listing.websiteUrl);
              const isExample = listing.id.startsWith("fallback-");

              return (
                <article
                  className="flex min-h-56 flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 transition hover:border-purple-500/50"
                  key={listing.id}
                >
                  <div className="flex items-start gap-3">
                    <div
                      aria-hidden="true"
                      className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/25 to-blue-500/20 text-lg font-bold text-purple-200"
                    >
                      {listing.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white">{listing.name}</h3>
                      <p className="mt-1 text-xs text-slate-400">
                        {listing.category} · {listing.tag}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-6 text-slate-300">
                    {listing.description ??
                      `Explore ${listing.name}, featured in the HookTos ${category.label.toLowerCase()} directory.`}
                  </p>
                  {isExample && (
                    <span className="mb-3 w-fit rounded-full border border-slate-700 px-2.5 py-1 text-[11px] text-slate-400">
                      Featured creator-business example
                    </span>
                  )}
                  {websiteUrl ? (
                    <a
                      className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 px-4 text-sm font-semibold text-white transition hover:border-purple-400/60 hover:bg-slate-800"
                      href={websiteUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Visit website <span aria-hidden="true" className="ml-2">↗</span>
                    </a>
                  ) : (
                    <Link
                      className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 px-4 text-sm font-semibold text-white transition hover:border-purple-400/60 hover:bg-slate-800"
                      href="/marketplace"
                    >
                      Explore marketplace
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section
          aria-labelledby="category-keywords-title"
          className="mt-16 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 sm:p-8"
        >
          <h2 className="text-xl font-bold text-white" id="category-keywords-title">
            Find {category.label} with HookTos
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
            Use this business listing directory to compare independent {category.label.toLowerCase()},
            discover creator-led companies, and find the right business to follow, partner with, or
            buy. Businesses can also claim one of the free business listing spots.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Popular searches">
            {category.primaryKeywords.map((keyword) => (
              <li
                className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-300"
                key={keyword}
              >
                {keyword}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="category-faq-title" className="mx-auto mt-16 max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-white" id="category-faq-title">
            {category.label} marketplace FAQ
          </h2>
          <div className="mt-5 space-y-3">
            {category.faqs.map(({ question, answer }) => (
              <details
                className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 open:border-purple-500/40"
                key={question}
              >
                <summary className="cursor-pointer list-none pr-6 font-semibold text-slate-100 marker:hidden">
                  {question}
                  <span
                    aria-hidden="true"
                    className="float-right text-purple-300 transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-300">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
