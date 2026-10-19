// app/sitemap.ts  (HookTos AI — v2)
// Next.js serves it automatically at https://www.hooktos.com/sitemap.xml
//
// What changed vs v1:
//  - Added missing routes: /audio, /hashtag, /marketplace, /blog, /changelog
//  - Blog posts read "date" / "updated" / "draft" / "cover" from MDX front-matter
//    (v1 stamped every URL with new Date() on every build, which Google learns to ignore)
//  - Draft posts and files starting with "_" are excluded
//  - Blog cover images are listed for Google Images
//  - Single source of truth for the domain (always https://www.hooktos.com)

import type { MetadataRoute } from 'next';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://www.hooktos.com';
const BLOG_DIR = path.join(process.cwd(), 'content', 'blogs');

// Re-generate the sitemap at most once per hour on Vercel (blog + audio pages change often).
export const revalidate = 3600;

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

// ---------------------------------------------------------------------------
// 1. Static routes — edit "updated" when you meaningfully change a page.
// ---------------------------------------------------------------------------
const BUILD_TIME = new Date();

const STATIC_ROUTES: {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
  updated?: string; // YYYY-MM-DD. Omit = build time (use for pages whose data changes daily).
}[] = [
  { path: '/',           changeFrequency: 'daily',   priority: 1.0 },
  { path: '/audio',      changeFrequency: 'daily',   priority: 0.9 }, // trending audio, ISR-synced daily
  { path: '/hashtag',    changeFrequency: 'weekly',  priority: 0.9 },
  { path: '/marketplace', changeFrequency: 'daily',  priority: 0.8 }, // billboard slots change often
  { path: '/blog',       changeFrequency: 'daily',   priority: 0.8 },
  { path: '/about',      changeFrequency: 'monthly', priority: 0.6, updated: '2026-10-19' },
  { path: '/changelog',  changeFrequency: 'weekly',  priority: 0.5, updated: '2026-10-19' },
  // Add free tool pages here once they exist, e.g.:
  // { path: '/tools/hook-generator',             changeFrequency: 'weekly', priority: 0.9 },
  // { path: '/tools/video-description-generator', changeFrequency: 'weekly', priority: 0.8 },
];

// ---------------------------------------------------------------------------
// 2. Tiny front-matter reader (no extra npm package needed)
// ---------------------------------------------------------------------------
type FrontMatter = {
  date?: string;
  updated?: string;
  draft?: string;
  cover?: string;
};

function readFrontMatter(fileContent: string): FrontMatter {
  const match = fileContent.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    // strip inline comments and wrapping quotes
    const value = kv[2].replace(/\s+#.*$/, '').trim().replace(/^["']|["']$/g, '');
    data[kv[1]] = value;
  }
  return data as FrontMatter;
}

function toDate(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

function absoluteUrl(p: string): string {
  if (/^https?:\/\//i.test(p)) return p;
  return `${BASE_URL}${p.startsWith('/') ? '' : '/'}${p}`;
}

// ---------------------------------------------------------------------------
// 3. Blog posts from content/blogs/*.md(x)
// ---------------------------------------------------------------------------
type BlogEntry = { slug: string; lastModified: Date; cover?: string };

function getBlogEntries(): BlogEntry[] {
  try {
    if (!fs.existsSync(BLOG_DIR)) return [];

    return fs
      .readdirSync(BLOG_DIR)
      .filter((file) => /\.mdx?$/.test(file) && !file.startsWith('_'))
      .map((file): BlogEntry | null => {
        const fullPath = path.join(BLOG_DIR, file);
        const raw = fs.readFileSync(fullPath, 'utf8');
        const fm = readFrontMatter(raw);
        if (fm.draft === 'true') return null;

        const fileTime = fs.statSync(fullPath).mtime;
        const published = toDate(fm.date, fileTime);
        return {
          slug: file.replace(/(?:\.(?:md|mdx))+$/i, ''),
          lastModified: toDate(fm.updated, published),
          cover: fm.cover,
        };
      })
      .filter((e): e is BlogEntry => e !== null)
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  } catch (error) {
    console.error('[sitemap] Could not read blog directory:', error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// 4. Build the sitemap
// ---------------------------------------------------------------------------
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getBlogEntries();
  const newestPost = posts[0]?.lastModified ?? BUILD_TIME;

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: r.path === '/' ? BASE_URL : `${BASE_URL}${r.path}`,
    lastModified:
      r.path === '/blog' ? newestPost : toDate(r.updated, BUILD_TIME),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    ...(post.cover ? { images: [absoluteUrl(post.cover)] } : {}),
  }));

  // Optional: database-driven pages (e.g. public business profiles in /directory).
  // Uncomment and adapt if such pages exist:
  //
  // import { prisma } from '@/lib/prisma';
  // const listings = await prisma.listing.findMany({
  //   where: { isPublic: true },
  //   select: { slug: true, updatedAt: true },
  // });
  // const listingEntries = listings.map((l) => ({
  //   url: `${BASE_URL}/directory/${l.slug}`,
  //   lastModified: l.updatedAt,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.5,
  // }));

  return [...staticEntries, ...blogEntries];
}
