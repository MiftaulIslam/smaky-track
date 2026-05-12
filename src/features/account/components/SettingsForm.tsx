"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  updateSettingsAction,
  type AccountActionResult,
} from "@/src/features/account/actions";

type SettingsFormProps = {
  initial: {
    currency: string;
    timezone: string;
    dailyGoal: number | null;
    reductionTargetPct: number | null;
  };
};

export function SettingsForm({ initial }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState<AccountActionResult | null, FormData>(
    updateSettingsAction,
    null
  );

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success("Settings saved.");
    } else {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="currency">Currency</Label>
        <Input id="currency" name="currency" defaultValue={initial.currency} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="timezone">Timezone</Label>
        <Input id="timezone" name="timezone" defaultValue={initial.timezone} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="dailyGoal">Daily Goal (smokes)</Label>
        <Input
          id="dailyGoal"
          name="dailyGoal"
          type="number"
          min={1}
          max={200}
          defaultValue={initial.dailyGoal ?? ""}
          placeholder="Optional"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="reductionTargetPct">Reduction Target (%)</Label>
        <Input
          id="reductionTargetPct"
          name="reductionTargetPct"
          type="number"
          min={1}
          max={100}
          defaultValue={initial.reductionTargetPct ?? ""}
          placeholder="Optional"
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
