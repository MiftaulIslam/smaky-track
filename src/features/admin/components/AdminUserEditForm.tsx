"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { updateAdminUserAction, type AdminActionResult } from "@/src/features/admin/actions";

type AdminUserEditFormProps = {
  userId: string;
  initialName: string;
  initialImage: string | null;
};

export function AdminUserEditForm({
  userId,
  initialName,
  initialImage,
}: AdminUserEditFormProps) {
  const action = updateAdminUserAction.bind(null, userId);
  const [state, formAction, isPending] = useActionState<AdminActionResult | null, FormData>(
    action,
    null
  );

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message ?? "User updated.");
      return;
    }
    toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="admin-user-name">Name</Label>
        <Input id="admin-user-name" name="name" defaultValue={initialName} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="admin-user-image">Avatar URL</Label>
        <Input
          id="admin-user-image"
          name="image"
          defaultValue={initialImage ?? ""}
          placeholder="https://example.com/avatar.png"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save user changes"}
      </Button>
    </form>
  );
}
