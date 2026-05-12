import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { DashboardChartsGrid } from "@/src/features/dashboard/components/DashboardChartsGrid";
import { KpiCards } from "@/src/features/smoke/components/KpiCards";
import {
  getBrandDistribution,
  getDailyAggregates,
  getKpis,
  getLastSmokeAt,
  getMonthlyAggregates,
  getRecentSmokes,
} from "@/src/features/smoke/queries";
import { formatBDT } from "@/src/lib/money";
import { AdminUserEditForm } from "@/src/features/admin/components/AdminUserEditForm";
import { toggleBlacklistAction } from "@/src/features/admin/actions";
import { getAdminUserById } from "@/src/features/admin/queries";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getAdminUserById(userId);
  if (!user) notFound();

  const [kpis, lastSmokeAt, daily, monthly, brandDist, recentSmokes] = await Promise.all([
    getKpis(userId),
    getLastSmokeAt(userId),
    getDailyAggregates(userId, 30),
    getMonthlyAggregates(userId, 12),
    getBrandDistribution(userId, 30),
    getRecentSmokes(userId, 10),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Button asChild size="sm" variant="ghost" className="w-fit px-0">
            <Link href="/admin-dashboard">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to users
            </Link>
          </Button>
          <h2 className="font-heading text-heading-sm font-semibold text-ghost-white">
            {user.name ?? "Unnamed user"}
          </h2>
          <p className="text-caption text-slate-text">{user.email}</p>
        </div>
        {user.isBlacklisted ? (
          <Badge variant="destructive">Blacklisted</Badge>
        ) : (
          <Badge variant="accent">Active</Badge>
        )}
      </div>

      <KpiCards kpis={kpis} lastSmokeAt={lastSmokeAt} />

      <DashboardChartsGrid daily={daily} monthly={monthly} brandDist={brandDist} kpis={kpis} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Edit User</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminUserEditForm
              userId={userId}
              initialName={user.name ?? ""}
              initialImage={user.image}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-caption text-slate-text">
              {user.isBlacklisted
                ? `Blacklisted${user.blacklistReason ? `: ${user.blacklistReason}` : "."}`
                : "User is currently active."}
            </p>
            <form
              action={async (formData) => {
                "use server";
                await toggleBlacklistAction(user.id, !user.isBlacklisted, formData);
              }}
            >
              <input
                type="hidden"
                name="reason"
                value={user.isBlacklisted ? "" : "Blacklisted from admin user detail page"}
              />
              <Button variant={user.isBlacklisted ? "outline" : "destructive"}>
                {user.isBlacklisted ? "Unblacklist user" : "Blacklist user"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Smokes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul role="list">
            {recentSmokes.length === 0 ? (
              <li className="px-6 py-5 text-caption text-slate-text">No smoke history for this user.</li>
            ) : (
              recentSmokes.map((entry, idx) => (
                <li
                  key={entry.id}
                  className={`flex items-center justify-between px-6 py-3 ${
                    idx < recentSmokes.length - 1 ? "border-b border-gunmetal/60" : ""
                  }`}
                >
                  <div>
                    <p className="text-caption font-medium text-ghost-white">{entry.brand.name}</p>
                    <p className="text-[12px] text-slate-text">
                      {new Date(entry.smokedAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-caption text-ghost-white">{formatBDT(entry.priceMinor)}</p>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
