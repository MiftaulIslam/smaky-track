"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Create your account",
    description:
      "Sign up with Google OAuth or email in seconds. No credit card, no onboarding maze.",
  },
  {
    number: 2,
    title: "Add brands & prices",
    description:
      "Tell Smaky the brands you smoke and pack price. It handles all cost calculations automatically.",
  },
  {
    number: 3,
    title: "Tap to log, watch trends",
    description:
      "One tap per cigarette. Charts, heatmaps, and your reduction score update in real time.",
  },
];

const phoneStates = [
  {
    buttonLabel: "Log cigarette",
    activeChip: null as string | null,
  },
  {
    buttonLabel: "Pick your brand",
    activeChip: "Camel",
  },
  {
    buttonLabel: "View your trends",
    activeChip: "Lucky St.",
  },
];

function PhoneMockup({ stateIndex }: { stateIndex: number }) {
  const state = phoneStates[stateIndex];

  const chips = ["Marlboro", "Camel", "Lucky St."];

  return (
    <div className="w-[280px] rounded-3xl border border-border-subtle bg-surface shadow-2xl p-5 space-y-4">
      {/* Title bar */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Smaky Track</span>
        <span className="text-xs text-foreground-disabled">10:42 AM</span>
      </div>

      {/* CTA button */}
      <AnimatePresence mode="wait">
        <motion.button
          key={state.buttonLabel}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
          tabIndex={-1}
          aria-hidden="true"
        >
          <span className="text-base leading-none">⊕</span>
          {state.buttonLabel}
        </motion.button>
      </AnimatePresence>

      {/* Brand chips */}
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const isActive = state.activeChip === chip;
          return (
            <motion.span
              key={chip}
              animate={{
                backgroundColor: isActive ? "hsl(var(--primary))" : "transparent",
                borderColor: isActive
                  ? "hsl(var(--primary))"
                  : "hsl(var(--border-subtle))",
                color: isActive
                  ? "hsl(var(--primary-foreground))"
                  : "hsl(var(--foreground-subtle))",
              }}
              transition={{ duration: 0.3 }}
              className="rounded-full border px-3 py-1 text-xs font-medium"
            >
              {chip}
            </motion.span>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-4">
          <p className="text-2xl font-bold text-foreground">8</p>
          <p className="text-[11px] text-foreground-disabled uppercase tracking-wide mt-1">
            Today
          </p>
        </div>
        <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-4">
          <p className="text-2xl font-bold text-foreground">$48</p>
          <p className="text-[11px] text-foreground-disabled uppercase tracking-wide mt-1">
            This month
          </p>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-[88px]"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — steps */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                How it works
              </p>
              <h2
                id="how-it-works-heading"
                className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight"
              >
                Up and running in 60 seconds
              </h2>
              <p className="mt-4 text-lg text-foreground-subtle font-medium">
                No complex setup. Sign in, set your brands, and your first log is
                seconds away.
              </p>
            </motion.div>

            <ol className="space-y-0" role="list">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                const isPast = activeStep > index;

                return (
                  <motion.li
                    key={step.number}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex gap-5 cursor-default"
                    onClick={() => setActiveStep(index)}
                  >
                    {/* Number + connector line */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        animate={{
                          backgroundColor: isActive
                            ? "hsl(var(--primary))"
                            : isPast
                            ? "hsl(var(--primary) / 0.3)"
                            : "hsl(var(--surface-elevated))",
                          borderColor: isActive
                            ? "hsl(var(--primary))"
                            : "hsl(var(--border-subtle))",
                        }}
                        transition={{ duration: 0.3 }}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold"
                        style={{
                          color: isActive
                            ? "hsl(var(--primary-foreground))"
                            : "hsl(var(--foreground-subtle))",
                        }}
                      >
                        {step.number}
                      </motion.div>
                      {index < steps.length - 1 && (
                        <div className="w-px flex-1 bg-border-subtle my-2" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-8 pt-1">
                      <motion.h3
                        animate={{
                          color: isActive
                            ? "hsl(var(--foreground))"
                            : "hsl(var(--foreground-subtle))",
                        }}
                        transition={{ duration: 0.3 }}
                        className="font-heading text-lg font-semibold"
                      >
                        {step.title}
                      </motion.h3>
                      <AnimatePresence>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-2 text-sm text-foreground-subtle leading-relaxed overflow-hidden"
                          >
                            {step.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>

          {/* Right — animated phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 -z-10 rounded-3xl bg-primary/20 blur-3xl scale-90 opacity-60" />
              <PhoneMockup stateIndex={activeStep} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
