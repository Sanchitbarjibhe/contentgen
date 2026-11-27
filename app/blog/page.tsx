import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { BlogPosts } from '@/lib/BlogPosts';
import { breadcrumbSchema } from '@/lib/seo/schema';
import JsonLd from '@/components/seo/JsonLd';


export const metadata: Metadata = buildMetadata({
  title: 'Reels Hooks, TikTok Frameworks & Creator Tips',
  description: 'Read practical guides to Instagram Reels hooks, TikTok content frameworks, AI writing tools, and strategies for growing a creator business with HookTos AI.',
  path: '/blog',
});

export default function BlogListingPage() {
    return (
        <main className="min-h-screen bg-transparent px-4 py-16 text-slate-100 selection:bg-purple-500 selection:text-white sm:px-6 lg:px-8">
            <JsonLd
                data={breadcrumbSchema([
                    { name: 'Home', url: '/' },
                    { name: 'Blog', url: '/blog' },
                ])}
            />
            {/* Header Section */}
            <div className="max-w-4xl mx-auto text-center space-y-4">
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Knowledge & Growth Guides
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    Reels Hooks, TikTok Frameworks & Creator Guides
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Latest strategies, guides, and tips for creating viral short-form content.
                </p>
            </div>

            <nav aria-label="Related creator tools" className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
                <Link className="text-blue-300 hover:text-blue-200" href="/hooks">
                    Explore AI hook frameworks
                </Link>
                <Link className="text-blue-300 hover:text-blue-200" href="/marketplace">
                    Browse the creator business marketplace
                </Link>
                <Link className="text-blue-300 hover:text-blue-200" href="/dashboard">
                    Open the AI content dashboard
                </Link>
            </nav>

            {/* Blog Grid / Cards Container */}
            <div className="max-w-4xl mx-auto mt-14 space-y-6">
                {BlogPosts.map((post: any) => (
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
        </main>
    );
}