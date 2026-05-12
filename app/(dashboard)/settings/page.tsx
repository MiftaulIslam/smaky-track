import type { Metadata } from "next";
import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { userSettings } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { SettingsForm } from "@/src/features/account/components/SettingsForm";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const settings = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-2xl">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Update your account preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm
            initial={{
              currency: settings?.currency ?? "BDT",
              timezone: settings?.timezone ?? "UTC",
              dailyGoal: settings?.dailyGoal ?? null,
              reductionTargetPct: settings?.reductionTargetPct ?? null,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
