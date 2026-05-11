import type { Metadata } from "next";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { getCalendarData } from "@/src/features/smoke/queries";
import { ContributionCalendarPanel } from "@/src/features/dashboard/components/ContributionCalendarPanel";

export const metadata: Metadata = {
  title: "Calendar View",
  robots: { index: false, follow: false },
};

export default async function CalendarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;
  const currentYear = new Date().getFullYear();

  const calendarData = await getCalendarData(userId, currentYear);

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="font-heading text-[24px] font-semibold text-ghost-white">
          Calendar View
        </h1>
        <p className="text-[14px] text-slate-text mt-1">
          Visualize your smoking activity across the year
        </p>
      </div>

      <ContributionCalendarPanel
        title="Smoking Activity Heatmap"
        initialYear={currentYear}
        initialData={calendarData}
        contentClassName="overflow-x-auto"
      />
    </div>
  );
}
