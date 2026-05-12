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
  },
  {
    icon: BarChart3,
    title: "Rich analytics",
    description:
      "Daily trends, monthly spending charts, brand distribution, and weekly heatmaps — all at a glance.",
  },
  {
    icon: Calendar,
    title: "Activity heatmap",
    description:
      "GitHub-style contribution calendar showing your smoking density across the entire year.",
  },
  {
    icon: Wallet,
    title: "Spending tracker",
    description:
      "Know exactly how much you spend per day, week, month, and year. See where your money goes.",
  },
  {
    icon: TrendingDown,
    title: "Reduction tracking",
    description:
      "Month-over-month comparison to see your progress. Celebrate reductions. Spot increases early.",
  },
  {
    icon: Shield,
    title: "Secure & private",
    description:
      "Your data stays yours. Secured with Google OAuth or email/password, encrypted at rest in Postgres.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-24 px-4 sm:px-6 lg:px-8 relative"
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
              className="group rounded-3xl border border-border-subtle bg-surface p-8 space-y-4 hover:bg-surface-hover hover:border-border-strong transition-all duration-300 cursor-default relative overflow-hidden shadow-sm hover:shadow-md"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-soft/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-elevated border border-border-strong group-hover:border-primary/50 group-hover:bg-primary-soft transition-colors duration-300">
                <feature.icon
                  className="h-6 w-6 text-foreground group-hover:text-primary transition-colors duration-300"
                  aria-hidden="true"
                />
              </div>
              <h3 className="relative z-10 font-heading text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="relative z-10 text-sm sm:text-base text-foreground-subtle leading-relaxed">
                {feature.description}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
