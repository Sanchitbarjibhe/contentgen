import { Metadata } from 'next';

const baseUrl = 'https://www.hooktos.com';

export const pageSEOConfig: Record<string, { title: string; description: string; image?: string }> = {
    home: {
        title: 'HookTos AI | AI Viral Hook Generator',
        description: 'Generate viral hooks, captions, and SEO content for TikTok, Reels, and YouTube Shorts.',
        image: '/android-chrome-512x512.png',
    },
    marketplace: {
        title: 'Marketplace | Explore Creator Businesses',
        description: 'Discover top global creator businesses, brands, and tools in our verified directory, promote your brand.',
        image: '/android-chrome-512x512.png',
    },
    blogs: {
        title: 'Blogs & Guides | HookTos AI',
        description: 'Read the latest tips, strategies, and insights on growing your social media presence.',
        image: '/android-chrome-512x512.png',
    },
};

// Reusable Helper Function
export function getPageMetadata(pageKey: keyof typeof pageSEOConfig, path: string = ''): Metadata {
    const config = pageSEOConfig[pageKey] || pageSEOConfig.home;
    const fullUrl = `${baseUrl}${path}`;

    return {
        title: config.title,
        description: config.description,
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: fullUrl,
        },
        openGraph: {
            title: config.title,
            description: config.description,
            url: fullUrl,
            siteName: 'HookTos AI',
            images: [{ url: config.image || '/android-chrome-512x512.png', alt: config.title }],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: config.title,
            description: config.description,
            images: [config.image || '/android-chrome-512x512.png'],
            creator: '@HookTosai',
        },
    };
}