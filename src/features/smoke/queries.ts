import { db } from "@/src/db";
import { smokeEntries, cigaretteBrands } from "@/src/db/schema";
import { eq, and, gte, lte, sql, desc, asc, count } from "drizzle-orm";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  format,
} from "date-fns";

// ─────────────────────────────────────────────────────────
// KPIs
// ─────────────────────────────────────────────────────────

export type KpiData = {
  today: { count: number; spendMinor: number };
  week: { count: number; spendMinor: number };
  month: { count: number; spendMinor: number };
  year: { count: number; spendMinor: number };
  prevMonth: { count: number; spendMinor: number };
  avgPerDay: number;
  reductionPct: number | null;
  streak: number;
  mostSmokedBrand: string | null;
};

async function countInRange(userId: string, from: Date, to: Date) {
  const [row] = await db
    .select({
      count: count(),
      spendMinor: sql<number>`coalesce(sum(${smokeEntries.priceMinor}), 0)`,
    })
    .from(smokeEntries)
    .where(
      and(
        eq(smokeEntries.userId, userId),
        gte(smokeEntries.smokedAt, from),
        lte(smokeEntries.smokedAt, to)
      )
    );
  return { count: Number(row.count), spendMinor: Number(row.spendMinor) };
}

export async function getKpis(userId: string): Promise<KpiData> {
  const now = new Date();

  const [todayData, weekData, monthData, yearData, prevMonthData] =
    await Promise.all([
      countInRange(userId, startOfDay(now), endOfDay(now)),
      countInRange(userId, startOfWeek(now, { weekStartsOn: 0 }), endOfWeek(now, { weekStartsOn: 0 })),
      countInRange(userId, startOfMonth(now), endOfMonth(now)),
      countInRange(userId, startOfYear(now), endOfYear(now)),
      countInRange(
        userId,
        startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
        endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1))
      ),
    ]);

  // Average per day (last 30 days)
  const thirtyDaysAgo = subDays(now, 30);
  const last30 = await countInRange(userId, thirtyDaysAgo, now);
  const avgPerDay = Math.round((last30.count / 30) * 10) / 10;

  // Reduction %
  let reductionPct: number | null = null;
  if (prevMonthData.count > 0) {
    reductionPct = Math.round(
      ((prevMonthData.count - monthData.count) / prevMonthData.count) * 100
    );
  }

  // Streak — consecutive days with at least 1 smoke (going backwards from today).
  // Note: no ORDER BY with DISTINCT — Postgres requires ORDER BY exprs to match DISTINCT
  // selected expressions; streak only needs the set of calendar days.
  const last60 = await db
    .selectDistinct({
      day: sql<string>`date_trunc('day', ${smokeEntries.smokedAt})::text`,
    })
    .from(smokeEntries)
    .where(
      and(
        eq(smokeEntries.userId, userId),
        gte(smokeEntries.smokedAt, subDays(now, 60))
      )
    );

  const smokedDays = new Set(last60.map((r) => r.day.slice(0, 10)));
  let streak = 0;
  let cursor = new Date(now);
  while (true) {
    const key = format(cursor, "yyyy-MM-dd");
    if (smokedDays.has(key)) {
      streak++;
      cursor = subDays(cursor, 1);
    } else {
      break;
    }
  }

  // Most smoked brand (last 30 days)
  const brandCounts = await db
    .select({
      name: cigaretteBrands.name,
      cnt: count(),
    })
    .from(smokeEntries)
    .innerJoin(cigaretteBrands, eq(smokeEntries.brandId, cigaretteBrands.id))
    .where(
      and(
        eq(smokeEntries.userId, userId),
        gte(smokeEntries.smokedAt, thirtyDaysAgo)
      )
    )
    .groupBy(cigaretteBrands.name)
    .orderBy(desc(count()))
    .limit(1);

  const mostSmokedBrand = brandCounts[0]?.name ?? null;

  return {
    today: todayData,
    week: weekData,
    month: monthData,
    year: yearData,
    prevMonth: prevMonthData,
    avgPerDay,
    reductionPct,
    streak,
    mostSmokedBrand,
  };
}

