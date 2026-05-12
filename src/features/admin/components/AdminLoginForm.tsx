"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { adminLoginAction, type AdminActionResult } from "@/src/features/admin/actions";

export function AdminLoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<AdminActionResult | null, FormData>(
    adminLoginAction,
    null
  );

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success("Admin access granted.");
      router.push("/admin-dashboard");
      router.refresh();
      return;
    }
    toast.error(state.error);
  }, [state, router]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-interactive-glow/30 bg-interactive-glow/15">
          <ShieldCheck className="h-5 w-5 text-interactive-glow" aria-hidden="true" />
        </div>
        <CardTitle>Admin Access</CardTitle>
        <CardDescription>Enter the admin password to access the dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter admin password"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Verifying..." : "Unlock Admin Dashboard"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
