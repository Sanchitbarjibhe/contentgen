export interface MarketplaceCategoryConfig {
  slug: string;
  label: string;
  itemLabel: string;
  tagline: string;
  headline: string;
  description: string;
  introText: string;
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
    introText:
      `The HookTos AI tools directory is a starting point for creators, founders, and small teams exploring independently built software and AI-related businesses. Listings are organized by category and tag so visitors can quickly identify products that may fit a particular workflow, audience, or business need. Use each listing's description as an introduction, then follow its website link to confirm what the product currently does and whether it is right for you.

AI products change quickly, and capabilities can vary substantially between providers. Before choosing a service, check its current feature set, supported integrations, privacy terms, usage limits, and pricing directly on the provider's site. A directory entry is not a product test, endorsement, or guarantee of results. Consider your own requirements and review the provider's documentation before relying on any tool for important work.

Founders and independent teams can submit a business for consideration through the marketplace listing flow. Submissions are subject to review and available listing capacity. Keep a submitted profile accurate and link to an official business website so potential users can learn more from the source. This category is designed for discovery: product transactions, subscriptions, and support remain with the listed provider.

Use the category and tags as navigation aids rather than as a ranking or quality score. If a listing does not answer a question you have, contact the provider directly and ask for details before making a decision.`,
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
    introText:
      `Browse this SaaS tools directory to discover software products and online services submitted by independent founders and businesses. The category gives visitors a way to scan public descriptions, see how products are tagged, and move from discovery to the provider's own website. It is intended to help teams build an initial shortlist, not to replace a product evaluation or procurement process.

When reviewing a SaaS listing, verify the current product details with the provider. Check the use case, supported platforms, account requirements, data handling, service terms, and current subscription price before signing up. Listings may change as companies update their products, and HookTos does not operate or provide support for third-party services. A listing should not be read as a certification, independent comparison, or promise that a product will meet a specific business requirement.

SaaS Founders can use the marketplace form to submit their business information for review. Include a clear name, category, useful summary, and official website so visitors can identify the product and continue their research. Listing availability and approval are subject to marketplace review. Any subscription, purchase, or support request is handled directly by the software provider.

Use the category and tags as navigation aids rather than as a ranking or quality score. If a listing does not answer a question you have, contact the provider directly and ask for details before making a decision.`,
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
    introText:
      `The content creators category helps audiences, businesses, and fellow creators discover independent creator-led brands, media projects, and services. Browse the listings to learn how each business describes its work, what category it belongs to, and where to find more information. The directory is designed to make discovery easier while leaving evaluation and communication in the hands of the people involved.

If you are considering a collaboration, visit the creator or business's official website and review its current portfolio, audience information, services, and contact process. Confirm deliverables, timelines, usage rights, rates, and measurement expectations directly before making an agreement. A directory listing does not verify audience metrics, guarantee availability, or imply endorsement by HookTos. Do your own research and use a written agreement appropriate to your project.

Creators and creator-led businesses can submit a profile for consideration through the marketplace listing flow. An accurate category, concise description, and working official website link help visitors understand the business without relying on assumptions. Submissions are reviewed and appear subject to listing criteria and capacity. HookTos provides discovery listings; collaboration terms, payments, and services are arranged independently between the parties.

Use the category and tags as navigation aids rather than as a ranking or quality score. If a listing does not answer a question you have, contact the provider directly and ask for details before making a decision.`,
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
    introText:
      `Use the YouTube creators directory to explore businesses and creator-led projects associated with online video. Listings may include video-first brands, independent services, and products whose owners identify with the YouTube ecosystem. Each entry gives visitors a starting point for discovery; follow the official website link to find the latest channel, work samples, business details, and contact information.

For a potential sponsorship or partnership, assess the specific channel and audience yourself. Review recent content, audience fit, engagement context, brand suitability, and the creator's current availability. Ask the creator or business to confirm performance information and deliverables, and agree on usage rights, timing, reporting, and payment terms before work begins. HookTos does not broker deals or guarantee audience size, campaign results, or the accuracy of third-party information.

YouTube creators and video businesses can submit their company or brand through the marketplace listing flow. Provide a correct business name, relevant category, helpful description, and official destination so interested visitors can continue their research. Submissions are subject to review and listing availability. The directory is for discovery; all creator services, negotiations, and commercial arrangements remain directly between the parties.

Use the category and tags as navigation aids rather than as a ranking or quality score. If a listing does not answer a question you have, contact the provider directly and ask for details before making a decision.`,
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
    introText:
      `This Instagram creators directory is a place to discover creator-led businesses, Reels-focused brands, and services connected to social content. Browse the public listing details to understand how each business identifies its work, then follow its official website or profile links to see current examples and contact options. The marketplace can help you find potential collaborators, but it does not replace a direct review of their work.

Before reaching out about a campaign, consider whether the creator's content, audience, and communication style align with your goals. Discuss the brief, deliverables, production requirements, deadlines, usage rights, disclosure expectations, and compensation directly. Confirm any audience or performance information with the creator, since details and availability can change. A listing is not a guarantee of results or an endorsement by HookTos, and the platform does not broker creator engagements.

Instagram Creators and creator-led companies can submit a business through the marketplace listing process. An accurate category, clear description, and official destination help visitors understand what is offered. Submissions are reviewed and depend on listing criteria and capacity. Contact each business through its own channels to discuss current services, pricing, or partnership terms.

Use the category and tags as navigation aids rather than as a ranking or quality score. If a listing does not answer a question you have, contact the provider directly and ask for details before making a decision.`,
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
    introText:
      `Explore this marketing agencies directory to find independent firms, creator-led studios, and businesses that describe their work in marketing, advertising, or growth services. Each listing is a discovery starting point: read its public description, identify a potentially relevant specialty, and follow the official website link to learn more about the provider's current services.

Agency capabilities and engagement models vary. Before selecting a partner, review relevant work samples, ask who will perform the work, clarify scope and success measures, and confirm the timeline, reporting cadence, ownership, and commercial terms in writing. Check references or other evidence appropriate to your project. A directory entry does not certify performance, guarantee campaign results, or constitute an endorsement by HookTos. Evaluate providers independently and agree on expectations directly.

Independent agencies and marketing businesses can submit a profile for review through the marketplace listing flow. Clear business information, an accurate category, and a working official website help prospective clients carry out their own evaluation. Approval and placement depend on marketplace review and listing availability. HookTos supports discovery; all service delivery, contracts, payments, and client relationships are managed between the agency and its customers.

Use the category and tags as navigation aids rather than as a ranking or quality score. If a listing does not answer a question you have, contact the provider directly and ask for details before making a decision.`,
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
    introText:
      `This startup directory brings together early-stage companies and founder-led businesses that have submitted profiles to the HookTos marketplace. Browse descriptions and categories to find companies that may relate to your interests, then continue to each official website for product details, company updates, and contact information. The directory is a discovery resource, not a funding platform, broker, or investment recommendation.

If you are evaluating a company, product, or potential partnership, conduct your own due diligence. Confirm the current status of the business, its offering, team, terms, and any claims directly with the people responsible. Do not treat a directory listing as verification of financial information, traction, product quality, or investment suitability. Any commercial discussion, investment decision, or transaction takes place independently and requires appropriate professional review.

Founders can submit a business profile for consideration through the marketplace listing flow. A useful submission includes accurate company information, a relevant category, a clear description, and a working official website. Profiles are reviewed and included subject to marketplace criteria and available capacity. HookTos helps people discover independent businesses; it does not broker acquisitions, investments, or other transactions.

Use the category and tags as navigation aids rather than as a ranking or quality score. If a listing does not answer a question you have, contact the provider directly and ask for details before making a decision.`,
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
