export const RESOURCE_CATEGORIES = [
  "swipe-files",
  "prompt-packs",
  "checklists",
  "templates",
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];
export type ResourcePlatform =
  | "TikTok"
  | "Instagram Reels"
  | "YouTube Shorts";

export type CreatorNiche =
  | "AI Tools & Tech"
  | "SaaS & Startups"
  | "Creator Economy / Monetization"
  | "Short-Form Video & Hooks"
  | "Fitness"
  | "Finance"
  | "Marketing Agencies"
  | "Real Estate"
  | "Business, Tech & AI Workflows"
  | "Finance & Crypto / Trading"
  | "Fitness, Health & Wellness"
  | "Career, Education & Skill Building"
  | "Digital Marketing & Creator Growth"
  | "Beauty, Fashion & Lifestyle"
  | "Gaming & Tech Hardware";

export const CREATOR_NICHES: CreatorNiche[] = [
  "AI Tools & Tech",
  "SaaS & Startups",
  "Creator Economy / Monetization",
  "Short-Form Video & Hooks",
  "Fitness",
  "Finance",
  "Marketing Agencies",
  "Real Estate",
  "Business, Tech & AI Workflows",
  "Finance & Crypto / Trading",
  "Fitness, Health & Wellness",
  "Career, Education & Skill Building",
  "Digital Marketing & Creator Growth",
  "Beauty, Fashion & Lifestyle",
  "Gaming & Tech Hardware",
];

type ResourceBase = {
  category: ResourceCategory;
  slug: string;
  title: string;
  description: string;
  platforms: ResourcePlatform[];
  niches: CreatorNiche[];
};

export type SwipeFileResource = ResourceBase & {
  category: "swipe-files";
  hook: string;
  generatorPrompt: string;
};

export type PromptPackResource = ResourceBase & {
  category: "prompt-packs";
  prompt: string;
};

export type ChecklistResource = ResourceBase & {
  category: "checklists";
  items: string[];
};

export type TemplateResource = ResourceBase & {
  category: "templates";
  content: string;
};

export type CreatorResource =
  | SwipeFileResource
  | PromptPackResource
  | ChecklistResource
  | TemplateResource;

export type PersistedCreatorResource = CreatorResource & {
  id: string;
  likesCount: number;
  liked: boolean;
};

export type ResourceCardData = CreatorResource & {
  id?: string;
  likesCount?: number;
  liked?: boolean;
};

export function isPersistedCreatorResource(
  value: unknown,
): value is PersistedCreatorResource {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  if (
    typeof record.id !== "string" ||
    typeof record.slug !== "string" ||
    typeof record.title !== "string" ||
    typeof record.description !== "string" ||
    typeof record.likesCount !== "number" ||
    typeof record.liked !== "boolean" ||
    !Array.isArray(record.platforms) ||
    !record.platforms.every((item) => typeof item === "string") ||
    !Array.isArray(record.niches) ||
    !record.niches.every((item) => typeof item === "string")
  ) {
    return false;
  }

  if (record.category === "swipe-files") {
    return typeof record.hook === "string" && typeof record.generatorPrompt === "string";
  }
  if (record.category === "prompt-packs") {
    return typeof record.prompt === "string";
  }
  if (record.category === "checklists") {
    return Array.isArray(record.items) && record.items.every((item) => typeof item === "string");
  }
  if (record.category === "templates") {
    return typeof record.content === "string";
  }
  return false;
}

const allPlatforms: ResourcePlatform[] = [
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
];

