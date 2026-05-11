import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { EmptyState } from "@/src/components/common/EmptyState";

export const metadata: Metadata = {
  title: "Brand Statistics",
  robots: { index: false, follow: false },
};

export default function BrandsPage() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="font-heading text-[24px] font-semibold text-ghost-white">
          Brand Statistics
        </h1>
        <p className="text-[14px] text-slate-text mt-1">
          Breakdown by cigarette brand
        </p>
      </div>

      <EmptyState
        icon={Clock}
        title="Coming soon"
        description="Per-brand analytics, spending by brand, and brand comparison charts are in development."
      />
    </div>
  );
}
