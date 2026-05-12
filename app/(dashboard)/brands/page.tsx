import type { Metadata } from "next";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { EmptyState } from "@/src/components/common/EmptyState";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { getBrandDistribution } from "@/src/features/smoke/queries";
import { BrandPieChart } from "@/src/components/charts/BrandPieChart";
import { formatBDT } from "@/src/lib/money";
import { packetsFromCigarettes } from "@/src/lib/smoking";
import { Layers3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Brand Statistics",
  robots: { index: false, follow: false },
};

export default async function BrandsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const brandDist90 = await getBrandDistribution(userId, 90);
  const totalCount = brandDist90.reduce((sum, row) => sum + row.count, 0);
  const totalSpend = brandDist90.reduce((sum, row) => sum + row.spendMinor, 0);
  const topBrand = brandDist90[0];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="font-heading text-[24px] font-semibold text-ghost-white">
          Brand Statistics
        </h1>
        <p className="text-[14px] text-slate-text mt-1">
          Breakdown by cigarette brand
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="p-5">
          <p className="text-[12px] font-medium text-slate-text uppercase tracking-wider mb-2">
            Last 90 Days
          </p>
          <p className="font-heading text-[22px] font-semibold text-ghost-white">{totalCount}</p>
          <Badge variant="secondary" className="mt-2 text-[10px]">
            {packetsFromCigarettes(totalCount).toFixed(1)} packets
          </Badge>
        </Card>
        <Card className="p-5">
          <p className="text-[12px] font-medium text-slate-text uppercase tracking-wider mb-2">
            Total Spend
          </p>
          <p className="font-heading text-[22px] font-semibold text-ghost-white">
            {formatBDT(totalSpend)}
          </p>
          <Badge variant="secondary" className="mt-2 text-[10px]">
            Last 90 days
          </Badge>
        </Card>
        <Card className="p-5">
          <p className="text-[12px] font-medium text-slate-text uppercase tracking-wider mb-2">
            Active Brands
          </p>
          <p className="font-heading text-[22px] font-semibold text-ghost-white">
            {brandDist90.length}
          </p>
          <Badge variant="secondary" className="mt-2 text-[10px]">
            With logged smokes
          </Badge>
        </Card>
        <Card className="p-5">
          <p className="text-[12px] font-medium text-slate-text uppercase tracking-wider mb-2">
            Top Brand
          </p>
          <p className="font-heading text-[22px] font-semibold text-ghost-white">
            {topBrand?.name ?? "—"}
          </p>
          <Badge variant="secondary" className="mt-2 text-[10px]">
            {topBrand ? `${topBrand.count} smokes` : "No data yet"}
          </Badge>
        </Card>
      </div>

      {brandDist90.length === 0 ? (
        <EmptyState
          icon={Layers3}
          title="No brand statistics yet"
          description="Log smokes to see brand-level distribution and spending insights."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Brand Distribution (90 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <BrandPieChart data={brandDist90} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Brand Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[320px] overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-[#141414] text-slate-text">
                    <tr className="border-b border-gunmetal">
                      <th className="px-4 py-2 text-left font-medium">Brand</th>
                      <th className="px-4 py-2 text-right font-medium">Smokes</th>
                      <th className="px-4 py-2 text-right font-medium">Packets</th>
                      <th className="px-4 py-2 text-right font-medium">Share</th>
                      <th className="px-4 py-2 text-right font-medium">Spend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brandDist90.map((row) => {
                      const share = totalCount > 0 ? (row.count / totalCount) * 100 : 0;
                      return (
                        <tr key={row.brandId} className="border-b border-gunmetal/60">
                          <td className="px-4 py-2 text-ghost-white">{row.name}</td>
                          <td className="px-4 py-2 text-right text-ash-text">{row.count}</td>
                          <td className="px-4 py-2 text-right text-ash-text">
                            {packetsFromCigarettes(row.count).toFixed(1)}
                          </td>
                          <td className="px-4 py-2 text-right text-ash-text">{share.toFixed(1)}%</td>
                          <td className="px-4 py-2 text-right text-ghost-white">
                            {formatBDT(row.spendMinor)}
                          </td>
                        </tr>
                      );
                    })}
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
