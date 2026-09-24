// components/ui/Badge.tsx
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "indigo" | "success" | "warning" | "danger";
}

const TONES: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "bg-white/5 text-zinc-300 ring-white/10",
  indigo: "bg-indigo-500/10 text-indigo-300 ring-indigo-500/30",
  success: "bg-emerald-400/10 text-emerald-400 ring-emerald-400/30",
  warning: "bg-amber-400/10 text-amber-400 ring-amber-400/30",
  danger: "bg-rose-400/10 text-rose-400 ring-rose-400/30",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        TONES[tone],
        className
      )}
      {...props}
    />
  );
}
