// components/DashboardGenerator.tsx
"use client";

import { useState } from "react";
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
  onGenerated?: (result: SavedGeneration) => void;
}

export function DashboardGenerator({ initialUsage, onGenerated }: DashboardGeneratorProps) {
  const [result, setResult] = useState<(GenerationResult & { id: string }) | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);

  return (
    <div className="space-y-8">
      <HookGeneratorForm
        initialUsage={initialUsage}
        onGenerated={(data) => {
          setResult(data);
          onGenerated?.(data);
        }}
        onUpgrade={() => setPaywallOpen(true)}
      />
      {result && <OutputCards result={result} />}
      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}
