import type { Prisma } from "@prisma/client";
import {
  CREATOR_NICHES,
  RESOURCE_CATEGORIES,
  type CreatorNiche,
  type CreatorResource,
  type PersistedCreatorResource,
  type ResourceCategory,
  type ResourcePlatform,
} from "@/data/resources";

export const RESOURCE_VISITOR_COOKIE = "hooktos_resource_visitor";

export type CreatorResourceRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  niche: string;
  summary: string;
  content: Prisma.JsonValue;
  platforms: string[];
  likesCount: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isResourceCategory(value: string): value is ResourceCategory {
  return RESOURCE_CATEGORIES.some((category) => category === value);
}

function isCreatorNiche(value: string): value is CreatorNiche {
  return CREATOR_NICHES.some((niche) => niche === value);
}

function isResourcePlatform(value: string): value is ResourcePlatform {
  return (
    value === "TikTok" ||
    value === "Instagram Reels" ||
    value === "YouTube Shorts"
  );
}

function getResourceContent(resource: CreatorResource): Prisma.InputJsonObject {
  const niches = resource.niches;
  switch (resource.category) {
    case "swipe-files":
      return {
        hook: resource.hook,
        generatorPrompt: resource.generatorPrompt,
        niches,
      };
    case "prompt-packs":
      return { prompt: resource.prompt, niches };
    case "checklists":
      return { items: resource.items, niches };
    case "templates":
      return { content: resource.content, niches };
  }
}

export function toCreatorResourceData(resource: CreatorResource) {
  return {
    slug: resource.slug,
    title: resource.title,
    category: resource.category,
    niche: resource.niches.join(", "),
    summary: resource.description,
    content: getResourceContent(resource),
    platforms: [...resource.platforms],
  };
}

export function fromCreatorResourceRow(
  row: CreatorResourceRow,
  liked: boolean,
): PersistedCreatorResource | null {
  if (!isResourceCategory(row.category) || !isRecord(row.content)) return null;

  const content = row.content;
  const platforms = row.platforms.filter(isResourcePlatform);
  if (platforms.length === 0) return null;

  const rawNiches = content.niches;
  const niches = Array.isArray(rawNiches)
    ? rawNiches.filter(
        (niche): niche is CreatorNiche =>
          typeof niche === "string" && isCreatorNiche(niche),
      )
    : row.niche
        .split(",")
        .map((niche) => niche.trim())
        .filter(isCreatorNiche);
  if (niches.length === 0) return null;

  const base = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.summary,
    platforms,
    niches,
    likesCount: row.likesCount,
    liked,
  };

  switch (row.category) {
    case "swipe-files":
      if (
        typeof content.hook !== "string" ||
        typeof content.generatorPrompt !== "string"
      ) {
        return null;
      }
      return {
        ...base,
        category: "swipe-files",
        hook: content.hook,
        generatorPrompt: content.generatorPrompt,
      };
    case "prompt-packs":
      return typeof content.prompt === "string"
        ? { ...base, category: "prompt-packs", prompt: content.prompt }
        : null;
    case "checklists":
      if (!Array.isArray(content.items)) return null;
      const checklistItems = content.items.filter(
        (item): item is string => typeof item === "string",
      );
      return checklistItems.length === content.items.length
        ? { ...base, category: "checklists", items: checklistItems }
        : null;
    case "templates":
      return typeof content.content === "string"
        ? { ...base, category: "templates", content: content.content }
        : null;
  }
}

export function getResourceSearchText(resource: CreatorResource): string {
  const content =
    resource.category === "swipe-files"
      ? `${resource.hook} ${resource.generatorPrompt}`
      : resource.category === "prompt-packs"
        ? resource.prompt
        : resource.category === "checklists"
          ? resource.items.join(" ")
          : resource.content;

  return [
    resource.title,
    resource.description,
    resource.category,
    resource.niches.join(" "),
    resource.platforms.join(" "),
    content,
  ]
    .join(" ")
    .toLowerCase();
}

export function isResourceVisitorKey(value: string | undefined): value is string {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
}
