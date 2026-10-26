// seo/keywords.ts

export const siteKeywords = {
    home: {
        high: [

            "AI content generator",
            "SaaS marketplace",
        ],
        medium: ["buy AI startup", "discover AI software"],
        low: [

            "affordable AI tools for small business 2026",
            "free ai writing tools",
            "essay hook generator",
            "hook sentence generator",
            "ai generator text",
            "ai text generator",
            "ai hook generator online",
            "ai text generator online",
            "ai writing tool",
            "ai hook tool",
            "ai hook generator for content creator", //ai text creator
            "ai text creator",
        ]
    },
    marketplace: {
        high: ["AI content generator", "SaaS marketplace"],
        medium: ["buy AI startup", "discover AI software"],
        low: ["affordable AI tools for small business 2026"]
    },
    blog: {
        high: ["AI trends 2026", "creator economy"],
        medium: ["how to build SaaS", "AI automation guides"],
        low: ["best AI tools workflow for beginners"]
    }
};

// एक रियुजेबल हेल्पर फंक्शन जे विशिष्ट कॅटेगरीचे सर्व कीवर्ड्स एका एररमध्ये एकत्र (Flatten) करून देईल
export function getKeywords(category: keyof typeof siteKeywords) {
    const cat = siteKeywords[category];
    if (!cat) return [];

    return [...cat.high, ...cat.medium, ...cat.low];
}