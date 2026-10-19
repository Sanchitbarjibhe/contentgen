// app/robots.ts  (HookTos AI — v2)
// Next.js serves it automatically at https://www.hooktos.com/robots.txt
//
// Strategy: HookTos wants maximum visibility in Google AND in AI answers
// (ChatGPT, Claude, Gemini, Perplexity). So every search bot, every AI search bot,
// every AI "user fetch" bot, and the AI training bots are ALLOWED on public pages.
// Only private/app areas are blocked, for everyone.
//
// What changed vs v1:
//  - Sitemap URL fixed: v1 pointed to https://hooktos.com (non-www) while the site
//    canonical is https://www.hooktos.com — that caused an extra redirect for crawlers.
//  - Named AI crawlers explicitly so you can switch any of them off in one place.
//  - Private paths are repeated for every named bot (a bot that has its own group
//    ignores the "*" group, so the blocks must be repeated).

import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.hooktos.com';

// Private areas — never crawl. Edit to match your real route names.
const PRIVATE_PATHS = [
  '/api/',
  '/admin/',
  '/dashboard/private/',
  // Suggested (uncomment if these routes exist and are login-only):
  // '/dashboard/',
  // '/checkout/',
  // '/account/',
  // '/auth/',
];

// AI crawlers we WANT (visibility in AI answers + brand knowledge in models).
const AI_ALLOWED_BOTS = [
  // OpenAI
  'OAI-SearchBot',    // ChatGPT search results
  'ChatGPT-User',     // fetches a page when a ChatGPT user asks
  'GPTBot',           // model training — allowed so models "know" HookTos
  // Anthropic
  'Claude-SearchBot', // Claude search index
  'Claude-User',      // fetches a page when a Claude user asks
  'ClaudeBot',        // model training
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Google / Apple / others
  'Google-Extended',    // Gemini & Vertex AI use of content (does NOT affect Google Search)
  'Applebot-Extended',  // Apple Intelligence
  'meta-externalagent', // Meta AI
  'Amazonbot',
  'DuckAssistBot',
  'CCBot',              // Common Crawl — feeds many open models
];

// Bots to BLOCK completely. Empty by default (max visibility).
// Example: add 'Bytespider' if server logs show it overloading the site.
const BLOCKED_BOTS: string[] = [];

export default function robots(): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots['rules'] = [
    // 1. Everyone (Googlebot, Bingbot, etc.)
    {
      userAgent: '*',
      allow: '/',
      disallow: PRIVATE_PATHS,
    },
    // 2. Named AI crawlers — same access as search engines
    {
      userAgent: AI_ALLOWED_BOTS,
      allow: ['/', '/llms.txt'],
      disallow: PRIVATE_PATHS,
    },
  ];

  // 3. Fully blocked bots (only added if the list is not empty)
  if (BLOCKED_BOTS.length > 0) {
    rules.push({ userAgent: BLOCKED_BOTS, disallow: '/' });
  }

  return {
    rules,
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
