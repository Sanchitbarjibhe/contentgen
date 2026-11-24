import OpenAI from "openai";
import { z } from "zod";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { FRAMEWORKS, type Framework, type GenerationResult, type Niche, type Platform } from "@/lib/types";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

const hookSchema = z.object({
  framework: z.enum(FRAMEWORKS),
  hook: z.string().min(1).max(400),
  retentionScore: z.number().min(0).max(100),
  rationale: z.string().min(1).max(200),
});

const responseSchema = z.object({
  hooks: z.array(hookSchema).length(10),
  description: z.string().min(1).max(1000),
  hashtags: z.object({
    broad: z.array(z.string()).length(5),
    medium: z.array(z.string()).length(5),
    lowCompetition: z.array(z.string()).length(5),
  }),
});

type GenerationInput = {
  topic: string;
  niche: Niche;
  platform: Platform;
};

export async function generateHooks(input: GenerationInput): Promise<GenerationResult> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured.");

  const groq = new OpenAI({
    apiKey,
    baseURL: GROQ_BASE_URL,
  });
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(input) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });
  const raw = completion.choices[0]?.message?.content;

  if (!raw) throw new Error("Groq returned an empty response.");
  return parseGenerationOutput(raw, input);
}

function parseGenerationOutput(raw: string, input: GenerationInput): GenerationResult {
  let output: unknown;
  const cleaned = raw.trim().replace(/^```(?:json)?\s*|\s*```$/gi, "");

  try {
    output = JSON.parse(cleaned);
  } catch {
    const json = extractJson(cleaned);
    if (json) {
      try {
        output = JSON.parse(json);
      } catch {
        output = parsePlainTextHooks(cleaned);
      }
    } else {
      output = parsePlainTextHooks(cleaned);
    }
  }

  const normalized = normalizeOutput(output, input);
  const parsed = responseSchema.safeParse(normalized);
  if (!parsed.success) {
    throw new Error(`Model output failed validation: ${parsed.error.message}`);
  }

  const avgRetentionScore = Math.round(
    parsed.data.hooks.reduce((sum, hook) => sum + hook.retentionScore, 0) / parsed.data.hooks.length
  );
  return { ...parsed.data, avgRetentionScore, generationMode: "AI" };
}

function extractJson(text: string): string | null {
  const start = text.search(/[{\[]/);
  if (start < 0) return null;

  const stack: string[] = [];
  let inString = false;
  let escaped = false;
  for (let index = start; index < text.length; index++) {
    const char = text[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "{" || char === "[") stack.push(char);
    else if (char === "}" || char === "]") {
      const opening = stack.pop();
      if ((char === "}" && opening !== "{") || (char === "]" && opening !== "[")) return null;
      if (stack.length === 0) return text.slice(start, index + 1);
    }
  }
  return null;
}

function parsePlainTextHooks(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

function normalizeOutput(output: unknown, input: GenerationInput) {
  const record = isRecord(output) ? output : {};
  const rawHooks = Array.isArray(output) ? output : record.hooks;
  if (!Array.isArray(rawHooks)) throw new Error("Model output did not contain a hook list.");

  const hookTexts = rawHooks.slice(0, 10).map((item) => {
    if (typeof item === "string") return item.trim();
    if (!isRecord(item)) return "";
    const value = item.hook ?? item.text ?? item.title ?? item.content;
    return typeof value === "string" ? value.trim() : "";
  });
  if (hookTexts.length !== 10 || hookTexts.some((hook) => !hook)) {
    throw new Error(`Model returned ${hookTexts.filter(Boolean).length} usable hooks; expected 10.`);
  }

  const hooks = hookTexts.map((hookText, index) => {
    const item = isRecord(rawHooks[index]) ? rawHooks[index] : {};
    return {
      framework: isFramework(item.framework) ? item.framework : FRAMEWORKS[index % FRAMEWORKS.length],
      hook: hookText.slice(0, 400),
      retentionScore: validScore(item.retentionScore) ? item.retentionScore : 78 - (index % 4) * 3,
      rationale: typeof item.rationale === "string" && item.rationale.trim()
        ? item.rationale.trim().slice(0, 200)
        : "Uses a distinct pattern to stop the scroll.",
    };
  });

  const hashtags = isRecord(record.hashtags) ? record.hashtags : {};
  const fallbackTags = [
    `#${input.niche.toLowerCase()}`,
    `#${input.platform.toLowerCase()}`,
    "#creator",
    "#shortvideo",
    "#contentideas",
  ];
  const normalizeTags = (value: unknown) => {
    const tags = Array.isArray(value) ? value.filter((tag): tag is string => typeof tag === "string" && !!tag.trim()) : [];
    return [...tags.slice(0, 5), ...fallbackTags].slice(0, 5);
  };

  return {
    hooks,
    description: typeof record.description === "string" && record.description.trim()
      ? record.description.trim().slice(0, 1000)
      : `Discover ${input.niche.toLowerCase()} ideas for ${input.platform.toLowerCase()} inspired by: ${input.topic.trim().slice(0, 300)}`,
    hashtags: {
      broad: normalizeTags(hashtags.broad),
      medium: normalizeTags(hashtags.medium),
      lowCompetition: normalizeTags(hashtags.lowCompetition),
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFramework(value: unknown): value is Framework {
  return typeof value === "string" && FRAMEWORKS.includes(value as Framework);
}

function validScore(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}
