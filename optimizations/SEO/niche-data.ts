// optimizations/seo/niche-data.ts

export interface NicheData {
    slug: string;
    nicheName: string;
    category: string;
    title: string;
    description: string;
    keywords: string[];
    heroHeadline: string;
    benefits: string[];
    faqs: { question: string; answer: string }[];
}

export const nichesDatabase: Record<string, NicheData> = {
    'fitness-hooks': {
        slug: 'fitness-hooks',
        nicheName: 'Fitness & Workout',
        category: 'Fitness',
        title: 'Fitness & Workout Viral Hooks Generator | HookTos AI',
        description: 'Generate high-converting fitness hooks for gym, bodybuilding, and weight loss reels. Boost your engagement instantly.',
        keywords: ['fitness hooks', 'gym reels captions', 'workout video hooks', 'weight loss TikTok ideas'],
        heroHeadline: 'Scroll-Stopping Fitness & Gym Hooks',
        benefits: [
            'Hook fitness enthusiasts in the first 3 seconds of your workout video.',
            'Psychology-backed hooks designed specifically for weight loss and bodybuilding content.',
            'Boost retention and algorithm reach on Instagram Reels and TikTok.'
        ],
        faqs: [
            { question: 'How do I use these fitness hooks?', answer: 'Simply copy the generated hook and use it as the first text overlay or spoken intro in your workout video.' },
            { question: 'Are these hooks good for TikTok and Reels?', answer: 'Yes, they are specifically optimized for short-form video platforms like TikTok, Instagram Reels, and YouTube Shorts.' }
        ]
    },
    'saas-growth-hooks': {
        slug: 'saas-growth-hooks',
        nicheName: 'SaaS & Startup Growth',
        category: 'Tech & SaaS',
        title: 'SaaS & Startup Growth Hooks Generator | HookTos AI',
        description: 'Create viral hooks for software, B2B SaaS, and startup founders. Attract users and investors with AI content.',
        keywords: ['SaaS growth hooks', 'startup marketing captions', 'B2B software video hooks', 'founder stories'],
        heroHeadline: 'High-Converting SaaS & Startup Hooks',
        benefits: [
            'Attract early adopters and B2B clients with compelling problem-solver hooks.',
            'Tailored for indie hackers, startup founders, and software marketers.',
            'Drive organic traffic and signups through short-form tech videos.'
        ],
        faqs: [
            { question: 'Can I use these for LinkedIn and Twitter/X videos?', answer: 'Absolutely! These hooks work exceptionally well for tech founders on LinkedIn and X as well.' }
        ]
    },
    'real-estate-hooks': {
        slug: 'real-estate-hooks',
        nicheName: 'Real Estate & Property',
        category: 'Real Estate',
        title: 'Real Estate Property Listing Hooks Generator | HookTos AI',
        description: 'Generate catchy hooks for real estate agents, property tours, and home buying tips on social media.',
        keywords: ['real estate hooks', 'property tour captions', 'realtor TikTok ideas', 'home buying hooks'],
        heroHeadline: 'Catchy Real Estate Property Hooks',
        benefits: [
            'Showcase luxury homes and property listings with captivating hooks.',
            'Attract home buyers and sellers directly through social media content.',
            'Save hours of brainstorming captions for your real estate brand.'
        ],
        faqs: [
            { question: 'Are these good for luxury property tours?', answer: 'Yes, we have specialized hooks for luxury listings, first-time home buyers, and real estate tips.' }
        ]
    }
};

// Helper function to get niche data safely
export function getNicheData(slug: string): NicheData {
    return nichesDatabase[slug] || {
        slug,
        nicheName: slug.replace(/-/g, ' ').toUpperCase(),
        category: 'General',
        title: `${slug.replace(/-/g, ' ')} Hooks | HookTos AI`,
        description: `Generate viral hooks for ${slug.replace(/-/g, ' ')} using AI.`,
        keywords: [slug, 'viral hooks', 'ai content'],
        heroHeadline: `Viral ${slug.replace(/-/g, ' ')} Hooks`,
        benefits: ['Boost your social media engagement', 'Save time with AI-powered content creation'],
        faqs: [{ question: 'How to use this?', answer: 'Copy and paste the generated hooks into your video scripts.' }]
    };
}