
# HookTos AI: SEO & Programmatic SEO Strategy Guide

> **Site:** https://hooktos.com  |  **Stack:** Next.js (App Router)  |  **Last updated:** November 2026
> **Products:** AI Viral Hook Generator (`/hooks`), Creator Marketplace (`/marketplace`), AI Tools Directory, Blog (`/blog`)

**Data caveat:** Search volume and difficulty figures below are *relative estimates* (Low / Med / High) to prioritise work. Validate every cluster in Google Search Console, Ahrefs/Semrush or Keyword Planner before committing content budget.

## 0. Baseline (from Google Search Console, last 3 months)

| Metric                  | Value                                                           | Implication                                         |
| ----------------------- | --------------------------------------------------------------- | --------------------------------------------------- |
| Clicks / Impressions    | 62 / 596                                                        | Young site, impressions rising since mid-Nov        |
| India                   | 60 clicks, pos ~13                                              | Only market converting                              |
| USA                     | 256 impr, 0 clicks, pos ~38                                     | Visibility but not ranking high enough              |
| Desktop vs Mobile       | pos 28 vs pos 8.7                                               | Desktop is weak, check CWV and content depth        |
| Duplicate URLs          | `_` and `-` versions of the same posts, http/https/www variants | Splits ranking signals: fix first                   |
| Programmatic `/hooks/*` | ~35 pages, almost no clicks                                     | Likely template-thin: add unique content or noindex |

**Primary KPIs:** indexed pages, impressions, avg. position for cluster head terms, CTR on pages in positions 3-15, signups from organic.

---

## 1. Keyword Research & Clustering

### 1.1 Method

1. **Seed:** export GSC *Queries* (last 3 months) + competitor keywords (Ahrefs/Semrush "Organic keywords") + autocomplete/People Also Ask.
2. **Cluster** by shared top-10 SERP URLs (if two keywords return mostly the same URLs, they belong to one page).
3. **Assign intent** (see legend) and **one primary keyword per URL**. Never target the same primary keyword with two URLs.
4. **Prioritise** by: intent value x (impressions in GSC or est. volume) / difficulty. Start with pos 8-20 queries already getting impressions.

**Intent legend:** `I` informational, `C` commercial investigation, `T` transactional, `N` navigational.
**Difficulty (est.):** `Low` new-site friendly, `Med` needs strong page + internal links, `High` needs backlinks/authority first.

### 1.2 Cluster A: AI Viral Hooks (core product)

| Cluster                 | Example keywords                                                                                                   | Intent | Difficulty | Target page type                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ | ------ | ---------- | ------------------------------------------------- |
| Generator (money)       | ai hook generator, viral hook generator, reel hook generator, tiktok hook generator, youtube shorts hook generator | T / C  | Med-High   | `/hooks` + `/hooks/[platform]`                    |
| Platform hooks          | viral hooks for reels, tiktok hooks, youtube shorts hooks, linkedin hooks, instagram caption hooks                 | I / C  | Med        | `/hooks/[platform]`                               |
| Hook type x platform    | curiosity gap hooks for reels, storytelling hooks tiktok, controversial hooks shorts, question hooks instagram     | I / C  | Low-Med    | `/hooks/[platform]/[hook-type]`                   |
| Niche hooks             | fitness reel hooks, real estate tiktok hooks, saas founder linkedin hooks, relationship advice reel hooks          | I      | Low        | `/hooks/[platform]/[hook-type]/[niche]` (phase 2) |
| Hook formulas           | 10 proven hook formulas, hook frameworks for short form video, first 3 seconds hooks                               | I      | Low-Med    | Blog pillar                                       |
| Hook examples/templates | hook templates copy paste, viral hook examples 2026                                                                | I / T  | Low        | Blog + hooks pages                                |

### 1.3 Cluster B: Creator & Influencer Marketplace

