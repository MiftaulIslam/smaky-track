import type { Metadata } from "next";
import { auth } from "@/src/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await auth();
  const user = session!.user!;

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-2xl">
      <div>
        <h1 className="font-heading text-[24px] font-semibold text-ghost-white">Profile</h1>
        <p className="text-[14px] text-slate-text mt-1">Your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
              <AvatarFallback className="text-[20px]">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-heading text-[18px] font-semibold text-ghost-white">
                {user.name ?? "No name set"}
              </p>
              <p className="text-[14px] text-slate-text">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3 border-t border-gunmetal pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-ash-text">Name</span>
              <span className="text-[14px] text-ghost-white">{user.name ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-ash-text">Email</span>
              <span className="text-[14px] text-ghost-white">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-ash-text">Account type</span>
              <Badge variant="accent">Tracker</Badge>
            </div>
          </div>

          <p className="text-[13px] text-slate-text">
            Profile editing coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
