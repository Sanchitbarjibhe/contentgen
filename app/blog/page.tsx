import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getPageMetadata } from '@/optimizations/SEO/seo.config';
import { BlogPosts } from '@/lib/BlogPosts';


export const metadata: Metadata = getPageMetadata('blogs', '/blogs');

export default function BlogListingPage() {
    return (
        <div className="min-h-screen bg-transparent px-4 py-16 text-slate-100 selection:bg-purple-500 selection:text-white sm:px-6 lg:px-8">
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
        </div>
    );
}