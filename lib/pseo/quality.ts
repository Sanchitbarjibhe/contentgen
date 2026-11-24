import type { PageContent } from "./types";

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function tokenize(text: string) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2),
  );
}

export function similarityRatio(a: string, b: string) {
  const left = tokenize(a);
  const right = tokenize(b);
  if (!left.size || !right.size) return 0;
  let intersection = 0;
  for (const word of left) if (right.has(word)) intersection++;
  return intersection / Math.max(left.size, right.size);
}

export function scorePage(page: PageContent) {
  let score = 0;
  if (wordCount(page.intro) >= 120) score += 25;
  if (page.examples.length >= 8) score += 25;
  if (page.faqs.length >= 4) score += 15;
  if (page.dos.length >= 3 && page.donts.length >= 3) score += 10;
  if (page.related.length >= 4) score += 10;
  if (page.uniquenessRatio >= 0.6) score += 15;
  return score;
}

export function failingChecks(page: PageContent) {
  const failing: string[] = [];
  if (wordCount(page.intro) < 120) failing.push("intro<120");
  if (page.examples.length < 8) failing.push("examples<8");
  if (page.faqs.length < 4) failing.push("faqs<4");
  if (page.dos.length < 3) failing.push("dos/donts<3");
  if (page.related.length < 4) failing.push("related<4");
  if (page.uniquenessRatio < 0.6) failing.push("uniqueness<0.6");
  return failing;
}
