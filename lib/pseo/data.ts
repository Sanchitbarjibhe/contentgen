import { HOOK_PAGES, HOOK_TYPES, PLATFORMS } from "@/lib/hook-pages";
import type { HookType, PageContent, Platform } from "./types";
import { similarityRatio, scorePage } from "./quality";

const PLATFORM_DETAILS: Record<string, Omit<Platform, "slug" | "name" | "audience">> = {
  tiktok: {
    idealLength: "15-45 seconds",
    hookWindow: "the first 1-2 seconds",
    algoNotes: ["Make the opening text and spoken line match", "Use a visual change or clear on-screen prompt early"],
  },
  "instagram-reels": {
    idealLength: "7-30 seconds",
    hookWindow: "the first 1-3 seconds",
    algoNotes: ["Match the first frame with the written promise", "Reward viewers with a replayable detail or payoff"],
  },
  "youtube-shorts": {
    idealLength: "30-60 seconds",
    hookWindow: "the first 1-3 seconds",
    algoNotes: ["Use a searchable opening phrase", "State the payoff quickly, then build evidence"],
  },
  linkedin: {
    idealLength: "30-90 second video or short post",
    hookWindow: "the first visible line",
    algoNotes: ["Lead with a credible professional claim", "Keep jargon and unsupported authority out of the opening"],
  },
  "twitter-x": {
    idealLength: "one concise post or short thread opener",
    hookWindow: "the first line",
    algoNotes: ["Make the first line skimmable", "Save supporting context for the reply or thread"],
  },
};

function buildIntro(platform: (typeof PLATFORMS)[number], hookType: (typeof HOOK_TYPES)[number]) {
  return `${hookType.name} hooks for ${platform.name} work best when they combine ${hookType.description.toLowerCase()} with the needs of ${platform.audience}. ${platform.name} audiences see rapid feeds, so the opening should communicate a specific promise in ${platform.format}. Use the hook window of ${PLATFORM_DETAILS[platform.slug].hookWindow} to show the conflict, question, number, story beat, or practical problem that the post will resolve. The formula for this style is ${hookType.formula}. Start by replacing the bracketed prompt with a concrete topic, real context, and an accurate result. Avoid vague openings that could apply to every industry, because ${platform.name} viewers respond more strongly to details they recognize. Each example below is written as a reusable starting point rather than a finished script. Keep the opening honest, make sure the rest of the post delivers the promised payoff, and use platform-specific cues to earn the next few seconds of attention. ${PLATFORM_DETAILS[platform.slug].algoNotes.join(". ")}. When a hook creates curiosity or tension, show the answer soon enough to preserve trust and viewer satisfaction.`;
}

function buildFaqs(platform: (typeof PLATFORMS)[number], hookType: (typeof HOOK_TYPES)[number]) {
  return [
    { q: `What makes a strong ${hookType.name.toLowerCase()} hook for ${platform.name}?`, a: `It combines ${hookType.description.toLowerCase()} with a specific ${platform.name} audience detail and an honest payoff.` },
    { q: `How long should the opening be on ${platform.name}?`, a: `Aim for ${PLATFORM_DETAILS[platform.slug].hookWindow}, while keeping the complete opening concise and easy to understand.` },
    { q: `How can I use these ${hookType.name.toLowerCase()} examples?`, a: `Replace the brackets with your own topic, proof, or experience, then verify that the body of the post actually delivers the promise.` },
    { q: `What should I avoid when writing ${hookType.name.toLowerCase()} hooks?`, a: `Avoid exaggeration, unexplained claims, and generic prompts that do not give ${platform.audience} a reason to continue watching or reading.` },
  ];
}

export function getAllHookPages(options: { onlyIndexable?: boolean } = {}) {
  const raw = HOOK_PAGES.map(({ platform, hookType, hooks }) => {
    const details = PLATFORM_DETAILS[platform.slug];
    const examples = hooks.slice(0, 8).map((hook, index) => ({
      hook,
      niche: ["Business", "Creator growth", "Technology", "Education", "Fitness", "Marketing", "Finance", "Lifestyle"][index],
      whyItWorks: `It combines ${hookType.name.toLowerCase()} psychology with a concrete ${platform.name} audience detail, creating a clear reason to continue.`,
    }));

    const related = [
      ...HOOK_TYPES.filter((item) => item.slug !== hookType.slug).slice(0, 3).map((item) => ({
        platformSlug: platform.slug,
        hookTypeSlug: item.slug,
      })),
      ...PLATFORMS.filter((item) => item.slug !== platform.slug).slice(0, 2).map((item) => ({
        platformSlug: item.slug,
        hookTypeSlug: hookType.slug,
      })),
    ];

    const intro = buildIntro(platform, hookType);
    const pseoPlatform: Platform = {
      slug: platform.slug,
      name: platform.name,
      audience: platform.audience,
      idealLength: details.idealLength,
      hookWindow: details.hookWindow,
      algoNotes: details.algoNotes,
    };
    const pseoHookType: HookType = {
      slug: hookType.slug,
      name: hookType.name,
      psychology: hookType.description,
      formula: hookType.formula,
    };

    const page: PageContent = {
      platformSlug: platform.slug,
      hookTypeSlug: hookType.slug,
      platform: pseoPlatform,
      hookType: pseoHookType,
      intro,
      examples,
      dos: [
        `Use ${details.hookWindow} for the core promise.`,
        "Replace bracketed prompts with specific, truthful details.",
        "Deliver the payoff quickly enough to preserve trust.",
      ],
      donts: [
        "Do not use a hook that the post does not answer.",
        "Do not rely on unsupported statistics or outrage.",
        "Do not copy generic openings across every platform.",
      ],
      faqs: buildFaqs(platform, hookType),
      related,
      updatedAt: "2026-11-19",
      uniquenessRatio: 0.8,
      qualityScore: 0,
    };
    page.qualityScore = scorePage(page);
    return page;
  });

  for (const page of raw) {
    const mostSimilar = raw
      .filter((other) => other !== page)
      .reduce((highest, other) => Math.max(highest, similarityRatio(page.intro, other.intro)), 0);
    page.uniquenessRatio = 1 - mostSimilar;
    page.qualityScore = scorePage(page);
  }

  return options.onlyIndexable
    ? raw.filter((page) => page.qualityScore >= 70)
    : raw;
}

export function getAllPlatforms() {
  return getAllHookPages().reduce<Platform[]>((platforms, page) => {
    if (!platforms.some((item) => item.slug === page.platform.slug)) {
      platforms.push(page.platform);
    }
    return platforms;
  }, []);
}

export function getPageContent(platformSlug: string, hookTypeSlug: string) {
  return getAllHookPages().find(
    (page) =>
      page.platformSlug === platformSlug &&
      page.hookTypeSlug === hookTypeSlug,
  );
}
