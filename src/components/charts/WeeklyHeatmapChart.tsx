"use client";

import type { WeeklyHeatmapCell } from "@/src/features/smoke/queries";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHour(h: number) {
  if (h === 0) return "12am";
  if (h === 12) return "12pm";
  if (h < 12) return `${h}am`;
  return `${h - 12}pm`;
}

function getIntensity(count: number, max: number): string {
  if (max === 0 || count === 0) return "rgba(255,255,255,0.03)";
  const pct = count / max;
  if (pct < 0.2) return "rgba(107,98,242,0.2)";
  if (pct < 0.4) return "rgba(107,98,242,0.4)";
  if (pct < 0.6) return "rgba(107,98,242,0.6)";
  if (pct < 0.8) return "rgba(107,98,242,0.75)";
  return "rgba(107,98,242,0.95)";
}

interface WeeklyHeatmapChartProps {
  data: WeeklyHeatmapCell[];
}

export function WeeklyHeatmapChart({ data }: WeeklyHeatmapChartProps) {
  const lookup = new Map<string, number>();
  let max = 0;
  for (const cell of data) {
    const key = `${cell.dayOfWeek}-${cell.hour}`;
    lookup.set(key, cell.count);
    if (cell.count > max) max = cell.count;
  }

  // Show every 3 hours to keep compact
  const displayHours = [0, 3, 6, 9, 12, 15, 18, 21];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[400px]">
        {/* Hour labels */}
        <div className="flex ml-10 mb-1 gap-px">
          {displayHours.map((h) => (
            <div
              key={h}
              className="text-[10px] text-muted-foreground"
              style={{ width: `${100 / 8}%` }}
            >
              {formatHour(h)}
            </div>
          ))}
        </div>

        {DAYS.map((day, dow) => (
          <div key={dow} className="flex items-center gap-px mb-1">
            <span className="w-10 text-[11px] text-muted-foreground shrink-0">{day}</span>
            <div className="flex gap-px flex-1">
              {HOURS.map((hour) => {
                const count = lookup.get(`${dow}-${hour}`) ?? 0;
                return (
                  <div
                    key={hour}
                    className="flex-1 h-4 rounded-[2px] transition-all"
                    style={{ backgroundColor: getIntensity(count, max) }}
                    title={count > 0 ? `${count} smoke${count > 1 ? "s" : ""}` : undefined}
                    aria-label={`${day} ${formatHour(hour)}: ${count} cigarettes`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
