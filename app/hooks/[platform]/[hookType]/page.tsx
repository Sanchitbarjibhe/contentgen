import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/seo/schema";
import { getAllHookPages, getPageContent } from "@/lib/pseo/data";

const HookPreview = dynamic(() => import("./HookPreview"), {
  loading: () => (
    <div className="min-h-96 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/50" />
  ),
});

export const revalidate = 86400;
export const dynamicParams = false;

type PageProps = {
  params: Promise<{ platform: string; hookType: string }>;
};

export function generateStaticParams() {
  return getAllHookPages({ onlyIndexable: true }).map((page) => ({
    platform: page.platformSlug,
    hookType: page.hookTypeSlug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { platform, hookType } = await params;
  const page = getPageContent(platform, hookType);
  if (!page) return buildMetadata({
    title: "Hook Guide",
    description: "Explore HookTos hook guides.",
    path: "/hooks",
  });

  const title = `${page.platform.name} ${page.hookType.name} Hook Frameworks`;
  const titleWithExamples =
    title.length < 37 ? `${title} Examples` : title;

  return buildMetadata({
    title: titleWithExamples,
    description: `Use ${page.hookType.name.toLowerCase()} hook frameworks for ${page.platform.name}, with niche examples, proven formulas, and tips. Generate custom opening lines free with HookTos AI.`,
    path: `/hooks/${platform}/${hookType}`,
    type: "article",
    noindex: page.qualityScore < 70,
  });
}

export default async function HookTypePage({ params }: PageProps) {
  const { platform, hookType } = await params;
  const page = getPageContent(platform, hookType);
  if (!page) notFound();

  const url = `/hooks/${platform}/${hookType}`;
  const formulaParts = page.hookType.formula
    .split(/\s*\+\s*/)
    .filter(Boolean);
  const keyPoints = formulaParts.length >= 3
    ? formulaParts.slice(0, 3)
    : [...formulaParts, page.platform.algoNotes[0]];
  const psychology = page.hookType.psychology;
  const relatedLinks = page.related.map((item) => ({
    href: `/hooks/${item.platformSlug}/${item.hookTypeSlug}`,
    label:
      item.platformSlug === platform
        ? `${item.hookTypeSlug.replace(/-/g, " ")} hooks for ${page.platform.name}`
        : `${page.hookType.name} hooks for ${item.platformSlug.replace(/-/g, " ")}`,
  }));

  return (
    <main className="min-h-screen bg-[#0B0F17] px-4 pb-20 pt-12 text-slate-100 sm:px-6 sm:pt-16 lg:px-8">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Hooks", url: "/hooks" },
            { name: page.platform.name, url: `/hooks/${platform}` },
            { name: page.hookType.name, url },
          ]),
          faqSchema(page.faqs),
          articleSchema({
            headline: `${page.hookType.name} Hooks for ${page.platform.name}`,
            url,
            datePublished: page.updatedAt,
            dateModified: page.updatedAt,
          }),
        ]}
      />
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
          <Link href="/">Home</Link>
          <span className="px-2 text-slate-600">/</span>
          <Link href="/hooks">Hooks</Link>
          <span className="px-2 text-slate-600">/</span>
          <Link href={`/hooks/${platform}`}>{page.platform.name}</Link>
          <span className="px-2 text-slate-600">/</span>
          <span className="text-slate-300">{page.hookType.name}</span>
        </nav>

        <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-2 lg:items-start lg:gap-10">
          <header className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2962FF]/30 bg-[#2962FF]/10 px-4 py-2 text-xs font-bold tracking-[0.12em] text-blue-200">
              <span className="size-2 rounded-full bg-[#00E676]" />
              {page.platform.name.toUpperCase()} HOOK PLAYBOOK
            </span>
            <h1 className="mt-6 max-w-2xl text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {page.hookType.name} Hooks for {page.platform.name}
            </h1>
            <p className="mt-6 text-left text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              For {page.platform.name},{" "}
              {psychology.charAt(0).toLowerCase() + psychology.slice(1)} Use{" "}
              {page.platform.hookWindow} to make the opening clear and deliver
              the promised payoff.
            </p>
            <ol
              aria-label={`${page.hookType.name} hook formula`}
              className="mt-5 flex flex-wrap gap-2"
            >
              {keyPoints.map((point, index) => (
                <li
                  key={point}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-200"
                >
                  <span className="text-blue-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {point.charAt(0).toUpperCase() + point.slice(1)}
                </li>
              ))}
            </ol>
            <Link
              href="#examples"
              className="mt-6 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-blue-200"
            >
              Jump to {page.examples.length} examples
              <span aria-hidden="true">↓</span>
            </Link>
          </header>

          <div className="min-w-0">
            <HookPreview
              hooks={page.examples.map((example) => example.hook)}
              platformName={page.platform.name}
            />
          </div>
        </div>

        <section id="examples" className="mx-auto mt-14 max-w-4xl scroll-mt-24">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            {page.examples.length} ready-to-customize examples
          </h2>
          <div className="mt-5 grid gap-3">
            {page.examples.map((example, index) => (
              <article
                key={`${example.niche}-${index}`}
                className="rounded-xl border border-slate-800 bg-[#101722] p-5"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-blue-300">
                  {example.niche}
                </p>
                <p className="mt-2 font-semibold leading-7 text-white">
                  {example.hook}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Why it works: {example.whyItWorks}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
            <h2 className="text-xl font-bold text-white">Do</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
              {page.dos.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
            <h2 className="text-xl font-bold text-white">Do not</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
              {page.donts.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        </section>

        <section className="mx-auto mt-14 max-w-4xl">
          <h2 className="text-2xl font-extrabold text-white">Frequently asked questions</h2>
          <div className="mt-5 space-y-3">
            {page.faqs.map((faq) => (
              <article key={faq.q} className="rounded-xl border border-slate-800 bg-[#101722] p-5">
                <h3 className="font-bold text-white">{faq.q}</h3>
                <p className="mt-2 leading-7 text-slate-300">{faq.a}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-4xl">
          <h2 className="text-xl font-extrabold text-white">Explore more hook guides</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-[#2962FF] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <p className="mx-auto mt-10 max-w-4xl text-sm text-slate-500">
          Updated {page.updatedAt}
        </p>
      </div>
    </main>
  );
}
