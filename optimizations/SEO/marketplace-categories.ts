export interface MarketplaceCategoryConfig {
  slug: string;
  label: string;
  itemLabel: string;
  tagline: string;
  headline: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  primaryKeywords: string[];
  longTailKeywords: string[];
  keywordHints: string[];
  categoryMatches: string[];
  tagMatches: string[];
  faqs: { question: string; answer: string }[];
}

export const marketplaceCategories = {
  "ai-tools": {
    slug: "ai-tools",
    label: "AI Tools",
    itemLabel: "AI businesses",
    tagline: "AI software · Automation · Creator tools",
    headline: "Top AI Tools & Creator Businesses Directory",
    description:
      "Discover AI tools, automation software, and creator-built products in a curated business listing directory.",
    metaTitle: "Top AI Tools & Creator Businesses Directory",
    metaDescription:
      "Explore AI tools in a creator marketplace and business listing directory. Compare independent software, discover AI businesses, and find free business listing sites.",
    focusKeyword: "business listing directory",
    primaryKeywords: ["free business listing sites", "business listing directory"],
    longTailKeywords: ["AI tools marketplace", "best AI tools for small business"],
    keywordHints: ["AI", "software", "business listing"],
    categoryMatches: ["AI", "Artificial Intelligence", "Technology", "SaaS"],
    tagMatches: ["AI", "automation", "artificial intelligence", "machine learning"],
    faqs: [
      {
        question: "Where can I find independent AI tools?",
        answer:
          "Browse the HookTos AI tools directory to discover independent AI products, automation software, and creator-built tools listed by category.",
      },
      {
        question: "Can I list my AI business for free?",
        answer:
          "Eligible founders can submit a business through the free listing option. Listings are subject to marketplace review and available free spots.",
      },
      {
        question: "What is a creator marketplace for AI tools?",
        answer:
          "A creator marketplace helps people discover software and businesses built by independent creators, founders, and small teams.",
      },
    ],
  },
  "saas-tools": {
    slug: "saas-tools",
    label: "SaaS Tools",
    itemLabel: "SaaS businesses",
    tagline: "SaaS · Software · Founder-built products",
    headline: "SaaS Tools in a Creator Marketplace & Directory",
    description:
      "Explore SaaS products and founder-led software companies in a searchable business listing directory for independent businesses.",
    metaTitle: "SaaS Tools & Software Business Listing Directory",
    metaDescription:
      "Discover founder-led SaaS products in a creator marketplace and business listing directory. Compare software and find free business listing sites for your company.",
    focusKeyword: "creator marketplace",
    primaryKeywords: ["creator marketplace", "business listing directory"],
    longTailKeywords: ["SaaS marketplace", "startup listing websites"],
    keywordHints: ["SaaS", "software", "business directory", "startup"],
    categoryMatches: ["SaaS", "Software", "Technology", "AI"],
    tagMatches: ["SaaS", "software", "workflow", "productivity", "cloud"],
    faqs: [
      {
        question: "What SaaS products can I discover here?",
        answer:
          "The directory features independent SaaS products, online software, and digital tools submitted by founders and creator-led businesses.",
      },
      {
        question: "How do I add my SaaS business to the directory?",
        answer:
          "Use the free listing option to submit your SaaS business details. Approved listings appear in the marketplace directory.",
      },
      {
        question: "Is HookTos a startup marketplace?",
        answer:
          "HookTos helps people discover independent businesses and creator-led software. It is a discovery directory, not a brokerage or transaction service.",
      },
    ],
  },
  "content-creators": {
    slug: "content-creators",
    label: "Content Creators",
    itemLabel: "creator businesses",
    tagline: "Content creators · Creator-led businesses",
    headline: "Content Creator Marketplace & Business Directory",
    description:
      "Find creator-led brands, content businesses, and services in a business listing directory built to help people discover independent creators.",
    metaTitle: "Content Creator Marketplace & Business Directory",
    metaDescription:
      "Explore creator businesses in a content creator marketplace and business listing directory. Discover independent brands and find free business listing sites.",
    focusKeyword: "creator marketplace",
    primaryKeywords: ["creator marketplace", "free business listing sites"],
    longTailKeywords: ["creator businesses", "business listing websites"],
    keywordHints: ["creator", "content", "business listing"],
    categoryMatches: ["Creator", "Content", "Media", "Business"],
    tagMatches: ["creator", "content", "video", "influencer", "media"],
    faqs: [
      {
        question: "What is a content creator marketplace?",
        answer:
          "It is a directory where audiences and businesses can discover creator-led companies, products, and services in one place.",
      },
      {
        question: "Can creators list their businesses?",
        answer:
          "Yes. Creators can submit a business listing with its name, category, website, and description for review.",
      },
      {
        question: "Can I buy a creator business through HookTos?",
        answer:
          "HookTos is a discovery marketplace and does not broker purchases. Contact a business directly to discuss any potential partnership or acquisition.",
      },
    ],
  },
  "youtube-creators": {
    slug: "youtube-creators",
    label: "YouTube Creators",
    itemLabel: "YouTube creator businesses",
    tagline: "YouTube · Video creators · Creator brands",
    headline: "YouTube Creator Marketplace & Business Directory",
    description:
      "Discover YouTube creators, video-first companies, and creator-built products in a curated online business listing directory.",
    metaTitle: "YouTube Creator Marketplace & Business Directory",
    metaDescription:
      "Find YouTube creator businesses in a creator marketplace and business listing directory. Explore video-led brands, tools, and free business listing sites.",
    focusKeyword: "creator marketplace",
    primaryKeywords: ["creator marketplace", "business listing directory"],
    longTailKeywords: ["YouTube creators", "creator businesses"],
    keywordHints: ["creator", "YouTube", "business listing"],
    categoryMatches: ["YouTube", "Creator", "Content", "Video"],
    tagMatches: ["YouTube", "video creator", "creator analytics", "shorts", "video"],
    faqs: [
      {
        question: "Where can I discover YouTube creator businesses?",
        answer:
          "Browse this directory for creator-led brands, products, and services connected to YouTube and online video.",
      },
      {
        question: "Can YouTube creators submit a business listing?",
        answer:
          "Yes. Creators can submit their company or brand through the marketplace listing form for review.",
      },
      {
        question: "Does this directory sell YouTube channels?",
        answer:
          "No. HookTos lists businesses for discovery and does not broker channel sales or creator-business acquisitions.",
      },
    ],
  },
  "instagram-creators": {
    slug: "instagram-creators",
    label: "Instagram Creators",
    itemLabel: "Instagram creator businesses",
    tagline: "Instagram · Reels · Creator brands",
    headline: "Instagram Creator Marketplace & Business Directory",
    description:
      "Explore Instagram creators, Reels-first businesses, and creator-led brands in a searchable online business listing directory.",
    metaTitle: "Instagram Creator Marketplace & Business Directory",
    metaDescription:
      "Discover Instagram creator businesses in a creator marketplace and business listing directory. Explore independent brands and free business listing sites.",
    focusKeyword: "creator marketplace",
    primaryKeywords: ["creator marketplace", "free business listing sites"],
    longTailKeywords: ["Instagram creators", "creator businesses"],
    keywordHints: ["creator", "Instagram", "business listing"],
    categoryMatches: ["Instagram", "Creator", "Social Media", "Content"],
    tagMatches: ["Instagram", "influencer", "Reels", "creator", "social media"],
    faqs: [
      {
        question: "What can I find in the Instagram creator directory?",
        answer:
          "Discover independent creator-led businesses, brands, products, and services associated with Instagram and social content.",
      },
      {
        question: "How can I list my Instagram creator business?",
        answer:
          "Submit your business through the free marketplace listing option. The listing is reviewed before appearing in the directory.",
      },
      {
        question: "Can I use the directory to contact a creator?",
        answer:
          "Listings include business website links where available. Contact each business through its own official channels to discuss collaborations.",
      },
    ],
  },
  "marketing-agencies": {
    slug: "marketing-agencies",
    label: "Marketing Agencies",
    itemLabel: "marketing businesses",
    tagline: "Marketing · Agencies · Growth services",
    headline: "Marketing Agency Business Listing Directory",
    description:
      "Compare independent marketing agencies, creator-led studios, and growth services in a curated business listing directory.",
    metaTitle: "Marketing Agency Business Listing Directory",
    metaDescription:
      "Explore independent agencies in a business listing directory and creator marketplace. Compare marketing services and find free business listing sites.",
    focusKeyword: "business listing directory",
    primaryKeywords: ["business listing directory", "free business listing sites"],
    longTailKeywords: ["marketing agency directory", "business listing websites"],
    keywordHints: ["marketing", "agency", "business listing"],
    categoryMatches: ["Marketing", "Agency", "Services", "Advertising"],
    tagMatches: ["marketing", "agency", "growth", "SEO", "social media"],
    faqs: [
      {
        question: "How do I find an independent marketing agency?",
        answer:
          "Browse agency and marketing-service listings, review the business details, and visit its website to learn about services and contact options.",
      },
      {
        question: "Can a small marketing agency be listed for free?",
        answer:
          "Agencies can submit a listing through the free listing option while free spots are available. Submissions are subject to review.",
      },
      {
        question: "Does HookTos endorse listed agencies?",
        answer:
          "A directory listing is for discovery and does not constitute an endorsement. Evaluate each agency and its services independently.",
      },
    ],
  },
  startups: {
    slug: "startups",
    label: "Startups",
    itemLabel: "startup businesses",
    tagline: "Startups · Founders · Creator-led companies",
    headline: "Startup Marketplace & Creator Business Directory",
    description:
      "Discover early-stage companies and founder-led brands in a startup marketplace built for exploring independent businesses.",
    metaTitle: "Startup Marketplace & Creator Business Directory",
    metaDescription:
      "Explore the startup marketplace to discover founder-led companies, buy creator business opportunities, and list your startup in a business listing directory.",
    focusKeyword: "startup marketplace",
    primaryKeywords: ["startup marketplace", "buy creator business"],
    longTailKeywords: ["startup listing websites", "business listing directory"],
    keywordHints: ["startup", "founder", "business listing"],
    categoryMatches: ["Startup", "SaaS", "Technology", "Business"],
    tagMatches: ["startup", "founder", "SaaS", "indie", "business"],
    faqs: [
      {
        question: "What startups are listed in this marketplace?",
        answer:
          "The directory features independent startups and founder-led businesses that have submitted a listing and passed marketplace review.",
      },
      {
        question: "Can I buy a creator business through the startup marketplace?",
        answer:
          "HookTos supports discovery but does not broker acquisitions. Contact a business directly to discuss a potential purchase or partnership.",
      },
      {
        question: "How can a startup get listed?",
        answer:
          "Submit your company details using the marketplace listing form. Approved listings are displayed in the relevant business directory categories.",
      },
    ],
  },
} satisfies Record<string, MarketplaceCategoryConfig>;

export type MarketplaceCategorySlug = keyof typeof marketplaceCategories;
