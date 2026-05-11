"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { MonthlyAggregate } from "@/src/features/smoke/queries";
import { fromMinorUnits } from "@/src/lib/money";

interface SpendingAreaChartProps {
  data: MonthlyAggregate[];
}

function CustomTooltip(props: TooltipProps<number, string>) {
  const { active, payload, label } = props as {
    active?: boolean;
    payload?: Array<{ value?: number }>;
    label?: string;
  };
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gunmetal bg-[#0f0f0f] px-3 py-2 text-[13px] shadow-lg">
      <p className="text-ash-text mb-1">{label}</p>
      <p className="text-ghost-white font-medium">
        ৳{fromMinorUnits(payload[0]?.value ?? 0).toFixed(0)}
      </p>
      {payload[1] && (
        <p className="text-slate-text">{payload[1].value} cigarettes</p>
      )}
    </div>
  );
}

export function SpendingAreaChart({ data }: SpendingAreaChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    spendBDT: fromMinorUnits(d.spendMinor),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6b62f2" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6b62f2" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#282828" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#686868", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#686868", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `৳${v}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="spendBDT"
          stroke="#6b62f2"
          strokeWidth={2}
          fill="url(#spendGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
