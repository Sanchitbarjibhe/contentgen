// lib/openai.ts
import { z } from "zod";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { FRAMEWORKS, type GenerationResult, type Niche, type Platform } from "@/lib/types";

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
    const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

    const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: buildUserPrompt(input) }] }],
          generationConfig: {
            temperature: 0.9,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini request failed with ${response.status}`);
    }

    const payload = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    raw = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (err) {
    throw new HookGenerationError("Gemini request failed", err);
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
