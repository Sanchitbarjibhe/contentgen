import React from 'react';

export const metadata = {
    title: "What's New — HookTos AI",
    description: 'Stay updated with the latest features, improvements, and releases for HookTos AI and HookCraft.',
};

interface ReleaseUpdate {
    version: string;
    date: string;
    badge?: string;
    title: string;
    description: string;
    changes: {
        category: 'New Feature' | 'Improvement' | 'Bug Fix';
        items: string[];
    }[];
}

const releases: ReleaseUpdate[] = [
    {
        version: 'v1.2.0',
        date: 'September 2026',
        badge: 'Latest Release',
        title: 'MDX Blog Engine & Dynamic SEO Sitemap Engine',
        description:
            'We have completely upgraded our SEO infrastructure and content publishing system to deliver lightning-fast loading speeds and improved search rankings.',
        changes: [
            {
                category: 'New Feature',
                items: [
                    'Added native MDX support for high-converting blog posts.',
                    'Introduced automated dynamic sitemap generation for indexation.',
                ],
            },
            {
                category: 'Improvement',
                items: [
                    'Optimized Open Graph social sharing cards for X (Twitter) and LinkedIn.',
                    'Improved site-wide metadata structure for faster Google indexing.',
                ],
            },
        ],
    },
    {
        version: 'v1.1.0',
        date: 'August 2026',
        title: 'HookCraft AI Engine Upgrade & Analytics Preview',
        description:
            'Engineered a faster AI inference workflow for generating platform-specific viral hooks in under 3 seconds.',
        changes: [
            {
                category: 'New Feature',
                items: [
                    'Added specialized prompt templates for Instagram Reels, Shorts, and TikTok.',
                    'Integrated custom domain email handling for seamless user support.',
                ],
            },
            {
                category: 'Bug Fix',
                items: [
                    'Resolved layout shifting issues on mobile viewports.',
                    'Fixed metadata image loading on initial page render.',
                ],
            },
        ],
    },
    {
        version: 'v1.0.0',
        date: 'July 2026',
        title: 'Official Launch of HookTos AI',
        description:
            'The initial public release of HookTos AI under the HookCraft brand architecture, designed to help creators beat the algorithm.',
        changes: [
            {
                category: 'New Feature',
                items: [
                    'Core AI Hook Generator for short-form video creators.',
                    'Dark-themed UI built with Next.js App Router and Tailwind CSS.',
                ],
            },
        ],
    },
];

export default function WhatsNewPage() {
    return (
        <div className="bg-slate-950 text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center space-y-4">
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Changelog & Product Updates
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    What&apos;s New in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">HookTos AI</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Explore our latest feature releases, performance upgrades, and continuous product improvements.
                </p>
            </div>

            {/* Timeline Section */}
            <div className="max-w-4xl mx-auto mt-16 space-y-12">
                {releases.map((release, index) => (
                    <div
                        key={release.version}
                        className="relative pl-6 sm:pl-8 border-l border-slate-800 space-y-4"
                    >
                        {/* Timeline Indicator Dot */}
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-slate-950" />

                        {/* Version & Date */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-mono font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20">
                                {release.version}
                            </span>
                            <span className="text-sm text-slate-500">{release.date}</span>
                            {release.badge && (
                                <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                                    {release.badge}
                                </span>
                            )}
                        </div>

                        {/* Content Card */}
                        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-100">{release.title}</h2>
                                <p className="text-slate-400 text-sm mt-2 leading-relaxed">{release.description}</p>
                            </div>

                            {/* Changes List */}
                            <div className="space-y-4 pt-2 border-t border-slate-800/60">
                                {release.changes.map((group, gIdx) => (
                                    <div key={gIdx} className="space-y-2">
                                        <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                                            {group.category}
                                        </span>
                                        <ul className="space-y-1.5 text-sm text-slate-300">
                                            {group.items.map((item, iIdx) => (
                                                <li key={iIdx} className="flex items-start gap-2">
                                                    <span className="text-blue-400 select-none">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer CTA */}
            <div className="max-w-4xl mx-auto mt-20 text-center p-8 rounded-2xl bg-slate-900/30 border border-slate-800">
                <h3 className="text-xl font-bold text-slate-200">Have a feature request?</h3>
                <p className="text-slate-400 text-sm mt-1">
                    We build based on creator feedback. Send us your ideas anytime.
                </p>
                <a
                    href="mailto:contact@hooktos.com"
                    className="inline-block mt-4 text-sm font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-4"
                >
                    Contact Development Team
                </a>
            </div>
        </div>
    );
}