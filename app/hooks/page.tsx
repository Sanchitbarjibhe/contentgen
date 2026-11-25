import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbSchema,
  itemListSchema,
  softwareAppSchema,
} from "@/lib/seo/schema";
import { HOOK_TYPES, PLATFORMS } from "@/lib/hook-pages";

export const metadata: Metadata = buildMetadata({
  title: "Viral Hook Generator and Creator Guides",
  description:
    "Generate stronger opening lines and explore proven hook frameworks for Instagram Reels, TikTok, YouTube Shorts, LinkedIn, and X with HookTos AI.",
  path: "/hooks",
});

export default function HooksPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-16 text-slate-100 sm:px-6">
      <JsonLd
        data={[
          softwareAppSchema(),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Hooks", url: "/hooks" },
          ]),
          itemListSchema(
            "Hook generator platforms",
            PLATFORMS.map((platform) => ({
              name: platform.name,
              url: `/hooks/${platform.slug}`,
            })),
          ),
        ]}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
        <Link className="hover:text-white" href="/">Home</Link>
        <span className="px-2">/</span>
        <span className="text-slate-200">Hooks</span>
      </nav>
      <header className="mt-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
          AI viral hook generator and creator guides
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          Build scroll-stopping openings for short-form video and professional
          posts, then explore proven hook formulas for each platform.
        </p>
        <Link
          className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 font-semibold text-white"
          href="/dashboard"
        >
          Try the hook generator
        </Link>
        <p className="mt-4 text-sm text-slate-400">
          Start with the free plan. Premium is $9.99 per month.
        </p>
      </header>
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">Choose a platform</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORMS.map((platform) => (
            <Link
              key={platform.slug}
              href={`/hooks/${platform.slug}`}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-purple-500/50"
            >
              <span className="font-bold text-white">{platform.name}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">Explore hook types</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {HOOK_TYPES.map((hookType) => (
            <Link
              key={hookType.slug}
              href={`/hooks/instagram-reels/${hookType.slug}`}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-purple-400"
            >
              {hookType.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
