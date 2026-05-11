"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import type {
  BrandDistribution,
  DailyAggregate,
  KpiData,
  MonthlyAggregate,
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

export function DashboardChartsGrid({
  daily,
  monthly,
  brandDist,
  kpis,
}: {
  daily: DailyAggregate[];
  monthly: MonthlyAggregate[];
  brandDist: BrandDistribution[];
  kpis: KpiData;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-[15px]">Daily Trend (30d)</CardTitle>
        </CardHeader>
        <CardContent>
          <DailyTrendChart data={daily} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[15px]">Monthly Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <SpendingAreaChart data={monthly} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[15px]">Brand Distribution (30d)</CardTitle>
        </CardHeader>
        <CardContent>
          <BrandPieChart data={brandDist} />
        </CardContent>
      </Card>

      <Card className="md:col-span-2 xl:col-span-1">
        <CardHeader>
          <CardTitle className="text-[15px]">Month Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ReductionBarChart kpis={kpis} />
        </CardContent>
      </Card>
    </div>
  );
}
