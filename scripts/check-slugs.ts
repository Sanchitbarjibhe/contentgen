import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const invalid: string[] = [];

function checkSlug(label: string, slug: string) {
  if (
    slug !== slug.toLowerCase() ||
    slug.includes("_") ||
    slug.endsWith("/") ||
    slug.includes(" ")
  ) {
    invalid.push(`${label}: ${slug}`);
  }
}

const blogDir = path.join(process.cwd(), "content", "blogs");
if (fs.existsSync(blogDir)) {
  for (const file of fs.readdirSync(blogDir)) {
    if (!/\.(md|mdx)$/i.test(file)) continue;
    const fullPath = path.join(blogDir, file);
    const parsed = matter(fs.readFileSync(fullPath, "utf8"));
    const slug = typeof parsed.data.slug === "string"
      ? parsed.data.slug
      : file.replace(/\.(md|mdx)$/i, "");
    checkSlug(`blog/${file}`, slug);
  }
}

for (const [label, slugs] of [
  ["platform", ["tiktok", "instagram-reels", "youtube-shorts", "linkedin", "twitter-x"]],
  ["hook-type", ["curiosity", "controversial", "statistics-based", "storytelling", "problem-solution", "negativity-bias", "question-based"]],
  ["marketplace-category", ["ai-tools", "saas-tools", "content-creators", "youtube-creators", "instagram-creators", "marketing-agencies", "startups"]],
] as const) {
  for (const slug of slugs) checkSlug(label, slug);
}

if (invalid.length) {
  console.error("SEO slug check failed:");
  for (const item of invalid) console.error(`- ${item}`);
  process.exit(1);
}

console.log("🎯 SEO slug check passed. All audited slugs are lowercase and hyphenated.");
