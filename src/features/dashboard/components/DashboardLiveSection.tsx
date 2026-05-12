"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { differenceInCalendarDays, format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { KpiCards } from "@/src/features/smoke/components/KpiCards";
import { QuickSmokeCard } from "@/src/features/smoke/components/QuickSmokeCard";
import { ContributionCalendarPanel } from "@/src/features/dashboard/components/ContributionCalendarPanel";
import { syncUserTimezoneAction } from "@/src/features/account/actions";
import type {
  CalendarDay,
  KpiData,
  SmokeEntryWithBrand,
} from "@/src/features/smoke/queries";
import type { CigaretteBrand } from "@/src/db/schema";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { SectionHeader } from "@/src/components/common/SectionHeader";
import { Separator } from "@/src/components/ui/separator";
import { formatBDT } from "@/src/lib/money";

type Snapshot = {
  kpis: KpiData;
  lastSmokeAt: Date | null;
  recentSmokes: SmokeEntryWithBrand[];
};

function toDate(value: Date | string | null): Date | null {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

export function DashboardLiveSection({
  initialKpis,
  initialLastSmokeAt,
  brands,
  defaultBrandId,
  initialCalendarData,
  initialYear,
  initialRecentSmokes,
}: {
  initialKpis: KpiData;
  initialLastSmokeAt: Date | string | null;
  brands: CigaretteBrand[];
  defaultBrandId?: string;
  initialCalendarData: CalendarDay[];
  initialYear: number;
  initialRecentSmokes: SmokeEntryWithBrand[];
}) {
  const router = useRouter();
  const [kpis, setKpis] = useState(initialKpis);
  const [lastSmokeAt, setLastSmokeAt] = useState<Date | null>(
    toDate(initialLastSmokeAt)
  );
  const [recentSmokes, setRecentSmokes] = useState<SmokeEntryWithBrand[]>(
    initialRecentSmokes.map((entry) => ({
      ...entry,
      smokedAt: toDate(entry.smokedAt)!,
    }))
  );
  const timezoneSyncedRef = useRef(false);

  const snapshotRef = useRef<Snapshot | null>(null);

  const recentSmokesWithFallback = useMemo(() => recentSmokes.slice(0, 5), [recentSmokes]);

  function applyOptimisticSmoke(brand: {
    id: string;
    name: string;
    defaultPriceMinor: number;
  }) {
    const now = new Date();

    snapshotRef.current = {
      kpis,
      lastSmokeAt,
      recentSmokes,
    };

    const alreadySmokedToday =
      lastSmokeAt && differenceInCalendarDays(now, lastSmokeAt) === 0;
    const wasYesterday =
      lastSmokeAt && differenceInCalendarDays(now, lastSmokeAt) === 1;

    setKpis((prev) => {
      const nextMonthCount = prev.month.count + 1;
      const nextReductionPct =
        prev.prevMonth.count > 0
          ? Math.round(((prev.prevMonth.count - nextMonthCount) / prev.prevMonth.count) * 100)
          : null;

      return {
        ...prev,
        today: {
          count: prev.today.count + 1,
          spendMinor: prev.today.spendMinor + brand.defaultPriceMinor,
        },
        week: {
          count: prev.week.count + 1,
          spendMinor: prev.week.spendMinor + brand.defaultPriceMinor,
        },
        month: {
          count: nextMonthCount,
          spendMinor: prev.month.spendMinor + brand.defaultPriceMinor,
        },
        year: {
          count: prev.year.count + 1,
          spendMinor: prev.year.spendMinor + brand.defaultPriceMinor,
        },
        avgPerDay: Math.round((prev.avgPerDay + 1 / 30) * 10) / 10,
        reductionPct: nextReductionPct,
        streak: alreadySmokedToday ? prev.streak : wasYesterday ? prev.streak + 1 : 1,
        mostSmokedBrand: prev.mostSmokedBrand ?? brand.name,
      };
    });

    setLastSmokeAt(now);
    setRecentSmokes((prev) => [
      {
        id: `optimistic-${now.getTime()}`,
        smokedAt: now,
        priceMinor: brand.defaultPriceMinor,
        currency: "BDT",
        note: null,
        brand: {
          id: brand.id,
          name: brand.name,
          slug: "optimistic",
        },
      },
      ...prev,
    ]);
  }

  function rollbackOptimisticSmoke() {
    const snapshot = snapshotRef.current;
    if (!snapshot) return;
    setKpis(snapshot.kpis);
    setLastSmokeAt(snapshot.lastSmokeAt);
    setRecentSmokes(snapshot.recentSmokes);
    snapshotRef.current = null;
  }

  function reconcileWithServer() {
    snapshotRef.current = null;
    router.refresh();
  }

  useEffect(() => {
    if (timezoneSyncedRef.current) return;
    timezoneSyncedRef.current = true;

    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    void syncUserTimezoneAction(detectedTimeZone);
  }, []);

  return (
    <>
      <KpiCards kpis={kpis} lastSmokeAt={lastSmokeAt} />

      <div className="grid gap-6 lg:grid-cols-3">
        <QuickSmokeCard
          key={defaultBrandId ?? "dashboard-default-brand"}
          brands={brands}
          defaultBrandId={defaultBrandId}
          onOptimisticLog={applyOptimisticSmoke}
          onRollback={rollbackOptimisticSmoke}
          onSettled={reconcileWithServer}
        />
        <div className="lg:col-span-2">
          <ContributionCalendarPanel
            title="Smoking Activity"
            initialYear={initialYear}
            initialData={initialCalendarData}
          />
        </div>
      </div>

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

        {recentSmokesWithFallback.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No smokes logged yet. Hit &quot;Smoke Now&quot; to get started!
          </p>
        ) : (
          <Card>
            <CardContent className="p-0">
              <ul role="list">
                {recentSmokesWithFallback.map((entry, idx) => (
                  <li
                    key={entry.id}
                    className={`flex items-center justify-between px-6 py-3 ${
                      idx < recentSmokesWithFallback.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {entry.brand.name}
                      </span>
                      {entry.note && (
                        <p className="text-xs text-muted-foreground">{entry.note}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-foreground">
                        {formatBDT(entry.priceMinor)}
                      </p>
                      <p className="text-xs text-muted-foreground">
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
    </>
  );
}

