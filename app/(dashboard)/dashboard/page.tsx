import type { Metadata } from "next";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { db } from "@/src/db";
import { userSettings } from "@/src/db/schema";
import { eq } from "drizzle-orm";
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
import { SectionHeader } from "@/src/components/common/SectionHeader";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import { DashboardChartsGrid } from "@/src/features/dashboard/components/DashboardChartsGrid";
import { DashboardLiveSection } from "@/src/features/dashboard/components/DashboardLiveSection";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;
  const currentYear = new Date().getFullYear();

  const [kpis, lastSmokeAt, brands, daily, monthly, brandDist, calendarData, recentSmokes, settings] =
    await Promise.all([
      getKpis(userId),
      getLastSmokeAt(userId),
      getActiveBrands(),
      getDailyAggregates(userId, 30),
      getMonthlyAggregates(userId, 12),
      getBrandDistribution(userId, 30),
      getCalendarData(userId, currentYear),
      getRecentSmokes(userId, 20),
      db.query.userSettings.findFirst({
        where: eq(userSettings.userId, userId),
      }),
    ]);

  const lastBrandId = recentSmokes[0]?.brand.id;
  const hasDefaultBrand = brands.some((brand) => brand.id === settings?.defaultBrandId);
  const preferredBrandId = hasDefaultBrand
    ? (settings?.defaultBrandId ?? undefined)
    : lastBrandId;

  return (
    <div className="p-6 md:p-8 space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {session.user.name?.split(" ")[0] ?? "there"} 👋
        </p>
      </div>

      <DashboardLiveSection
        initialKpis={kpis}
        initialLastSmokeAt={lastSmokeAt}
        brands={brands}
        defaultBrandId={preferredBrandId}
        initialCalendarData={calendarData}
        initialYear={currentYear}
        initialRecentSmokes={recentSmokes}
      />

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
    </div>
  );
}
