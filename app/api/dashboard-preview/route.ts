import { NextResponse } from "next/server";
import { db } from "@/src/db";
import {
  smokeEntries,
  cigaretteBrands,
  packetPurchases,
} from "@/src/db/schema";
import { count, sum, sql, desc } from "drizzle-orm";
import { subDays } from "date-fns";

export const revalidate = 60; // 1 minute

export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = subDays(todayStart, 1);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // ── Today count ──────────────────────────────────────────────────────────
    const [todayRow] = await db
      .select({ total: count() })
      .from(smokeEntries)
      .where(sql`${smokeEntries.smokedAt} >= ${todayStart}`);

    // ── Yesterday count ───────────────────────────────────────────────────────
    const [yesterdayRow] = await db
      .select({ total: count() })
      .from(smokeEntries)
      .where(
        sql`${smokeEntries.smokedAt} >= ${yesterdayStart} AND ${smokeEntries.smokedAt} < ${todayStart}`
      );

    // ── Monthly spend (packet purchases) ─────────────────────────────────────
    const [currSpendRow] = await db
      .select({ total: sum(packetPurchases.costMinor) })
      .from(packetPurchases)
      .where(sql`${packetPurchases.purchasedAt} >= ${monthStart}`);

    const [prevSpendRow] = await db
      .select({ total: sum(packetPurchases.costMinor) })
      .from(packetPurchases)
      .where(
        sql`${packetPurchases.purchasedAt} >= ${prevMonthStart} AND ${packetPurchases.purchasedAt} <= ${prevMonthEnd}`
      );

    // ── This month total entries ──────────────────────────────────────────────
    const [monthRow] = await db
      .select({ total: count() })
      .from(smokeEntries)
      .where(sql`${smokeEntries.smokedAt} >= ${monthStart}`);

    const [prevMonthRow] = await db
      .select({ total: count() })
      .from(smokeEntries)
      .where(
        sql`${smokeEntries.smokedAt} >= ${prevMonthStart} AND ${smokeEntries.smokedAt} <= ${prevMonthEnd}`
      );

    // ── 16-week heatmap (112 days, grouped by day) ────────────────────────────
    const heatmapStart = subDays(todayStart, 111); // 112 days = 16 weeks
    const heatmapRows = await db
      .select({
        day: sql<string>`DATE(${smokeEntries.smokedAt} AT TIME ZONE 'UTC')`.as("day"),
        cnt: count(),
      })
      .from(smokeEntries)
      .where(sql`${smokeEntries.smokedAt} >= ${heatmapStart}`)
      .groupBy(sql`DATE(${smokeEntries.smokedAt} AT TIME ZONE 'UTC')`);

    // Build a 112-element array (oldest day first)
    const heatmapMap = new Map<string, number>();
    for (const row of heatmapRows) {
      heatmapMap.set(row.day, Number(row.cnt));
    }
    const maxCount = Math.max(...(heatmapMap.size ? [...heatmapMap.values()] : [1]), 1);
    const heatmapData: number[] = Array.from({ length: 112 }, (_, i) => {
      const d = subDays(todayStart, 111 - i);
      const key = d.toISOString().slice(0, 10);
      const cnt = heatmapMap.get(key) ?? 0;
      return Math.min(10, Math.round((cnt / maxCount) * 10));
    });

    // ── Brand breakdown (top 3, this month) ──────────────────────────────────
    const brandRows = await db
      .select({
        name: cigaretteBrands.name,
        cnt: count(),
      })
      .from(smokeEntries)
      .where(sql`${smokeEntries.smokedAt} >= ${monthStart}`)
      .leftJoin(cigaretteBrands, sql`${smokeEntries.brandId} = ${cigaretteBrands.id}`)
      .groupBy(cigaretteBrands.name)
      .orderBy(desc(count()))
      .limit(3);

    const totalBrandCount = brandRows.reduce((s, r) => s + Number(r.cnt), 0) || 1;
    const brandBreakdown = brandRows.map((r) => ({
      name: r.name ?? "Unknown",
      pct: Math.round((Number(r.cnt) / totalBrandCount) * 100),
    }));

    // ── Most recent log entry ─────────────────────────────────────────────────
    const recentRows = await db
      .select({
        brandName: cigaretteBrands.name,
        smokedAt: smokeEntries.smokedAt,
      })
      .from(smokeEntries)
      .leftJoin(cigaretteBrands, sql`${smokeEntries.brandId} = ${cigaretteBrands.id}`)
      .orderBy(desc(smokeEntries.smokedAt))
      .limit(1);

    const recentLog = recentRows[0]
      ? { name: recentRows[0].brandName ?? "Unknown", smokedAt: recentRows[0].smokedAt }
      : null;

    // ── Derived values ────────────────────────────────────────────────────────
    const todayCount = Number(todayRow.total);
    const yesterdayCount = Number(yesterdayRow.total);
    const todayVsYesterday = todayCount - yesterdayCount;

    const currSpendMinor = Number(currSpendRow.total) ?? 0;
    const prevSpendMinor = Number(prevSpendRow.total) ?? 0;
    const spendDiffMinor = currSpendMinor - prevSpendMinor;

    const thisMonth = Number(monthRow.total);
    const prevMonth = Number(prevMonthRow.total);
    const monthVsPrev = thisMonth - prevMonth;

    return NextResponse.json({
      today: { count: todayCount, vsYesterday: todayVsYesterday },
      monthlySpend: { minor: currSpendMinor, diffMinor: spendDiffMinor },
      thisMonth: { count: thisMonth, vsPrevMonth: monthVsPrev },
      heatmapData,
      brandBreakdown,
      recentLog: recentLog
        ? { name: recentLog.name, smokedAt: recentLog.smokedAt }
        : null,
    });
  } catch (err) {
    console.error("[dashboard-preview]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
