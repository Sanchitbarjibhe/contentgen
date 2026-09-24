// lib/openai.ts
import OpenAI from "openai";
import { z } from "zod";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { FRAMEWORKS, type GenerationResult, type Niche, type Platform } from "@/lib/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ---------------------------------------------------------------------------
// Runtime validation — never trust JSON-mode output blindly. The model can
// still return malformed data (wrong counts, out-of-range scores, etc.), so
// we validate before it ever touches the database or the client.
// ---------------------------------------------------------------------------

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

export class HookGenerationError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "HookGenerationError";
  }
}

export async function generateHooks(input: {
  topic: string;
  niche: Niche;
  platform: Platform;
}): Promise<GenerationResult> {
  let raw: string | null;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(input) },
      ],
    });

    raw = completion.choices[0]?.message?.content ?? null;
  } catch (err) {
    throw new HookGenerationError("OpenAI request failed", err);
  }

  if (!raw) {
    throw new HookGenerationError("OpenAI returned an empty response");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch (err) {
    throw new HookGenerationError("Model did not return valid JSON", err);
  }

  const parsed = responseSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new HookGenerationError(
      `Model output failed schema validation: ${parsed.error.message}`
    );
  }

  const avgRetentionScore = Math.round(
    parsed.data.hooks.reduce((sum, h) => sum + h.retentionScore, 0) /
      parsed.data.hooks.length
  );

  return { ...parsed.data, avgRetentionScore };
}
