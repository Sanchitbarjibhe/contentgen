"use client";

import { useState } from "react";
import { DashboardGenerator } from "@/components/DashboardGenerator";
import { RecentGenerations, type RecentGeneration } from "@/components/RecentGenerations";
import type { GenerationResult, UsageInfo } from "@/lib/types";

type SavedGeneration = GenerationResult & {
    id: string;
    usage: UsageInfo;
    topic: string;
    niche: string;
    platform: string;
    createdAt: string;
};

interface DashboardWorkspaceProps {
    initialUsage: UsageInfo;
    initialRecent: RecentGeneration[];
}

export function DashboardWorkspace({ initialUsage, initialRecent }: DashboardWorkspaceProps) {
    const [recent, setRecent] = useState(initialRecent);

    function handleGenerated(generation: SavedGeneration) {
        const recentGeneration: RecentGeneration = {
            id: generation.id,
            topic: generation.topic,
            niche: generation.niche,
            platform: generation.platform,
            avgRetentionScore: generation.avgRetentionScore,
            createdAt: generation.createdAt,
        };
        setRecent((current) => [recentGeneration, ...current.filter((item) => item.id !== recentGeneration.id)].slice(0, 5));
    }

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Quick generate</h2>
                <DashboardGenerator initialUsage={initialUsage} onGenerated={handleGenerated} />
            </div>
            <div className="lg:col-span-2">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Recent generations</h2>
                <RecentGenerations generations={recent} />
            </div>
        </div>
    );
}