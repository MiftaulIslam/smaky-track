"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Cigarette,
  Shield,
  TrendingDown,
  Wallet,
} from "lucide-react";

const features = [
  {
    icon: Cigarette,
    title: "One-tap logging",
    description:
      "Log every cigarette instantly with brand selection. Never miss an entry with our quick-action card.",
    gradientWash:
      "bg-linear-to-b from-orange-500/25 via-rose-500/12 to-orange-950/40",
    gradientGlow: "bg-linear-to-br from-orange-500/30 via-rose-500/15 to-transparent",
    iconGlow: "group-hover:text-orange-400",
    iconBg: "group-hover:bg-orange-500/10 group-hover:border-orange-500/30",
  },
  {
    icon: BarChart3,
    title: "Rich analytics",
    description:
      "Daily trends, monthly spending charts, brand distribution, and weekly heatmaps — all at a glance.",
    gradientWash:
      "bg-linear-to-b from-blue-500/25 via-cyan-500/12 to-slate-950/40",
    gradientGlow: "bg-linear-to-br from-blue-500/30 via-cyan-500/15 to-transparent",
    iconGlow: "group-hover:text-blue-400",
    iconBg: "group-hover:bg-blue-500/10 group-hover:border-blue-500/30",
  },
  {
    icon: Calendar,
    title: "Activity heatmap",
    description:
      "GitHub-style contribution calendar showing your smoking density across the entire year.",
    gradientWash:
      "bg-linear-to-b from-violet-500/25 via-purple-500/12 to-violet-950/40",
    gradientGlow: "bg-linear-to-br from-violet-500/30 via-purple-500/15 to-transparent",
    iconGlow: "group-hover:text-violet-400",
    iconBg: "group-hover:bg-violet-500/10 group-hover:border-violet-500/30",
  },
  {
    icon: Wallet,
    title: "Spending tracker",
    description:
      "Know exactly how much you spend per day, week, month, and year. See where your money goes.",
    gradientWash:
      "bg-linear-to-b from-emerald-500/25 via-teal-500/12 to-emerald-950/40",
    gradientGlow: "bg-linear-to-br from-emerald-500/30 via-teal-500/15 to-transparent",
    iconGlow: "group-hover:text-emerald-400",
    iconBg: "group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30",
  },
  {
    icon: TrendingDown,
    title: "Reduction tracking",
    description:
      "Month-over-month comparison to see your progress. Celebrate reductions. Spot increases early.",
    gradientWash:
      "bg-linear-to-b from-pink-500/25 via-fuchsia-500/12 to-fuchsia-950/40",
    gradientGlow: "bg-linear-to-br from-pink-500/30 via-fuchsia-500/15 to-transparent",
    iconGlow: "group-hover:text-pink-400",
    iconBg: "group-hover:bg-pink-500/10 group-hover:border-pink-500/30",
  },
  {
    icon: Shield,
    title: "Secure & private",
    description:
      "Your data stays yours. Secured with Google OAuth or email/password, encrypted at rest in Postgres.",
    gradientWash:
      "bg-linear-to-b from-amber-500/25 via-yellow-500/12 to-amber-950/40",
    gradientGlow: "bg-linear-to-br from-amber-500/30 via-yellow-500/15 to-transparent",
    iconGlow: "group-hover:text-amber-400",
    iconBg: "group-hover:bg-amber-500/10 group-hover:border-amber-500/30",
  },
] as const;

export function Features() {
  return (
    <section
      id="features"
      className="py-24 px-4 sm:px-6 lg:px-8 relative scroll-mt-[88px]"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            id="features-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight"
          >
            Everything you need to track smarter
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-foreground-subtle max-w-2xl mx-auto font-medium"
          >
            Built for real awareness. Log once, gain clarity for days.
          </motion.p>
        </div>

        <ul
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {features.map((feature, index) => (
            <motion.li
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-border-subtle bg-surface p-8 shadow-sm transition-all duration-300 hover:border-border-strong hover:bg-surface-hover hover:shadow-lg"
            >
              {/* Full-card hover wash (top → bottom so color reaches the footer of the card) */}
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 z-0 min-h-full w-full rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${feature.gradientWash}`}
              />
              {/* Corner accent */}
              <div
                aria-hidden
                className={`pointer-events-none absolute -top-10 -left-10 z-0 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 ${feature.gradientGlow}`}
              />
              <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border-strong bg-surface-elevated ${feature.iconBg} transition-colors duration-300`}
                >
                  <feature.icon
                    className={`h-6 w-6 text-foreground ${feature.iconGlow} transition-colors duration-300`}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-foreground-subtle sm:text-base">
                  {feature.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
