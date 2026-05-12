"use client";

import { useState } from "react";
import { subDays } from "date-fns";

const INTENSITY_CLASSES = [
  "bg-transparent border border-border-subtle/30",
  "bg-primary/10",
  "bg-primary/20",
  "bg-primary/30",
  "bg-primary/40",
  "bg-primary/50",
  "bg-primary/60",
  "bg-primary/70",
  "bg-primary/80",
  "bg-primary/90",
  "bg-primary",
];

interface HeatmapGridProps {
  data: number[];
  weeks: number;
}

export function HeatmapGrid({ data, weeks }: HeatmapGridProps) {
  const [tooltip, setTooltip] = useState<{
    index: number;
    x: number;
    y: number;
  } | null>(null);

  const totalDays = weeks * 7;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const getDate = (index: number) =>
    subDays(todayStart, totalDays - 1 - index);

  const getLabel = (index: number) => {
    const d = getDate(index);
    const value = data[index] ?? 0;
    const formatted = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return value === 0 ? `No logs — ${formatted}` : `${value} cigs — ${formatted}`;
  };

  return (
    <div className="relative">
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
      >
        {data.map((value, i) => (
          <div
            key={i}
            className={`
              aspect-square rounded-sm cursor-pointer
              transition-all duration-150
              hover:scale-125 hover:z-10 hover:brightness-125
              ${INTENSITY_CLASSES[value]}
            `}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const parentRect =
                e.currentTarget.closest("[data-heatmap-root]")?.getBoundingClientRect();
              setTooltip({
                index: i,
                x: rect.left - (parentRect?.left ?? 0) + rect.width / 2,
                y: rect.top - (parentRect?.top ?? 0),
              });
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </div>

      {/* Tooltip */}
      {tooltip !== null && (
        <div
          className="
            pointer-events-none absolute z-20
            -translate-x-1/2 -translate-y-full -mt-1
            whitespace-nowrap
            rounded-lg border border-border-strong
            bg-surface-elevated
            px-2.5 py-1.5
            text-[11px] font-medium text-foreground
            shadow-lg
          "
          style={{
            left: tooltip.x,
            top: tooltip.y - 6,
          }}
        >
          {getLabel(tooltip.index)}
          {/* Arrow */}
          <span
            className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-border-strong"
            style={{ marginTop: "-1px" }}
          />
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-surface-elevated" />
        </div>
      )}
    </div>
  );
}