| Cluster           | Example keywords                                                                          | Intent | Difficulty | Target page type                     |
| ----------------- | ----------------------------------------------------------------------------------------- | ------ | ---------- | ------------------------------------ |
| Marketplace head  | creator marketplace, influencer marketplace, hire content creators                        | C / T  | High       | `/marketplace`                       |
| Platform specific | instagram creator marketplace, youtube influencer marketplace, tiktok creator marketplace | C / T  | Med        | `/marketplace/[category]`            |
| Region specific   | influencer marketplace india, indian content creators for hire                            | C / T  | Low-Med    | `/marketplace/[category]/[location]` |
| Niche creators    | fitness influencers for brands, saas youtuber sponsorship                                 | C      | Low-Med    | `/marketplace/[category]`            |
| Creator-side      | list my creator profile, get brand deals as small creator, monetize small audience        | I / T  | Low        | Blog + `/marketplace/join`           |

### 1.4 Cluster C: AI Tools Directory & Content Generation

| Cluster                | Example keywords                                                                      | Intent | Difficulty | Target page type                                    |
| ---------------------- | ------------------------------------------------------------------------------------- | ------ | ---------- | --------------------------------------------------- |
| Directory head         | ai tools directory, best ai tools for creators                                        | C      | High       | `/tools`                                            |
| Category               | best ai video tools, best ai writing tools for content creators, ai caption generator | C      | Med-High   | `/tools/[category]`                                 |
| Tool alternatives      | [tool] alternatives, [tool] vs [tool]                                                 | C / T  | Med        | `/tools/[slug]/alternatives`, `/compare/[a]-vs-[b]` |
| How-to / informational | ai content generation guide, how to use ai for short form content                     | I      | Low-Med    | Blog                                                |
| SaaS adjacent          | ai content repurposing tool, ai script generator                                      | C / T  | Med-High   | `/tools/[category]`                                 |

### 1.5 Priority order (new-site strategy)

1. **Low-difficulty, long-tail** (hook type x platform, niche hooks, how-to blogs): quick impressions and topical authority.
2. **Page-2 queries from GSC** (pos 8-20): push to page 1 with content upgrade + internal links.
3. **Mid-difficulty commercial** (platform marketplaces, tool alternatives).
4. **High-difficulty head terms** (`ai hook generator`, `creator marketplace`): target once authority and backlinks are in place.

---

## 2. Programmatic SEO (pSEO) Architecture

### 2.1 URL structure

```
/hooks                                   -> pillar: generator + hub
/hooks/[platform]                        -> instagram-reels | tiktok | youtube-shorts | linkedin
/hooks/[platform]/[hook-type]            -> curiosity-gap | storytelling | controversial | question | ...
/marketplace                             -> hub
/marketplace/[category]                  -> youtube-creators | instagram-creators | saas-tools ...
/tools                                   -> directory hub
/tools/[category]
/blog/[slug]
```

Rules: lowercase, hyphens only, no trailing slash, no query-string variants indexed, max 3 levels deep.

### 2.2 Data model (single source of truth)

```ts
// lib/pseo/types.ts
export type Platform = {
  slug: string;            // "instagram-reels"
  name: string;            // "Instagram Reels"
  audience: string;
  idealLength: string;     // "7-30 seconds"
  hookWindow: string;      // "first 1-3 seconds"
  algoNotes: string[];     // platform-specific tips (UNIQUE per platform)
};

export type HookType = {
  slug: string;            // "curiosity-gap"
  name: string;            // "Curiosity Gap"
  psychology: string;
  formula: string;         // "You won't believe [X] until you [Y]"
};

export type PageContent = {
  platformSlug: string;
  hookTypeSlug: string;
  intro: string;           // AI-generated, human-reviewed, stored (NOT generated at request time)
  examples: { hook: string; niche: string; whyItWorks: string }[]; // min 8
  dos: string[];
  donts: string[];
  faqs: { q: string; a: string }[];                                // min 4
  related: { platformSlug: string; hookTypeSlug: string }[];
  updatedAt: string;       // ISO date
  qualityScore: number;    // computed, see 2.4
};
```

Store `PageContent` in your DB (Postgres/Supabase/Prisma) or versioned JSON under `content/pseo/`. **Generate offline** (script/CI), review, then persist. Do not call an LLM during page render: slow, non-deterministic and risky for quality.

### 2.3 Dynamic routing: `app/hooks/[platform]/[hookType]/page.tsx`

