import type { Metadata } from "next";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import {
  getKpis,
  getLastSmokeAt,
  getDailyAggregates,
  getBrandDistribution,
  getMonthlyAggregates,
  getCalendarData,
  getRecentSmokes,
} from "@/src/features/smoke/queries";
import { getActiveBrands } from "@/src/features/brands/queries";
import { KpiCards } from "@/src/features/smoke/components/KpiCards";
import { QuickSmokeCard } from "@/src/features/smoke/components/QuickSmokeCard";
import { SectionHeader } from "@/src/components/common/SectionHeader";
import { Card, CardContent } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { formatBDT } from "@/src/lib/money";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ContributionCalendarPanel } from "@/src/features/dashboard/components/ContributionCalendarPanel";
import { DashboardChartsGrid } from "@/src/features/dashboard/components/DashboardChartsGrid";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;
  const currentYear = new Date().getFullYear();

  const [kpis, lastSmokeAt, brands, daily, monthly, brandDist, calendarData, recentSmokes] =
    await Promise.all([
      getKpis(userId),
      getLastSmokeAt(userId),
      getActiveBrands(),
      getDailyAggregates(userId, 30),
      getMonthlyAggregates(userId, 12),
      getBrandDistribution(userId, 30),
      getCalendarData(userId, currentYear),
      getRecentSmokes(userId, 5),
    ]);

  const lastBrandId = recentSmokes[0]?.brand.id;

  return (
    <div className="p-6 md:p-8 space-y-10">
      <div>
        <h1 className="font-heading text-[24px] font-semibold text-ghost-white">
          Dashboard
        </h1>
        <p className="text-[14px] text-slate-text mt-1">
          Welcome back, {session.user.name?.split(" ")[0] ?? "there"} 👋
        </p>
      </div>

      <KpiCards kpis={kpis} lastSmokeAt={lastSmokeAt} />

      <div className="grid gap-6 lg:grid-cols-3">
        <QuickSmokeCard brands={brands} defaultBrandId={lastBrandId} />
        <div className="lg:col-span-2">
          <ContributionCalendarPanel
            title="Smoking Activity"
            initialYear={currentYear}
            initialData={calendarData}
          />
        </div>
      </div>

      <Separator />

      <section aria-labelledby="analytics-heading">
        <SectionHeader
          id="analytics-heading"
          title="Analytics"
          description="Visual breakdown of your smoking patterns"
          action={
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href="/analytics">
                View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          }
          className="mb-6"
        />

        <DashboardChartsGrid
          daily={daily}
          monthly={monthly}
          brandDist={brandDist}
          kpis={kpis}
        />
      </section>

      <Separator />

      <section aria-labelledby="recent-heading">
        <SectionHeader
          id="recent-heading"
          title="Recent Activity"
          action={
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href="/history">
                View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          }
          className="mb-4"
        />

        {recentSmokes.length === 0 ? (
          <p className="text-[14px] text-slate-text">
            No smokes logged yet. Hit &quot;Smoke Now&quot; to get started!
          </p>
        ) : (
          <Card>
            <CardContent className="p-0">
              <ul role="list">
                {recentSmokes.map((entry, idx) => (
                  <li
                    key={entry.id}
                    className={`flex items-center justify-between px-6 py-3 ${idx < recentSmokes.length - 1 ? "border-b border-gunmetal" : ""}`}
                  >
                    <div>
                      <span className="text-[14px] font-medium text-ghost-white">
                        {entry.brand.name}
                      </span>
                      {entry.note && (
                        <p className="text-[12px] text-slate-text">{entry.note}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] text-ghost-white">
                        {formatBDT(entry.priceMinor)}
                      </p>
                      <p className="text-[12px] text-slate-text">
                        {format(entry.smokedAt, "MMM d, h:mm a")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
