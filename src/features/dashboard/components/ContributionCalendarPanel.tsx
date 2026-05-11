"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import type { CalendarDay } from "@/src/features/smoke/queries";

const ContributionCalendar = dynamic(
  () =>
    import("@/src/components/charts/ContributionCalendar").then(
      (m) => m.ContributionCalendar
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 animate-pulse rounded-lg bg-white/5" aria-hidden />
    ),
  }
);

export function ContributionCalendarPanel({
  title = "Smoking Activity",
  initialYear,
  initialData,
  contentClassName,
}: {
  title?: string;
  initialYear: number;
  initialData: CalendarDay[];
  /** e.g. overflow-x-auto on calendar page */
  contentClassName?: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className={contentClassName}>
        <ContributionCalendar initialYear={initialYear} initialData={initialData} />
      </CardContent>
    </Card>
  );
}