```tsx
// app/hooks/[platform]/[hookType]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageContent, getAllHookPages } from "@/lib/pseo/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, breadcrumbSchema, articleSchema } from "@/lib/seo/schema";

export const dynamicParams = false;      // unknown combos -> 404, no thin pages
export const revalidate = 60 * 60 * 24;  // ISR: refresh daily

export async function generateStaticParams() {
  const pages = await getAllHookPages({ onlyIndexable: true });
  return pages.map((p) => ({ platform: p.platformSlug, hookType: p.hookTypeSlug }));
}

type Props = { params: Promise<{ platform: string; hookType: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform, hookType } = await params;
  const page = await getPageContent(platform, hookType);
  if (!page) return {};
  return buildMetadata({
    title: `${page.hookType.name} Hooks for ${page.platform.name} (2026): ${page.examples.length}+ Viral Examples`,
    description: `Copy ${page.examples.length}+ ${page.hookType.name.toLowerCase()} hooks for ${page.platform.name}. Proven formulas, examples by niche, and a free AI hook generator.`,
    path: `/hooks/${platform}/${hookType}`,
    noindex: page.qualityScore < 70,     // quality gate (2.4)
  });
}

export default async function Page({ params }: Props) {
  const { platform, hookType } = await params;
  const page = await getPageContent(platform, hookType);
  if (!page) notFound();

  const url = `/hooks/${platform}/${hookType}`;
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Hooks", url: "/hooks" },
          { name: page.platform.name, url: `/hooks/${platform}` },
          { name: page.hookType.name, url },
        ]),
        faqSchema(page.faqs),
        articleSchema({ headline: `${page.hookType.name} Hooks for ${page.platform.name}`, url, dateModified: page.updatedAt }),
      ]} />
      <article>
        <h1>{page.hookType.name} Hooks for {page.platform.name} (2026)</h1>
        <p>{page.intro}</p>
        {/* Interactive generator pre-filled with platform + hook type */}
        {/* Examples list, formula, do/don't, FAQs, related pages, CTA */}
      </article>
    </>
  );
}
```

Also add a hub page at `/hooks/[platform]` listing all hook types for the platform (links down) and linking back to `/hooks` (links up).

### 2.4 Avoiding thin / duplicate content: the quality gate

**Principle:** Google penalises pages that differ only by swapped keywords. Every programmatic page needs **information gain**: content that exists on that page only.

Each page must have all of:

| Element                | Requirement                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| Unique intro           | 120-200 words, mentions platform-specific behaviour + hook-type psychology                       |
| Real examples          | 8+ hooks, at least 4 unique to this platform x type combination, each with a "why it works" line |
| Platform-specific tips | From `Platform.algoNotes`, not copy/pasted across hook types                                     |
| FAQ (4-6 Qs)           | At least 2 unique to the combo, with `FAQPage` JSON-LD                                           |
| Interactive element    | Generator pre-filled for this combo                                                              |
| Related links          | 4+ contextual links to sibling combos + parent hub                                               |
| Freshness              | `updatedAt` shown and updated when content changes                                               |

**Automated gate (run in CI before build):**

```ts
// lib/pseo/quality.ts
export function scorePage(p: PageContent): number {
  let s = 0;
  const words = (t: string) => t.trim().split(/\s+/).length;
  if (words(p.intro) >= 120) s += 25;
  if (p.examples.length >= 8) s += 25;
  if (p.faqs.length >= 4) s += 15;
  if (p.dos.length >= 3 && p.donts.length >= 3) s += 10;
  if (p.related.length >= 4) s += 10;
  // uniqueness: penalise if intro is too similar to another page's intro
  s += p.uniquenessRatio >= 0.6 ? 15 : 0;   // computed via shingle/Jaccard similarity across pages
  return s;
}
```

- **score >= 70** -> indexable, included in sitemap.
- **score < 70** -> `noindex, follow`, excluded from sitemap, fix before release.
- Launch in **batches** (start with the 10-15 best combos), watch GSC indexing, then expand.
- Never publish combos that make no sense (e.g. a hook type that does not suit a platform). `dynamicParams = false` + explicit allow-list.

**Unique-content generation pipeline (offline):**

1. Feed the LLM structured inputs (platform facts, hook psychology, 10 real high-performing hooks you collected).
2. Prompt for intro, examples, FAQs as JSON. Ban generic phrases ("In today's fast-paced world").
3. Run similarity check against existing pages. Regenerate above threshold.
4. Human review the first batch; spot check afterwards.
5. Save to DB with `updatedAt`.

