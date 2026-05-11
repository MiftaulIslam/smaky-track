import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfDay,
  endOfWeek,
  endOfMonth,
  endOfYear,
  subDays,
  format,
  formatDistanceToNow,
  differenceInCalendarDays,
  eachDayOfInterval,
  parseISO,
} from "date-fns";

export {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfDay,
  endOfWeek,
  endOfMonth,
  endOfYear,
  subDays,
  format,
  formatDistanceToNow,
  differenceInCalendarDays,
  eachDayOfInterval,
  parseISO,
};

export type DateRange = { from: Date; to: Date };

export function getPeriodRange(
  period: "day" | "week" | "month" | "year",
  now = new Date()
): DateRange {
  switch (period) {
    case "day":
      return { from: startOfDay(now), to: endOfDay(now) };
    case "week":
      return {
        from: startOfWeek(now, { weekStartsOn: 0 }),
        to: endOfWeek(now, { weekStartsOn: 0 }),
      };
    case "month":
      return { from: startOfMonth(now), to: endOfMonth(now) };
    case "year":
      return { from: startOfYear(now), to: endOfYear(now) };
  }
}

export function getPrevPeriodRange(
  period: "month",
  now = new Date()
): DateRange {
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return { from: startOfMonth(prevMonth), to: endOfMonth(prevMonth) };
}

export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function getYearDays(year: number): Date[] {
  return eachDayOfInterval({
    start: new Date(year, 0, 1),
    end: new Date(year, 11, 31),
  });
}
