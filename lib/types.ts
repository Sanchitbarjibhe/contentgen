// lib/types.ts
// Single source of truth for shapes shared between the API route, the AI
// prompt layer, and the client components.

export const NICHES = ["TECH", "FINANCE", "FITNESS", "COMEDY", "BUSINESS"] as const;
export type Niche = (typeof NICHES)[number];

export const PLATFORMS = ["REELS", "SHORTS", "TIKTOK"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const FRAMEWORKS = [
  "VISUAL_HOOK",
  "CURIOSITY_GAP",
  "NEGATIVE_FRAMING",
  "CONTROVERSY",
  "PROBLEM_SOLUTION",
] as const;
export type Framework = (typeof FRAMEWORKS)[number];

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  VISUAL_HOOK: "Visual Hook",
  CURIOSITY_GAP: "Curiosity Gap",
  NEGATIVE_FRAMING: "Negative Framing",
  CONTROVERSY: "Controversy",
  PROBLEM_SOLUTION: "Problem-Solution",
};

export type Plan = "FREE" | "PRO" | "AGENCY";

export interface PlanConfig {
  label: string;
  priceMonthly: number;
  dailyGenerationLimit: number | null; // null = unlimited
  retentionScorePredictor: boolean;
  nicheCustomization: boolean;
  bulkCsvExport: boolean;
  multiAccount: boolean;
}

export const PLAN_LIMITS: Record<Plan, PlanConfig> = {
  FREE: {
    label: "Free",
    priceMonthly: 0,
    dailyGenerationLimit: 5,
    retentionScorePredictor: false,
    nicheCustomization: false,
    bulkCsvExport: false,
    multiAccount: false,
  },
  PRO: {
    label: "Pro Creator",
    priceMonthly: 9,
    dailyGenerationLimit: null,
    retentionScorePredictor: true,
    nicheCustomization: true,
    bulkCsvExport: false,
    multiAccount: false,
  },
  AGENCY: {
    label: "Agency",
    priceMonthly: 29,
    dailyGenerationLimit: null,
    retentionScorePredictor: true,
    nicheCustomization: true,
    bulkCsvExport: true,
    multiAccount: true,
  },
};

/** One hook variation, as returned by the model. */
export interface HookResult {
  framework: Framework;
  hook: string;
  /** 0-100 scroll-stop probability. */
  retentionScore: number;
  /** One line explaining why this hook scores the way it does. */
  rationale: string;
}

export interface HashtagGroup {
  broad: string[]; // 5
  medium: string[]; // 5
  lowCompetition: string[]; // 5
}

/** Full structured output of a single generation call. */
export interface GenerationResult {
  hooks: HookResult[]; // 10 items
  description: string;
  hashtags: HashtagGroup;
  avgRetentionScore: number;
}

export interface GenerateRequestBody {
  topic: string;
  niche: Niche;
  platform: Platform;
}

export interface UsageInfo {
  plan: Plan;
  used: number;
  limit: number | null; // null = unlimited
  remaining: number | null; // null = unlimited
}
