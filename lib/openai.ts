import { ChatOllama } from "@langchain/ollama";
import OpenAI from "openai";
import { z } from "zod";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { FRAMEWORKS, type Framework, type GenerationResult, type Niche, type Platform } from "@/lib/types";

const AI_TIMEOUT_MS = 20_000;

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

type Provider = {
  name: string;
  generate: (input: GenerationInput) => Promise<string>;
};

export async function generateHooks(input: GenerationInput): Promise<GenerationResult> {
  const providers = getProviders();
  if (providers.length === 0) {
    throw new Error(
      "No AI provider is configured. Set Ollama_API_KEY, OLLAMA_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY, or GOOGLE_API_KEY to enable AI generation."
    );
  }

  const providerErrors: unknown[] = [];
  for (const provider of providers) {
    try {
      const raw = await provider.generate(input);
      return parseGenerationOutput(raw, input);
    } catch (error) {
      console.error(
        `AI Generation Error (${provider.name}):`,
        error instanceof Error ? error.stack ?? error.message : error
      );
      providerErrors.push(error);
    }
  }

  throw new AggregateError(providerErrors, "All configured AI providers failed.");
}

function getProviders(): Provider[] {
  const providers: Provider[] = [];
  const ollamaKey = process.env.Ollama_API_KEY?.trim() || process.env.OLLAMA_API_KEY?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim();

  if (ollamaKey) {
    providers.push({
      name: "Ollama",
      generate: async (input) => {
        const model = new ChatOllama({
          model: process.env.OLLAMA_MODEL?.trim() || "llama3",
          baseUrl:
            process.env.OLLAMA_BASE_URL?.trim() ||
            "https://ollama.com",
          temperature: 0.9,
          headers: { Authorization: `Bearer ${ollamaKey}` },
        });
        const response = await model.invoke(`${SYSTEM_PROMPT}\n\n${buildUserPrompt(input)}`);
        if (typeof response.content === "string") return response.content;

        const content = response.content
          .map((part) => {
            if (typeof part === "string") return part;
            return "text" in part && typeof part.text === "string" ? part.text : "";
          })
          .join("");
        if (!content) throw new Error("Ollama returned an empty response.");
        return content;
      },
    });
  }

  if (openAiKey) {
    providers.push({
      name: "OpenAI",
      generate: async (input) => {
        const client = new OpenAI({ apiKey: openAiKey, timeout: AI_TIMEOUT_MS, maxRetries: 0 });
        const response = await client.chat.completions.create({
          model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
          temperature: 0.9,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt(input) },
          ],
        });
        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error("OpenAI returned an empty response.");
        return content;
      },
    });
  }

  if (geminiKey) {
    providers.push({
      name: "Gemini",
      generate: async (input) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
        try {
          const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": geminiKey,
              },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: [{ role: "user", parts: [{ text: buildUserPrompt(input) }] }],
                generationConfig: {
                  temperature: 0.9,
                  responseMimeType: "application/json",
                },
              }),
              signal: controller.signal,
            }
          );
          if (!response.ok) {
            const details = (await response.text()).slice(0, 500);
            throw new Error(`Gemini request failed (${response.status}): ${details}`);
          }

          const payload = (await response.json()) as {
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          };
          const content = payload.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!content) throw new Error("Gemini returned an empty response.");
          return content;
        } finally {
          clearTimeout(timeout);
        }
      },
    });
  }

  return providers;
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
