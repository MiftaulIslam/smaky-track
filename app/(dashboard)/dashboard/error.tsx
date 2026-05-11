"use client";

import { useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-[10px] border border-destructive/30 bg-destructive/10">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="font-heading text-[18px] font-semibold text-ghost-white">
          Something went wrong
        </h2>
        <p className="text-[14px] text-slate-text max-w-sm">
          {error.message || "An unexpected error occurred while loading the dashboard."}
        </p>
      </div>
      <Button onClick={reset} variant="ghost">
        Try again
      </Button>
    </div>
  );
}