export const resources: CreatorResource[] = [
  {
    category: "checklists",
    slug: "first-3-seconds-hook-checklist",
    title: "First 3 Seconds Hook Checklist",
    description:
      "Make the opening instantly clear, relevant, and strong enough to earn the next few seconds.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Marketing Agencies", "Creator Economy / Monetization"],
    items: [
      "Name the audience, problem, or outcome before adding background context.",
      "Show a visual that supports the opening line instead of a generic title card.",
      "Use concrete nouns and verbs so the viewer can picture the subject immediately.",
      "Create one clear question or expectation the rest of the video will answer.",
      "Remove greetings, long disclaimers, and setup that can come after the hook.",
      "Make the spoken opening understandable with sound off using accurate captions.",
      "Check that the hook promises something the video actually delivers.",
      "Read the line aloud and trim any words that slow down the first beat.",
    ],
  },
  {
    category: "checklists",
    slug: "instagram-reels-pre-publish-checklist",
    title: "Instagram Reels Pre-Publish Checklist",
    description:
      "A practical final review for Reels framing, captions, accessibility, and audience action.",
    platforms: ["Instagram Reels"],
    niches: ["Short-Form Video & Hooks", "Creator Economy / Monetization", "Marketing Agencies"],
    items: [
      "Preview the full video in vertical 9:16 framing and keep key text away from interface overlays.",
      "Confirm the opening frame communicates the Reel topic without relying on the caption.",
      "Review auto-captions for names, product terms, punctuation, and timing.",
      "Keep on-screen text large enough to read on a phone and visible long enough to finish.",
      "Choose a cover with a clear subject and concise, accurate title.",
      "Check that any audio, footage, and brand assets are cleared for this use.",
      "Write a caption that adds context instead of repeating every spoken line.",
      "Use a specific, low-friction CTA that matches the Reel's goal.",
      "Preview tags, mentions, location, and destination links before publishing.",
      "Watch the exported file once with sound and once muted to catch edit issues.",
    ],
  },
  {
    category: "checklists",
    slug: "youtube-shorts-retention-checklist",
    title: "YouTube Shorts Retention Checklist",
    description:
      "Tighten the story arc and visual pacing so Shorts viewers can follow through to the payoff.",
    platforms: ["YouTube Shorts"],
    niches: ["Short-Form Video & Hooks", "AI Tools & Tech", "SaaS & Startups"],
    items: [
      "Start with the result, question, or tension that makes this Short worth watching.",
      "Keep the video focused on one main idea rather than stacking unrelated tips.",
      "Deliver a useful detail, visual change, or new beat before the opening loses momentum.",
      "Use cuts and demonstrations to clarify the point, not just to add motion.",
      "Remove repeated explanations and pauses that do not improve understanding.",
      "Make any tutorial steps visible in the order viewers should follow them.",
      "Resolve the opening question with an example, result, or clear takeaway.",
      "End cleanly without a long outro that delays the promised payoff.",
      "Check the first and final frames for awkward dead air or abrupt cutoffs.",
      "Compare audience-retention dips with the corresponding beat before revising the next Short.",
    ],
  },
  {
    category: "checklists",
    slug: "tiktok-viral-hook-trend-checklist",
    title: "TikTok Viral Hook & Trend Checklist",
    description:
      "Use trends as a creative starting point while keeping the hook relevant, original, and honest.",
    platforms: ["TikTok"],
    niches: ["Short-Form Video & Hooks", "Creator Economy / Monetization", "Marketing Agencies"],
    items: [
      "Confirm the trend is still relevant to the audience you want to reach.",
      "Identify the recognizable trend element viewers will understand without explanation.",
      "Connect the trend to a specific point, story, or useful takeaway from your niche.",
      "Write an opening line that still makes sense if the trend audio is unavailable.",
      "Use licensed or platform-provided audio and review the usage terms for branded content.",
      "Avoid copying another creator's exact script, framing, or distinctive edit.",
      "Keep the first visual and spoken line aligned so the context lands quickly.",
      "Check captions, text placement, and timing on a phone-sized preview.",
      "Make claims about reach, sales, or results accurately and with context.",
      "Save the trend format and note what audience response you will evaluate afterward.",
    ],
  },
  {
    category: "checklists",
    slug: "ai-tool-workflow-demo-checklist",
    title: "AI Tool & Workflow Demo Checklist",
    description:
      "Show an AI workflow clearly, disclose the right context, and avoid overstating what the tool can do.",
    platforms: allPlatforms,
    niches: ["AI Tools & Tech", "SaaS & Startups", "Marketing Agencies"],
    items: [
      "State the real task and intended audience before showing the tool.",
      "Show the starting input and relevant settings so the workflow can be followed.",
      "Use a test account or remove private customer data, keys, and personal details.",
      "Record the actual steps instead of implying the tool completed work it did not do.",
      "Show the output and explain what you reviewed, edited, or verified.",
      "Mention important limits, plan requirements, or human review when they affect the result.",
      "Avoid presenting generated claims, citations, or metrics as verified without checking them.",
      "Make the before-and-after comparison fair and use the same task conditions.",
      "Keep screen text legible and zoom in on the steps that matter.",
      "End with a useful next step rather than promising guaranteed time or revenue savings.",
    ],
  },
  {
    category: "checklists",
    slug: "saas-build-in-public-launch-checklist",
    title: "SaaS / Build-in-Public Launch Checklist",
    description:
      "Share a credible product launch story with clear user context, proof, and next steps.",
    platforms: allPlatforms,
    niches: ["SaaS & Startups", "AI Tools & Tech", "Creator Economy / Monetization"],
    items: [
      "Explain who the product is for and the problem it addresses in one sentence.",
      "Show a real product screen or workflow rather than relying only on abstract claims.",
      "Separate shipped features from roadmap ideas and experiments.",
      "Use customer quotes or metrics only with permission and accurate context.",
      "Protect user data, unpublished roadmap details, and internal credentials in recordings.",
      "Describe what changed since the last update and why you made that decision.",
      "Include pricing, availability, or beta limitations only if they are current.",
      "Avoid implying product-market fit or revenue outcomes from a small sample.",
      "Invite a specific form of feedback from the right audience.",
      "Add a clear destination link and verify the signup or demo flow before posting.",
    ],
  },
  {
    category: "checklists",
    slug: "creator-brand-pitch-monetization-checklist",
    title: "Creator Brand Pitch & Monetization Checklist",
    description:
      "Prepare a focused, professional brand pitch while setting clear expectations for sponsored content.",
    platforms: allPlatforms,
    niches: ["Creator Economy / Monetization", "Marketing Agencies", "Short-Form Video & Hooks"],
    items: [
      "Identify a real fit between the brand, your audience, and the content you create.",
      "Use current audience and performance data with the time period and source stated.",
      "Lead with one campaign idea that fits the brand's actual product and audience.",
      "List deliverables, platforms, usage rights, timeline, and revision scope separately.",
      "Set a rate and payment terms in writing before production begins.",
      "Confirm whether paid usage, whitelisting, exclusivity, or raw files cost extra.",
      "Disclose sponsorship clearly in the content using applicable platform and legal guidance.",
      "Make product statements truthful and based on your genuine experience.",
      "Share a trackable link or agreed measurement plan without guaranteeing performance.",
      "Proofread the pitch, check links, and follow up politely after a reasonable interval.",
    ],
  },
  {
    category: "checklists",
    slug: "personal-finance-money-reel-checklist",
    title: "Personal Finance / Money Reel Checklist",
    description:
      "Keep finance content useful and responsible by checking context, assumptions, and disclosures.",
    platforms: ["Instagram Reels", "TikTok", "YouTube Shorts"],
    niches: ["Finance", "Creator Economy / Monetization"],
    items: [
      "Clearly distinguish general education from personalized financial advice.",
      "Name the country, date, or assumptions when rules and numbers depend on context.",
      "Verify calculations, rates, tax details, and cited sources before recording.",
      "Explain risks, fees, and trade-offs alongside potential benefits.",
      "Do not promise returns, debt elimination, approval, or guaranteed outcomes.",
      "Disclose affiliate links, sponsorships, and other financial relationships clearly.",
      "Use a representative example and label estimates rather than presenting them as facts.",
      "Avoid showing account numbers, statements, addresses, or identifiable client details.",
      "Define unfamiliar finance terms in plain language and avoid misleading shortcuts.",
      "Include a relevant next step, such as checking official guidance or consulting a qualified professional.",
    ],
  },
  {
    category: "checklists",
    slug: "fitness-workout-form-checklist",
    title: "Fitness & Workout Form Checklist",
    description:
      "Film an understandable movement demo while prioritizing safe setup and responsible coaching.",
    platforms: allPlatforms,
    niches: ["Fitness", "Creator Economy / Monetization"],
    items: [
      "Choose a movement and coaching point appropriate for the intended audience.",
      "Show the setup, equipment, and full range of motion clearly in frame.",
      "Demonstrate at a controlled pace before showing a faster variation.",
      "Use a camera angle that makes the key movement pattern visible.",
      "Offer a lower-impact option or explain how to reduce load when appropriate.",
      "Avoid diagnosing injuries or presenting one cue as right for every body.",
      "Check the floor, equipment, and surrounding space before filming.",
      "Use a spotter or appropriate safety setup for movements that require one.",
      "Add concise cues that viewers can understand without stopping the video repeatedly.",
      "Recommend stopping if movement causes pain and seeking qualified guidance when needed.",
    ],
  },
  {
    category: "checklists",
    slug: "batch-recording-day-checklist",
    title: "Batch Recording Day Checklist",
    description:
      "Prepare a focused recording session so multiple short videos stay consistent and usable.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Creator Economy / Monetization", "Marketing Agencies", "SaaS & Startups"],
    items: [
      "Choose a single audience and theme for the recording batch.",
      "Outline each video's hook, key beats, proof, and CTA before setup.",
      "Group scripts by location, outfit, props, or screen-recording setup to reduce resets.",
      "Charge devices, clear storage, test the microphone, and check framing.",
      "Record a short test clip and listen for room noise and clipping.",
      "Keep a shot list for B-roll, screenshots, product demos, and alternate openings.",
      "Capture two or three truthful hook takes without changing the core promise.",
      "Mark completed scripts and note any pickups needed before teardown.",
      "Back up raw footage and label clips by topic and intended platform.",
      "Leave time to review the footage before assuming every take is usable.",
    ],
  },
  {
    category: "swipe-files",
    slug: "unexpected-result-swipe-file",
    title: "The Unexpected Result Swipe File",
    description:
      "Open with a surprising but real outcome, then explain the experiment or decision behind it.",
    platforms: allPlatforms,
    niches: ["Fitness", "AI Tools & Tech", "SaaS & Startups", "Creator Economy / Monetization"],
    hook: "I automated my weekly report with one AI workflow—and spent the extra hour checking what it got wrong.",
    generatorPrompt:
      "Write 10 honest short-form hooks about my real experiment or experience. Use an unexpected-result structure: state the reasonable expectation, reveal a genuinely surprising outcome, and invite the viewer into the explanation. Do not invent results or exaggerate causality. My experience and topic: ",
  },
  {
    category: "swipe-files",
    slug: "expensive-mistake-swipe-file",
    title: "The Expensive Mistake Swipe File",
    description:
      "Turn a costly, time-consuming, or avoidable misstep into a useful lesson for your audience.",
    platforms: allPlatforms,
    niches: ["SaaS & Startups", "Finance", "Real Estate", "Marketing Agencies"],
    hook: "I paid for three project tools before realizing our startup's real bottleneck was a handoff no tool could fix.",
    generatorPrompt:
      "Create 10 short-form hooks from a real mistake I made in [niche]. Keep the cost or consequence specific only if I provide verified details; otherwise describe the impact qualitatively. Make the lesson practical, avoid shaming viewers, and do not imply a guaranteed outcome. My mistake and lesson: ",
  },
  {
    category: "swipe-files",
    slug: "myth-busting-contrarian-swipe-file",
    title: "Myth-Busting / Contrarian Swipe File",
    description:
      "Challenge a popular belief with evidence, nuance, and a more useful way to think about it.",
    platforms: allPlatforms,
    niches: ["AI Tools & Tech", "Finance", "Fitness", "Marketing Agencies"],
    hook: "Posting every day is not automatically a growth strategy; if each video speaks to a different audience, the signal gets muddy.",
    generatorPrompt:
      "Draft 10 respectful myth-busting hooks about [topic]. For every hook, state the common belief fairly, add a meaningful nuance or evidence-based counterpoint, and avoid treating a complex issue as universally true. Use only facts or sources I provide. Topic and evidence: ",
  },
  {
    category: "swipe-files",
    slug: "before-after-transformation-swipe-file",
    title: "Before vs. After Transformation Swipe File",
    description:
      "Show a credible transformation by comparing a clear starting point with the process and result.",
    platforms: allPlatforms,
    niches: ["Fitness", "Creator Economy / Monetization", "SaaS & Startups", "Real Estate"],
    hook: "Before I filmed my workouts, I guessed what my squat looked like. Recording one set helped me spot a setup change to work on.",
    generatorPrompt:
      "Write 10 truthful before-and-after hooks for my project. Make the starting point and changed factor concrete, include timeframe only when supplied, and avoid implying the same result is guaranteed for everyone. My before, process, and after: ",
  },
  {
    category: "swipe-files",
    slug: "number-timeframe-swipe-file",
    title: "Number + Timeframe Swipe File",
    description:
      "Use a number and a real timeframe to frame a focused, easy-to-follow lesson or experiment.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Finance", "Fitness", "Marketing Agencies"],
    hook: "I tested three opening lines on the same product demo this week; the clearest one made the benefit obvious before the feature list.",
    generatorPrompt:
      "Generate 10 number-and-timeframe hook variations for [topic]. Use only the numbers, durations, and outcomes I give you; do not fabricate test results. Make each line easy to say aloud and connect the number to a clear viewer benefit. My verified details: ",
  },
  {
    category: "swipe-files",
    slug: "ai-workflow-tool-replacement-swipe-file",
    title: "AI Workflow & Tool Replacement Swipe File",
    description:
      "Compare a real workflow before and after an AI tool, including the human checks that still matter.",
    platforms: allPlatforms,
    niches: ["AI Tools & Tech", "SaaS & Startups", "Marketing Agencies"],
    hook: "I used an AI assistant to draft a campaign outline, then fact-checked every claim before it went to a client.",
    generatorPrompt:
      "Create 10 transparent hooks about how I used an AI tool in a real workflow. Separate automated steps from human decisions, use my actual tool and task details, and avoid unsupported productivity or accuracy claims. Workflow, tool, and observed result: ",
  },
  {
    category: "swipe-files",
    slug: "founder-saas-build-in-public-swipe-file",
    title: "Founder & SaaS Build-in-Public Swipe File",
    description:
      "Share a founder decision, product lesson, or launch update with useful context instead of vanity metrics.",
    platforms: allPlatforms,
    niches: ["SaaS & Startups", "AI Tools & Tech", "Creator Economy / Monetization"],
    hook: "We removed a feature from our beta after user interviews showed the setup—not the dashboard—was the confusing part.",
    generatorPrompt:
      "Write 10 founder-led hooks for a build-in-public update. Use only product facts, customer feedback I have permission to share, and metrics I provide. Distinguish shipped work from plans, and end with a lesson or honest question. Update details: ",
  },
  {
    category: "swipe-files",
    slug: "curiosity-gap-open-loop-swipe-file",
    title: "Curiosity Gap / Open Loop Swipe File",
    description:
      "Create an unanswered but honest question that the video resolves with a concrete payoff.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "AI Tools & Tech", "Real Estate", "Fitness"],
    hook: "The most useful line in this property listing was not the headline. It was the detail about the commute.",
    generatorPrompt:
      "Write 10 curiosity-gap hooks for [topic]. Each must raise a specific question that the video can answer, avoid withholding essential context just to mislead, and include a clear payoff idea. The real question and answer: ",
  },
  {
    category: "swipe-files",
    slug: "comparison-x-vs-y-swipe-file",
    title: "Comparison / \"X vs. Y\" Swipe File",
    description:
      "Compare two options against a stated use case so viewers can decide which fits their needs.",
    platforms: allPlatforms,
    niches: ["AI Tools & Tech", "SaaS & Startups", "Finance", "Real Estate"],
    hook: "For a solo creator, a spreadsheet can beat a new analytics app if the only question is which posts brought signups.",
    generatorPrompt:
      "Create 10 fair comparison hooks for [option A] versus [option B]. State the use case and decision criteria, avoid unsupported rankings, and make room for trade-offs instead of declaring one option universally best. My comparison notes: ",
  },
  {
    category: "swipe-files",
    slug: "real-estate-local-business-hook-swipe-file",
    title: "Real Estate & Local Business Hook Swipe File",
    description:
      "Lead with a place-specific detail or practical buyer question without promising outcomes or overstating facts.",
    platforms: allPlatforms,
    niches: ["Real Estate", "Marketing Agencies", "Creator Economy / Monetization"],
    hook: "Before you tour a condo near downtown, check what the monthly fee includes—not just the listing price.",
    generatorPrompt:
      "Write 10 locally relevant hooks for a real estate or neighborhood business video. Use only verified location, listing, price, and availability details I provide; avoid guarantees and discriminatory language. Focus on useful questions, process, or local context. Verified details and audience: ",
  },
  {
    category: "templates",
    slug: "hook-proof-story-payoff-cta-template",
    title: "Hook -> Proof/Story -> Payoff -> CTA Template",
    description:
      "A compact short-form structure that earns attention, supports the claim, delivers value, and closes cleanly.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Marketing Agencies", "Creator Economy / Monetization"],
    content:
      "HOOK (0-3 sec): If you are [specific audience] trying to [goal], pay attention to [specific issue or result].\n\nPROOF / STORY: When I [real action or observation], I noticed [verifiable detail].\n\nKEY BEATS: First [step or context]. Then [evidence, example, or turning point].\n\nPAYOFF: The useful takeaway is [one clear lesson the viewer can apply].\n\nCTA: [One relevant action: save this, compare your approach, or share a question].\n\nFACT CHECK: Confirm every claim and make sure the opening promise is fulfilled.",
  },
  {
    category: "templates",
    slug: "problem-agitation-solution-pas-template",
    title: "Problem -> Agitation -> Solution (PAS) Template",
    description:
      "Describe a real audience problem, explain its practical impact without fearmongering, and offer a next step.",
    platforms: allPlatforms,
    niches: ["SaaS & Startups", "Marketing Agencies", "Finance", "Real Estate"],
    content:
      "PROBLEM: If [specific audience] is dealing with [observable problem], you are not the only one.\n\nIMPACT: It can make [specific task or decision] harder because [clear, fair explanation].\n\nSOLUTION: Try [practical first step, workflow, or resource].\n\nHOW TO START: Do [step one], then check [measure or signal] before changing more.\n\nCTA: [Invite a relevant question or suggest a low-pressure next action].\n\nGUARDRAIL: Do not exaggerate consequences or promise that one solution works for everyone.",
  },
  {
    category: "templates",
    slug: "30-second-do-this-not-that-template",
    title: "30-Second \"Do This, Not That\" Template",
    description:
      "Contrast a common approach with a more useful alternative in a concise, demonstrable format.",
    platforms: allPlatforms,
    niches: ["Fitness", "AI Tools & Tech", "Marketing Agencies", "Short-Form Video & Hooks"],
    content:
      "0-3 SEC — HOOK: For [task], do this—not that.\n\n3-8 SEC — NOT THAT: Show [common approach] and explain the specific limitation in one sentence.\n\n8-18 SEC — DO THIS: Demonstrate [alternative] with a clear visual or example.\n\n18-25 SEC — WHY: Explain when this approach helps and any important trade-off.\n\n25-30 SEC — CTA: Ask viewers to [try one step, save the comparison, or ask a follow-up].\n\nSAFETY / ACCURACY CHECK: Avoid presenting personal preference as a universal rule.",
  },
  {
    category: "templates",
    slug: "ai-tool-walkthrough-script-template",
    title: "AI Tool Walkthrough Script Template",
    description:
      "Demonstrate an AI workflow from input to reviewed output with transparent limits and context.",
    platforms: allPlatforms,
    niches: ["AI Tools & Tech", "SaaS & Startups", "Marketing Agencies"],
    content:
      "HOOK: Here is how I use [AI tool] to help with [specific task].\n\nCONTEXT: This workflow is for [audience/use case], and it starts with [input or source].\n\nDEMO: First, I [step one]. Next, I [step two or prompt].\n\nOUTPUT: The tool returned [describe the actual output].\n\nHUMAN REVIEW: I checked [facts, privacy, tone, or quality] and changed [specific part].\n\nTAKEAWAY: This helps with [appropriate benefit], but it does not replace [important judgment or step].\n\nCTA: [Invite viewers to test the workflow with their own non-sensitive example].",
  },
  {
    category: "templates",
    slug: "saas-startup-story-template",
    title: "SaaS / Startup Story Template",
    description:
      "Tell the story behind a product choice, experiment, or launch while keeping facts and plans distinct.",
    platforms: allPlatforms,
    niches: ["SaaS & Startups", "AI Tools & Tech", "Creator Economy / Monetization"],
    content:
      "HOOK: We built [feature/product] because [specific user problem or observation].\n\nBEFORE: Our original assumption was [assumption].\n\nTURN: Then [customer signal, test, or constraint] changed how we saw it.\n\nDECISION: We chose to [shipped action] and set aside [alternative].\n\nWHAT HAPPENED: So far, [verified result or qualitative feedback]. This is an early signal, not a guarantee.\n\nLESSON: The part other founders can reuse is [specific lesson].\n\nCTA: Ask [one focused question] or invite viewers to [demo, waitlist, or feedback link].",
  },
  {
    category: "templates",
    slug: "case-study-breakdown-template",
    title: "Case Study Breakdown Template",
    description:
      "Break down a project with permission, context, process, and measurable results that are not overstated.",
    platforms: allPlatforms,
    niches: ["Marketing Agencies", "SaaS & Startups", "Real Estate", "Creator Economy / Monetization"],
    content:
      "HOOK: Here is how [client/project] approached [specific challenge].\n\nCONTEXT: The starting situation was [baseline, timeframe, and relevant conditions].\n\nGOAL: We agreed to focus on [defined goal or metric].\n\nPROCESS: First [action one], then [action two], and finally [action three].\n\nRESULT: Over [timeframe], [verified result with source and caveat].\n\nWHY IT MATTERS: The likely contributing factor was [evidence-based explanation], not a guaranteed formula.\n\nTAKEAWAY / CTA: If you are facing [similar situation], consider [practical next step].\n\nPERMISSION CHECK: Confirm approval for names, data, visuals, and attribution.",
  },
  {
    category: "templates",
    slug: "mistake-breakdown-template",
    title: "Mistake Breakdown Template",
    description:
      "Explain a mistake without blame, show the correction, and give viewers a useful way to avoid it.",
    platforms: allPlatforms,
    niches: ["SaaS & Startups", "Finance", "Fitness", "Real Estate"],
    content:
      "HOOK: I got [specific decision or step] wrong when [context].\n\nWHAT I ASSUMED: I thought [assumption] because [reason].\n\nWHAT HAPPENED: Instead, [honest consequence with relevant context].\n\nTHE FIX: I changed [specific action] and checked [signal or feedback].\n\nWHAT I LEARNED: Next time, I would [repeatable lesson].\n\nVIEWER TAKEAWAY: Before you [related action], check [one practical item].\n\nCTA: Invite viewers to share a lesson, not personal or sensitive information.",
  },
  {
    category: "templates",
    slug: "checklist-step-by-step-guide-template",
    title: "Checklist / Step-by-Step Guide Template",
    description:
      "Turn a repeatable process into a clear sequence viewers can follow and save.",
    platforms: allPlatforms,
    niches: ["AI Tools & Tech", "Fitness", "Finance", "Marketing Agencies"],
    content:
      "HOOK: Use this [number]-step checklist before you [specific task].\n\nSTEP 1 — [Action]: Show [what to do] and explain why it matters.\n\nSTEP 2 — [Action]: Demonstrate [next action] with [example or visual].\n\nSTEP 3 — [Action]: Check [result, setting, or safety point].\n\nFINAL CHECK: Confirm [condition that means the process is complete].\n\nPAYOFF: This helps you [realistic benefit] when [relevant context].\n\nCTA: Save this checklist or comment with the step you want explained.\n\nADAPTATION: Include caveats for steps that depend on location, experience, or individual needs.",
  },
  {
    category: "templates",
    slug: "brand-deal-sponsorship-pitch-template",
    title: "Brand Deal / Sponsorship Pitch Template",
    description:
      "Pitch a specific creator-brand partnership with audience fit, a campaign idea, and clear deliverables.",
    platforms: allPlatforms,
    niches: ["Creator Economy / Monetization", "Marketing Agencies", "Short-Form Video & Hooks"],
    content:
      "SUBJECT: [Specific campaign idea] for [Brand] x [Creator]\n\nOPEN: Hi [Name], I create [content type] for [audience description] and especially liked [specific, genuine brand detail].\n\nFIT: My audience often asks about [relevant need], which connects to [product or campaign goal].\n\nIDEA: I would create [one short-form concept] showing [story, use case, or demonstration] on [platforms].\n\nDELIVERABLES: [Number and format of posts], [draft/review timeline], and [proposed usage rights].\n\nPROOF: [Current audience or performance metric], measured over [time period] from [source].\n\nBUDGET / NEXT STEP: My proposed fee is [rate] for [scope]. Would a short call or brief be useful?\n\nSIGN-OFF: [Name, creator profile, contact details, media kit link].\n\nTERMS TO CONFIRM: Payment, disclosure, revisions, exclusivity, paid usage, and approval timeline.",
  },
  {
    category: "templates",
    slug: "weekly-content-repurposing-template",
    title: "Weekly Content Repurposing Template",
    description:
      "Plan a week of platform-native pieces from one source idea without simply reposting identical cuts.",
    platforms: allPlatforms,
    niches: ["Creator Economy / Monetization", "Marketing Agencies", "SaaS & Startups", "AI Tools & Tech"],
    content:
      "SOURCE IDEA: [Core idea, interview, demo, or long-form asset]\n\nMONDAY — MAIN LESSON: Hook [opening], share [one insight], CTA [action].\n\nTUESDAY — QUICK DEMO: Show [one step] on [platform], with [visual proof].\n\nWEDNESDAY — STORY: Tell [moment or lesson] and connect it to [audience need].\n\nTHURSDAY — FAQ / OBJECTION: Answer [real audience question] with [evidence or example].\n\nFRIDAY — RECAP / CTA: Summarize [three takeaways] and invite [next action].\n\nADAPTATION NOTES: Rewrite each hook, framing, captions, and CTA for the platform; do not use identical cuts by default.\n\nREVIEW: Check source permissions, factual accuracy, brand requirements, and performance notes before scheduling.",
  },
  {
    category: "prompt-packs",
    slug: "10-hook-multi-angle-prompt-pack",
    title: "10-Hook Multi-Angle Prompt Pack",
    description:
      "Generate ten distinct openings for one topic, with useful angle variation and a grounded promise.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "AI Tools & Tech", "Creator Economy / Monetization"],
    prompt:
      "You are a short-form video hook editor. Write exactly 10 opening hooks for [TOPIC] aimed at [AUDIENCE] on [PLATFORM]. Use these distinct angles once each where suitable: curiosity, practical mistake, transformation, personal story, myth check, comparison, quick list, demonstration, audience question, and unexpected observation. Keep each hook natural to say aloud and under 20 words. Use only facts I provide, do not guarantee results, and make sure each opening has a payoff the video can deliver. Topic details and verified proof: [ADD DETAILS]. Return a numbered list.",
  },
  {
    category: "prompt-packs",
    slug: "first-3-seconds-hook-refiner-prompt-pack",
    title: "First-3-Seconds Hook Refiner Prompt Pack",
    description:
      "Refine a draft opening for clarity, specificity, and a fast, honest audience payoff.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Marketing Agencies", "Creator Economy / Monetization"],
    prompt:
      "Act as a concise short-form video editor. Refine the draft below so the audience and value are clear in the first three seconds. First diagnose any vague wording, slow setup, unsupported claim, or mismatch between promise and payoff. Then provide 5 revised hooks: direct, curiosity-led, story-led, question-led, and visual-demo-led. Keep each under 18 spoken words, preserve my meaning, and do not invent facts. Audience: [AUDIENCE]. Platform: [PLATFORM]. Draft and actual video payoff: [PASTE].",
  },
  {
    category: "prompt-packs",
    slug: "niche-specific-hook-generator-prompt-pack",
    title: "Niche-Specific Hook Generator Prompt Pack",
    description:
      "Create niche-aware hooks using audience language, expertise boundaries, and a useful point of view.",
    platforms: allPlatforms,
    niches: ["AI Tools & Tech", "SaaS & Startups", "Creator Economy / Monetization", "Short-Form Video & Hooks", "Fitness", "Finance", "Marketing Agencies", "Real Estate"],
    prompt:
      "You are a responsible short-form content strategist for [NICHE]. The target viewer is [AUDIENCE] and the topic is [TOPIC]. List 5 common questions or misconceptions using only context I provide, then write 2 opening hooks for each. Make hooks specific to this niche without fake jargon, unsupported statistics, or guaranteed outcomes. For finance, real estate, and fitness topics, keep claims contextual and avoid personalized professional advice. Label each hook by its angle and add one sentence describing the payoff the video must deliver. Context and sources: [ADD].",
  },
  {
    category: "prompt-packs",
    slug: "short-form-script-outliner-prompt-pack",
    title: "Short-Form Script Outliner Prompt Pack",
    description:
      "Turn a topic and hook into a tight sequence of beats designed for clear delivery and a real payoff.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "AI Tools & Tech", "Fitness", "Marketing Agencies"],
    prompt:
      "Create a short-form video outline for [PLATFORM] about [TOPIC] for [AUDIENCE]. Use this hook: [HOOK]. Structure the outline as: opening visual and spoken line; one-sentence context; 3 concise story or tutorial beats; proof/example; payoff that answers the hook; and a relevant CTA. Aim for [DURATION] seconds and label approximate beat timing. Make every beat advance the idea, include visual suggestions, and flag any claim that needs verification. Do not add invented facts.",
  },
  {
    category: "prompt-packs",
    slug: "retention-drop-off-audit-prompt-pack",
    title: "Retention & Drop-Off Audit Prompt Pack",
    description:
      "Audit a script or timestamped retention notes for confusing, repetitive, or low-value beats.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Marketing Agencies", "Creator Economy / Monetization"],
    prompt:
      "Review the short-form script and, if provided, timestamped audience-retention notes below. Do not assume the reason for a drop-off without evidence. Return: (1) the opening promise in one sentence; (2) a beat-by-beat table with purpose, clarity, and repetition notes; (3) likely friction points tied to specific lines or timestamps; (4) 3 editing or rewrite experiments; and (5) a revised outline that preserves the actual message. Script: [PASTE]. Audience and platform: [ADD]. Retention data and sample size: [ADD OR WRITE NONE].",
  },
  {
    category: "prompt-packs",
    slug: "seo-caption-hook-alignment-prompt-pack",
    title: "SEO & Caption Hook Alignment Prompt Pack",
    description:
      "Align the spoken hook, on-screen text, caption, and search terms without keyword stuffing.",
    platforms: allPlatforms,
    niches: ["Marketing Agencies", "Real Estate", "Fitness", "AI Tools & Tech"],
    prompt:
      "Align these short-form video elements around one accurate search intent. Topic: [TOPIC]. Audience query or phrase: [SEARCH PHRASE]. Spoken hook: [HOOK]. Video's actual content: [SUMMARY]. Create 3 natural caption options, one concise on-screen title, and 5 relevant terms or phrases to consider. Keep the primary phrase readable and natural, do not add keywords the video does not address, and do not make claims absent from the source. Note any mismatch between the hook and content.",
  },
  {
    category: "prompt-packs",
    slug: "platform-adaptation-prompt-pack",
    title: "Platform Adaptation Prompt Pack",
    description:
      "Adapt one core idea to TikTok, Reels, and Shorts with platform-specific framing rather than copy-pasting.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Creator Economy / Monetization", "Marketing Agencies", "SaaS & Startups"],
    prompt:
      "Adapt the core idea below into three distinct short-form treatments: TikTok, Instagram Reels, and YouTube Shorts. For each, provide an opening hook, first visual, 3-beat outline, caption approach, and relevant CTA. Preserve the same facts and viewer value, but tailor framing and pacing so the versions are not identical reposts. Avoid claims about guaranteed algorithm reach. Core idea, audience, and proof: [PASTE].",
  },
  {
    category: "prompt-packs",
    slug: "myth-objection-crusher-prompt-pack",
    title: "Myth & Objection Crusher Prompt Pack",
    description:
      "Address a genuine audience objection with a fair explanation, useful evidence, and a non-pushy next step.",
    platforms: allPlatforms,
    niches: ["SaaS & Startups", "Finance", "Fitness", "Real Estate", "AI Tools & Tech"],
    prompt:
      "Help me answer this audience objection or misconception: [OBJECTION]. Audience and context: [ADD]. Evidence or sources I can use: [PASTE]. First restate the objection fairly, then identify what is valid, what depends on context, and what evidence is missing. Write 5 short-form hook options and a 4-beat response that acknowledges trade-offs and avoids shame, pressure, or universal promises. Do not invent supporting evidence. End with a low-pressure next step.",
  },
  {
    category: "prompt-packs",
    slug: "30-day-content-batching-prompt-pack",
    title: "30-Day Content Batching Prompt Pack",
    description:
      "Build a sustainable month of short-form ideas from audience problems, pillars, and real expertise.",
    platforms: allPlatforms,
    niches: ["Creator Economy / Monetization", "Marketing Agencies", "SaaS & Startups", "Real Estate"],
    prompt:
      "Create a 30-day short-form content plan for [NICHE / BRAND] serving [AUDIENCE]. Content pillars: [3-5 PILLARS]. Available formats and weekly capacity: [ADD]. For each idea, include a working title, audience question, hook angle, format (demo/story/list/FAQ/case study), proof or asset needed, and platform adaptation note. Balance educational, behind-the-scenes, community, and offer-related content without repeating topics. Do not invent customer stories or data; mark ideas that need evidence. Organize into four weekly batches and include one rest/review buffer day each week.",
  },
  {
    category: "prompt-packs",
    slug: "cta-generator-prompt-pack",
    title: "CTA (Call-To-Action) Generator Prompt Pack",
    description:
      "Generate natural calls to action that fit the content goal and ask for one clear next step.",
    platforms: allPlatforms,
    niches: ["Creator Economy / Monetization", "Marketing Agencies", "SaaS & Startups", "Short-Form Video & Hooks"],
    prompt:
      "Write 12 concise calls to action for this short-form video. Video topic and takeaway: [ADD]. Audience: [ADD]. Goal: [choose one: conversation, save/share, follow, newsletter signup, product demo, or purchase]. Offer or destination and any limitations: [ADD]. Create 2 options for each of 6 tones: helpful, conversational, direct, community-led, curiosity-led, and low-pressure. Ask for only one primary action per CTA, match the request to the value delivered, and do not create urgency, scarcity, or benefits that are not true.",
  },
  {
    category: "checklists",
    slug: "viral-pre-publish-readiness-checklist",
    title: "Viral Content Pre-Publish Readiness Checklist",
    description:
      "Give every short-form post a final check for a clear promise, strong opening, accessible edit, and useful next step.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Creator Economy / Monetization", "Digital Marketing & Creator Growth"],
    items: [
      "State one specific viewer takeaway that the video actually delivers.",
      "Make the first frame and opening line understandable without a long introduction.",
      "Show a relevant visual, result, question, or demonstration in the opening beat.",
      "Check that the hook creates interest without exaggerating the payoff.",
      "Review captions for accuracy, readable timing, and names or terms that speech-to-text may mishear.",
      "Keep important text and faces clear of platform interface overlays.",
      "Remove pauses, repeated explanations, and shots that do not help the story.",
      "Check music, footage, and other assets for permission to use on the intended platform.",
      "Choose one call to action that fits the value of the video.",
      "Preview the exported video on a phone, with sound on and muted.",
    ],
  },
  {
    category: "checklists",
    slug: "short-form-retention-and-pacing-audit",
    title: "Short-Form Retention & Pacing Audit",
    description:
      "Review each beat for clarity and momentum, then use actual audience-retention data to guide the next edit.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Digital Marketing & Creator Growth", "Marketing Agencies"],
    items: [
      "Write the opening promise in one sentence and check that the video fulfills it.",
      "Mark the point where the main question, problem, or outcome first becomes clear.",
      "For every beat, note what new information or visual it adds.",
      "Cut repeated setup and pauses unless they improve comprehension or timing.",
      "Use a visual change when it clarifies a new step, example, or change in emphasis.",
      "Keep on-screen text brief enough to read before the next important beat.",
      "Make the payoff easy to find and avoid delaying it with an unrelated outro.",
      "Compare retention dips with the corresponding line or shot before deciding what caused them.",
      "Test one meaningful edit at a time so the result is easier to interpret.",
      "Treat performance as audience feedback, not proof that one edit guarantees reach.",
    ],
  },
  {
    category: "checklists",
    slug: "viral-distribution-and-repurposing-checklist",
    title: "Going-Viral Distribution & Repurposing Checklist",
    description:
      "Distribute a strong idea thoughtfully across platforms and turn its useful parts into new, audience-fit formats.",
    platforms: allPlatforms,
    niches: ["Creator Economy / Monetization", "Digital Marketing & Creator Growth", "Marketing Agencies"],
    items: [
      "Choose the platform and audience for each version instead of reposting blindly.",
      "Export a clean vertical master and upload without another platform's watermark.",
      "Adapt the opening, pacing, caption, and call to action to each platform's viewing context.",
      "Check each platform's current music, disclosure, and branded-content requirements.",
      "Publish captions and on-screen text that preserve the video's meaning when watched muted.",
      "Share the post with communities that genuinely benefit from it rather than mass-tagging people.",
      "Use a pinned comment or reply to answer a useful follow-up, not to manufacture engagement.",
      "Turn a strong question from the comments into a distinct follow-up with a new payoff.",
      "Repurpose the core lesson into a carousel, short text post, or longer explanation with fresh context.",
      "Review watch time, completion, saves, shares, and meaningful replies after a consistent interval.",
      "Record what you learned and avoid treating one high-performing post as a guaranteed formula.",
    ],
  },
  {
    category: "swipe-files",
    slug: "high-retention-opening-hooks-swipe-file",
    title: "High-Retention Opening Hooks Swipe File",
    description:
      "A ready-to-adapt set of direct openings that make the viewer's reason to stay clear in the first few seconds.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Creator Economy / Monetization", "Digital Marketing & Creator Growth"],
    hook:
      "Your first three seconds should answer one question: why stay?\nBefore you add another effect, fix the sentence viewers hear first.\nHere's the small edit that made this tutorial easier to follow.\nMost of the useful part happens before the step everyone skips.",
    generatorPrompt:
      "Use the supplied opening lines as structural inspiration and write 8 original short-form hooks for my topic. Keep each line natural to say in under three seconds, make the viewer benefit or tension specific, and pair each hook with a visual that can be filmed simply. Ask me for the topic and audience first if they are missing. Do not invent personal results, statistics, or guarantees.",
  },
  {
    category: "swipe-files",
    slug: "curiosity-gap-callouts-swipe-file",
    title: "Curiosity-Gap Callouts Swipe File",
    description:
      "Open a genuine question viewers want answered, then make sure the video pays it off clearly.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Marketing Agencies", "Creator Economy / Monetization"],
    hook:
      "I thought the obvious fix would work, until I checked this one detail.\nThe result looked simple; the reason behind it was not.\nThere is one part of this process I would check before changing anything else.\nI tested the usual advice, and the surprising part was what happened next.",
    generatorPrompt:
      "Write 8 curiosity-gap opening lines about my topic for Reels, Shorts, or TikTok. For each, state the real question it raises and the exact moment the video should answer it. Ask me for the topic and what I can honestly show if those details are missing. Keep the intrigue fair: no fake secrets, withheld safety information, unsupported outcomes, or bait-and-switch endings.",
  },
  {
    category: "swipe-files",
    slug: "pattern-interrupt-lines-swipe-file",
    title: "Pattern-Interrupt Opening Lines Swipe File",
    description:
      "Break a familiar scroll pattern with a specific observation, visual cue, or concise change of perspective.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Digital Marketing & Creator Growth", "AI Tools & Tech"],
    hook:
      "Pause on this frame: the detail in the corner changes the whole explanation.\nDon't watch the final result yet; first notice what changed between these two steps.\nI was about to delete this clip, then I noticed what the screen was showing.\nQuick test: which version would you understand without the sound?",
    generatorPrompt:
      "Create 8 pattern-interrupt openings for my short-form video topic. Pair each spoken line with a simple first-frame action, prop, screen detail, or edit that supports its meaning. Ask me for the topic and available footage or props when needed. Avoid startling viewers, imitating another creator's signature, or promising a reveal that the video does not contain.",
  },
  {
    category: "swipe-files",
    slug: "share-save-triggers-swipe-file",
    title: "Share & Save Triggers Swipe File",
    description:
      "Use clear, low-pressure lines that give viewers a real reason to save, share, or revisit a helpful video.",
    platforms: allPlatforms,
    niches: ["Creator Economy / Monetization", "Short-Form Video & Hooks", "Digital Marketing & Creator Growth"],
    hook:
      "Save this so you can run the checklist before your next post.\nSend this to the teammate who is editing your next short.\nKeep this walkthrough handy the next time you need to compare these options.\nIf someone on your team is working through this too, share the steps with them.",
    generatorPrompt:
      "Write 10 natural save-or-share calls to action for my video. Ask me what the video teaches and who it is for if that context is missing. Give each line one clear action, connect the action to a specific future use or relevant person, and keep the tone helpful rather than pressuring. Do not ask for likes, comments, follows, and shares all at once.",
  },
  {
    category: "templates",
    slug: "curiosity-loop-short-form-script-template",
    title: "Curiosity Loop Short-Form Script Template",
    description:
      "Create an honest open loop, add useful clues, and deliver the answer before the ending.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Creator Economy / Monetization", "Digital Marketing & Creator Growth"],
    content:
      "OPEN (0-3 sec): Name the surprising question or detail that makes this worth watching.\n\nSETUP (3-8 sec): Give only the context needed to understand why the question matters.\n\nCLUE 1: Show the first useful observation, step, or piece of evidence.\n\nRE-HOOK: Point to what is still unresolved without repeating the opening.\n\nPAYOFF: Answer the opening question directly and show the supporting example.\n\nTAKEAWAY: Explain what the viewer can apply, and when the lesson may not fit.\n\nCTA: Choose one relevant next step, such as saving the walkthrough or asking a focused question.\n\nFINAL CHECK: The opening is accurate, the answer is present, and no essential context was withheld.",
  },
  {
    category: "templates",
    slug: "contrarian-take-short-form-script-template",
    title: "Contrarian Take Short-Form Script Template",
    description:
      "Challenge a common idea with fair context, a reasoned alternative, and evidence viewers can evaluate.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Marketing Agencies", "SaaS & Startups"],
    content:
      "HOOK (0-3 sec): State the common advice you want to question and the context where it may fall short.\n\nFAIR SETUP: Explain why reasonable people use that advice and what it gets right.\n\nCOUNTERPOINT: Share the specific experience, example, or evidence that changed your view.\n\nALTERNATIVE: Demonstrate a practical option and who might benefit from it.\n\nTRADE-OFF: Name a case where the usual advice is still useful or your approach may not fit.\n\nTAKEAWAY: Give viewers one decision rule they can test for themselves.\n\nCTA: Invite one focused question or ask viewers to save the decision rule.\n\nFINAL CHECK: Separate opinion from fact and avoid framing disagreement as proof of incompetence.",
  },
  {
    category: "templates",
    slug: "step-by-step-short-form-breakdown-template",
    title: "Step-by-Step Short-Form Breakdown Template",
    description:
      "Turn a repeatable process into concise, visible steps with a check for success and relevant caveats.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "AI Tools & Tech", "Digital Marketing & Creator Growth"],
    content:
      "HOOK (0-3 sec): Say what the viewer will be able to do after watching.\n\nCONTEXT: Show the starting point and identify who this process is intended for.\n\nSTEP ONE: Demonstrate the first action and name the expected result.\n\nSTEP TWO: Show the next action; keep the screen or object in view while explaining it.\n\nSTEP THREE: Complete the process and point out the detail that is easiest to miss.\n\nCHECK: Show how to confirm the process worked and what to do if it did not.\n\nSUMMARY: Recap the steps in one short sentence.\n\nCTA: Choose one action that helps viewers use or revisit the process.\n\nFINAL CHECK: Verify every instruction, disclose meaningful limits, and remove steps that are not needed.",
  },
  {
    category: "templates",
    slug: "before-after-transformation-script-template",
    title: "Before / After Transformation Script Template",
    description:
      "Show a credible change by explaining the starting point, what changed, and the context behind the result.",
    platforms: allPlatforms,
    niches: ["Creator Economy / Monetization", "Short-Form Video & Hooks", "Marketing Agencies"],
    content:
      "HOOK (0-3 sec): Show the clearest verified difference and name what the video will explain.\n\nBEFORE: Establish the starting state, timeframe, and conditions viewers need to understand.\n\nCHANGE: Demonstrate the specific action, process, or decision that changed.\n\nAFTER: Show the actual result using a fair comparison and consistent conditions.\n\nEXPLANATION: Describe what likely contributed, what else changed, and what cannot be concluded.\n\nREUSABLE LESSON: Share one practical idea viewers can adapt without promising the same result.\n\nCTA: Invite viewers to save the process or ask one relevant follow-up.\n\nFINAL CHECK: Get permission for personal or client material and do not imply a typical outcome from a single example.",
  },
  {
    category: "prompt-packs",
    slug: "viral-angle-brainstorm-prompt-pack",
    title: "Viral Angle Brainstorm Prompt Pack",
    description:
      "Explore a range of audience-first angles for one idea without relying on fabricated claims or guaranteed reach.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Creator Economy / Monetization", "Digital Marketing & Creator Growth"],
    prompt:
      "Act as a thoughtful short-form content strategist. Help me find distinctive angles for a video idea. First ask me for the topic, intended audience, what I know from direct experience, and any proof or source material. Then propose 12 angles across practical how-to, common misconception, decision comparison, small experiment, behind-the-scenes process, audience question, and useful failure. For each angle, provide the viewer's reason to care, an honest opening line, a simple visual, and the payoff the video must deliver. Flag any angle that needs evidence. Do not promise virality, invent results, or suggest outrage bait.",
  },
  {
    category: "prompt-packs",
    slug: "three-second-hook-writing-prompt-pack",
    title: "Three-Second Hook Writing Prompt Pack",
    description:
      "Draft punchy spoken openings with a matching first-frame idea and a payoff the video can actually support.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Creator Economy / Monetization", "Marketing Agencies"],
    prompt:
      "You are a short-form video hook editor. Ask me for the video topic, target viewer, key takeaway, and any verified evidence before drafting. Write 15 spoken hooks that can be delivered naturally in about three seconds. Group them into curiosity, direct benefit, surprising detail, myth check, and relatable problem. For every hook, add a matching first-frame visual and the next sentence that begins the payoff. Keep each claim faithful to the material, use clear language, and reject misleading urgency or empty clickbait.",
  },
  {
    category: "prompt-packs",
    slug: "retention-drop-off-scoring-prompt-pack",
    title: "Retention Drop-Off Review & Scoring Prompt Pack",
    description:
      "Diagnose likely friction points using a script and retention evidence, while separating observed data from hypotheses.",
    platforms: allPlatforms,
    niches: ["Short-Form Video & Hooks", "Digital Marketing & Creator Growth", "Marketing Agencies"],
    prompt:
      "Act as a careful short-form video editor reviewing audience retention. First ask me for the script or transcript, video duration, intended audience, and any timestamped retention data or known drop-off points. If retention data is unavailable, state that your review is a hypothesis based on the script alone. Score the opening clarity, beat-to-beat progression, pacing, payoff, and ending from 1 to 5 using a brief rubric. Then map likely friction points to specific lines or timestamps, explain confidence, and suggest three small tests ordered by expected learning value. Do not claim causation from a graph or assume every dip means the edit is bad.",
  },
  {
    category: "prompt-packs",
    slug: "viral-post-multiformat-repurposing-prompt-pack",
    title: "One Post to Multiple Formats Prompt Pack",
    description:
      "Repurpose a single useful post into distinct platform-native versions while keeping its facts and core value intact.",
    platforms: allPlatforms,
    niches: ["Creator Economy / Monetization", "Digital Marketing & Creator Growth", "Marketing Agencies"],
    prompt:
      "Help me repurpose one existing post into platform-appropriate short-form content. First ask me to provide the original post or transcript, its intended audience, the main takeaway, and any factual or usage constraints. Identify the core idea and list what must remain accurate. Then create distinct concepts for TikTok, Instagram Reels, and YouTube Shorts, plus a concise carousel outline and a text-post version. For each, provide an opening, structure, visual or formatting approach, and one suitable call to action. Do not copy another creator's style, add unsupported claims, or make the versions feel like identical cross-posts.",
  },
];

export const RESOURCE_CATEGORY_LABELS: Record<ResourceCategory, string> = {
  "swipe-files": "Swipe Files",
  "prompt-packs": "Prompt Packs",
  checklists: "Checklists",
  templates: "Templates",
};

export function getResource(category: string, slug: string) {
  return resources.find(
    (resource) => resource.category === category && resource.slug === slug,
  );
}