---

## 3. Technical SEO & Metadata Automation

### 3.1 Central SEO config

```ts
// lib/seo/config.ts
export const SITE = {
  name: "HookTos AI",
  url: "https://hooktos.com",          // canonical host (non-www; change here if you choose www)
  year: 2026,
  twitter: "@hooktos",                 // set your real handle
  defaultOg: "/og/default.png",
};
```

### 3.2 Metadata builder (title, OG, Twitter, canonical)

```ts
// lib/seo/metadata.ts
import type { Metadata } from "next";
import { SITE } from "./config";

type Input = {
  title: string;
  description: string;
  path: string;          // "/hooks/tiktok/storytelling"  (always hyphenated, no trailing slash)
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
};

export function buildMetadata({ title, description, path, image, noindex, type = "website" }: Input): Metadata {
  const url = `${SITE.url}${path}`;
  const og = `${SITE.url}${image ?? SITE.defaultOg}`;
  const fullTitle = title.length > 58 ? title.slice(0, 57) + "…" : title;   // keep ≤ ~60 chars
  const desc = description.length > 155 ? description.slice(0, 154) + "…" : description;

  return {
    metadataBase: new URL(SITE.url),
    title: fullTitle,
    description: desc,
    alternates: { canonical: url },          // self-referencing canonical on EVERY page
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title: fullTitle, description: desc, url, siteName: SITE.name, type, images: [{ url: og, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc, images: [og], site: SITE.twitter },
  };
}
```

### 3.3 Title & meta description formulas

| Page type            | Title formula (≤60 chars)                               | Meta description (140-155 chars)                                                                       |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Hook platform x type | `{Type} Hooks for {Platform} (2026): {N}+ Examples`     | `Copy {N}+ {type} hooks for {platform}. Proven formulas, niche examples and a free AI hook generator.` |
| Blog listicle        | `{N} Viral Hooks for Reels That Work in 2026`           | `Steal {N} tested hooks, with templates and examples. Free AI generator included.`                     |
| Marketplace category | `Hire {Category} Creators: Verified Marketplace (2026)` | `Browse verified {category} creators, compare rates and contact them directly. Free to list.`          |
| Tools directory      | `Best AI {Category} Tools in 2026 (Compared)`           | `Compare the top AI {category} tools by pricing, features and use case. Updated {Month} 2026.`         |
| Comparison           | `{A} vs {B} (2026): Which Is Better?`                   | `Side-by-side comparison of {A} and {B}: features, pricing, pros and cons.`                            |

**Power words** (use sparingly, one per title): *Proven, Free, Copy-Paste, Ultimate, Tested, Updated, Examples, Templates*. Include the year only where freshness matters, and update it yearly via the `SITE.year` constant.

### 3.4 Clean slugs (hyphens only)

```ts
// lib/seo/slug.ts
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[_\s]+/g, "-")          // underscores and spaces -> hyphen
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
```

Use `slugify()` when **creating** content (CMS hook / seed script) and validate in CI that no stored slug contains `_`.

### 3.5 Redirect legacy URLs (fixes duplicates found in GSC)

**a) Underscore -> hyphen and host normalisation in middleware:**

```ts
// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  let changed = false;

  // 1. underscores -> hyphens in path
  if (url.pathname.includes("_")) {
    url.pathname = url.pathname.replace(/_/g, "-");
    changed = true;
  }
  // 2. strip trailing slash (except root)
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
    changed = true;
  }
  // 3. force lowercase
  const lower = url.pathname.toLowerCase();
  if (lower !== url.pathname) { url.pathname = lower; changed = true; }

  if (changed) return NextResponse.redirect(url, 301);
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
```

**b) Host canonicalisation (www / http) in `next.config.js`:** *(skip if your host/CDN, e.g. Vercel domain settings, already redirects)*

```js
// next.config.js
module.exports = {
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.hooktos.com" }],
        destination: "https://hooktos.com/:path*",
        permanent: true,
      },
    ];
  },
};
```

> Pick **one** canonical host (`https://hooktos.com` or `https://www.hooktos.com`) and use it in `SITE.url`, redirects, sitemap, canonicals and GSC property. GSC showed all three variants today.

