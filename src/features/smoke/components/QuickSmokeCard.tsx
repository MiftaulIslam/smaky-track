"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Cigarette, Flame } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { logSmokeAction } from "../actions";
import type { CigaretteBrand } from "@/src/db/schema";
import { formatBDT } from "@/src/lib/money";

interface QuickSmokeCardProps {
  brands: CigaretteBrand[];
  defaultBrandId?: string;
}

export function QuickSmokeCard({ brands, defaultBrandId }: QuickSmokeCardProps) {
  const [selectedBrandId, setSelectedBrandId] = useState(
    defaultBrandId ?? brands[0]?.id ?? ""
  );
  const queryClient = useQueryClient();

  const selectedBrand = brands.find((b) => b.id === selectedBrandId);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const result = await logSmokeAction(selectedBrandId);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onMutate: async () => {
      // Optimistic: immediately show success feedback
      toast.loading("Logging smoke…", { id: "quick-smoke" });
    },
    onSuccess: () => {
      toast.success("Smoke logged!", { id: "quick-smoke" });
      queryClient.invalidateQueries({ queryKey: ["kpis"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to log smoke", { id: "quick-smoke" });
    },
  });

  return (
    <Card className="relative overflow-hidden">
      {/* ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(107,98,242,0.08), transparent)",
        }}
        aria-hidden="true"
      />

      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-interactive-glow/15 border border-interactive-glow/25">
            <Cigarette className="h-4 w-4 text-interactive-glow" aria-hidden="true" />
          </div>
          <CardTitle>Quick Smoke</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="brand-select"
            className="text-[13px] font-medium text-ash-text"
          >
            Select Brand
          </label>
          <Select
            value={selectedBrandId}
            onValueChange={setSelectedBrandId}
          >
            <SelectTrigger id="brand-select" aria-label="Select cigarette brand">
              <SelectValue placeholder="Choose a brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  <span className="flex items-center justify-between w-full gap-8">
                    <span>{brand.name}</span>
                    <span className="text-slate-text text-[12px]">
                      {formatBDT(brand.defaultPriceMinor)}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedBrand && (
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-slate-text">Cost per cigarette</span>
            <span className="text-ghost-white font-medium">
              {formatBDT(selectedBrand.defaultPriceMinor)}
            </span>
          </div>
        )}

        <Button
          size="xl"
          className="w-full gap-2"
          onClick={() => mutate()}
          disabled={isPending || !selectedBrandId}
          aria-label="Log a smoke now"
        >
          <Flame className="h-4 w-4" aria-hidden="true" />
          {isPending ? "Logging…" : "Smoke Now"}
        </Button>
      </CardContent>
    </Card>
  );
}
