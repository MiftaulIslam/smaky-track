"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { BrandDistribution } from "@/src/features/smoke/queries";
import { formatBDT } from "@/src/lib/money";

const COLORS = ["#6b62f2", "#b2b2b2", "#4867af", "#e5e5e5", "#9c8ff8"];

interface BrandPieChartProps {
  data: BrandDistribution[];
}

function CustomTooltip(props: TooltipProps<number, string>) {
  const { active, payload } = props as {
    active?: boolean;
    payload?: Array<{ name?: string; value?: number; payload?: BrandDistribution }>;
  };
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-gunmetal bg-[#0f0f0f] px-3 py-2 text-[13px] shadow-lg">
      <p className="text-ghost-white font-medium">{item?.name}</p>
      <p className="text-ash-text">{item?.value} cigarettes</p>
      {item?.payload && (
        <p className="text-slate-text">{formatBDT(item.payload.spendMinor)}</p>
      )}
    </div>
  );
}

export function BrandPieChart({ data }: BrandPieChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-[200px] items-center justify-center text-[14px] text-slate-text">
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={75}
          innerRadius={40}
          paddingAngle={2}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ color: "#b2b2b2", fontSize: "12px" }}>{value}</span>
          )}
          iconSize={8}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
