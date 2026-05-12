"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  updateProfileAction,
  type AccountActionResult,
} from "@/src/features/account/actions";

type ProfileFormProps = {
  initial: {
    name: string;
    image: string | null;
    email: string;
    defaultBrandId: string | null;
  };
  brands: Array<{ id: string; name: string }>;
};

export function ProfileForm({ initial, brands }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState<AccountActionResult | null, FormData>(
    updateProfileAction,
    null
  );

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success("Profile updated.");
    } else {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4 border-t border-gunmetal pt-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={initial.name} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" value={initial.email} readOnly disabled />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="image">Avatar URL</Label>
        <Input
          id="image"
          name="image"
          defaultValue={initial.image ?? ""}
          placeholder="https://example.com/avatar.png"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="defaultBrandId">Default Brand</Label>
        <select
          id="defaultBrandId"
          name="defaultBrandId"
          defaultValue={initial.defaultBrandId ?? ""}
          className="flex h-10 w-full rounded-lg border border-gunmetal bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[14px] text-ghost-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-glow focus-visible:border-transparent"
        >
          <option value="">Use recent smoke brand</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
