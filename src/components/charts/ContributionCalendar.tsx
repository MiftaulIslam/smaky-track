"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, getDay, startOfYear, eachDayOfInterval, endOfYear } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import { getCalendarDataAction } from "@/src/features/smoke/calendarAction";
import type { CalendarDay } from "@/src/features/smoke/queries";
import { formatBDT } from "@/src/lib/money";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

function getIntensityClass(count: number, max: number): string {
  if (count === 0) return "bg-white/[0.04] hover:bg-white/[0.08]";
  const pct = count / max;
  if (pct < 0.25) return "bg-[rgba(107,98,242,0.25)] hover:bg-[rgba(107,98,242,0.35)]";
  if (pct < 0.5) return "bg-[rgba(107,98,242,0.5)] hover:bg-[rgba(107,98,242,0.6)]";
  if (pct < 0.75) return "bg-[rgba(107,98,242,0.7)] hover:bg-[rgba(107,98,242,0.8)]";
  return "bg-[rgba(107,98,242,0.9)] hover:bg-interactive-glow";
}

interface TooltipState {
  content: CalendarDay;
  x: number;
  y: number;
}

interface ContributionCalendarProps {
  initialYear?: number;
  initialData?: CalendarDay[];
}

export function ContributionCalendar({ initialYear, initialData }: ContributionCalendarProps) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(initialYear ?? currentYear);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["calendar", year],
    queryFn: () => getCalendarDataAction(year),
    initialData: year === initialYear ? initialData : undefined,
    staleTime: 5 * 60 * 1000,
  });

  // Build lookup map
  const dayMap = useMemo(() => {
    const map = new Map<string, CalendarDay>();
    if (data) {
      for (const d of data) {
        map.set(d.date, d);
      }
    }
    return map;
  }, [data]);

  // Get max count for intensity scale
  const maxCount = useMemo(() => {
    if (!data?.length) return 1;
    return Math.max(...data.map((d) => d.count), 1);
  }, [data]);

  // Build weeks array
  const weeks = useMemo(() => {
    const allDays = eachDayOfInterval({
      start: startOfYear(new Date(year, 0, 1)),
      end: endOfYear(new Date(year, 11, 31)),
    });

    const result: (Date | null)[][] = [];
    let week: (Date | null)[] = Array(getDay(allDays[0])).fill(null);

    for (const day of allDays) {
      week.push(day);
      if (week.length === 7) {
        result.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      result.push(week);
    }
    return result;
  }, [year]);

  // Month label positions
  const monthLabels = useMemo(() => {
    const labels: { month: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, col) => {
      for (const day of week) {
        if (!day) continue;
        const m = day.getMonth();
        if (m !== lastMonth) {
          labels.push({ month: MONTHS[m], col });
          lastMonth = m;
        }
        break;
      }
    });
    return labels;
  }, [weeks]);

  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => currentYear - i
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-[13px] text-slate-text">
          Activity for {year}
        </div>
        <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger className="w-24 h-8 text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <div className="relative overflow-x-auto pb-2" onMouseLeave={() => setTooltip(null)}>
          {/* Month labels */}
          <div className="flex mb-1 pl-[26px]">
            {monthLabels.map(({ month, col }) => (
              <div
                key={`${month}-${col}`}
                className="text-[10px] text-slate-text absolute"
                style={{ left: `${26 + col * 14}px` }}
              >
                {month}
              </div>
            ))}
          </div>
          <div className="mt-4" />

          <div className="flex gap-[3px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-1">
              {DAYS_SHORT.map((d, i) => (
                <div
                  key={i}
                  className="text-[9px] text-slate-text w-[12px] h-[11px] flex items-center"
                >
                  {i % 2 === 1 ? d : ""}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => {
                  if (!day) {
                    return <div key={di} className="w-[11px] h-[11px]" />;
                  }
                  const dateStr = format(day, "yyyy-MM-dd");
                  const dayData = dayMap.get(dateStr);
                  const count = dayData?.count ?? 0;
                  const intensityClass = getIntensityClass(count, maxCount);

                  return (
                    <div
                      key={di}
                      className={`w-[11px] h-[11px] rounded-[2px] cursor-pointer transition-colors ${intensityClass}`}
                      onMouseEnter={(e) => {
                        if (dayData) {
                          const rect = (e.target as HTMLElement).getBoundingClientRect();
                          setTooltip({ content: dayData, x: rect.left, y: rect.top });
                        } else {
                          setTooltip(null);
                        }
                      }}
                      role="gridcell"
                      aria-label={`${dateStr}: ${count} cigarettes`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Floating tooltip */}
          {tooltip && (
            <div
              className="fixed z-50 pointer-events-none rounded-lg border border-gunmetal bg-[#0f0f0f] p-3 text-[12px] shadow-xl"
              style={{ top: tooltip.y - 80, left: tooltip.x - 60 }}
            >
              <p className="text-ash-text mb-1 font-medium">
                {format(parseISO(tooltip.content.date), "MMMM d, yyyy")}
              </p>
              <p className="text-ghost-white">
                {tooltip.content.count} cigarette{tooltip.content.count !== 1 ? "s" : ""}
              </p>
              <p className="text-slate-text">{formatBDT(tooltip.content.spendMinor)}</p>
              {tooltip.content.brands.length > 0 && (
                <p className="text-slate-text">{tooltip.content.brands.join(", ")}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 text-[11px] text-slate-text">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="w-[11px] h-[11px] rounded-[2px]"
            style={{
              backgroundColor:
                level === 0
                  ? "rgba(255,255,255,0.04)"
                  : `rgba(107,98,242,${0.2 + level * 0.175})`,
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
