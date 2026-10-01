// components/OutputCards.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Eye, Hash } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { copyToClipboard, retentionTier } from "@/lib/utils";
import { FRAMEWORK_LABELS } from "@/lib/types";
import type { GenerationResult, HookResult } from "@/lib/types";
import { VisualPreviewModal } from "@/components/VisualPreviewModal";

interface OutputCardsProps {
  result: GenerationResult;
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} aria-label={`${label} to clipboard`}>
      {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

function HookCard({ hook, index, onPreview }: { hook: HookResult; index: number; onPreview: () => void }) {
  const tier = retentionTier(hook.retentionScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
    >
      <Card className="h-full">
        <CardBody className="flex h-full flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <Badge tone="indigo">{FRAMEWORK_LABELS[hook.framework]}</Badge>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tier.className}`}
              title="Scroll-Stop retention score"
            >
              {hook.retentionScore}% {tier.label}
            </span>
          </div>

          <p className="flex-1 text-sm leading-relaxed text-zinc-100">{hook.hook}</p>
          <p className="text-xs italic text-zinc-500">{hook.rationale}</p>

          <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
            <button
              onClick={onPreview}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-indigo-400"
            >
              <Eye className="size-3.5" />
              Preview
            </button>
            <CopyButton text={hook.hook} />
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

export function OutputCards({ result }: OutputCardsProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const allHashtags = [
    ...result.hashtags.broad,
    ...result.hashtags.medium,
    ...result.hashtags.lowCompetition,
  ];

  return (
    <div className="space-y-8">
      {/* Hooks grid */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          10 Hook Variations
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.hooks.map((hook, i) => (
            <HookCard key={i} hook={hook} index={i} onPreview={() => setPreviewIndex(i)} />
          ))}
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200">SEO Description</h3>
          <CopyButton text={result.description} />
        </CardHeader>
        <CardBody>
          <p className="text-sm leading-relaxed text-zinc-300">{result.description}</p>
        </CardBody>
      </Card>

      {/* Hashtags */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-zinc-200">
            <Hash className="size-4 text-indigo-400" />
            15 Hashtags
          </h3>
          <CopyButton text={allHashtags.map((h) => `#${h}`).join(" ")} label="Copy all" />
        </CardHeader>
        <CardBody className="space-y-4">
          <HashtagRow title="Broad reach" tags={result.hashtags.broad} tone="neutral" />
          <HashtagRow title="Medium / community" tags={result.hashtags.medium} tone="indigo" />
          <HashtagRow title="Low competition" tags={result.hashtags.lowCompetition} tone="success" />
        </CardBody>
      </Card>

      {previewIndex !== null && (
        <VisualPreviewModal
          hooks={result.hooks}
          initialIndex={previewIndex}
          onClose={() => setPreviewIndex(null)}
        />
      )}
    </div>
  );
}

function HashtagRow({
  title,
  tags,
  tone,
}: {
  title: string;
  tags: string[];
  tone: "neutral" | "indigo" | "success";
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-zinc-500">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag} tone={tone}>
            #{tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
