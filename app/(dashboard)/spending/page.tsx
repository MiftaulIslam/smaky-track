import type { Metadata } from "next";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/common/EmptyState";
import { getKpis, getMonthlyAggregates } from "@/src/features/smoke/queries";
import { formatBDT } from "@/src/lib/money";
import { packetsFromCigarettes } from "@/src/lib/smoking";
import { SpendingAreaChart } from "@/src/components/charts/SpendingAreaChart";
import { Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Spending Reports",
  robots: { index: false, follow: false },
};

export default async function SpendingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [kpis, monthly12] = await Promise.all([
    getKpis(userId),
    getMonthlyAggregates(userId, 12),
  ]);

  const monthPackets = packetsFromCigarettes(kpis.month.count);
  const yearPackets = packetsFromCigarettes(kpis.year.count);
  const totalSpend12 = monthly12.reduce((sum, row) => sum + row.spendMinor, 0);
  const totalCount12 = monthly12.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Spending Reports
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed breakdown of your cigarette spending
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            This Month
          </p>
          <p className="font-heading text-[22px] font-semibold text-foreground">
            {formatBDT(kpis.month.spendMinor)}
          </p>
          <Badge variant="secondary" className="mt-2 text-[10px]">
            {kpis.month.count} smokes ({monthPackets.toFixed(1)} packets)
          </Badge>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            This Year
          </p>
          <p className="font-heading text-[22px] font-semibold text-foreground">
            {formatBDT(kpis.year.spendMinor)}
          </p>
          <Badge variant="secondary" className="mt-2 text-[10px]">
            {kpis.year.count} smokes ({yearPackets.toFixed(1)} packets)
          </Badge>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Last 12 Months
          </p>
          <p className="font-heading text-[22px] font-semibold text-foreground">
            {formatBDT(totalSpend12)}
          </p>
          <Badge variant="secondary" className="mt-2 text-[10px]">
            {totalCount12} smokes ({packetsFromCigarettes(totalCount12).toFixed(1)} packets)
          </Badge>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Avg per Smoke
          </p>
          <p className="font-heading text-[22px] font-semibold text-foreground">
            {kpis.month.count > 0
              ? formatBDT(Math.round(kpis.month.spendMinor / kpis.month.count))
              : "—"}
          </p>
          <Badge variant="secondary" className="mt-2 text-[10px]">
            Based on this month
          </Badge>
        </Card>
      </div>

      {monthly12.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No spending data yet"
          description="Log smokes from the dashboard to unlock monthly spending reports."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Monthly Spending (12 months)</CardTitle>
            </CardHeader>
            <CardContent>
              <SpendingAreaChart data={monthly12} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[320px] overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-[#141414] text-muted-foreground">
                    <tr className="border-b border-border">
                      <th className="px-4 py-2 text-left font-medium">Month</th>
                      <th className="px-4 py-2 text-right font-medium">Smokes</th>
                      <th className="px-4 py-2 text-right font-medium">Packets</th>
                      <th className="px-4 py-2 text-right font-medium">Spend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...monthly12].reverse().map((row) => (
                      <tr key={row.month} className="border-b border-border/60">
                        <td className="px-4 py-2 text-foreground">{row.month}</td>
                        <td className="px-4 py-2 text-right text-foreground-subtle">{row.count}</td>
                        <td className="px-4 py-2 text-right text-foreground-subtle">
                          {packetsFromCigarettes(row.count).toFixed(1)}
                        </td>
                        <td className="px-4 py-2 text-right text-foreground">
                          {formatBDT(row.spendMinor)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
