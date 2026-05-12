import type { Metadata } from "next";
import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { userSettings, users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { ProfileForm } from "@/src/features/account/components/ProfileForm";
import { getActiveBrands } from "@/src/features/brands/queries";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const [user, settings, brands] = await Promise.all([
    db.query.users.findFirst({
      where: eq(users.id, userId),
    }),
    db.query.userSettings.findFirst({
      where: eq(userSettings.userId, userId),
    }),
    getActiveBrands(),
  ]);

  if (!user) redirect("/login");

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-2xl">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-heading text-lg font-semibold text-foreground">
                {user.name ?? "No name set"}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-subtle">Name</span>
              <span className="text-sm text-foreground">{user.name ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-subtle">Email</span>
              <span className="text-sm text-foreground">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-subtle">Account type</span>
              <Badge variant="accent">Tracker</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-subtle">Default brand</span>
              <span className="text-sm text-foreground">
                {brands.find((brand) => brand.id === settings?.defaultBrandId)?.name ?? "Recent smoke"}
              </span>
            </div>
          </div>

          <ProfileForm
            initial={{
              name: user.name ?? "",
              image: user.image,
              email: user.email,
              defaultBrandId: settings?.defaultBrandId ?? null,
            }}
            brands={brands.map((brand) => ({ id: brand.id, name: brand.name }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
