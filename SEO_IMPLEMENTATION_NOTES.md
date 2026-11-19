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