### 3.6 Sitemap automation

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/config";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllHookPages, getAllPlatforms } from "@/lib/pseo/data";
import { getMarketplaceCategories } from "@/lib/marketplace";
import { getToolCategories } from "@/lib/tools";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, hookPages, platforms, mCats, tCats] = await Promise.all([
    getAllBlogPosts(),
    getAllHookPages({ onlyIndexable: true }),   // quality-gated
    getAllPlatforms(),
    getMarketplaceCategories(),
    getToolCategories(),
  ]);

  const u = (path: string, lastModified: Date | string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) =>
    ({ url: `${SITE.url}${path}`, lastModified, priority, changeFrequency });

  const now = new Date();
  return [
    u("/", now, 1.0, "weekly"),
    u("/hooks", now, 0.9, "weekly"),
    u("/marketplace", now, 0.9, "weekly"),
    u("/tools", now, 0.8, "weekly"),
    u("/blog", now, 0.8, "daily"),
    ...platforms.map((p) => u(`/hooks/${p.slug}`, now, 0.8, "weekly")),
    ...hookPages.map((h) => u(`/hooks/${h.platformSlug}/${h.hookTypeSlug}`, h.updatedAt, 0.6, "monthly")),
    ...mCats.map((c) => u(`/marketplace/${c.slug}`, c.updatedAt, 0.7, "weekly")),
    ...tCats.map((c) => u(`/tools/${c.slug}`, c.updatedAt, 0.7, "weekly")),
    ...posts.map((p) => u(`/blog/${p.slug}`, p.updatedAt, 0.7, "monthly")),
  ];
}
```

If total URLs may exceed 50,000, use `generateSitemaps()` to split (e.g. one sitemap per section) and reference them from `robots.ts`.

```ts
// app/robots.ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/", "/account", "/admin"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
```

> `/dashboard` is showing impressions in GSC. If it requires login, set `robots: noindex` on it and keep it out of the sitemap.

### 3.7 Structured data helpers

```tsx
// components/seo/JsonLd.tsx
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
```

```ts
// lib/seo/schema.ts
import { SITE } from "./config";

export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE.url}${it.url}` })),
});

export const articleSchema = (a: { headline: string; url: string; dateModified: string; datePublished?: string }) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.headline,
  mainEntityOfPage: `${SITE.url}${a.url}`,
  dateModified: a.dateModified,
  datePublished: a.datePublished ?? a.dateModified,
  author: { "@type": "Organization", name: SITE.name },
  publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: `${SITE.url}/logo.png` } },
});

export const softwareAppSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HookTos AI Viral Hook Generator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: `${SITE.url}/hooks`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },   // adjust to real pricing
});
```

Place `Organization` + `WebSite` schema in the root layout, `SoftwareApplication` on `/hooks`, `ItemList` on directory/marketplace category pages.

### 3.8 Performance (desktop position is weak)

- Use `next/image`, set `priority` only on the LCP image, define `sizes`.
- `next/font` with `display: swap`.
- Keep the generator widget as a client component loaded with `dynamic(() => import(...))`; keep all SEO text server-rendered.
- Target: LCP < 2.5s, INP < 200ms, CLS < 0.1 on both mobile and desktop (check GSC *Core Web Vitals*).

---

## 4. Content Optimisation & Internal Linking Engine

### 4.1 Blog post blueprint (for top-10 rankings and CTR)

1. **Title:** primary keyword near the start + number/year/benefit (see 3.3).
2. **Intro (≤100 words):** answer the query in the first 2-3 sentences (feature-snippet friendly), then promise what follows.
3. **Table of contents** with anchor links (earns sitelinks/jump links).
4. **Body:** H2 per sub-intent (what / how / examples / mistakes / tools). Short paragraphs, lists, tables.
5. **Original value:** your own data, tested hook examples, screenshots from the tool, a downloadable template.
6. **Inline CTA** after the first value block: "Generate hooks for your niche" -> `/hooks/...`.
7. **FAQ section** (3-5 real questions from PAA) + `FAQPage` schema.
8. **Author + updated date** (E-E-A-T), update the post every 3-6 months.
9. **Related posts + related hook pages** block at the bottom.
10. **Word count** driven by SERP competitors (typically 1,200-2,500 for pillars), not by padding.

