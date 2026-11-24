import { LINK_RULES } from "./linkMap";

const MAX_LINKS_PER_POST = 6;
const MAX_PER_TARGET = 1;

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, (character) => `\\${character}`);
}

export function autoLink(markdown: string, currentPath: string): string {
  const used = new Map<string, number>();
  let total = 0;
  let inCodeFence = false;
  const rules = [...LINK_RULES].sort((a, b) => b.priority - a.priority);

  return markdown.split(/\r?\n/).map((line) => {
    if (/^```/.test(line.trim())) {
      inCodeFence = !inCodeFence;
      return line;
    }
    if (inCodeFence) return line;
    if (/^#{1,6}\s/.test(line)) return line;
    if (/\[[^\]]+\]\([^)\r\n]+\)/.test(line)) return line;
    if (/`[^`]+`/.test(line)) return line;

    let text = line;
    for (const rule of rules) {
      if (total >= MAX_LINKS_PER_POST) break;
      if (rule.href === currentPath) continue;
      if ((used.get(rule.href) ?? 0) >= MAX_PER_TARGET) continue;

      for (const keyword of rule.keywords) {
        const regex = new RegExp(`\\b(${escapeRegex(keyword)})\\b`, "i");
        if (!regex.test(text)) continue;
        const anchor = rule.anchors?.[0];
        text = text.replace(regex, (_match, matched: string) =>
          `[${anchor ?? matched}](${rule.href})`,
        );
        used.set(rule.href, (used.get(rule.href) ?? 0) + 1);
        total++;
        break;
      }
    }
    return text;
  }).join("\n");
}
