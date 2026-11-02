export const PLATFORMS = [
  {
    slug: "tiktok",
    name: "TikTok",
    audience: "TikTok creators",
    contentContext: "your next TikTok video",
    format: "fast, conversational videos that earn attention in the opening seconds",
  },
  {
    slug: "instagram-reels",
    name: "Instagram Reels",
    audience: "Instagram creators",
    contentContext: "your next Instagram Reel",
    format: "visual-first Reels designed to stop the scroll and earn a replay",
  },
  {
    slug: "youtube-shorts",
    name: "YouTube Shorts",
    audience: "YouTube creators",
    contentContext: "your next YouTube Short",
    format: "searchable Shorts that make the payoff clear and keep viewers watching",
  },
  {
    slug: "linkedin",
    name: "LinkedIn",
    audience: "LinkedIn professionals",
    contentContext: "your next LinkedIn post",
    format: "professional posts and videos that reward a useful, credible opening",
  },
  {
    slug: "twitter-x",
    name: "Twitter/X",
    audience: "Twitter/X creators",
    contentContext: "your next Twitter/X post",
    format: "concise posts and threads with a strong first line",
  },
] as const;

export const HOOK_TYPES = [
  {
    slug: "curiosity",
    name: "Curiosity",
    description:
      "Open a clear information gap, then pay it off with a specific insight instead of withholding the answer.",
    intent: "curiosity hooks",
    formula: "Unexpected detail + open loop + useful payoff",
    templates: [
      "I tried [topic] for [time period]. The result I did not expect was [surprise].",
      "Most people miss this one detail about [topic]—and it changes [outcome].",
      "Here is what happened when I replaced [usual approach] with [alternative].",
      "There is a reason [common result] keeps happening. It starts with [overlooked cause].",
      "I found the missing step between [starting point] and [desired outcome].",
      "This tiny change made [topic] work differently for me. Here is the before and after.",
      "Everyone talks about [popular idea]. The more interesting question is [open question].",
      "I compared [option A] with [option B]. One detail made the choice obvious.",
      "The surprising part of [topic] is not [obvious detail]. It is [less obvious detail].",
      "I almost skipped [small action]. Then I saw what it changed about [outcome].",
      "What if the fastest way to [goal] is to stop doing [common action]?",
      "This is the part of [topic] I wish someone had shown me first.",
      "I tested the advice about [topic] so you can see what actually holds up.",
      "The answer to [common question] depends on one thing most guides leave out.",
      "Watch how [simple input] changes [result] in [topic].",
    ],
  },
  {
    slug: "controversial",
    name: "Controversial",
    description:
      "Challenge a familiar assumption with a defensible point of view, evidence, and room for a thoughtful response.",
    intent: "controversial hooks",
    formula: "Familiar belief + respectful challenge + reason",
    templates: [
      "Unpopular opinion: [common advice] is not the best way to [goal].",
      "I disagree with the usual advice about [topic]—here is the evidence that changed my mind.",
      "We should stop treating [popular tactic] as a shortcut to [outcome].",
      "A hard truth about [topic]: [specific claim]. Here is what I mean.",
      "Not every [popular choice] is worth it. I would choose [alternative] for [reason].",
      "The loudest advice about [topic] often skips the most important trade-off.",
      "I used to believe [common belief]. Then [experience] gave me a better answer.",
      "Hot take: [popular metric] does not tell the whole story about [outcome].",
      "You do not need to [common requirement] to make progress on [goal].",
      "The debate about [topic] misses the practical question: [better question].",
      "I would not recommend [common tactic] until you check [important condition].",
      "More [popular input] is not always better for [desired result].",
      "Here is why I stopped following the standard playbook for [topic].",
      "The best choice for [goal] might be the one that looks less impressive.",
      "A respectful disagreement about [topic]: [claim] works better when [condition].",
    ],
  },
  {
    slug: "statistics-based",
    name: "Statistics-Based",
    description:
      "Lead with a meaningful number, explain its context, and connect it to an actionable conclusion.",
    intent: "statistics-based hooks",
    formula: "Relevant number + context + practical takeaway",
    templates: [
      "[Number] [items or people] later, this is what I learned about [topic].",
      "I tracked [metric] for [time period]. The clearest pattern was [finding].",
      "One number changed how I think about [topic]: [verified number and context].",
      "[Percentage]% of [group] face [challenge], but [specific action] can help.",
      "Here is the before-and-after data from [experiment]: [result with context].",
      "I compared [number] approaches to [goal]. This one consistently stood out.",
      "The average hides an important detail about [metric]. Let me show you.",
      "[Time period] of testing [topic] produced [result]. Here is what the number means.",
      "This small dataset answered a big question about [topic]: [question].",
      "A [number]-step process helped me move [metric] from [baseline] to [result].",
      "The stat about [topic] worth remembering is [number]—with one important caveat.",
      "I measured [metric] before and after [change]. Here is the difference.",
      "How much does [action] affect [outcome]? I tracked [metric] to find out.",
      "These [number] examples reveal a pattern in [topic] you can use.",
      "One comparison makes [topic] easier to understand: [number A] versus [number B].",
    ],
  },
  {
    slug: "storytelling",
    name: "Storytelling",
    description:
      "Start in a specific moment, introduce a real tension, and lead toward a lesson your audience can use.",
    intent: "storytelling hooks",
    formula: "Specific moment + tension + earned lesson",
    templates: [
      "The day I [specific moment], I realized I had misunderstood [topic].",
      "I was about to [action] when [unexpected event] changed the plan.",
      "A year ago, I was [starting point]. This is what helped me reach [milestone].",
      "I still remember the moment [person or event] made me rethink [topic].",
      "My first attempt at [goal] failed because I overlooked [lesson].",
      "It started with [small event]. By the end, I had learned [useful insight].",
      "I thought [assumption] would happen. Then [turning point] proved me wrong.",
      "The most useful lesson I learned about [topic] came from [specific experience].",
      "Here is the story behind [result]—including the part I nearly left out.",
      "I had [challenge] and [time limit]. This is how I decided what to do next.",
      "One conversation about [topic] stayed with me. Here is the detail that mattered.",
      "Before [milestone], there was one small decision I almost did not make.",
      "I learned [lesson] the hard way during [specific situation].",
      "The turning point in my [topic] story was not what I expected.",
      "Let me take you back to [moment]. It explains why I approach [topic] differently.",
    ],
  },
  {
    slug: "problem-solution",
    name: "Problem-Solution",
    description:
      "Name a recognizable frustration, promise a realistic next step, and show how to apply the solution.",
    intent: "problem-solution hooks",
    formula: "Specific frustration + practical fix + clear benefit",
    templates: [
      "If [problem] keeps getting in the way of [goal], try this [number]-step fix.",
      "Struggling with [specific challenge]? Start by changing [first actionable step].",
      "Here is a simple way to fix [problem] without [unwanted trade-off].",
      "When [problem] happens, use this checklist to get back to [desired result].",
      "The reason [task] feels difficult may be [cause]. Here is how to address it.",
      "A practical fix for [problem]: [action] before you [common next step].",
      "If you only have [time or resource], use it to solve [highest-priority problem].",
      "Stop guessing at [challenge]. This framework helps you choose your next move.",
      "I made [task] easier by breaking [large problem] into [small first step].",
      "Here is how to avoid [common mistake] when you are trying to [goal].",
      "A quick troubleshooting guide for [problem] and what to try first.",
      "You do not need a full reset to improve [topic]. Start with this one adjustment.",
      "If [symptom] keeps happening, check [likely cause] before changing everything.",
      "Turn [frustrating situation] into a repeatable process with these steps.",
      "The easiest way to get unstuck on [topic] is to make the next step smaller.",
    ],
  },
  {
    slug: "negativity-bias",
    name: "Negativity-Bias",
    description:
      "Use a cautionary opening to identify a real risk, then offer a constructive way to prevent or fix it.",
    intent: "negativity-bias hooks",
    formula: "Credible risk + consequence + constructive prevention",
    templates: [
      "Avoid this [topic] mistake before it costs you [specific consequence].",
      "If you are doing [action], watch out for [common risk] and try [safer step].",
      "This overlooked [topic] mistake can make [goal] harder than it needs to be.",
      "Do not repeat my [specific mistake]. Here is what I would do differently.",
      "The warning sign I missed before [problem] was [early clue].",
      "Before you try [popular tactic], check that it will not create [unwanted result].",
      "Three things to review before [action] so you can avoid [preventable problem].",
      "I wish I had spotted [warning sign] sooner. Here is how to recognize it.",
      "One habit can quietly undermine [goal]. Here is a practical way to replace it.",
      "What not to do when [situation]—and the safer alternative to use instead.",
      "This shortcut around [topic] can backfire if you miss [important condition].",
      "A common [topic] pitfall is [risk]. Use this check to catch it early.",
      "If [undesired outcome] keeps happening, stop and look for [possible cause].",
      "The costly part of [mistake] is easy to miss until [consequence] appears.",
      "Protect your progress on [goal] by avoiding this one preventable misstep.",
    ],
  },
  {
    slug: "question-based",
    name: "Question-Based",
    description:
      "Ask one focused question your audience genuinely wants answered, then deliver the answer without delay.",
    intent: "question-based hooks",
    formula: "Audience-relevant question + promised answer",
    templates: [
      "What would change if you could [desired outcome] without [usual obstacle]?",
      "Are you making this common assumption about [topic]?",
      "Which matters more for [goal]: [option A] or [option B]? Here is how to decide.",
      "Why does [specific problem] keep happening, even when you [common effort]?",
      "What is the first thing to fix when [challenge] gets in the way of [goal]?",
      "Could [simple change] make [topic] easier? I tested it to find out.",
      "How do you know whether [option] is right for your [specific situation]?",
      "What is one [topic] lesson you can use before [next action]?",
      "Are you focusing on [popular metric] when [more useful metric] matters more?",
      "What happens when you replace [usual approach] with [alternative]?",
      "How can you make progress on [goal] when you only have [constraint]?",
      "Which [number] steps make the biggest difference to [desired outcome]?",
      "What is the simplest way to explain [confusing topic] to [audience]?",
      "Have you tried [action] before changing [larger part of the process]?",
      "What would you tell someone starting [topic] today? Here is my answer.",
    ],
  },
] as const;

export type PlatformSlug = (typeof PLATFORMS)[number]["slug"];
export type HookTypeSlug = (typeof HOOK_TYPES)[number]["slug"];

export type HookPage = {
  platform: (typeof PLATFORMS)[number];
  hookType: (typeof HOOK_TYPES)[number];
  hooks: string[];
};

export const HOOK_PAGES: HookPage[] = PLATFORMS.flatMap((platform) =>
  HOOK_TYPES.map((hookType) => ({
    platform,
    hookType,
    hooks: hookType.templates.map((template) =>
      template
        .replaceAll("[platform]", platform.name)
        .replace(/\[([^\]]+)\]/g, (_match, prompt: string) =>
          `[${prompt} for ${platform.contentContext}]`,
        ),
    ),
  })),
);

export function getHookPage(
  platformSlug: string,
  hookTypeSlug: string,
): HookPage | undefined {
  return HOOK_PAGES.find(
    (page) =>
      page.platform.slug === platformSlug &&
      page.hookType.slug === hookTypeSlug,
  );
}
