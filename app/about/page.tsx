import React from 'react';

export const metadata = {
    title: 'About Us — HookTos AI',
    description: 'Learn about HookTos AI, our mission, vision, and the story behind the viral hook generator.',
};

export default function AboutPage() {
    return (
        <div className="bg-slate-950 text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="max-w-5xl mx-auto text-center space-y-6">
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Powered by HookTos AI
                </span>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                    Empowering Creators to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Hook Their Audience</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">
                    At HookTos AI, we build intelligent tools that convert casual scrollers into loyal followers and long-term customers.
                </p>
            </div>

            {/* Grid: Mission & Vision */}
            <div className="max-w-6xl mx-auto mt-20 grid md:grid-cols-2 gap-8">
                <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-blue-500/40 transition">
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">Our Mission</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Our mission is to empower content creators, marketers, and businesses to stay ahead of social media algorithms. HookTos AI simplifies the process of creating high-retention hooks in seconds.
                    </p>
                </div>
                <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-purple-500/40 transition">
                    <h2 className="text-2xl font-bold text-purple-400 mb-4">Our Vision</h2>
                    <p className="text-slate-300 leading-relaxed">
                        We aim to build a comprehensive multi-SaaS portfolio under the hooktos.com ecosystem, making digital marketing, SEO, and AI-driven content generation accessible, efficient, and affordable for everyone.
                    </p>
                </div>
            </div>

            {/* Story Section */}
            <div className="max-w-4xl mx-auto mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800">
                <h2 className="text-3xl font-bold text-center mb-6">Our Story</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    In an era where social media algorithms constantly evolve and attention spans shrink, capturing audience interest within the first three seconds has become the biggest challenge for creators.
                </p>
                <p className="text-slate-300 leading-relaxed">
                    HookTos AI was created to solve this problem. By combining artificial intelligence with proven psychological frameworks of viral content, we built a platform that delivers instant, high-converting results.
                </p>
            </div>

            {/* Core Values Section */}
            <div className="max-w-5xl mx-auto mt-20">
                <h2 className="text-3xl font-bold text-center mb-10">Core Values</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                        <h3 className="text-lg font-semibold text-slate-100 mb-2">Innovation First</h3>
                        <p className="text-sm text-slate-400">Leveraging cutting-edge AI capabilities to stay one step ahead of content trends.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                        <h3 className="text-lg font-semibold text-slate-100 mb-2">Creator-Centric</h3>
                        <p className="text-sm text-slate-400">Designing every feature to save time and maximize reach for creators and brands.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                        <h3 className="text-lg font-semibold text-slate-100 mb-2">Quality & Transparency</h3>
                        <p className="text-sm text-slate-400">Delivering high-converting outputs without unnecessary complexity or fluff.</p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-5xl mx-auto mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div className="p-6 rounded-xl bg-slate-900/30 border border-slate-800/80">
                    <div className="text-4xl font-extrabold text-blue-400">10,000+</div>
                    <div className="text-sm text-slate-400 mt-2">Hooks Generated</div>
                </div>
                <div className="p-6 rounded-xl bg-slate-900/30 border border-slate-800/80">
                    <div className="text-4xl font-extrabold text-purple-400">10x</div>
                    <div className="text-sm text-slate-400 mt-2">Average Engagement</div>
                </div>
                <div className="p-6 rounded-xl bg-slate-900/30 border border-slate-800/80">
                    <div className="text-4xl font-extrabold text-pink-400">99.9%</div>
                    <div className="text-sm text-slate-400 mt-2">Uptime Reliability</div>
                </div>
            </div>

            {/* Founder / Team */}
            {/* <div className="max-w-4xl mx-auto mt-20 text-center">
                <h2 className="text-3xl font-bold mb-8">Meet the Builder</h2>
                <div className="inline-flex flex-col items-center p-8 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 mb-4 flex items-center justify-center font-bold text-2xl text-white">
                        SB
                    </div>
                    <h3 className="text-xl font-bold">Sanchit Barjibhe</h3>
                    <p className="text-sm text-blue-400 mt-1">Founder & Lead Engineer</p>
                    <p className="text-slate-400 text-sm mt-3 max-w-md">
                        Passionate about building scalable SaaS products, AI systems, and empowering digital creators worldwide.
                    </p>
                </div>
            </div> */}

            {/* CTA Section */}
            <div className="max-w-4xl mx-auto mt-20 text-center space-y-6 p-10 rounded-3xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-slate-800">
                <h2 className="text-3xl font-bold">Ready to Scale Your Reach?</h2>
                <p className="text-slate-300">Start generating high-converting hooks for your Reels, Shorts, and TikToks today.</p>
                <a
                    href="/"
                    className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition shadow-lg shadow-blue-500/20"
                >
                    Try HookTos AI Free
                </a>
            </div>
        </div>
    );
}