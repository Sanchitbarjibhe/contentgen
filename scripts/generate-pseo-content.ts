import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";
import { getAllHookPages } from "../lib/pseo/data";
import { similarityRatio } from "../lib/pseo/quality";

type GeneratedContent = {
  intro: string;
  examples: { hook: string; niche: string; whyItWorks: string }[];
  faqs: { q: string; a: string }[];
  dos: string[];
  donts: string[];
  related: { platformSlug: string; hookTypeSlug: string }[];
};

const [platform, hookType] = process.argv.slice(2);
const dryRun = process.argv.includes("--dry-run");

function usage() {
  console.error(
    "Usage: tsx scripts/generate-pseo-content.ts <platform> <hook-type> [--dry-run]",
  );
  process.exit(1);
}

if (!platform || !hookType) usage();

if (!process.env.OPENAI_API_KEY && !dryRun) {
  console.error("Set OPENAI_API_KEY before generation. Use --dry-run for a safe sample.");
  process.exit(1);
}

const sample: GeneratedContent = {
  intro: `Create ${hookType} hooks for ${platform} by connecting a specific audience problem to a clear, truthful payoff. The opening should match the platform's pace and preview useful information in the first few seconds. Begin with a concrete detail, introduce one clear tension or question, and make the rest of the post prove the promise. Avoid exaggerated claims and generic phrases that could apply to any platform or niche. A strong example names the topic, audience, or surprising result without revealing the entire answer. It also fits the creator's real experience and gives viewers enough context to understand why the post matters. Use the platform's strongest visual or spoken detail as the first signal, then move quickly into the supporting explanation. Adapt the same framework across niches only when the examples remain specific and believable.`,
  examples: [
    { hook: "I tried one specific [topic] change for 7 days.", niche: "Business", whyItWorks: "Creates a measurable open loop and a concrete payoff." },
    { hook: "Most people miss this detail about [topic].", niche: "Education", whyItWorks: "Challenges assumptions while promising useful context." },
    { hook: "Here is the first step I would change.", niche: "Marketing", whyItWorks: "Starts with practical relevance." },
    { hook: "The smallest [topic] mistake can cost you [result].", niche: "Growth", whyItWorks: "Uses a credible risk and a specific reason to keep watching." },
    { hook: "I compared [option A] with [option B] for [time].", niche: "Technology", whyItWorks: "Promises a direct comparison based on real context." },
    { hook: "This is the [topic] lesson I wish I knew earlier.", niche: "Creator work", whyItWorks: "Adds personal stakes and a useful takeaway." },
    { hook: "What would happen if you stopped doing [common action]?", niche: "Productivity", whyItWorks: "Challenges a familiar behavior with a safe open question." },
    { hook: "The [topic] result changed after I focused on [detail].", niche: "Lifestyle", whyItWorks: "Shows a cause-and-effect insight without overclaiming." },
  ],
  faqs: [
    { q: `What is a ${hookType} hook?`, a: "It is an opening that creates interest with a psychology-led promise." },
    { q: `How should I customize this hook for ${platform}?`, a: "Replace every bracketed detail with an accurate topic, audience, and outcome." },
    { q: "How soon should the answer appear?", a: "Reveal the useful answer early enough that the opening remains honest and satisfying." },
    { q: "What makes the examples platform-specific?", a: "They match the pace, format, and audience behavior of the selected platform." },
  ],
  dos: ["Use a specific topic", "Keep the promise honest", "Pay off the opening quickly"],
  donts: ["Avoid unsupported claims", "Do not hide the answer too long", "Do not reuse generic prompts"],
  related: [
    { platformSlug: platform, hookTypeSlug: "storytelling" },
    { platformSlug: platform, hookTypeSlug: "curiosity" },
    { platformSlug: platform, hookTypeSlug: "question-based" },
    { platformSlug: platform, hookTypeSlug: "problem-solution" },
  ],
};

async function main() {
  let output = sample;
  if (!dryRun) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      input: `Generate structured JSON pSEO content for platform "${platform}" and hook type "${hookType}". Return only JSON with intro (120-200 words), at least 8 examples with hook/niche/whyItWorks, 4-6 FAQs with q/a, 3 dos, 3 donts, and 4 related entries. Ban generic phrases and unsupported claims.`,
    });
    const text = response.output_text;
    output = JSON.parse(text) as GeneratedContent;
  }

  console.log(JSON.stringify(output, null, 2));

  if (!dryRun) {
    const target = path.join(process.cwd(), "content", "pseo", `${platform}-${hookType}.json`);
    const existing = getAllHookPages().find(
      (page) => page.platformSlug === platform && page.hookTypeSlug === hookType,
    );
    const generatedText = [
      output.intro,
      ...output.examples.map((example) => `${example.hook} ${example.whyItWorks}`),
    ].join(" ");
    const existingText = existing
      ? [
          existing.intro,
          ...existing.examples.map((example) => `${example.hook} ${example.whyItWorks}`),
        ].join(" ")
      : "";
    if (existingText && similarityRatio(generatedText, existingText) >= 0.55) {
      console.error("Similarity check failed: generated content is too close to an existing page.");
      process.exit(1);
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, JSON.stringify(output, null, 2));
    console.log(`Saved ${target}`);
  }
}

void main();
