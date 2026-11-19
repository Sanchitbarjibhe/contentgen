# SEO Implementation Notes

## Phase 1 decisions

- Canonical host: `https://hooktos.com`, following the guide's default. The existing `www` host is redirected to non-www in `next.config.mjs`.
- Next 16 `proxy.ts` returns 301 responses for underscores, uppercase paths, and trailing slashes. Static files, `_next`, and `/api` are excluded; the existing anonymous-ID proxy behavior is preserved.
- The guide file is named `docs/SEO/Seo strategy guide.md` in this checkout; it was used as the specification.
- Existing blog data already normalizes underscore filenames and frontmatter slugs. Middleware handles legacy underscore URLs as 301 redirects to hyphenated canonical paths.
- Central metadata now uses `lib/seo/metadata.ts` for the home, blog, blog post, marketplace, marketplace category, hooks, changelog, about, audio, hashtag, and claim-spot pages.

## Phase 1 TODO

- Confirm the real Twitter/X site handle; `@HookTosai` is retained pending confirmation.
- Replace or add 1200x630 page-specific OG artwork.
- Supply final marketplace category copy.
- Replace any TODO pricing/schema values once real pricing is verified.

## Phase 2 decisions

- Canonical sitemap and robots URLs use `https://hooktos.com`.
- `/dashboard`, `/api/`, `/account`, `/admin`, `/sign-in`, `/sign-up`, and `/claim-spot` are excluded or noindexed as auth/private routes.
- Existing Organization and WebSite JSON-LD remains in the root layout and now uses the non-www canonical host.
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

## Phase 4 TODO

- Replace each `Placeholder final copy:` marketplace intro with final 200-400 word category copy.

## Phase 4 validation

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run seo:check-slugs`: passed.
- `npm run build`: route compilation and static generation completed for 115 routes, then Next.js 16.4.0 exited on the security-vulnerability gate.