// ─────────────────────────────────────────────────────────
// Last smoke entry
// ─────────────────────────────────────────────────────────

export async function getLastSmokeAt(userId: string): Promise<Date | null> {
  const entry = await db.query.smokeEntries.findFirst({
    where: eq(smokeEntries.userId, userId),
    orderBy: [desc(smokeEntries.smokedAt)],
  });
  return entry?.smokedAt ?? null;
}

// ─────────────────────────────────────────────────────────
// Daily aggregates (for charts)
// ─────────────────────────────────────────────────────────

export type DailyAggregate = {
  date: string;
  count: number;
  spendMinor: number;
};

export async function getDailyAggregates(
  userId: string,
  days: number
): Promise<DailyAggregate[]> {
  const from = subDays(new Date(), days);

  const rows = await db
    .select({
      date: sql<string>`date_trunc('day', ${smokeEntries.smokedAt})::date::text`,
      count: count(),
      spendMinor: sql<number>`coalesce(sum(${smokeEntries.priceMinor}), 0)`,
    })
    .from(smokeEntries)
    .where(
      and(eq(smokeEntries.userId, userId), gte(smokeEntries.smokedAt, from))
    )
    .groupBy(sql`date_trunc('day', ${smokeEntries.smokedAt})::date`)
    .orderBy(asc(sql`date_trunc('day', ${smokeEntries.smokedAt})::date`));

  return rows.map((r) => ({
    date: r.date,
    count: Number(r.count),
    spendMinor: Number(r.spendMinor),
  }));
}

// ─────────────────────────────────────────────────────────
// Monthly aggregates
// ─────────────────────────────────────────────────────────

export type MonthlyAggregate = {
  month: string; // "2025-01"
  count: number;
  spendMinor: number;
};

export async function getMonthlyAggregates(
  userId: string,
  months: number
): Promise<MonthlyAggregate[]> {
  const from = new Date();
  from.setMonth(from.getMonth() - months);

  const rows = await db
    .select({
      month: sql<string>`to_char(date_trunc('month', ${smokeEntries.smokedAt}), 'YYYY-MM')`,
      count: count(),
      spendMinor: sql<number>`coalesce(sum(${smokeEntries.priceMinor}), 0)`,
    })
    .from(smokeEntries)
    .where(
      and(eq(smokeEntries.userId, userId), gte(smokeEntries.smokedAt, from))
    )
    .groupBy(sql`date_trunc('month', ${smokeEntries.smokedAt})`)
    .orderBy(asc(sql`date_trunc('month', ${smokeEntries.smokedAt})`));

  return rows.map((r) => ({
    month: r.month,
    count: Number(r.count),
    spendMinor: Number(r.spendMinor),
  }));
}

// ─────────────────────────────────────────────────────────
// Brand distribution
// ─────────────────────────────────────────────────────────

export type BrandDistribution = {
  brandId: string;
  name: string;
  count: number;
  spendMinor: number;
};

export async function getBrandDistribution(
  userId: string,
  days: number
): Promise<BrandDistribution[]> {
  const from = subDays(new Date(), days);

  const rows = await db
    .select({
      brandId: cigaretteBrands.id,
      name: cigaretteBrands.name,
      count: count(),
      spendMinor: sql<number>`coalesce(sum(${smokeEntries.priceMinor}), 0)`,
    })
    .from(smokeEntries)
    .innerJoin(cigaretteBrands, eq(smokeEntries.brandId, cigaretteBrands.id))
    .where(
      and(eq(smokeEntries.userId, userId), gte(smokeEntries.smokedAt, from))
    )
    .groupBy(cigaretteBrands.id, cigaretteBrands.name)
    .orderBy(desc(count()));

  return rows.map((r) => ({
    brandId: r.brandId,
    name: r.name,
    count: Number(r.count),
    spendMinor: Number(r.spendMinor),
  }));
}

// ─────────────────────────────────────────────────────────
// Weekly heatmap (day-of-week × hour)
// ─────────────────────────────────────────────────────────

