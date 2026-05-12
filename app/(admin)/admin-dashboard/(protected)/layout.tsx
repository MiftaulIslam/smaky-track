import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { adminLogoutAction } from "@/src/features/admin/actions";
import { requireAdminAuth } from "@/src/features/admin/auth";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminAuth();

  return (
    <div className="min-h-screen">
      <header className="h-16 border-b border-border bg-[rgba(0,0,0,0.35)] backdrop-blur-[4px]">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-6">
          <div>
            <p className="text-caption text-muted-foreground uppercase tracking-wider">Admin Console</p>
            <h1 className="text-subheading font-heading font-semibold text-foreground">
              Smaky Track Admin
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">Back to App</Link>
            </Button>
            <form
              action={async () => {
                "use server";
                await adminLogoutAction();
                redirect("/admin-dashboard/login");
              }}
            >
              <Button type="submit" variant="ghost" size="sm" className="gap-1.5">
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl p-4 md:p-6">{children}</main>
    </div>
  );
}
