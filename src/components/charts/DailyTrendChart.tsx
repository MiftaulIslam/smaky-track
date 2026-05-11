"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import { format, parseISO } from "date-fns";
import type { DailyAggregate } from "@/src/features/smoke/queries";
import { formatBDT } from "@/src/lib/money";

interface DailyTrendChartProps {
  data: DailyAggregate[];
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
      <p className="text-ash-text mb-1">
        {label ? format(parseISO(label), "MMM d, yyyy") : ""}
      </p>
      <p className="text-ghost-white font-medium">{payload[0]?.value} cigarettes</p>
      {payload[1] && (
        <p className="text-slate-text">{formatBDT(payload[1].value ?? 0)}</p>
      )}
    </div>
  );
}

export function DailyTrendChart({ data }: DailyTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#282828" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => format(parseISO(v), "MMM d")}
          tick={{ fill: "#686868", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: "#686868", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#6b62f2"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#6b62f2", strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