export type WeeklyHeatmapCell = {
  dayOfWeek: number; // 0=Sun, 6=Sat
  hour: number;
  count: number;
};

export async function getWeeklyHeatmap(
  userId: string,
  weeks: number
): Promise<WeeklyHeatmapCell[]> {
  const from = subDays(new Date(), weeks * 7);

  const rows = await db
    .select({
      dayOfWeek: sql<number>`extract(dow from ${smokeEntries.smokedAt})::int`,
      hour: sql<number>`extract(hour from ${smokeEntries.smokedAt})::int`,
      count: count(),
    })
    .from(smokeEntries)
    .where(
      and(eq(smokeEntries.userId, userId), gte(smokeEntries.smokedAt, from))
    )
    .groupBy(
      sql`extract(dow from ${smokeEntries.smokedAt})`,
      sql`extract(hour from ${smokeEntries.smokedAt})`
    );

  return rows.map((r) => ({
    dayOfWeek: Number(r.dayOfWeek),
    hour: Number(r.hour),
    count: Number(r.count),
  }));
}

// ─────────────────────────────────────────────────────────
// Contribution calendar data (per-day for a year)
// ─────────────────────────────────────────────────────────

export type CalendarDay = {
  date: string;
  count: number;
  spendMinor: number;
  brands: string[];
};

export async function getCalendarData(
  userId: string,
  year: number
): Promise<CalendarDay[]> {
  const from = new Date(year, 0, 1);
  const to = new Date(year, 11, 31, 23, 59, 59);

  const rows = await db
    .select({
      date: sql<string>`date_trunc('day', ${smokeEntries.smokedAt})::date::text`,
      count: count(),
      spendMinor: sql<number>`coalesce(sum(${smokeEntries.priceMinor}), 0)`,
      brands: sql<string>`string_agg(distinct ${cigaretteBrands.name}, ', ')`,
    })
    .from(smokeEntries)
    .innerJoin(cigaretteBrands, eq(smokeEntries.brandId, cigaretteBrands.id))
    .where(
      and(
        eq(smokeEntries.userId, userId),
        gte(smokeEntries.smokedAt, from),
        lte(smokeEntries.smokedAt, to)
      )
    )
    .groupBy(sql`date_trunc('day', ${smokeEntries.smokedAt})::date`)
    .orderBy(asc(sql`date_trunc('day', ${smokeEntries.smokedAt})::date`));

  return rows.map((r) => ({
    date: r.date,
    count: Number(r.count),
    spendMinor: Number(r.spendMinor),
    brands: r.brands ? r.brands.split(", ") : [],
  }));
}

// ─────────────────────────────────────────────────────────
// Recent smoke entries (for history page)
// ─────────────────────────────────────────────────────────

export type SmokeEntryWithBrand = {
  id: string;
  smokedAt: Date;
  priceMinor: number;
  currency: string;
  note: string | null;
  brand: { id: string; name: string; slug: string };
};

export async function getRecentSmokes(
  userId: string,
  limit = 20,
  offset = 0
): Promise<SmokeEntryWithBrand[]> {
  const rows = await db
    .select({
      id: smokeEntries.id,
      smokedAt: smokeEntries.smokedAt,
      priceMinor: smokeEntries.priceMinor,
      currency: smokeEntries.currency,
      note: smokeEntries.note,
      brandId: cigaretteBrands.id,
      brandName: cigaretteBrands.name,
      brandSlug: cigaretteBrands.slug,
    })
    .from(smokeEntries)
    .innerJoin(cigaretteBrands, eq(smokeEntries.brandId, cigaretteBrands.id))
    .where(eq(smokeEntries.userId, userId))
    .orderBy(desc(smokeEntries.smokedAt))
    .limit(limit)
    .offset(offset);

  return rows.map((r) => ({
    id: r.id,
    smokedAt: r.smokedAt,
    priceMinor: r.priceMinor,
    currency: r.currency,
    note: r.note,
    brand: { id: r.brandId, name: r.brandName, slug: r.brandSlug },
  }));
}
