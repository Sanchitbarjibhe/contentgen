// components/VisualPreviewModal.tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, X } from "lucide-react";
import { FRAMEWORK_LABELS } from "@/lib/types";
import { retentionTier } from "@/lib/utils";
import type { HookResult } from "@/lib/types";

interface VisualPreviewModalProps {
  hooks: HookResult[];
  initialIndex: number;
  onClose: () => void;
}

// A different gradient per framework so the "simulated footage" doesn't
// look identical for every hook.
const FRAMEWORK_GRADIENTS: Record<string, string> = {
  VISUAL_HOOK: "from-fuchsia-600 via-purple-700 to-zinc-950",
  CURIOSITY_GAP: "from-indigo-600 via-blue-800 to-zinc-950",
  NEGATIVE_FRAMING: "from-rose-600 via-red-800 to-zinc-950",
  CONTROVERSY: "from-amber-500 via-orange-700 to-zinc-950",
  PROBLEM_SOLUTION: "from-emerald-600 via-teal-800 to-zinc-950",
};

export function VisualPreviewModal({ hooks, initialIndex, onClose }: VisualPreviewModalProps) {
  const [index, setIndex] = useState(initialIndex);
  const hook = hooks[index];

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, hooks.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hooks.length, onClose]);

  const tier = retentionTier(hook.retentionScore);
  const gradient = FRAMEWORK_GRADIENTS[hook.framework] ?? FRAMEWORK_GRADIENTS.VISUAL_HOOK;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
          <NavButton
            direction="left"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          />

          {/* 9:16 phone frame */}
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="relative aspect-[9/16] w-[min(90vw,340px)] overflow-hidden rounded-[2rem] border-[6px] border-zinc-800 bg-black shadow-2xl"
          >
            {/* Simulated video background */}
            <div className={`absolute inset-0 bg-gradient-to-b ${gradient}`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.12),transparent_60%)]" />

            {/* Notch */}
            <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-black/60" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-1.5 text-white/80 hover:text-white"
              aria-label="Close preview"
            >
              <X className="size-4" />
            </button>

            {/* Framework + score */}
            <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
              <span className="w-fit rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-medium text-white/90">
                {FRAMEWORK_LABELS[hook.framework]}
              </span>
              <span
                className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${tier.className}`}
              >
                {hook.retentionScore}% Scroll-Stop
              </span>
            </div>

            {/* Hook text overlay */}
            <div className="absolute inset-x-0 top-1/3 z-10 px-5 text-center">
              <p
                className="text-balance text-xl font-extrabold leading-snug text-white"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
              >
                {hook.hook}
              </p>
            </div>

            {/* Fake TikTok/Reels right-hand action rail */}
            <div className="absolute bottom-20 right-3 z-10 flex flex-col items-center gap-4 text-white">
              <div className="flex flex-col items-center gap-1">
                <Heart className="size-6" />
                <span className="text-[10px] text-white/80">24.1k</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <MessageCircle className="size-6" />
                <span className="text-[10px] text-white/80">312</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Share2 className="size-6" />
                <span className="text-[10px] text-white/80">Share</span>
              </div>
            </div>

            {/* Bottom scrub bar */}
            <div className="absolute inset-x-0 bottom-0 z-10 h-1 bg-white/20">
              <div className="h-full w-1/3 bg-white" />
            </div>
          </motion.div>

          <NavButton
            direction="right"
            disabled={index === hooks.length - 1}
            onClick={() => setIndex((i) => Math.min(i + 1, hooks.length - 1))}
          />
        </div>

        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-zinc-500">
          {index + 1} / {hooks.length} — use ← → to browse
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

function NavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous hook" : "Next hook"}
      className="rounded-full bg-white/5 p-2 text-zinc-300 ring-1 ring-inset ring-white/10 hover:bg-white/10 disabled:opacity-20"
    >
      <Icon className="size-5" />
    </button>
  );
}
