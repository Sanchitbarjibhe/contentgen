// components/UsageChart.tsx
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

interface UsageChartProps {
  /** Oldest -> newest, 7 entries. */
  data: { label: string; count: number }[];
}

export function UsageChart({ data }: UsageChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-zinc-200">Generations — last 7 days</h3>
      </CardHeader>
      <CardBody>
        <div className="flex h-32 items-end gap-2.5">
          {data.map((d) => (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-sm bg-gradient-to-t from-indigo-600 to-indigo-400"
                style={{ height: `${Math.max((d.count / max) * 100, d.count > 0 ? 6 : 2)}%` }}
                title={`${d.count} generation${d.count === 1 ? "" : "s"}`}
              />
              <span className="text-[10px] text-zinc-600">{d.label}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
