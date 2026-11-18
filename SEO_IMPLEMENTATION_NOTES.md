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
