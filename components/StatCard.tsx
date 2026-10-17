// components/StatCard.tsx
import { LucideIcon } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: boolean;
  hint?: string;
}

export function StatCard({ label, value, icon: Icon, accent, hint }: StatCardProps) {
  return (
    <Card>
      <CardBody className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500">{label}</p>
          <p className={cn("mt-1.5 text-2xl font-semibold text-zinc-100", accent && "text-indigo-400")}>
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-zinc-600">{hint}</p>}
        </div>
        <div className={cn("rounded-lg p-2", accent ? "bg-indigo-500/10" : "bg-white/5")}>
          <Icon className={cn("size-5", accent ? "text-indigo-400" : "text-zinc-400")} />
        </div>
      </CardBody>
    </Card>
  );
}
