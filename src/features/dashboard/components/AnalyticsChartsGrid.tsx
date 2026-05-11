"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import type {
  BrandDistribution,
  DailyAggregate,
  KpiData,
  MonthlyAggregate,
  WeeklyHeatmapCell,
} from "@/src/features/smoke/queries";

const DailyTrendChart = dynamic(
  () =>
    import("@/src/components/charts/DailyTrendChart").then((m) => m.DailyTrendChart),
  { ssr: false }
);
const SpendingAreaChart = dynamic(
  () =>
    import("@/src/components/charts/SpendingAreaChart").then((m) => m.SpendingAreaChart),
  { ssr: false }
);
const BrandPieChart = dynamic(
  () =>
    import("@/src/components/charts/BrandPieChart").then((m) => m.BrandPieChart),
  { ssr: false }
);
const ReductionBarChart = dynamic(
  () =>
    import("@/src/components/charts/ReductionBarChart").then((m) => m.ReductionBarChart),
  { ssr: false }
);
const WeeklyHeatmapChart = dynamic(
  () =>
    import("@/src/components/charts/WeeklyHeatmapChart").then((m) => m.WeeklyHeatmapChart),
  { ssr: false }
);

export function AnalyticsChartsGrid({
  daily90,
  monthly12,
  brandDist90,
  kpis,
  weekly16,
}: {
  daily90: DailyAggregate[];
  monthly12: MonthlyAggregate[];
  brandDist90: BrandDistribution[];
  kpis: KpiData;
  weekly16: WeeklyHeatmapCell[];
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Daily Trend (90 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <DailyTrendChart data={daily90} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending (12 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <SpendingAreaChart data={monthly12} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand Distribution (90d)</CardTitle>
        </CardHeader>
        <CardContent>
          <BrandPieChart data={brandDist90} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Month-over-Month</CardTitle>
        </CardHeader>
        <CardContent>
          <ReductionBarChart kpis={kpis} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Smoking Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyHeatmapChart data={weekly16} />
        </CardContent>
      </Card>
    </div>
  );
}
