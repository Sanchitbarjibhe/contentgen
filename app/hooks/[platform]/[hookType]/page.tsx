import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HookPreview from "./HookPreview";
import {
  HOOK_PAGES,
  HOOK_TYPES,
  PLATFORMS,
  getHookPage,
} from "@/lib/hook-pages";

const BASE_URL = "https://www.hooktos.com";

type PageProps = {
  params: Promise<{ platform: string; hookType: string }>;
};

export const dynamicParams = false;

export function generateStaticParams(): Array<{
  platform: string;
  hookType: string;
}> {
  return HOOK_PAGES.map(({ platform, hookType }) => ({
    platform: platform.slug,
    hookType: hookType.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { platform, hookType } = await params;
  const page = getHookPage(platform, hookType);
  if (!page) notFound();

  const title = `15 Viral ${page.hookType.name} Hooks for ${page.platform.name} (2026 Guide)`;
  const description = `Explore 15 ${page.hookType.intent} for ${page.platform.name}, with ready-to-customize examples, proven formulas, and practical tips for your next post.`;
  const canonical = `${BASE_URL}/hooks/${page.platform.slug}/${page.hookType.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: `${title} | HookTos AI`,
      description,
      siteName: "HookTos AI",
      images: [
        {
          url: "/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: "HookTos AI",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | HookTos AI`,
      description,
      images: ["/android-chrome-512x512.png"],
    },
  };
}

export default async function HookTypePage({ params }: PageProps) {
  const { platform, hookType } = await params;
  const page = getHookPage(platform, hookType);
  if (!page) notFound();

  const relatedHookTypes = HOOK_TYPES.filter(
    (item) => item.slug !== page.hookType.slug,
  ).slice(0, 4);
  const relatedPlatforms = PLATFORMS.filter(
    (item) => item.slug !== page.platform.slug,
  ).slice(0, 4);

  return (
    <main className="min-h-screen bg-[#0B0F17] px-4 pb-20 pt-12 text-slate-100 sm:px-6 sm:pt-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
          <Link className="transition hover:text-white" href="/">
            Home
          </Link>
          <span className="px-2 text-slate-600">/</span>
          <Link className="transition hover:text-white" href="/hooks/tiktok/curiosity">
            Hook guides
          </Link>
          <span className="px-2 text-slate-600">/</span>
          <span className="text-slate-300">{page.platform.name}</span>
          <span className="px-2 text-slate-600">/</span>
          <span className="text-slate-300">{page.hookType.name}</span>
        </nav>

        <header className="mx-auto mt-10 max-w-4xl text-center sm:mt-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2962FF]/30 bg-[#2962FF]/10 px-4 py-2 text-xs font-bold tracking-[0.12em] text-blue-200">
            <span className="size-2 rounded-full bg-[#00E676]" />
            {page.platform.name.toUpperCase()} HOOK PLAYBOOK
          </span>
          <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            15 Viral{" "}
            <span className="text-[#78a0ff]">{page.hookType.name}</span> Hooks
            for {page.platform.name}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            {page.hookType.description} Use these ready-to-customize examples
            for {page.platform.format}.
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-4xl">
          <HookPreview hooks={page.hooks} platformName={page.platform.name} />
        </div>

        <section className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#00E676]">
              The framework
            </p>
            <h2 className="mt-3 text-xl font-bold text-white">
              A repeatable {page.hookType.name.toLowerCase()} hook formula
            </h2>
            <p className="mt-3 leading-7 text-slate-300">
              {page.hookType.formula}. Make the opening specific to your
              audience, keep the promise honest, and deliver the payoff in the
              content that follows.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-300">
              Platform fit
            </p>
            <h2 className="mt-3 text-xl font-bold text-white">
              Adapt your opening for {page.platform.name}
            </h2>
            <p className="mt-3 leading-7 text-slate-300">
              {page.platform.audience} can use this format for{" "}
              {page.platform.format}. Match the first line to the post’s real
              value, then move quickly into the example, story, or answer.
            </p>
          </article>
        </section>

        <section className="mx-auto mt-14 max-w-4xl">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            How to use these {page.hookType.name.toLowerCase()} hooks
          </h2>
          <ol className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              "Replace each bracketed prompt with a concrete detail from your topic.",
              "Choose an opening that fits the audience and format of your post.",
              "Pay off the hook with a useful answer; do not overpromise for clicks.",
            ].map((step, index) => (
              <li
                key={step}
                className="rounded-xl border border-slate-800 bg-[#101722] p-5"
              >
                <span className="text-sm font-extrabold text-[#00E676]">
                  0{index + 1}
                </span>
                <p className="mt-2 leading-6 text-slate-300">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto mt-14 max-w-4xl">
          <h2 className="text-xl font-extrabold text-white">
            Explore more hook guides
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {relatedHookTypes.map((item) => (
              <Link
                key={item.slug}
                href={`/hooks/${page.platform.slug}/${item.slug}`}
                className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-[#2962FF] hover:text-white"
              >
                {item.name} hooks for {page.platform.name}
              </Link>
            ))}
            {relatedPlatforms.map((item) => (
              <Link
                key={item.slug}
                href={`/hooks/${item.slug}/${page.hookType.slug}`}
                className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-[#2962FF] hover:text-white"
              >
                {page.hookType.name} hooks for {item.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
