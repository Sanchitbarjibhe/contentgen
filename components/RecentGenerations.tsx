"use client";

import { Card, CardBody } from "@/components/ui/Card";
import { formatNiche, formatPlatform, retentionTier } from "@/lib/utils";

export interface RecentGeneration {
    id: string;
    topic: string;
    niche: string;
    platform: string;
    avgRetentionScore: number;
    createdAt: string;
}

export function RecentGenerations({ generations }: { generations: RecentGeneration[] }) {
    return (
        <Card>
            <CardBody className="divide-y divide-white/[0.06] p-0">
                {generations.length === 0 ? (
                    <p className="p-6 text-center text-sm text-zinc-600">Nothing yet — generate your first set of hooks to see it here.</p>
                ) : (
                    generations.map((generation) => {
                        const tier = retentionTier(generation.avgRetentionScore);
                        return (
                            <div key={generation.id} className="p-4">
                                <div className="mb-1.5 flex items-center justify-between gap-2">
                                    <span className="text-xs font-medium text-zinc-500">{formatNiche(generation.niche)} · {formatPlatform(generation.platform)}</span>
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${tier.className}`}>{Math.round(generation.avgRetentionScore)}% avg</span>
                                </div>
                                <p className="line-clamp-2 text-sm text-zinc-300">{generation.topic}</p>
                                <p className="mt-1 text-xs text-zinc-600">{new Date(generation.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
                            </div>
                        );
                    })
                )}
            </CardBody>
        </Card>
    );
}