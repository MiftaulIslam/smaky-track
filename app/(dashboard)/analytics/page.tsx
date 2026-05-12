import type { Metadata } from "next";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import {
  getDailyAggregates,
  getBrandDistribution,
  getMonthlyAggregates,
  getWeeklyHeatmap,
  getKpis,
} from "@/src/features/smoke/queries";
import { Card } from "@/src/components/ui/card";
import { formatBDT, fromMinorUnits } from "@/src/lib/money";
import { Badge } from "@/src/components/ui/badge";
import { AnalyticsChartsGrid } from "@/src/features/dashboard/components/AnalyticsChartsGrid";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [kpis, daily90, monthly12, brandDist90, weekly16] = await Promise.all([
    getKpis(userId),
    getDailyAggregates(userId, 90),
    getMonthlyAggregates(userId, 12),
    getBrandDistribution(userId, 90),
    getWeeklyHeatmap(userId, 16),
  ]);

  const yearlyProjectedSmokes = Math.round(kpis.avgPerDay * 365);
  const yearlyProjectedSpend = Math.round(
    kpis.avgPerDay * 365 * (kpis.month.spendMinor / Math.max(kpis.month.count, 1))
  );
  const avgCostPerSmoke =
    kpis.month.count > 0
      ? fromMinorUnits(kpis.month.spendMinor / kpis.month.count)
      : 0;

  return (
    <div className="p-6 md:p-8 space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Deep dive into your smoking patterns and trends
        </p>
      </div>

      <section aria-labelledby="projections-heading">
        <h2
          id="projections-heading"
          className="font-heading text-base font-semibold text-foreground mb-4"
        >
          Projections
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            {
              label: "Est. yearly smokes",
              value: yearlyProjectedSmokes.toLocaleString(),
              badge: "at current rate",
            },
            {
              label: "Est. yearly spend",
              value: formatBDT(yearlyProjectedSpend),
              badge: "at current rate",
            },
            {
              label: "Avg cost / smoke",
              value: `৳${avgCostPerSmoke.toFixed(2)}`,
              badge: "this month",
            },
            {
              label: "If reduced 20%",
              value: formatBDT(Math.round(yearlyProjectedSpend * 0.8)),
              badge: "yearly savings: " + formatBDT(Math.round(yearlyProjectedSpend * 0.2)),
            },
          ].map((item) => (
            <Card key={item.label} className="p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {item.label}
              </p>
              <p className="font-heading text-[22px] font-semibold text-foreground">{item.value}</p>
              <Badge variant="secondary" className="mt-2 text-[10px]">
                {item.badge}
              </Badge>
            </Card>
          ))}
        </div>
      </section>

      <AnalyticsChartsGrid
        daily90={daily90}
        monthly12={monthly12}
        brandDist90={brandDist90}
        kpis={kpis}
        weekly16={weekly16}
      />
    </div>
  );
}
