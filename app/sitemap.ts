import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";
import { PLATFORMS } from "@/lib/hook-pages";
import { getAllHookPages } from "@/lib/pseo/data";
import { marketplaceCategories } from "@/optimizations/SEO/marketplace-categories";
import { SITE } from "@/lib/seo/config";
import {
  RESOURCE_CATEGORIES,
  resources as starterResources,
} from "@/data/resources";
import { nicheResources } from "@/data/niche-resources";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

type FrontMatter = {
  slug?: string;
  date?: string;
  updated?: string;
  draft?: string;
  cover?: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blogs");

function readFrontMatter(content: string): FrontMatter {
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    data[kv[1]] = kv[2]
      .replace(/\s+#.*$/, "")
      .trim()
      .replace(/^["']|["']$/g, "");
  }
  return data;
}

function toDate(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function absoluteUrl(url: string): string {
  return /^https?:\/\//i.test(url)
    ? url
    : `${SITE.url}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const buildTime = new Date();
  const resourceCategories = new Set<string>(RESOURCE_CATEGORIES);
  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "daily", priority: 1, lastModified: buildTime },
    { url: `${SITE.url}/hooks`, changeFrequency: "weekly", priority: 0.9, lastModified: buildTime },
    { url: `${SITE.url}/marketplace`, changeFrequency: "daily", priority: 0.9, lastModified: buildTime },
    { url: `${SITE.url}/blog`, changeFrequency: "daily", priority: 0.8, lastModified: buildTime },
    { url: `${SITE.url}/tools`, changeFrequency: "weekly", priority: 0.8, lastModified: buildTime },
    { url: `${SITE.url}/audio`, changeFrequency: "daily", priority: 0.8, lastModified: buildTime },
    { url: `${SITE.url}/hashtag`, changeFrequency: "weekly", priority: 0.8, lastModified: buildTime },
    { url: `${SITE.url}/about`, changeFrequency: "monthly", priority: 0.6, lastModified: new Date("2026-10-19") },
    { url: `${SITE.url}/changelog`, changeFrequency: "weekly", priority: 0.5, lastModified: new Date("2026-10-19") },
  ];

  const categoryEntries: MetadataRoute.Sitemap = Object.values(
    marketplaceCategories,
  ).map((category) => ({
    url: `${SITE.url}/marketplace/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: buildTime,
  }));

  const resourceCategoryEntries: MetadataRoute.Sitemap = RESOURCE_CATEGORIES.map(
    (category) => ({
      url: `${SITE.url}/resources/${category}`,
      changeFrequency: "weekly",
      priority: 0.7,
      lastModified: buildTime,
    }),
  );

  const resourceEntryMap = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const resource of [...starterResources, ...nicheResources]) {
    const url = `${SITE.url}/resources/${resource.category}/${resource.slug}`;
    resourceEntryMap.set(url, {
      url,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: buildTime,
    });
  }
  try {
    const databaseResources = await prisma.creatorResource.findMany({
      select: { category: true, slug: true, updatedAt: true },
    });
    for (const resource of databaseResources) {
      if (!resourceCategories.has(resource.category)) continue;
      const url = `${SITE.url}/resources/${resource.category}/${resource.slug}`;
      resourceEntryMap.set(url, {
        url,
        changeFrequency: "monthly",
        priority: 0.6,
        lastModified: resource.updatedAt,
      });
    }
  } catch (error) {
    console.error("[sitemap] unable to load database resources; using static catalog:", error);
  }

  const platformEntries: MetadataRoute.Sitemap = PLATFORMS.map((platform) => ({
    url: `${SITE.url}/hooks/${platform.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: buildTime,
  }));

  const hookEntries: MetadataRoute.Sitemap = getAllHookPages({ onlyIndexable: true }).map(
    (page) => ({
      url: `${SITE.url}/hooks/${page.platformSlug}/${page.hookTypeSlug}`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: buildTime,
    }),
  );

  let blogEntries: MetadataRoute.Sitemap = [];
  if (fs.existsSync(BLOG_DIR)) {
    blogEntries = fs
      .readdirSync(BLOG_DIR)
      .filter((file) => /\.(md|mdx)$/i.test(file) && !file.startsWith("_"))
      .flatMap((file): MetadataRoute.Sitemap => {
        const fullPath = path.join(BLOG_DIR, file);
        const raw = fs.readFileSync(fullPath, "utf8");
        const frontMatter = readFrontMatter(raw);
        if (frontMatter.draft === "true") return [];

        const fileSlug = file
          .replace(/(?:\.(?:md|mdx))+$/i, "")
          .replace(/_/g, "-")
          .replace(/-+/g, "-")
          .toLowerCase();
        const slug = (frontMatter.slug ?? fileSlug)
          .replace(/_/g, "-")
          .replace(/-+/g, "-")
          .toLowerCase();
        const fileTime = fs.statSync(fullPath).mtime;
        const published = toDate(frontMatter.date, fileTime);
        const lastModified = toDate(frontMatter.updated, published);

        return [{
          url: `${SITE.url}/blog/${slug}`,
          changeFrequency: "monthly",
          priority: 0.7,
          lastModified,
          ...(frontMatter.cover
            ? { images: [absoluteUrl(frontMatter.cover)] }
            : {}),
        }];
      });
  }

  return [
    ...staticEntries,
    ...categoryEntries,
    ...resourceCategoryEntries,
    {
      url: `${SITE.url}/resources`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: buildTime,
    },
    ...resourceEntryMap.values(),
    ...platformEntries,
    ...hookEntries,
    ...blogEntries,
  ];
}
