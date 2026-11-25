import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "AI Creator Tools for Reels, TikTok & Shorts",
  description:
    "Explore AI creator tools for Reels, TikTok, and Shorts, including a viral hook generator, Instagram hashtag research, and trending audio discovery.",
  path: "/tools",
});

export default function ToolsPage() {
  const tools = [
    { name: "AI Hook Generator", href: "/hooks", description: "Build platform-ready opening hooks." },
    { name: "Trending Hashtags", href: "/hashtag", description: "Explore momentum across hashtag topics." },
    { name: "Trending Audio", href: "/audio", description: "Find sounds used across short-form video." },
  ];

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-16 text-slate-100 sm:px-6">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Tools", url: "/tools" },
          ]),
          itemListSchema(
            "HookTos creator tools",
            tools.map((tool) => ({ name: tool.name, url: tool.href })),
          ),
        ]}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
        <Link className="hover:text-white" href="/">Home</Link>
        <span className="px-2">/</span>
        <span className="text-slate-200">Tools</span>
      </nav>
      <header className="mt-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl">AI creator tools for Reels, TikTok, and Shorts</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          Discover tools for stronger openings, trend research, and short-form content planning.
        </p>
      </header>
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-purple-500/50"
          >
            <h2 className="font-bold text-white">{tool.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{tool.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
