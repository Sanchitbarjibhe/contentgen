// optimizations/seo/business-niche-data.ts

export interface BusinessNiche {
    slug: string;
    nicheName: string;
    tagline: string;
    description: string;
    keywords: string[];
    heroTitle: string;
}

export const businessNiches: Record<string, BusinessNiche> = {
    'saas-ai-tools': {
        slug: 'saas-ai-tools',
        nicheName: 'SaaS & AI Tools',
        tagline: 'SaaS · AI Automation',
        description: 'Explore verified SaaS startups, AI automation tools, and software solutions built by independent creators and founders.',
        keywords: ['SaaS directory', 'AI tools marketplace', 'indie hacker software', 'startup businesses'],
        heroTitle: 'Top SaaS & AI Automation Businesses',
    },
    'food-artisan-cafes': {
        slug: 'food-artisan-cafes',
        nicheName: 'Food & Artisan Cafes',
        tagline: 'Food · Artisan Cafe',
        description: 'Discover unique food brands, artisan coffee shops, and culinary ventures created by passionate independent makers.',
        keywords: ['artisan food brands', 'coffee shop directory', 'creator food businesses', 'independent cafes'],
        heroTitle: 'Artisan Food & Independent Cafes',
    },
    'retail-minimalist-gear': {
        slug: 'retail-minimalist-gear',
        nicheName: 'Retail & Minimalist Gear',
        tagline: 'Retail · Minimalist Gear',
        description: 'Browse minimalist apparel, lifestyle products, and creator-led retail brands from the community.',
        keywords: ['minimalist gear brands', 'creator retail stores', 'independent e-commerce brands'],
        heroTitle: 'Minimalist Retail & Creator Brands',
    },
    'tech-data-intelligence': {
        slug: 'tech-data-intelligence',
        nicheName: 'Tech & Data Intelligence',
        tagline: 'Tech · Data Intelligence',
        description: 'Find cutting-edge data analytics platforms, developer tools, and tech intelligence apps built by solo founders.',
        keywords: ['data analytics startups', 'tech directory', 'developer tools marketplace'],
        heroTitle: 'Tech & Data Intelligence Startups',
    }
};

export function getBusinessNiche(slug: string): BusinessNiche {
    return businessNiches[slug] || {
        slug,
        nicheName: slug.replace(/-/g, ' ').toUpperCase(),
        tagline: 'Business · Directory',
        description: `Explore verified independent businesses and creator brands in the ${slug.replace(/-/g, ' ')} niche.`,
        keywords: [slug, 'creator businesses', 'marketplace directory'],
        heroTitle: `${slug.replace(/-/g, ' ')} Businesses`,
    };
}