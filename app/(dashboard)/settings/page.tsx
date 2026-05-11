import type { Metadata } from "next";
import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { userSettings } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const settings = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-2xl">
      <div>
        <h1 className="font-heading text-[24px] font-semibold text-ghost-white">Settings</h1>
        <p className="text-[14px] text-slate-text mt-1">Manage your preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Your current account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-ash-text">Currency</span>
            <Badge variant="secondary">{settings?.currency ?? "BDT"}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-ash-text">Timezone</span>
            <Badge variant="secondary">{settings?.timezone ?? "UTC"}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-ash-text">Daily Goal</span>
            <Badge variant="secondary">{settings?.dailyGoal ?? "Not set"}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-ash-text">Reduction Target</span>
            <Badge variant="secondary">
              {settings?.reductionTargetPct ? `${settings.reductionTargetPct}%` : "Not set"}
            </Badge>
          </div>
          <p className="text-[13px] text-slate-text pt-2">
            Full settings editing coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