**Content structure:** Pillar -> clusters.

```
Pillar: "Viral Hooks for Short-Form Video: Complete Guide (2026)"   -> targets "viral hooks"
  ├─ 10 Viral Hooks for Reels                  -> /hooks/instagram-reels
  ├─ 10 Proven Content Hook Formulas           -> /hooks
  ├─ YouTube Shorts Hooks That Keep Viewers    -> /hooks/youtube-shorts
  ├─ How to Monetize a Small Audience          -> /marketplace/join
  └─ Short-Form Content Strategy               -> /hooks + /marketplace
```

### 4.2 Category/hub page blueprint (e.g. `/marketplace/[category]`, `/tools/[category]`)

- H1 with keyword + year; 150-300 words unique intro above the listing.
- Filterable list that is **crawlable** (real `<a href>` links, paginated with `?page=` canonicalised to self or use "Load more" with real URLs).
- Comparison table (price, best for, rating) for tools.
- FAQ block + `ItemList` schema.
- "Related categories" links and a CTA ("List your profile" / "Try the hook generator").

### 4.3 CTR optimisation loop (weekly, 20 minutes)

1. GSC -> Performance -> Pages. Filter: impressions > 40, CTR < 3%, position < 15.
2. Rewrite title/meta using formulas in 3.3 (add number, year, benefit, "Free").
3. Log change + date in a tracking sheet.
4. Re-check after 14-21 days; keep winners, revert losers.

### 4.4 Automated internal linking engine

**Goal:** every blog post links to the relevant conversion pages (`/hooks/...`, `/marketplace/...`) using keyword-rich anchors, without manual work or over-optimisation.

**Step 1: link map (config):**

```ts
// lib/seo/linkMap.ts
export type LinkRule = {
  keywords: string[];     // phrases to look for (lowercase)
  href: string;           // target URL
  anchors?: string[];     // optional anchor variants (rotate to avoid exact-match spam)
  priority: number;       // higher wins when overlapping
};

export const LINK_RULES: LinkRule[] = [
  { keywords: ["viral hooks for reels", "reel hooks", "instagram reels hooks"], href: "/hooks/instagram-reels", priority: 10 },
  { keywords: ["tiktok hooks", "tiktok hook"], href: "/hooks/tiktok", priority: 10 },
  { keywords: ["youtube shorts hooks", "shorts hooks"], href: "/hooks/youtube-shorts", priority: 10 },
  { keywords: ["curiosity gap"], href: "/hooks/instagram-reels/curiosity-gap", priority: 8 },
  { keywords: ["hook generator", "ai hook generator"], href: "/hooks", priority: 9 },
  { keywords: ["creator marketplace", "influencer marketplace", "hire creators"], href: "/marketplace", priority: 9 },
  { keywords: ["youtube creators", "youtube influencers"], href: "/marketplace/youtube-creators", priority: 8 },
  { keywords: ["ai tools directory", "ai tools for creators"], href: "/tools", priority: 7 },
];
```

**Step 2: auto-linker (runs at build/render on Markdown/MDX content):**

```ts
// lib/seo/autoLink.ts
import { LINK_RULES } from "./linkMap";

const MAX_LINKS_PER_POST = 6;
const MAX_PER_TARGET = 1;      // link each target once per post

export function autoLink(markdown: string, currentPath: string): string {
  const used = new Map<string, number>();
  let total = 0;
  const rules = [...LINK_RULES].sort((a, b) => b.priority - a.priority);

  // split on code blocks, existing links and headings: do not touch them
  const parts = markdown.split(/(```[\s\S]*?```|\[[^\]]*\]\([^)]*\)|^#{1,6} .*$)/gm);

  return parts.map((part, i) => {
    if (i % 2 === 1) return part;                     // protected segments
    let text = part;
    for (const rule of rules) {
      if (total >= MAX_LINKS_PER_POST) break;
      if (rule.href === currentPath) continue;        // no self links
      if ((used.get(rule.href) ?? 0) >= MAX_PER_TARGET) continue;
      for (const kw of rule.keywords) {
        const re = new RegExp(`\\b(${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "i");
        if (re.test(text)) {
          text = text.replace(re, `[$1](${rule.href})`);
          used.set(rule.href, (used.get(rule.href) ?? 0) + 1);
          total++;
          break;
        }
      }
    }
    return text;
  }).join("");
}
```

Use in the blog renderer: `const content = autoLink(post.markdown, `/blog/${post.slug}`)`.

**Step 3: structural links (always present, not keyword-dependent):**

```tsx
// components/seo/RelatedLinks.tsx
import Link from "next/link";

