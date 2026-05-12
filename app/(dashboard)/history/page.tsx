import type { Metadata } from "next";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { getRecentSmokes } from "@/src/features/smoke/queries";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { DeleteSmokeButton } from "@/src/features/smoke/components/DeleteSmokeButton";
import { EmptyState } from "@/src/components/common/EmptyState";
import { formatBDT } from "@/src/lib/money";
import { format } from "date-fns";
import { History } from "lucide-react";

export const metadata: Metadata = {
  title: "Smoke History",
  robots: { index: false, follow: false },
};

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const entries = await getRecentSmokes(userId, 50);

  // Group by date
  const grouped: Record<string, typeof entries> = {};
  for (const entry of entries) {
    const key = format(entry.smokedAt, "yyyy-MM-dd");
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(entry);
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Smoke History
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your last 50 entries
          </p>
        </div>
        <Badge variant="secondary">{entries.length} entries</Badge>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={History}
          title="No history yet"
          description="Start tracking by hitting 'Smoke Now' on the dashboard."
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped)
            .sort(([a], [b]) => (a > b ? -1 : 1))
            .map(([dateKey, dayEntries]) => (
              <section key={dateKey} aria-label={`Entries for ${dateKey}`}>
                <h2 className="text-sm font-semibold text-foreground-subtle mb-2 uppercase tracking-wider">
                  {format(new Date(dateKey + "T00:00:00"), "EEEE, MMMM d, yyyy")}
                  <span className="ml-2 text-muted-foreground font-normal">
                    {dayEntries.length} smoke{dayEntries.length > 1 ? "s" : ""} ·{" "}
                    {formatBDT(dayEntries.reduce((s, e) => s + e.priceMinor, 0))}
                  </span>
                </h2>
                <Card>
                  <CardContent className="p-0">
                    <ul role="list">
                      {dayEntries.map((entry, idx) => (
                        <li
                          key={entry.id}
                          className={`flex items-center justify-between px-5 py-3 ${idx < dayEntries.length - 1 ? "border-b border-border" : ""}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-hover shrink-0">
                              <span className="text-sm" role="img" aria-label="cigarette">🚬</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {entry.brand.name}
                              </p>
                              {entry.note && (
                                <p className="text-xs text-muted-foreground">{entry.note}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                              <p className="text-sm text-foreground font-medium">
                                {formatBDT(entry.priceMinor)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(entry.smokedAt, "h:mm a")}
                              </p>
                            </div>
                            <DeleteSmokeButton entryId={entry.id} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </section>
            ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground text-center">
        Showing last 50 entries. Advanced filtering coming soon.
      </p>
    </div>
  );
}
