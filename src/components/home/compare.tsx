"use client";

import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";

const rows = [
  {
    feature: "Cigarette logging",
    free: { type: "check", label: "Unlimited" },
    pro: { type: "check", label: "Unlimited" },
  },
  {
    feature: "History & charts",
    free: { type: "check", label: "7 days" },
    pro: { type: "check", label: "Full year" },
  },
  {
    feature: "Brand tracking",
    free: { type: "check", label: "Up to 3" },
    pro: { type: "check", label: "Unlimited" },
  },
  {
    feature: "Activity heatmap",
    free: { type: "check", label: "4 weeks" },
    pro: { type: "check", label: "Full year" },
  },
  {
    feature: "Reduction score",
    free: { type: "dash" },
    pro: { type: "check", label: "Month-over-month" },
  },
  {
    feature: "CSV export",
    free: { type: "dash" },
    pro: { type: "check", label: "Full data" },
  },
  {
    feature: "Priority support",
    free: { type: "dash" },
    pro: { type: "check", label: "Email + chat" },
  },
  {
    feature: "Price",
    free: { type: "price", label: "Free" },
    pro: { type: "price", label: "$4 / month", highlight: true },
  },
] as const;

function CellValue({
  cell,
}: {
  cell: { type: string; label?: string; highlight?: boolean };
}) {
  if (cell.type === "dash") {
    return <Minus className="h-4 w-4 text-[#484f58] mx-auto" />;
  }
  if (cell.type === "price") {
    return (
      <span
        className={`text-sm font-bold ${cell.highlight ? "text-[#6b62f2]" : "text-[#e5e5e5]"}`}
      >
        {cell.label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <Check className="h-3.5 w-3.5 text-[#3fb950] shrink-0" />
      <span className="text-sm text-[#3fb950] font-medium">{cell.label}</span>
    </span>
  );
}

export function Compare() {
  return (
    <section
      id="compare"
      className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-[88px]"
      aria-labelledby="compare-heading"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-semibold uppercase tracking-widest text-[#6b62f2] mb-4"
          >
            Compare
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            id="compare-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-[#e5e5e5] tracking-tight mb-4"
          >
            Free vs Pro — side by side
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#8b949e] text-base"
          >
            See exactly what you get at each tier before deciding.
          </motion.p>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-[#21262d] overflow-hidden"
          role="table"
          aria-label="Free vs Pro comparison"
        >
          {/* Column headers */}
          <div
            className="grid grid-cols-3 bg-[#161b22] border-b border-[#21262d] px-6 py-3"
            role="row"
          >
            <div role="columnheader" className="text-sm font-semibold text-[#e5e5e5]">
              Feature
            </div>
            <div role="columnheader" className="text-sm font-semibold text-[#e5e5e5] text-center">
              Free
            </div>
            <div role="columnheader" className="text-sm font-semibold text-[#e5e5e5] text-center">
              <span>Pro</span>
              <span className="ml-2 inline-flex items-center rounded-full bg-[#6b62f2] px-2 py-0.5 text-[10px] font-semibold text-white">
                Popular
              </span>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.feature}
              role="row"
              className={`grid grid-cols-3 px-6 py-4 items-center ${
                i < rows.length - 1 ? "border-b border-[#21262d]" : ""
              } ${i % 2 === 0 ? "bg-transparent" : "bg-[#161b22]/40"}`}
            >
              <div role="cell" className="text-sm text-[#8b949e]">
                {row.feature}
              </div>
              <div role="cell" className="text-center">
                <CellValue cell={row.free} />
              </div>
              <div role="cell" className="text-center">
                <CellValue cell={row.pro} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
