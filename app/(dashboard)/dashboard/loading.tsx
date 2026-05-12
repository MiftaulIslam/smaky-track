import { Skeleton } from "@/src/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* KPI skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>

      {/* Quick smoke + calendar row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-52 rounded-2xl" />
        <div className="lg:col-span-2">
          <Skeleton className="h-52 rounded-2xl" />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
