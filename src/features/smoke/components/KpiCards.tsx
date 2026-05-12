import {
  Cigarette,
  TrendingDown,
  TrendingUp,
  Flame,
  Star,
  BarChart3,
  Clock,
} from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { formatBDT } from "@/src/lib/money";
import { packetsFromCigarettes } from "@/src/lib/smoking";
import type { KpiData } from "../queries";
import { LastSmokeRelative } from "./LastSmokeRelative";

interface KpiCardsProps {
  kpis: KpiData;
  lastSmokeAt: Date | null;
}

export function KpiCards({ kpis, lastSmokeAt }: KpiCardsProps) {
  const reductionPositive =
    kpis.reductionPct !== null && kpis.reductionPct > 0;
  const reductionNegative =
    kpis.reductionPct !== null && kpis.reductionPct < 0;

  const cards = [
    {
      label: "Today",
      value: kpis.today.count.toString(),
      subvalue: `${formatBDT(kpis.today.spendMinor)} · ${packetsFromCigarettes(kpis.today.count).toFixed(1)} packets`,
      icon: Cigarette,
      description: "cigarettes",
    },
    {
      label: "This Week",
      value: kpis.week.count.toString(),
      subvalue: `${formatBDT(kpis.week.spendMinor)} · ${packetsFromCigarettes(kpis.week.count).toFixed(1)} packets`,
      icon: BarChart3,
      description: "cigarettes",
    },
    {
      label: "This Month",
      value: kpis.month.count.toString(),
      subvalue: `${formatBDT(kpis.month.spendMinor)} · ${packetsFromCigarettes(kpis.month.count).toFixed(1)} packets`,
      icon: Cigarette,
      description: "cigarettes",
    },
    {
      label: "This Year",
      value: kpis.year.count.toString(),
      subvalue: `${formatBDT(kpis.year.spendMinor)} · ${packetsFromCigarettes(kpis.year.count).toFixed(1)} packets`,
      icon: Cigarette,
      description: "cigarettes",
    },
    {
      label: "Avg / Day",
      value: kpis.avgPerDay.toString(),
      subvalue: "last 30 days",
      icon: BarChart3,
      description: "cigarettes",
    },
    {
      label: "Monthly Change",
      value:
        kpis.reductionPct !== null
          ? `${kpis.reductionPct > 0 ? "−" : "+"}${Math.abs(kpis.reductionPct)}%`
          : "—",
      subvalue:
        kpis.reductionPct !== null
          ? reductionPositive
            ? "vs last month"
            : "vs last month"
          : "no prior data",
      icon: reductionPositive ? TrendingDown : TrendingUp,
      description: "",
      accent: reductionPositive
        ? "success"
        : reductionNegative
          ? "destructive"
          : "secondary",
    },
    {
      label: "Current Streak",
      value: `${kpis.streak}d`,
      subvalue: "consecutive days",
      icon: Flame,
      description: "",
    },
    {
      label: "Top Brand",
      value: kpis.mostSmokedBrand ?? "—",
      subvalue: "last 30 days",
      icon: Star,
      description: "",
    },
  ] as const;

  return (
    <section aria-label="Key performance indicators">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="font-heading text-2xl font-semibold text-foreground leading-none">
                  {card.value}
                </p>
                <p className="text-xs text-foreground-subtle">{card.subvalue}</p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-hover border border-border">
                <card.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
            </div>
          </Card>
        ))}

        {/* Last smoked — live-updating */}
        <Card className="p-5 col-span-2 sm:col-span-1">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Last Smoked
              </p>
              <LastSmokeRelative date={lastSmokeAt} />
              {lastSmokeAt && (
                <p className="text-xs text-foreground-subtle">
                  {lastSmokeAt.toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-hover border border-border">
              <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