export function RelatedLinks({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title} className="mt-12 rounded-xl border p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.href}><Link href={l.href} className="underline">{l.label}</Link></li>
        ))}
      </ul>
    </nav>
  );
}
```

Add to every blog post: a **"Try it"** CTA card (`/hooks`), a **"Find creators"** card (`/marketplace`) and a **related hook pages** block chosen by tag match (`post.tags` -> hook platform/type).

**Linking rules (policy):**

- Flow: blog -> hook/marketplace pages (conversion) and hook pages -> blog (supporting guides) and sibling hook pages.
- Every programmatic page: 1 link up to its hub, 4+ links to siblings, 1 link to a relevant blog post. No orphan pages: every URL must be reachable within 3 clicks from home.
- Vary anchor text; descriptive anchors, never "click here".
- Use `<Link>` (real `<a href>`), never `onClick` navigation for SEO links.
- Breadcrumbs on all nested pages (UI + schema).

---

## 5. Two-Week Execution Checklist

### Week 1: Fix foundations, quick wins

**Day 1: Duplicates & canonicals**

- [ ] Decide canonical host (`https://hooktos.com` vs `www`) and update `SITE.url`.
- [ ] Add host redirect (`next.config.js` or domain settings) and `middleware.ts` (underscore -> hyphen, lowercase, no trailing slash) with 301s.
- [ ] Audit existing blog slugs; rename any with `_` to hyphen versions in DB/CMS.
- [ ] Add `buildMetadata()` and apply `alternates.canonical` globally.
- [ ] Deploy; verify with `curl -I` that old URLs return 301 to the new ones.

**Day 2: Sitemap, robots, indexing**

- [ ] Add `app/sitemap.ts` and `app/robots.ts`; confirm `/sitemap.xml` lists only canonical, indexable URLs.
- [ ] `noindex` + disallow `/dashboard`, `/account`, `/api`.
- [ ] Submit sitemap in GSC; use *URL Inspection* on top 10 pages; check *Page indexing* for "Discovered / Crawled - not indexed".
- [ ] In GSC, remove old/duplicate URLs if they linger (Removals tool, after 301s are live).

**Day 3: Metadata rewrite (CTR)**

- [ ] Rewrite title + meta for: `/blog/10-viral-hooks-for-reels`, `/blog/10-proven-content-hook-formulas...`, `/blog/monetize-a-small-audience`, `/changelog`, homepage (include "HookTos" brand).
- [ ] Add OG images (1200x630) for the top pages; verify with a social card validator.
- [ ] Record before/after in a tracking sheet (date, old title, new title, CTR baseline).

**Day 4: Structured data & schema**

- [ ] Add `JsonLd` component and schema helpers.
- [ ] Add `Organization` + `WebSite` in root layout, `SoftwareApplication` on `/hooks`, `Article` + `FAQPage` + `BreadcrumbList` on blog posts.
- [ ] Validate with Google Rich Results Test and fix warnings.

**Day 5: Pillar content upgrade**

- [ ] Expand `/blog/10-viral-hooks-for-reels` (target pos 22 -> top 10): TOC, 20+ examples, templates, FAQ, inline CTA to `/hooks/instagram-reels`.
- [ ] Add internal links from 3-5 related posts pointing to it.

**Day 6: Internal linking engine**

- [ ] Implement `linkMap.ts`, `autoLink.ts`, `RelatedLinks` and CTA cards in the blog layout.
- [ ] Run on all existing posts; manually review diff for bad anchors.
- [ ] Ensure `/marketplace` and `/hooks` are linked from header and footer.

**Day 7: Review & measure**

- [ ] Check GSC *Pages* + *Indexing*: duplicates resolving, sitemap read successfully.
- [ ] Run Lighthouse / PageSpeed on home, `/hooks`, one blog post (mobile + desktop). Note LCP/INP/CLS issues for week 2.

### Week 2: pSEO scale-up & marketplace

