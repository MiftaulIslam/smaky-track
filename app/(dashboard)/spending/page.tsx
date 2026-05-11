import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { EmptyState } from "@/src/components/common/EmptyState";

export const metadata: Metadata = {
  title: "Spending Reports",
  robots: { index: false, follow: false },
};

export default function SpendingPage() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="font-heading text-[24px] font-semibold text-ghost-white">
          Spending Reports
        </h1>
        <p className="text-[14px] text-slate-text mt-1">
          Detailed breakdown of your cigarette spending
        </p>
      </div>

      <EmptyState
        icon={Clock}
        title="Coming soon"
        description="Detailed spending reports with monthly breakdowns, projections, and export are in development."
      />
    </div>
  );
}
