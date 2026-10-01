import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Blog — HookTos AI',
    description: 'Latest strategies, guides, and tips for creating viral short-form content with AI.',
};

// Blog Posts Data
const blogPosts = [
    {
        slug: '10-viral-hooks-for-reels',
        title: '10 Viral Hooks to Skyrocket Your Instagram Reels in 2026',
        description:
            'Discover the top 10 AI-proven hooks that grab attention in the first 3 seconds and massively increase your engagement and views.',
        date: '2026-09-25',
        readTime: '4 min read',
        category: 'Instagram Strategy',
    },
    {
        slug: 'monetize_a_small_audience',
        title: 'The Solopreneur Playbook: How to Monetize Your Audience in 2026',
        description:
            'Learn how full-time creators and solopreneurs build 6-figure businesses using digital products, brand sponsorships, and paid communities.',
        date: '2026-09-26',
        readTime: '6 min read',
        category: 'Monetization',
    },
    {
        slug: 'short_form_content_strategy',
        title: 'Short-Form Content Strategy for YouTube Shorts & TikTok',
        description:
            'Master the algorithm with data-backed retention tactics, pacing secrets, and storytelling hooks built for rapid growth.',
        date: '2026-09-27',
        readTime: '5 min read',
        category: 'Growth Tactics',
    },
    {
        slug: 'dealing_with_algorithm_changes',
        title: 'Dealing with Social Media Algorithm Changes Without Burning Out',
        description:
            'How to adapt your content creation workflow when algorithms shift, keeping your reach consistent and high-converting.',
        date: '2026-09-28',
        readTime: '4 min read',
        category: 'Algorithm',
    },
    {
        slug: 'the_pitch_email_template_that_gets_brands_to_pay_you_more',
        title: 'The Pitch Email Template That Gets Brands to Pay You More',
        description:
            'A proven outreach script and negotiation framework designed to help creators land premium brand sponsorships.',
        date: '2026-09-29',
        readTime: '3 min read',
        category: 'Sponsorships',
    },
    {
        slug: 'the_truth_about_going_viral_in_2026_skill_vs_luck',
        title: 'The Truth About Going Viral in 2026: Skill vs Luck',
        description:
            'An in-depth analysis of short-form video metrics and why viral distribution is a repeatable skill rather than random chance.',
        date: '2026-09-30',
        readTime: '7 min read',
        category: 'Analytics',
    },
];

export default function BlogListingPage() {
    return (
        <div className="bg-slate-950 text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 selection:bg-purple-500 selection:text-white">
            {/* Header Section */}
            <div className="max-w-4xl mx-auto text-center space-y-4">
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Knowledge & Growth Guides
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    HookTos AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">Blog</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Latest strategies, guides, and tips for creating viral short-form content.
                </p>
            </div>

            {/* Blog Grid / Cards Container */}
            <div className="max-w-4xl mx-auto mt-14 space-y-6">
                {blogPosts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group block p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:border-purple-500/50 hover:bg-slate-900/80 transition-all duration-300 shadow-lg hover:shadow-purple-500/10"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-md border border-purple-500/20 w-fit">
                                {post.category}
                            </span>
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                                <span>{post.readTime}</span>
                                <span>•</span>
                                <time>{post.date}</time>
                            </div>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 group-hover:text-purple-300 transition-colors duration-200">
                            {post.title}
                        </h2>

                        <p className="text-slate-400 text-sm mt-3 leading-relaxed font-normal">
                            {post.description}
                        </p>

                        <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                            Read Article <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}