**Day 8: pSEO data model & quality gate**

- [ ] Create `lib/pseo/types.ts`, data access functions and `scorePage()`.
- [ ] Audit the ~35 existing `/hooks/...` pages: score each; mark `< 70` as `noindex` until improved.
- [ ] Define allow-list of valid platform x hook-type combinations.

**Day 9: Content generation pipeline**

- [ ] Build offline script to generate intro, examples, FAQs (structured JSON) per combo; add similarity check.
- [ ] Generate and review the **top 12 combos** (e.g. instagram-reels, tiktok, youtube-shorts x curiosity-gap, storytelling, question, controversial).

**Day 10: Dynamic route & templates**

- [ ] Implement `app/hooks/[platform]/page.tsx` (hub) and `app/hooks/[platform]/[hookType]/page.tsx` with `generateStaticParams`, `generateMetadata`, JSON-LD, related links, generator pre-fill.
- [ ] Set `dynamicParams = false`; verify 404 for invalid combos.

**Day 11: Marketplace category pages**

- [ ] For `/marketplace/content-creators`, `/youtube-creators`, `/saas-tools`, `/ai-tools`: add 200-400 word unique intro, FAQ, crawlable listings, `ItemList` schema, related categories.
- [ ] Add `/marketplace/join` page targeting creator-side queries ("list my creator profile").

**Day 12: Tools directory structure**

- [ ] Create `/tools` hub and `/tools/[category]` template with comparison table, FAQ schema.
- [ ] Draft 3 comparison pages (`/compare/[a]-vs-[b]`) for tools your users already ask about.

**Day 13: Performance & international targeting**

- [ ] Fix top CWV issues from Day 7 (images, fonts, JS bundle size, lazy-load generator).
- [ ] Decide market focus: US-first vs India-first. If India: add "for Indian creators" pages and content, consider `hreflang` only if you publish separate language versions (e.g. Hindi/Marathi).

**Day 14: Launch batch & set up monitoring**

- [ ] Publish batch 1 of pSEO pages (quality score >= 70), confirm in sitemap, request indexing for the hubs.
- [ ] Set up weekly GSC review: CTR loop (section 4.3), new queries at pos 8-20, indexing report.
- [ ] Plan next 2 weeks: batch 2 pSEO (30+ pages), 4 blog posts from cluster map, 5 backlink outreach targets (creator communities, AI tool directories, newsletter mentions, product launches).

### Ongoing (monthly)

- [ ] Re-run keyword clustering with new GSC data; add or merge pages.
- [ ] Refresh the top 5 posts (new examples, updated year, new FAQ).
- [ ] Prune or merge pages with zero impressions after 90 days.
- [ ] Track KPIs: indexed pages, impressions, avg. position (head terms), CTR, organic signups.

---

## Appendix A: Pre-publish SEO QA (per page)

- [ ] One H1 with primary keyword; logical H2/H3 hierarchy
- [ ] Title ≤ 60 chars, meta description 140-155 chars
- [ ] Self-referencing canonical, hyphenated lowercase slug
- [ ] Unique intro + examples + FAQ (quality score >= 70 for pSEO)
- [ ] Schema validated (FAQ / Breadcrumb / Article / SoftwareApplication)
- [ ] 3+ internal links in and 3+ out; reachable within 3 clicks
- [ ] OG/Twitter image present
- [ ] Images with descriptive `alt`, `next/image` with dimensions
- [ ] In sitemap (if indexable) / excluded (if noindex)
- [ ] Mobile and desktop Core Web Vitals pass

## Appendix B: Suggested file layout

```
app/
  sitemap.ts
  robots.ts
  hooks/
    page.tsx
    [platform]/page.tsx
    [platform]/[hookType]/page.tsx
  marketplace/[category]/page.tsx
  tools/[category]/page.tsx
  blog/[slug]/page.tsx
components/seo/
  JsonLd.tsx
  RelatedLinks.tsx
lib/seo/
  config.ts  metadata.ts  schema.ts  slug.ts  linkMap.ts  autoLink.ts
lib/pseo/
  types.ts  data.ts  quality.ts
scripts/
  generate-pseo-content.ts
  check-slugs.ts
middleware.ts
docs/
  seo-strategy-guide.md
```
