// components/DashboardGenerator.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { HookGeneratorForm } from "@/components/HookGeneratorForm";
import { OutputCards } from "@/components/OutputCards";
import { PaywallModal } from "@/components/PaywallModal";
import type { GenerationResult, Niche, Platform, UsageInfo } from "@/lib/types";

export type SavedGeneration = GenerationResult & {
  id: string;
  usage: UsageInfo;
  topic: string;
  niche: Niche;
  platform: Platform;
  createdAt: string;
};

interface DashboardGeneratorProps {
  initialUsage: UsageInfo;
  initialPrompt?: string;
  onGenerated?: (result: SavedGeneration) => void;
}

export function DashboardGenerator({ initialUsage, initialPrompt, onGenerated }: DashboardGeneratorProps) {
  const [result, setResult] = useState<(GenerationResult & { id: string }) | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!result) return;
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  return (
    <div className="space-y-8">
      <HookGeneratorForm
        initialUsage={initialUsage}
        initialTopic={initialPrompt}
        onGenerated={(data) => {
          setResult(data);
          onGenerated?.(data);
        }}
        onUpgrade={() => setPaywallOpen(true)}
      />
      {result && (
        <div ref={resultsRef} className="scroll-mt-24 min-w-0" id="generated-hooks">
          <OutputCards result={result} />
        </div>
      )}
      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}
