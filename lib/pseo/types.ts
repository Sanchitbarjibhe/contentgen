export type Platform = {
  slug: string;
  name: string;
  audience: string;
  idealLength: string;
  hookWindow: string;
  algoNotes: string[];
};

export type HookType = {
  slug: string;
  name: string;
  psychology: string;
  formula: string;
};

export type PageContent = {
  platformSlug: string;
  hookTypeSlug: string;
  platform: Platform;
  hookType: HookType;
  intro: string;
  examples: {
    hook: string;
    niche: string;
    whyItWorks: string;
  }[];
  dos: string[];
  donts: string[];
  faqs: { q: string; a: string }[];
  related: { platformSlug: string; hookTypeSlug: string }[];
  updatedAt: string;
  qualityScore: number;
  uniquenessRatio: number;
};
