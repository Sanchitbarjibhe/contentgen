// components/DashboardGenerator.tsx
"use client";

import { useState } from "react";
import { HookGeneratorForm } from "@/components/HookGeneratorForm";
import { OutputCards } from "@/components/OutputCards";
import type { GenerationResult, UsageInfo } from "@/lib/types";

interface DashboardGeneratorProps {
  initialUsage: UsageInfo;
}

export function DashboardGenerator({ initialUsage }: DashboardGeneratorProps) {
  const [result, setResult] = useState<(GenerationResult & { id: string }) | null>(null);

  return (
    <div className="space-y-8">
      <HookGeneratorForm
        initialUsage={initialUsage}
        onGenerated={(data) => setResult(data)}
      />
      {result && <OutputCards result={result} />}
    </div>
  );
}
