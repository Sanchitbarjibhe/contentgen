import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import ResourceCard from "@/components/resources/ResourceCard";
import { nicheResources } from "@/data/niche-resources";
import {
  RESOURCE_CATEGORIES,
  RESOURCE_CATEGORY_LABELS,
  resources as starterResources,
  type ResourceCardData,
  type ResourceCategory,
} from "@/data/resources";
import { buildMetadata } from "@/lib/seo/metadata";
import { collectionPageSchema, breadcrumbSchema } from "@/lib/seo/schema";
import {
  fromCreatorResourceRow,
  isResourceVisitorKey,
  RESOURCE_VISITOR_COOKIE,
} from "@/lib/creator-resources";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ category: string }>;
};

const categoryDescriptions: Record<ResourceCategory, string> = {
  "swipe-files":
    "Study reusable short-form video hooks for TikTok, Instagram Reels, and YouTube Shorts, then adapt them to your audience.",
  "prompt-packs":
    "Copy and customize practical AI prompts for stronger creator hooks, scripts, captions, and content planning.",
  checklists:
    "Use actionable pre-publish and production checklists to make short-form videos clearer, more useful, and ready to share.",
  templates:
    "Start with ready-to-customize short-form video scripts, creator pitches, and repeatable content workflows.",
};

export const dynamic = "force-dynamic";
export const dynamicParams = false;

export function generateStaticParams() {
  return RESOURCE_CATEGORIES.map((category) => ({ category }));
}

function isResourceCategory(value: string): value is ResourceCategory {
  return RESOURCE_CATEGORIES.some((category) => category === value);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isResourceCategory(category)) {
    return buildMetadata({
      title: "Creator Resources",
      description: "Explore creator resources from HookTos AI.",
      path: "/resources",
      noindex: true,
    });
  }

  const label = RESOURCE_CATEGORY_LABELS[category];
  return buildMetadata({
    title: `${label} for Short-Form Video Creators`,
    description: categoryDescriptions[category],
    path: `/resources/${category}`,
  });
}

async function loadCategoryResources(
  category: ResourceCategory,
): Promise<ResourceCardData[]> {
  const fallback = [...starterResources, ...nicheResources].filter(
    (resource) => resource.category === category,
  );

  try {
    const [rows, cookieStore] = await Promise.all([
      prisma.creatorResource.findMany({
        where: { category },
        orderBy: { title: "asc" },
      }),
      cookies(),
    ]);

    if (rows.length === 0) return fallback;

    const visitorKey = cookieStore.get(RESOURCE_VISITOR_COOKIE)?.value;
    const likes = isResourceVisitorKey(visitorKey)
      ? await prisma.resourceLike.findMany({
          where: { visitorKey, resourceId: { in: rows.map((row) => row.id) } },
          select: { resourceId: true },
        })
      : [];
    const likedIds = new Set(likes.map((like) => like.resourceId));
    const mapped = rows.map((row) =>
      fromCreatorResourceRow(row, likedIds.has(row.id)),
    );

    if (mapped.some((resource) => resource === null)) {
      console.error(`[resources] malformed database resources in ${category}.`);
      return fallback;
    }

    return mapped.filter(
      (resource): resource is NonNullable<typeof resource> => resource !== null,
    );
  } catch (error) {
    console.error(`[resources] unable to load database category ${category}:`, error);
    return fallback;
  }
}

export default async function ResourceCategoryPage({ params }: PageProps) {
  const { category } = await params;
  if (!isResourceCategory(category)) notFound();

  const label = RESOURCE_CATEGORY_LABELS[category];
  const categoryResources = await loadCategoryResources(category);
  const path = `/resources/${category}`;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#0d1021] px-4 pb-20 pt-10 text-slate-100 sm:px-6 sm:pt-16 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 size-[28rem] rounded-full bg-indigo-600/15 blur-[130px]" />
        <div className="absolute right-[-12rem] top-[35rem] size-[26rem] rounded-full bg-emerald-500/10 blur-[130px]" />
      </div>
      <JsonLd
        data={[
          collectionPageSchema({
            name: `${label} for Short-Form Video Creators`,
            description: categoryDescriptions[category],
            url: path,
            items: categoryResources.map((resource) => ({
              name: resource.title,
              url: `${path}/${resource.slug}`,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Resources", url: "/resources" },
            { name: label, url: path },
          ]),
        ]}
      />
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
          <Link className="hover:text-white" href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link className="hover:text-white" href="/resources">Resources</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-slate-200">{label}</span>
        </nav>

        <header className="mx-auto mt-8 max-w-3xl text-center sm:mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
            HookTos AI Creator Resources
          </p>
          <h1 className="mt-4 break-words text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {label} for Short-Form Video Creators
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
            {categoryDescriptions[category]}
          </p>
          <Link
            className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-400/[0.08] px-4 py-2 text-sm font-semibold text-indigo-100 transition hover:border-indigo-300/60 hover:bg-indigo-400/[0.14]"
            href="/resources"
          >
            Browse all resources
          </Link>
        </header>

        <section
          aria-label={label}
          className="mt-8 grid min-w-0 gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categoryResources.map((resource) => (
            <ResourceCard
              key={`${resource.category}-${resource.slug}`}
              resource={resource}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
