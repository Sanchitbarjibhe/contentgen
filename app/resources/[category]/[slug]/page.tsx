import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  RESOURCE_CATEGORY_LABELS,
  getResource,
  type ResourceCardData,
} from "@/data/resources";
import { nicheResources as nicheSpecificResources } from "@/data/niche-resources";
import { buildMetadata } from "@/lib/seo/metadata";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, resourceArticleSchema } from "@/lib/seo/schema";
import ResourceDetailActions from "@/components/resources/ResourceDetailActions";
import ResourceEarlyAccessForm from "@/components/resources/ResourceEarlyAccessForm";
import ResourceLikeButton from "@/components/resources/ResourceLikeButton";
import ResourceShareButton from "@/components/resources/ResourceShareButton";
import {
  fromCreatorResourceRow,
  isResourceVisitorKey,
  RESOURCE_VISITOR_COOKIE,
} from "@/lib/creator-resources";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export const dynamic = "force-dynamic";

function getStaticResource(category: string, slug: string) {
  return (
    getResource(category, slug) ??
    nicheSpecificResources.find(
      (resource) => resource.category === category && resource.slug === slug,
    )
  );
}

async function loadResource(
  category: string,
  slug: string,
  includeVisitorLike: boolean,
): Promise<ResourceCardData | undefined> {
  try {
    const row = await prisma.creatorResource.findUnique({ where: { slug } });
    if (row && row.category === category) {
      let liked = false;
      if (includeVisitorLike) {
        const cookieStore = await cookies();
        const visitorKey = cookieStore.get(RESOURCE_VISITOR_COOKIE)?.value;
        if (isResourceVisitorKey(visitorKey)) {
          liked = Boolean(
            await prisma.resourceLike.findUnique({
              where: {
                resourceId_visitorKey: {
                  resourceId: row.id,
                  visitorKey,
                },
              },
              select: { id: true },
            }),
          );
        }
      }

      const resource = fromCreatorResourceRow(row, liked);
      if (resource) return resource;
      console.error(`[resources] malformed database resource: ${slug}`);
    } else if (row && row.category !== category) {
      return undefined;
    }
  } catch (error) {
    console.error(`[resources] unable to load database resource ${slug}:`, error);
  }

  return getStaticResource(category, slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const resource = await loadResource(category, slug, false);
  if (!resource) {
    return buildMetadata({
      title: "Creator Resources",
      description: "Explore creator resources from HookTos AI.",
      path: "/resources",
    });
  }

  return buildMetadata({
    title: `${resource.title} | ${RESOURCE_CATEGORY_LABELS[resource.category]}`,
    description: resource.description,
    path: `/resources/${resource.category}/${resource.slug}`,
    type: "article",
  });
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { category, slug } = await params;
  const resource = await loadResource(category, slug, true);
  if (!resource) notFound();

  const categoryLabel = RESOURCE_CATEGORY_LABELS[resource.category];
  const resourceUrl = `/resources/${resource.category}/${resource.slug}`;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#0d1021] px-4 pb-20 pt-8 text-slate-100 sm:px-6 sm:pt-12 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/3 size-[28rem] rounded-full bg-indigo-600/15 blur-[130px]" />
        <div className="absolute right-[-12rem] top-[30rem] size-[24rem] rounded-full bg-emerald-500/10 blur-[130px]" />
      </div>
      <JsonLd
        data={[
          resourceArticleSchema({
            headline: resource.title,
            description: resource.description,
            url: resourceUrl,
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Resources", url: "/resources" },
            { name: categoryLabel, url: `/resources/${resource.category}` },
            { name: resource.title, url: resourceUrl },
          ]),
        ]}
      />

      <div className="mx-auto max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
          <Link className="hover:text-white" href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link className="hover:text-white" href="/resources">Resources</Link>
          <span aria-hidden="true">/</span>
          <Link className="hover:text-white" href={`/resources/${resource.category}`}>{categoryLabel}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-slate-200">{resource.title}</span>
        </nav>

        <article className="mt-8 rounded-3xl border border-slate-700/70 bg-slate-900/40 p-5 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03] backdrop-blur-xl sm:mt-12 sm:p-9">
          <span className="inline-flex rounded-full border border-indigo-400/25 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-200">
            {categoryLabel}
          </span>
          <h1 className="mt-5 break-words text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {resource.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            {resource.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {resource.platforms.map((platform) => (
              <span key={platform} className="rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1.5 text-xs font-medium text-slate-300">
                {platform}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {resource.niches.map((niche) => (
              <span key={niche} className="rounded-full border border-indigo-400/15 bg-indigo-400/[0.05] px-3 py-1.5 text-xs font-medium text-indigo-100/80">
                {niche}
              </span>
            ))}
          </div>
          <div className="mt-5">
            <div className="flex flex-wrap items-start gap-3">
              <ResourceLikeButton
                initialLiked={resource.liked}
                initialLikesCount={resource.likesCount}
                resourceId={resource.id}
              />
              <ResourceShareButton
                href={resourceUrl}
                summary={resource.description}
                title={resource.title}
              />
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-7">
            {resource.category === "swipe-files" && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-white">Hook to swipe</h2>
                <blockquote className="rounded-2xl border border-indigo-400/20 bg-indigo-400/[0.06] p-5 text-lg leading-8 text-slate-100 sm:p-6">
                  &ldquo;{resource.hook}&rdquo;
                </blockquote>
                <p className="text-sm leading-6 text-slate-400">
                  Use this as a structure, then adapt the details to your own experience and audience.
                </p>
                <ResourceDetailActions
                  copyText={resource.hook}
                  generatorPrompt={`${resource.generatorPrompt}\n\n${resource.hook}\n\nMy video topic: `}
                  copyLabel="Copy Hook"
                />
              </div>
            )}

            {resource.category === "prompt-packs" && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-white">Ready-to-use prompt</h2>
                <pre className="overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-slate-800 bg-slate-950/60 p-5 font-sans text-sm leading-7 text-slate-200 sm:p-6">
                  {resource.prompt}
                </pre>
                <ResourceDetailActions copyText={resource.prompt} copyLabel="Copy Prompt" />
              </div>
            )}

            {resource.category === "checklists" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white">Checklist</h2>
                <ul className="space-y-3">
                  {resource.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 text-sm leading-6 text-slate-300">
                      <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-emerald-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-slate-500">
                  Check off items on the resource card as you prepare your next video.
                </p>
              </div>
            )}

            {resource.category === "templates" && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-white">Script template</h2>
                <pre className="overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-slate-800 bg-slate-950/60 p-5 font-sans text-sm leading-7 text-slate-200 sm:p-6">
                  {resource.content}
                </pre>
                <ResourceDetailActions copyText={resource.content} copyLabel="Copy Template" />
              </div>
            )}
          </div>
        </article>

        <section className="mt-8 rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/15 via-slate-900/70 to-emerald-500/[0.08] p-6 sm:mt-10 sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
                <Sparkles aria-hidden="true" className="size-4" />
                Make your next one
              </span>
              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                Turn this resource into your next video.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Generate platform-ready hooks with HookTos AI, or join the waitlist for early access.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:w-56">
              <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500" href="/dashboard">
                Try the Generator <ArrowRight className="size-4" />
              </Link>
              <ResourceEarlyAccessForm />
            </div>
          </div>
        </section>

        <Link className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white" href="/resources">
          <ArrowLeft className="size-4" /> Back to all resources
        </Link>
      </div>
    </main>
  );
}
