export type LinkRule = {
  keywords: string[];
  href: string;
  anchors?: string[];
  priority: number;
};

export const LINK_RULES: LinkRule[] = [
  { keywords: ["viral hooks for reels", "reel hooks", "instagram reels hooks"], href: "/hooks/instagram-reels", priority: 10 },
  { keywords: ["tiktok hooks", "tiktok hook"], href: "/hooks/tiktok", priority: 10 },
  { keywords: ["youtube shorts hooks", "shorts hooks"], href: "/hooks/youtube-shorts", priority: 10 },
  { keywords: ["curiosity gap", "curiosity hooks"], href: "/hooks/instagram-reels/curiosity", priority: 8 },
  { keywords: ["hook generator", "ai hook generator"], href: "/hooks", priority: 9 },
  { keywords: ["creator marketplace", "influencer marketplace", "hire creators"], href: "/marketplace", priority: 9 },
  { keywords: ["youtube creators", "youtube influencers"], href: "/marketplace/youtube-creators", priority: 8 },
];
