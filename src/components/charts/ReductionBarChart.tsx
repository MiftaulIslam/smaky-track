"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { KpiData } from "@/src/features/smoke/queries";

interface ReductionBarChartProps {
  kpis: KpiData;
}

function CustomTooltip(props: TooltipProps<number, string>) {
  const { active, payload, label } = props as {
    active?: boolean;
    payload?: Array<{ name?: string; value?: number; color?: string }>;
    label?: string;
  };
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gunmetal bg-[#0f0f0f] px-3 py-2 text-[13px] shadow-lg">
      <p className="text-ash-text mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.value} cigarettes
        </p>
      ))}
    </div>
  );
}

export function ReductionBarChart({ kpis }: ReductionBarChartProps) {
  const data = [
    { label: "This Month", count: kpis.month.count },
    { label: "Last Month", count: kpis.prevMonth.count },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#282828" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#686868", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#686868", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" name="Cigarettes" fill="#6b62f2" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
