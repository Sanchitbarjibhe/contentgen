# SEO Implementation Notes

## Phase 1 decisions

- Canonical host: `https://www.hooktos.com`, matching the crawled 200 host. Keep the apex-to-www permanent redirect configured at the deployment/domain level.
- Next 16 `proxy.ts` returns 301 responses for underscores, uppercase paths, and trailing slashes. Static files, `_next`, and `/api` are excluded; the existing anonymous-ID proxy behavior is preserved.
- The guide file is named `docs/SEO/Seo strategy guide.md` in this checkout; it was used as the specification.
- Existing blog data already normalizes underscore filenames and frontmatter slugs. Middleware handles legacy underscore URLs as 301 redirects to hyphenated canonical paths.
- Central metadata now uses `lib/seo/metadata.ts` for the home, blog, blog post, marketplace, marketplace category, hooks, changelog, about, audio, hashtag, and claim-spot pages.

## Phase 1 follow-up completion

- The `@HookTosai` handle matches the existing HookTos X profile.
- Added a generated 1200x630 Open Graph image at `/opengraph-image` and updated default metadata and article-schema fallbacks to use it.
- Premium pricing is shown as $9.99/month in the existing paywall. The `/hooks` page and SoftwareApplication offers use that same amount; no other unverified paid tiers are advertised.

## Phase 2 decisions

- Canonical sitemap and robots URLs use `https://www.hooktos.com`.
- `/dashboard` is excluded from the sitemap and returns `noindex, follow`; it must remain crawlable so search engines can read that directive. Internal APIs and auth routes remain blocked or noindexed.
- Existing Organization and WebSite JSON-LD remains in the root layout and uses the www canonical host.
- `SoftwareApplication` JSON-LD was moved to the existing/new `/hooks` hub.
- Reused the existing JSON-LD renderer for `components/seo/JsonLd.tsx`.
- Blog posts include Article, FAQPage when applicable, HowTo where detected, and BreadcrumbList JSON-LD.
- Tool categories are omitted because no `/tools` routes exist in this checkout.

## Phase 2 validation

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run seo:check-slugs`: passed.
- `npm run build`: route compilation and static generation completed successfully, then Next.js 16.4.0 exited on the runtime security-vulnerability gate. Upgrade remains a separate follow-up.

## Phase 3 decisions

- Existing JSON hook data is the pSEO source of truth; no database migration or request-time LLM generation was added.
- Existing hook slugs remain unchanged. The quality gate indexes pages with a score of at least 70 and excludes lower-quality pages from sitemap/static params.
- Platform and hook metadata, dos/donts, FAQs, examples, freshness, JSON-LD, breadcrumbs, and sibling links are rendered server-side.
- The offline generator requires `OPENAI_API_KEY` for live generation and supports `--dry-run`. It has not been run against production data.

## Phase 3 pSEO audit

| slug | score | failing checks |
| --- | ---: | --- |
| /hooks/tiktok/curiosity | 85 | uniqueness<0.6 |
| /hooks/tiktok/controversial | 85 | uniqueness<0.6 |
| /hooks/tiktok/statistics-based | 85 | uniqueness<0.6 |
| /hooks/tiktok/storytelling | 85 | uniqueness<0.6 |
| /hooks/tiktok/problem-solution | 85 | uniqueness<0.6 |
| /hooks/tiktok/negativity-bias | 85 | uniqueness<0.6 |
| /hooks/tiktok/question-based | 85 | uniqueness<0.6 |
| /hooks/instagram-reels/curiosity | 85 | uniqueness<0.6 |
| /hooks/instagram-reels/controversial | 85 | uniqueness<0.6 |
| /hooks/instagram-reels/statistics-based | 85 | uniqueness<0.6 |
| /hooks/instagram-reels/storytelling | 85 | uniqueness<0.6 |
| /hooks/instagram-reels/problem-solution | 85 | uniqueness<0.6 |
| /hooks/instagram-reels/negativity-bias | 85 | uniqueness<0.6 |
| /hooks/instagram-reels/question-based | 85 | uniqueness<0.6 |
| /hooks/youtube-shorts/curiosity | 85 | uniqueness<0.6 |
| /hooks/youtube-shorts/controversial | 85 | uniqueness<0.6 |
| /hooks/youtube-shorts/statistics-based | 85 | uniqueness<0.6 |
| /hooks/youtube-shorts/storytelling | 85 | uniqueness<0.6 |
| /hooks/youtube-shorts/problem-solution | 85 | uniqueness<0.6 |
| /hooks/youtube-shorts/negativity-bias | 85 | uniqueness<0.6 |
| /hooks/youtube-shorts/question-based | 85 | uniqueness<0.6 |
| /hooks/linkedin/curiosity | 85 | uniqueness<0.6 |
| /hooks/linkedin/controversial | 85 | uniqueness<0.6 |
| /hooks/linkedin/statistics-based | 85 | uniqueness<0.6 |
| /hooks/linkedin/storytelling | 85 | uniqueness<0.6 |
| /hooks/linkedin/problem-solution | 85 | uniqueness<0.6 |
| /hooks/linkedin/negativity-bias | 85 | uniqueness<0.6 |
| /hooks/linkedin/question-based | 85 | uniqueness<0.6 |
| /hooks/twitter-x/curiosity | 85 | uniqueness<0.6 |
| /hooks/twitter-x/controversial | 85 | uniqueness<0.6 |
| /hooks/twitter-x/statistics-based | 85 | uniqueness<0.6 |
| /hooks/twitter-x/storytelling | 85 | uniqueness<0.6 |
| /hooks/twitter-x/problem-solution | 85 | uniqueness<0.6 |
| /hooks/twitter-x/negativity-bias | 85 | uniqueness<0.6 |
| /hooks/twitter-x/question-based | 85 | uniqueness<0.6 |

## Phase 3 validation

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run seo:check-slugs`: passed.
- `npm run seo:audit-pseo`: showed all 35 existing combinations at score 85, with uniqueness content remaining an implementation TODO.
- `npm run seo:generate-pseo:dry-run`: produced valid structured sample JSON and did not write production data.
- `npm run build`: compiled, type-checked, and statically generated 114 routes, then exited on the Next.js 16.4.0 security-vulnerability gate.

