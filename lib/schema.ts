// lib/schema.ts  (HookTos AI — v1)
// All JSON-LD structured data for HookTos AI lives here.
//
// IMPORTANT before going live:
//  - Replace every value marked TODO with real data.
//  - Never add ratings, reviews or prices that are not real and visible on the page —
//    Google can issue a manual penalty for fake structured data.

const SITE = 'https://www.hooktos.com';
const ORG_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;
const APP_ID = `${SITE}/hooks#software`;

const ONE_LINE_DESCRIPTION =
  'HookTos AI is an AI hook generator for Instagram Reels, YouTube Shorts and TikTok. It writes 10 psychology-backed hooks per video with retention scores, finds trending Instagram audio and suggests niche hashtags.';

// ---------------------------------------------------------------------------
// Organization — tells Google and LLMs who owns the site (fixes "Identity Schema")
// ---------------------------------------------------------------------------
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'HookTos AI',
  alternateName: ['HookTos', 'Hooktos AI'],
  url: SITE,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE}/android-chrome-512x512.png`,
    width: 512,
    height: 512,
  },
  description: ONE_LINE_DESCRIPTION,
  email: 'support@hooktos.com', // TODO: real support email
  sameAs: [
    // Every official profile. Only list profiles that exist.
    'https://x.com/HookTosai',
    // 'https://www.instagram.com/hooktos.ai',      // TODO
    // 'https://www.youtube.com/@hooktosai',         // TODO
    // 'https://www.linkedin.com/company/hooktos-ai',// TODO
    // 'https://www.producthunt.com/products/hooktos-ai', // TODO after launch
  ],
};

// ---------------------------------------------------------------------------
// WebSite — site name in Google results
// ---------------------------------------------------------------------------
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE,
  name: 'HookTos AI',
  alternateName: 'HookTos',
  description: ONE_LINE_DESCRIPTION,
  publisher: { '@id': ORG_ID },
  inLanguage: 'en',
};

// ---------------------------------------------------------------------------
// SoftwareApplication — the product itself
// ---------------------------------------------------------------------------
export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': APP_ID,
  name: 'HookTos AI — AI Hook Generator',
  url: SITE,
  applicationCategory: 'MultimediaApplication',
  applicationSubCategory: 'AI Content Creation Tool',
  operatingSystem: 'Web browser',
  description: ONE_LINE_DESCRIPTION,
  image: `${SITE}/opengraph-image`,
  publisher: { '@id': ORG_ID },
  featureList: [
    'AI hook generator: 10 viral hooks per idea',
    'Retention score for every hook',
    'SEO-optimised video descriptions',
    'Trending Instagram audio tracker updated daily',
    'Niche hashtag finder with reach estimates',
  ],
  offers: [
    {
      '@type': 'Offer',
      name: 'Free',
      price: '0',
      priceCurrency: 'USD',
      url: `${SITE}/hooks`,
    },
    {
      '@type': 'Offer',
      name: 'Premium',
      price: '9.99',
      priceCurrency: 'USD',
      description: 'Monthly subscription',
      url: `${SITE}/hooks`,
    },
  ],
  // Add ONLY when you have real reviews shown on the site:
  // aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '57' },
};

// ---------------------------------------------------------------------------
// FAQPage — build from the same array you render on the page
// ---------------------------------------------------------------------------
export type FaqItem = { question: string; answer: string };

export const homeFaqs: FaqItem[] = [
  {
    question: 'What is an AI hook generator?',
    answer:
      'An AI hook generator writes the first line or first 3 seconds of a short video. HookTos AI gives you 10 hook options for any topic, each based on a proven psychology trigger such as curiosity gap or pattern interrupt, with a predicted retention score.',
  },
  {
    question: 'How do I stop viewers dropping off in the first 3 seconds?',
    answer:
      'Open with a hook that creates a question in the viewer’s mind, show the payoff visually in the first frame, cut any intro, and put on-screen text that matches the spoken hook. HookTos AI scores each hook so you can pick the one most likely to keep viewers watching.',
  },
  {
    question: 'Is HookTos AI free?',
    answer:
      'HookTos AI has a free plan. Premium costs $9.99 per month and includes unlimited generations and private generation history.',
  },
  {
    question: 'Does HookTos work for YouTube Shorts and TikTok?',
    answer:
      'Yes. Hooks are written for Instagram Reels, YouTube Shorts and TikTok, and you can choose the platform so the length and style match each feed.',
  },
  {
    question: 'How is the retention score calculated?',
    answer:
      'The retention score is an AI-generated estimate for comparing hook options, not a measured audience result or a guarantee. Treat it as a decision aid and test how each hook performs with your audience.',
  },
  {
    question: 'How does the trending Instagram audio tool work?',
    answer:
      'The audio explorer surfaces trending-sound information from its available data source. Rankings and availability can change, so confirm a sound is still available and suitable on Instagram before using it.',
  },
];

export function faqPageSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

// ---------------------------------------------------------------------------
// Article / BlogPosting — for every /blog/[slug] page
// ---------------------------------------------------------------------------
export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;     // YYYY-MM-DD
  updated?: string; // YYYY-MM-DD
  author?: string;
  cover?: string;   // "/blog/xyz.jpg"
  keywords?: string[];
};

export function articleSchema(post: PostMeta) {
  const url = `${SITE}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title.slice(0, 110),
    description: post.description,
    image: post.cover ? `${SITE}${post.cover}` : `${SITE}/opengraph-image`,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: {
      '@type': 'Person',
      name: post.author ?? 'HookTos AI Team',
      url: `${SITE}/about`,
    },
    publisher: { '@id': ORG_ID },
    keywords: post.keywords?.join(', '),
    inLanguage: 'en',
  };
}

// ---------------------------------------------------------------------------
// BreadcrumbList — Home › Blog › Post
// ---------------------------------------------------------------------------
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE}${item.path}`,
    })),
  };
}
