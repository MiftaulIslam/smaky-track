import React from "react";
import { Cigarette, TrendingDown, TrendingUp, Wallet, CalendarDays } from "lucide-react";

const CARD_CONFIGS: Record<
  string,
  {
    icon: React.ElementType;
    gradient: string;
    glowColor: string;
    ringColor: string;
    iconBg: string;
    decorShape: string;
  }
> = {
  Today: {
    icon: Cigarette,
    gradient: "from-violet-500/10 via-primary/5 to-transparent",
    glowColor: "bg-violet-500/20",
    ringColor: "ring-violet-500/30",
    iconBg: "bg-violet-500/15 text-violet-400",
    decorShape:
      "w-32 h-32 rounded-full bg-violet-500/10 blur-2xl -top-6 -right-6",
  },
  "Monthly spend": {
    icon: Wallet,
    gradient: "from-emerald-500/10 via-emerald-400/5 to-transparent",
    glowColor: "bg-emerald-500/20",
    ringColor: "ring-emerald-500/30",
    iconBg: "bg-emerald-500/15 text-emerald-400",
    decorShape:
      "w-28 h-28 rounded-full bg-emerald-500/10 blur-2xl -top-4 -right-4",
  },
  "This month": {
    icon: CalendarDays,
    gradient: "from-sky-500/10 via-sky-400/5 to-transparent",
    glowColor: "bg-sky-500/20",
    ringColor: "ring-sky-500/30",
    iconBg: "bg-sky-500/15 text-sky-400",
    decorShape:
      "w-28 h-28 rounded-full bg-sky-500/10 blur-2xl -top-4 -right-4",
  },
};

const DEFAULT_CONFIG = CARD_CONFIGS["Today"];

export const DashboardCard = ({
  title,
  value,
  change,
  trend,
  className = "",
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  className?: string;
}) => {
  const cfg = CARD_CONFIGS[title] ?? DEFAULT_CONFIG;
  const Icon = cfg.icon;
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor = trend === "up" ? "text-emerald-400" : "text-red-400";

  return (
    <div
      className={`
        relative overflow-hidden
        rounded-3xl border border-border-subtle
        bg-surface-glass backdrop-blur-xl
        p-6 ring-1 ${cfg.ringColor}
        transition-all duration-300
        hover:shadow-lg hover:scale-[1.02]
        ${className}
      `}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${cfg.gradient} pointer-events-none`}
      />

      {/* Decorative blur circle */}
      <div className={`absolute pointer-events-none ${cfg.decorShape}`} />

      {/* Decorative dot grid (3×3) */}
      <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-[5px] opacity-20 pointer-events-none">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-1 w-1 rounded-full bg-foreground-subtle" />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground-subtle">
            {title}
          </p>
          <div className="mt-3 text-4xl font-black text-foreground leading-none tracking-tight">
            {value}
          </div>
          <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{change}</span>
          </div>
        </div>

        {/* Icon badge */}
        <div
          className={`
            flex h-11 w-11 shrink-0 items-center justify-center
            rounded-2xl ring-1 ring-inset ring-white/10
            ${cfg.iconBg}
          `}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`
          absolute bottom-0 left-6 right-6 h-px
          bg-linear-to-r from-transparent via-primary/30 to-transparent
        `}
      />
    </div>
  );
};
