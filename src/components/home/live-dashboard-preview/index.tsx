import { db } from "@/src/db";
import { smokeEntries, cigaretteBrands, packetPurchases } from "@/src/db/schema";
import { count, sum, sql, desc } from "drizzle-orm";
import { subDays, formatDistanceToNow } from "date-fns";
import { Activity, BarChart2, Clock } from "lucide-react";
import { BrandBar } from "./dependencies/brand-bar";
import { DashboardCard } from "./dependencies/dashboard-card";
import { HeatmapGrid } from "./dependencies/heatmap-grid";

const BRAND_COLORS = ["var(--color-primary)", "#4867af", "#686868"];
const HEAT_MAP_WEEKS_COUNT = 16;

export async function LiveDashboardPreview() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = subDays(todayStart, 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59
  );
  const heatmapStart = subDays(todayStart, HEAT_MAP_WEEKS_COUNT * 7 - 1);

  // Run all queries in parallel
  const [
    [todayRow],
    [yesterdayRow],
    [currSpendRow],
    [prevSpendRow],
    [monthRow],
    [prevMonthRow],
    heatmapRows,
    brandRows,
    recentRows,
  ] = await Promise.all([
    db
      .select({ total: count() })
      .from(smokeEntries)
      .where(sql`${smokeEntries.smokedAt} >= ${todayStart}`),

    db
      .select({ total: count() })
      .from(smokeEntries)
      .where(
        sql`${smokeEntries.smokedAt} >= ${yesterdayStart} AND ${smokeEntries.smokedAt} < ${todayStart}`
      ),

    db
      .select({ total: sum(packetPurchases.costMinor) })
      .from(packetPurchases)
      .where(sql`${packetPurchases.purchasedAt} >= ${monthStart}`),

    db
      .select({ total: sum(packetPurchases.costMinor) })
      .from(packetPurchases)
      .where(
        sql`${packetPurchases.purchasedAt} >= ${prevMonthStart} AND ${packetPurchases.purchasedAt} <= ${prevMonthEnd}`
      ),

    db
      .select({ total: count() })
      .from(smokeEntries)
      .where(sql`${smokeEntries.smokedAt} >= ${monthStart}`),

    db
      .select({ total: count() })
      .from(smokeEntries)
      .where(
        sql`${smokeEntries.smokedAt} >= ${prevMonthStart} AND ${smokeEntries.smokedAt} <= ${prevMonthEnd}`
      ),

    db
      .select({
        day: sql<string>`DATE(${smokeEntries.smokedAt} AT TIME ZONE 'UTC')`.as(
          "day"
        ),
        cnt: count(),
      })
      .from(smokeEntries)
      .where(sql`${smokeEntries.smokedAt} >= ${heatmapStart}`)
      .groupBy(
        sql`DATE(${smokeEntries.smokedAt} AT TIME ZONE 'UTC')`
      ),

    db
      .select({ name: cigaretteBrands.name, cnt: count() })
      .from(smokeEntries)
      .where(sql`${smokeEntries.smokedAt} >= ${monthStart}`)
      .leftJoin(
        cigaretteBrands,
        sql`${smokeEntries.brandId} = ${cigaretteBrands.id}`
      )
      .groupBy(cigaretteBrands.name)
      .orderBy(desc(count()))
      .limit(3),

    db
      .select({
        brandName: cigaretteBrands.name,
        smokedAt: smokeEntries.smokedAt,
      })
      .from(smokeEntries)
      .leftJoin(
        cigaretteBrands,
        sql`${smokeEntries.brandId} = ${cigaretteBrands.id}`
      )
      .orderBy(desc(smokeEntries.smokedAt))
      .limit(1),
  ]);

  // ── Derived values ──────────────────────────────────────────────────────────
  const todayCount = Number(todayRow.total);
  const yesterdayCount = Number(yesterdayRow.total);
  const todayVsYesterday = todayCount - yesterdayCount;

  const currSpendMinor = Number(currSpendRow.total ?? 0);
  const prevSpendMinor = Number(prevSpendRow.total ?? 0);
  const spendDiffMinor = currSpendMinor - prevSpendMinor;
  const spendBDT = Math.round(currSpendMinor / 100);
  const spendDiffBDT = Math.round(Math.abs(spendDiffMinor) / 100);

  const thisMonth = Number(monthRow.total);
  const prevMonth = Number(prevMonthRow.total);
  const monthVsPrev = thisMonth - prevMonth;

  // ── Heatmap ─────────────────────────────────────────────────────────────────
  const heatmapMap = new Map<string, number>();
  for (const row of heatmapRows) {
    heatmapMap.set(row.day, Number(row.cnt));
  }
  const maxCount = Math.max(
    ...(heatmapMap.size ? [...heatmapMap.values()] : [1]),
    1
  );
  const totalDays = HEAT_MAP_WEEKS_COUNT * 7;
  const heatmapData: number[] = Array.from({ length: totalDays }, (_, i) => {
    const d = subDays(todayStart, totalDays - 1 - i);
    const key = d.toISOString().slice(0, 10);
    const cnt = heatmapMap.get(key) ?? 0;
    return Math.min(10, Math.round((cnt / maxCount) * 10));
  });

  // ── Brand breakdown ──────────────────────────────────────────────────────────
  const totalBrandCount =
    brandRows.reduce((s, r) => s + Number(r.cnt), 0) || 1;
  const brandBreakdown = brandRows.map((r, i) => ({
    name: r.name ?? "Unknown",
    pct: Math.round((Number(r.cnt) / totalBrandCount) * 100),
    color: BRAND_COLORS[i],
  }));

  // ── Recent log ───────────────────────────────────────────────────────────────
  const recentLog = recentRows[0]
    ? {
        name: recentRows[0].brandName ?? "Unknown",
        timeAgo: formatDistanceToNow(new Date(recentRows[0].smokedAt), {
          addSuffix: true,
        }),
      }
    : null;

  // ── Format card values ───────────────────────────────────────────────────────
  const todayChangeLabel =
    todayVsYesterday === 0
      ? "Same as yesterday"
      : `${todayVsYesterday > 0 ? "+" : ""}${todayVsYesterday} vs yesterday`;
  const todayTrend = todayVsYesterday <= 0 ? "up" : "down";

  const spendChangeLabel =
    spendDiffMinor <= 0
      ? `-৳${spendDiffBDT} saved`
      : `+৳${spendDiffBDT} vs last month`;
  const spendTrend = spendDiffMinor <= 0 ? "up" : "down";

  const monthChangeLabel =
    monthVsPrev === 0
      ? "Same as last month"
      : `${monthVsPrev > 0 ? "+" : ""}${monthVsPrev} vs last month`;
  const monthTrend = monthVsPrev <= 0 ? "up" : "down";

  return (
    <section
      id="overview"
      className="pb-0 scroll-mt-[88px]"
      aria-labelledby="overview-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm tracking-widest uppercase text-foreground-subtle">
            Dashboard
          </p>
          <h2
            id="overview-heading"
            className="mt-2 text-3xl sm:text-4xl font-semibold text-foreground"
          >
            Everything in one view
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm text-foreground-subtle">
            Your real-time command center for habits, spending, and trends.
          </p>
        </div>

        {/* GRID */}
        <section className="border rounded-3xl p-6">
          <div
            role="img"
            aria-label="Dashboard with analytics cards, heatmap, and brand breakdown"
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* STAT CARDS */}
            <DashboardCard
              className="w-full"
              title="Today"
              value={String(todayCount)}
              change={todayChangeLabel}
              trend={todayTrend}
            />
            <DashboardCard
              className="w-full"
              title="Monthly spend"
              value={`৳${spendBDT}`}
              change={spendChangeLabel}
              trend={spendTrend}
            />
            <DashboardCard
              className="w-full"
              title="This month"
              value={String(thisMonth)}
              change={monthChangeLabel}
              trend={monthTrend}
            />

            {/* HEATMAP */}
            <div
              data-heatmap-root
              className="relative md:col-span-2 w-full overflow-hidden rounded-3xl border border-border-subtle bg-surface-glass backdrop-blur-xl p-6 ring-1 ring-amber-500/20"
            >
              {/* gradient wash */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-amber-500/8 via-orange-400/4 to-transparent" />
              {/* decorative blobs */}
              <div className="pointer-events-none absolute -top-8 -right-8 h-36 w-36 rounded-full bg-amber-500/10 blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-40 rounded-full bg-orange-400/8 blur-2xl" />
              {/* dot grid */}
              <div className="pointer-events-none absolute bottom-4 right-4 grid grid-cols-4 gap-[5px] opacity-15">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-1 w-1 rounded-full bg-foreground-subtle" />
                ))}
              </div>

              {/* header */}
              <div className="relative z-10 mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 ring-1 ring-inset ring-amber-500/25">
                  <Activity className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Activity heatmap</p>
                  <p className="text-[11px] text-foreground-disabled">{HEAT_MAP_WEEKS_COUNT} weeks · hover for details</p>
                </div>
              </div>

              <div className="relative z-10">
                <HeatmapGrid data={heatmapData} weeks={HEAT_MAP_WEEKS_COUNT} />
              </div>

              {/* bottom accent */}
              <div className="pointer-events-none absolute bottom-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-amber-500/30 to-transparent" />
            </div>

            {/* BRAND BREAKDOWN */}
            <div className="relative w-full overflow-hidden rounded-3xl border border-border-subtle bg-surface-glass backdrop-blur-xl p-6 ring-1 ring-indigo-500/20">
              {/* gradient wash */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-500/8 via-violet-400/4 to-transparent" />
              {/* decorative blob */}
              <div className="pointer-events-none absolute -top-6 -right-6 h-28 w-28 rounded-full bg-indigo-500/12 blur-2xl" />
              {/* dot grid */}
              <div className="pointer-events-none absolute bottom-4 right-4 grid grid-cols-3 gap-[5px] opacity-15">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-1 w-1 rounded-full bg-foreground-subtle" />
                ))}
              </div>

              {/* header */}
              <div className="relative z-10 mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 ring-1 ring-inset ring-indigo-500/25">
                  <BarChart2 className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Brand breakdown</p>
                  <p className="text-[11px] text-foreground-disabled">This month</p>
                </div>
              </div>

              <div className="relative z-10 space-y-3">
                {brandBreakdown.length > 0 ? (
                  brandBreakdown.map((b) => (
                    <BrandBar key={b.name} name={b.name} value={b.pct} color={b.color} />
                  ))
                ) : (
                  <p className="text-xs text-foreground-disabled">No data yet</p>
                )}
              </div>

              {/* bottom accent */}
              <div className="pointer-events-none absolute bottom-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-indigo-500/30 to-transparent" />
            </div>

            {/* RECENT LOG */}
            <div className="relative md:col-span-3 w-full overflow-hidden rounded-3xl border border-border-subtle bg-surface-glass backdrop-blur-xl p-6 ring-1 ring-teal-500/20">
              {/* gradient wash */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-teal-500/6 via-cyan-400/4 to-transparent" />
              {/* decorative blob */}
              <div className="pointer-events-none absolute -top-6 right-12 h-24 w-48 rounded-full bg-teal-500/10 blur-3xl" />
              {/* dot grid */}
              <div className="pointer-events-none absolute bottom-4 right-4 grid grid-cols-5 gap-[5px] opacity-15">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-1 w-1 rounded-full bg-foreground-subtle" />
                ))}
              </div>

              {/* header */}
              <div className="relative z-10 mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/15 text-teal-400 ring-1 ring-inset ring-teal-500/25">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Recent log</p>
                  <p className="text-[11px] text-foreground-disabled">Latest entry</p>
                </div>
              </div>

              <div className="relative z-10">
                {recentLog ? (
                  <div className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-surface-hover cursor-pointer">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60 blur-sm group-hover:opacity-100" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">{recentLog.name}</span>
                      <span className="text-[11px] text-foreground-subtle">Logged activity entry</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-border-subtle text-foreground-subtle bg-surface group-hover:border-border">
                      {recentLog.timeAgo}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-foreground-disabled px-3">No entries yet</p>
                )}
              </div>

              {/* bottom accent */}
              <div className="pointer-events-none absolute bottom-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-teal-500/30 to-transparent" />
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
