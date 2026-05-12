import { BrandBar } from "./dependencies/brand-bar";
import { DashboardCard } from "./dependencies/dashboard-card";

export function LiveDashboardPreview() {
  const HEAT_MAP_WEEKS_COUNT = 16;
  const heatmapData: number[] = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    2, 3, 4, 5, 6, 7, 8, 6, 5, 4, 3,
    1, 0, 2, 4, 6, 8, 10, 9, 7, 5, 3,
    2, 3, 5, 7, 9, 10, 8, 6, 4, 2, 1,
    0, 1, 3, 5, 7, 9, 8, 6, 4, 2, 0,
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 6,
    2, 4, 6, 8, 10, 9, 7, 5, 3, 1, 0
  ];

  const RecentLogs = [
    { name: "Marlboro Red", time: "2 min ago", type: "recent" },
    { name: "Camel Blue", time: "1 hr ago", type: "recent" },
    { name: "Lucky Strike Original", time: "3 hr ago", type: "medium" },
    { name: "Dunhill Fine Cut", time: "Yesterday", type: "old" },
    { name: "Camel Yellow", time: "Yesterday", type: "old" },
  ]

  return (
    <section className="pb-0" aria-label="Live dashboard preview">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm tracking-widest uppercase text-foreground-subtle">
            Dashboard
          </p>

          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold text-foreground">
            Everything in one view
          </h2>

          <p className="mt-3 max-w-xl mx-auto text-sm text-foreground-subtle">
            Your real-time command center for habits, spending, and trends.
          </p>
        </div>

        {/* GRID */}
        <section className="border rounded-3xl p-6">
          <div
            role="img"
            aria-label="Dashboard with analytics cards, heatmap, and brand breakdown"
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >

            {/* CARDS */}
            <DashboardCard className="w-full" title="Today" value="8" change="-2 vs yesterday" trend="down" />
            <DashboardCard className="w-full" title="Monthly spend" value="$48" change="-$12 saved" trend="up" />
            <DashboardCard className="w-full" title="This month" value="184" change="-34 vs last month" trend="up" />

            {/* HEATMAP */}
            <div className="md:col-span-2 w-full rounded-3xl border border-border-subtle bg-surface-glass backdrop-blur-xl p-6">
              <p className="text-sm text-foreground-subtle mb-4">
                Activity heatmap — {HEAT_MAP_WEEKS_COUNT} weeks
              </p>

              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${HEAT_MAP_WEEKS_COUNT}, minmax(0, 1fr))`,
                }}
              >
                {heatmapData.map((value, i) => {
                  const styles = [
                    "bg-transparent",
                    "bg-primary/10",
                    "bg-primary/20",
                    "bg-primary/30",
                    "bg-primary/40",
                    "bg-primary/50",
                    "bg-primary/60",
                    "bg-primary/70",
                    "bg-primary/80",
                    "bg-primary/90",
                    "bg-primary",
                  ];

                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm transition-colors duration-300 ${styles[value]}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* BRAND */}
            <div className="w-full rounded-3xl border border-border-subtle bg-surface-glass backdrop-blur-xl p-6">
              <p className="text-sm text-foreground-subtle mb-4">
                Brand breakdown
              </p>

              <div className="space-y-3">
                <BrandBar name="Marlboro" value={48} />
                <BrandBar name="Camel" value={31} color="#4867af" />
                <BrandBar name="Lucky St." value={21} color="#686868" />
              </div>
            </div>

            {/* RECENT LOG */}
            <div className="md:col-span-3 w-full rounded-3xl border border-border-subtle bg-surface-glass backdrop-blur-xl p-6">
              <p className="text-sm text-foreground-subtle mb-4">
                Recent log
              </p>

              <div className="space-y-2">
                {RecentLogs.slice(0, 1).map((log, i) => (
                  <div
                    key={log.name}
                    className="
                      group
                      grid grid-cols-[auto_1fr_auto]
                      items-center gap-3
                      cursor-pointer
                      rounded-xl
                      px-3 py-2
                      transition-all
                      duration-200
                      hover:bg-surface-hover
                    "
                  >
                    {/* Glow dot */}
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 blur-sm group-hover:opacity-100" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>

                    {/* Main text */}
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground group-hover:text-foreground">
                        {log.name}
                      </span>

                      {/* subtle secondary hint */}
                      <span className="text-[11px] text-foreground-subtle">
                        Logged activity entry
                      </span>
                    </div>

                    {/* Time */}
                    <span
                      className={`
            text-xs
            px-2 py-0.5
            rounded-full
            border
            border-border-subtle
            text-foreground-subtle
            bg-surface
            group-hover:border-border
          `}
                    >
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </div>
    </section>
  );
}