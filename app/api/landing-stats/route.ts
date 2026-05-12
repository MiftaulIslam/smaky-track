import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { smokeEntries, users, packetPurchases } from "@/src/db/schema";
import { count, sum, avg, sql } from "drizzle-orm";

export const revalidate = 300; // refresh every 5 minutes

export async function GET() {
  try {
    const [logCountRow] = await db
      .select({ total: count() })
      .from(smokeEntries);

    const [userCountRow] = await db
      .select({ total: count() })
      .from(users);

    const [spendRow] = await db
      .select({ total: sum(packetPurchases.costMinor) })
      .from(packetPurchases);

    // Avg reduction: compare current month vs prev month per user,
    // then average that ratio across users who have both months.
    // Simplified: compare global totals current vs prev month.
    const now = new Date();
    const currMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [currMonthRow] = await db
      .select({ total: count() })
      .from(smokeEntries)
      .where(sql`${smokeEntries.smokedAt} >= ${currMonthStart}`);

    const [prevMonthRow] = await db
      .select({ total: count() })
      .from(smokeEntries)
      .where(
        sql`${smokeEntries.smokedAt} >= ${prevMonthStart} AND ${smokeEntries.smokedAt} <= ${prevMonthEnd}`
      );

    const prevCount = Number(prevMonthRow.total) || 0;
    const currCount = Number(currMonthRow.total) || 0;
    let avgReductionPct: number | null = null;
    if (prevCount > 0) {
      avgReductionPct = Math.round(((prevCount - currCount) / prevCount) * 100);
    }

    const totalLogs = Number(logCountRow.total) ?? 0;
    const totalUsers = Number(userCountRow.total) ?? 0;
    // costMinor is in minor units (poisha). Convert to BDT major.
    const totalSpendBDT = Math.round((Number(spendRow.total) ?? 0) / 100);

    return NextResponse.json({
      totalUsers,
      totalLogs,
      totalSpendBDT,
      avgReductionPct,
    });
  } catch (err) {
    console.error("[landing-stats]", err);
    return NextResponse.json(
      { totalUsers: 0, totalLogs: 0, totalSpendBDT: 0, avgReductionPct: null },
      { status: 500 }
    );
  }
}
