"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const freePlan = {
  label: "FREE",
  price: "$0",
  period: "/month",
  description: "Everything to start tracking and building awareness around your habit.",
  features: [
    "Unlimited cigarette logging",
    "7-day history & charts",
    "Basic spending overview",
    "Up to 3 brands",
    "4-week heatmap",
  ],
  cta: "Get started free",
  href: "/signup",
  popular: false,
};

const proPlan = {
  label: "PRO",
  price: "$4",
  period: "/month",
  description: "The full analytics suite for people serious about cutting down. Cancel anytime.",
  features: [
    "Everything in Free",
    "Full year history & heatmap",
    "Month-over-month reduction score",
    "Unlimited brands & CSV export",
    "Priority email & chat support",
  ],
  cta: "Start Pro free trial",
  href: "/signup?plan=pro",
  popular: true,
};

function PlanCard({
  plan,
  delay,
}: {
  plan: typeof freePlan | typeof proPlan;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-2xl p-8 flex flex-col gap-6 ${
        plan.popular
          ? "bg-[#161b22] border-2 border-[#6b62f2]"
          : "bg-transparent border border-[#21262d]"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-[#6b62f2] px-3 py-1 text-xs font-semibold text-white">
            Most popular
          </span>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#8b949e] mb-3">
          {plan.label}
        </p>
        <div className="flex items-end gap-1">
          <span className="text-5xl font-bold text-[#e5e5e5] tracking-tight">{plan.price}</span>
          <span className="text-sm text-[#8b949e] mb-1.5">{plan.period}</span>
        </div>
        <p className="mt-3 text-sm text-[#8b949e] leading-relaxed">{plan.description}</p>
      </div>

      <ul className="space-y-3 flex-1" role="list">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <div
              className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full shrink-0 ${
                plan.popular ? "bg-[#6b62f2]" : "bg-[#21262d]"
              }`}
            >
              <Check className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="text-sm text-[#c2c2c2]">{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href={plan.href}
        className={`w-full flex items-center justify-center rounded-full py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${
          plan.popular
            ? "bg-white text-black"
            : "border border-[#30363d] text-[#e5e5e5] bg-transparent hover:bg-[#161b22]"
        }`}
      >
        {plan.cta}
      </Link>
    </motion.div>
  );
}

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-[88px]"
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-semibold uppercase tracking-widest text-[#6b62f2] mb-4"
          >
            Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            id="pricing-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-[#e5e5e5] tracking-tight mb-4"
          >
            Simple, honest pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#8b949e] text-base"
          >
            Start free. Upgrade when you want the full picture.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <PlanCard plan={freePlan} delay={0.15} />
          <PlanCard plan={proPlan} delay={0.25} />
        </div>
      </div>
    </section>
  );
}