## Phase 4 decisions

- Added build-time Markdown auto-linking with a six-link maximum, one link per target, heading/code/existing-link protection, and no self-links.
- Blog posts now have visible breadcrumbs, related HookTos resources, and existing Try HookTos/Marketplace CTA cards.
- Marketplace category copy uses `introText` fields in the existing `marketplaceCategories` TypeScript data source. Prisma was not changed because category definitions are static, versioned configuration in this repository.
- Category pages now emit BreadcrumbList, FAQPage, and ItemList JSON-LD and include related-category links.
- The `/tools` hub is a real static route linking existing `/hooks`, `/hashtag`, and `/audio` tools. No fabricated tool-category listings or pricing were added.

## Phase 4 follow-up completion

- Replaced all seven placeholder marketplace category introductions with distinct, factual copy of 200-400 words each. The four requested categories (content creators, YouTube creators, SaaS tools, AI tools) are covered, as are Instagram creators, marketing agencies, and startups.
- Category introductions render as separate paragraphs for readability.

## Phase 4 validation

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run seo:check-slugs`: passed.
- `npm run build`: route compilation and static generation completed for 115 routes, then Next.js 16.4.0 exited on the security-vulnerability gate.

## Phase 5 decisions

- The existing `HookPreview` client widget is now lazy-loaded with `next/dynamic`; H1, intro, examples, FAQ, JSON-LD, and related links remain server-rendered.
- Inter keeps `display: "swap"` through `next/font/google`.
- The navbar logo uses `next/image` with an explicit `44px` `sizes` value.
- The reusable `OptimizedImage` helper remains lazy-loaded and requires meaningful alt text. There were no existing page-level content images identified that use priority loading.

## Phase 5 validation

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run seo:check-slugs`: passed.
- `npm run build`: compiled and statically generated 115 routes, then Next.js 16.4.0 exited on the security-vulnerability gate. Next.js was subsequently upgraded to 16.4.6 in a separate follow-up.
- Build route report: no unusually large route group or route-specific bundle size was reported in the terminal output.

## Post-phase completion

- Next.js is upgraded to 16.4.6 to clear the security-vulnerability build gate. The updated production build and current source changes are revalidated below.
- Marketplace intros no longer contain placeholder text; each category description is 200-400 words, avoids claims of vetting or guaranteed outcomes, and explains that listings are for discovery.
- Added a 1200x630 generated social-sharing image. Twitter handle and visible Premium price are aligned with existing product information.
- Lighthouse/PageSpeed was run against the public homepage before these latest local changes. It reported mobile scores of 100 for Performance, Accessibility, Best Practices, and SEO (LCP 1.2s, TBT 20ms, CLS 0). The deployed page did not yet match this checkout, so this is not a measurement of the new SEO changes.
- Post-upgrade main-checkout verification:
  - `npm run lint`: passed.
  - `npx tsc --noEmit`: passed.
  - `npm run seo:check-slugs`: passed.
  - `npm run build`: passed on Next.js 16.4.6; generated all 116 static pages, including `/opengraph-image`.
  - Production smoke test: `/opengraph-image` returned HTTP 200 with `image/png` and a valid PNG signature; `/hooks` and `/marketplace/ai-tools` returned HTTP 200 and rendered the expected metadata, price text, and category introduction.
- The pSEO audit still reports `uniqueness<0.6` on all 35 pages; each scores 85 and remains above the 70 indexing threshold. This is an editorial differentiation follow-up, not a build or quality-threshold failure.
- Remaining checks require deployment: test redirects, sitemap/robots, and structured data against the deployed version, then run Lighthouse on the updated routes and inspect Google Search Console.

## Final verification commands

- `curl -I https://hooktos.com/` — expected permanent redirect to `https://www.hooktos.com/`.
- `curl -I https://www.hooktos.com/blog/how-to-hook-viewers-in-3-seconds` — expected permanent redirect to `/blog/short-form-content-strategy`.
- Open `https://www.hooktos.com/sitemap.xml` and confirm it contains canonical indexable URLs only.
- Open `https://www.hooktos.com/robots.txt` and confirm it references the www sitemap and does not disallow `/dashboard`.
- Validate blog, hook, FAQ, and marketplace JSON-LD in Google Rich Results Test after deployment.
- Run Lighthouse mobile and desktop reports for `/`, `/hooks`, `/hooks/instagram-reels/curiosity`, `/blog/10-viral-hooks-for-reels`, `/marketplace/ai-tools` after deployment.
