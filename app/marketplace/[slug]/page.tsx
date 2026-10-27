// app/directory/[slug]/page.tsx
import type { Metadata } from 'next';
import { businessNiches, getBusinessNiche } from '@/optimizations/SEO/business-niche-data';
import Link from 'next/link';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// 1. Static Params for Programmatic SEO Generation
export async function generateStaticParams() {
    return Object.keys(businessNiches).map((slug) => ({
        slug,
    }));
}

// 2. Dynamic Metadata for each Niche Directory Page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const niche = getBusinessNiche(slug);

    return {
        title: `${niche.heroTitle} | HookTos AI Marketplace`,
        description: niche.description,
        keywords: niche.keywords,
        alternates: {
            canonical: `https://www.hooktos.com/marketplace/${niche.slug}`,
        },
        openGraph: {
            title: `${niche.heroTitle} | HookTos AI`,
            description: niche.description,
            url: `https://www.hooktos.com/marketplace/${niche.slug}`,
            type: 'website',
        },
    };
}

// 3. Component
export default async function NicheDirectoryPage({ params }: PageProps) {
    const { slug } = await params;
    const niche = getBusinessNiche(slug);

    return (
        <main className="mx-auto min-h-screen max-w-6xl px-5 py-10 text-slate-100 sm:px-6 sm:py-11">
            <div className="mx-auto max-w-[1048px]">
                <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium sm:text-sm">
                    <Link className="text-purple-400 transition hover:text-purple-300" href="/">
                        Home
                    </Link>
                    <span aria-hidden="true" className="text-slate-600">/</span>
                    <Link className="text-purple-400 transition hover:text-purple-300" href="/marketplace">
                        Marketplace
                    </Link>
                    <span aria-hidden="true" className="text-slate-600">/</span>
                    <span aria-current="page" className="text-slate-300">{niche.nicheName}</span>
                </nav>

                <section className="mb-10">
                    <h1 className="mb-2 text-balance text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-[50px]">
                        <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
                            {niche.heroTitle}
                        </span>
                    </h1>
                    <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                        {niche.description}
                    </p>
                </section>

                <div className="mb-6 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-purple-700/50 bg-purple-900/40 px-3 py-1.5 text-xs font-medium text-purple-300">
                        {niche.tagline}
                    </span>
                    <span className="text-xs text-slate-400">Verified Community Businesses</span>
                </div>

                <section
                    aria-label={`${niche.nicheName} businesses`}
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
                >
                    <article className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 transition-colors hover:border-purple-500/50">
                        <div className="mb-4 flex items-center gap-3.5">
                            <div
                                aria-hidden="true"
                                className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 text-lg font-bold text-purple-400"
                            >
                                {niche.nicheName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-bold leading-6 text-white">
                                    Sample {niche.nicheName} Startup
                                </h2>
                                <span className="text-[11px] text-slate-400">{niche.tagline}</span>
                            </div>
                        </div>
                        <p className="mb-4 text-xs leading-relaxed text-slate-300">
                            This is a verified creator business featured under the {niche.nicheName} directory.
                        </p>
                        <button
                            className="min-h-8 w-full rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                            type="button"
                        >
                            View Details <span aria-hidden="true">🚀</span>
                        </button>
                    </article>
                </section>
            </div>
        </main>
    );
}