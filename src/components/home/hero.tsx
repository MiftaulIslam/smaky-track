"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Flame,
  Sparkles,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { HeroStatsCarousel } from "./hero-stats";

const stats = [
  ["12k+", "Active users"],
  ["2.4M", "Logs recorded"],
  ["$180k", "Spending tracked"],
  ["−31%", "Avg. reduction"],
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Hero({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-background
        px-4
        pt-32
        pb-24
        text-center
        sm:px-6
        lg:px-8
      "
    >
      {/* Ambient Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -10%, var(--color-primary-soft), transparent 68%)",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 45% 35% at 85% 85%, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent 70%)",
        }}
      />

      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          pointer-events-none
          opacity-40
          [background-image:linear-gradient(color-mix(in_srgb,var(--color-primary)_6%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--color-primary)_6%,transparent)_1px,transparent_1px)]
          [background-size:56px_56px]
          [mask-image:radial-gradient(ellipse_80%_65%_at_50%_40%,black_10%,transparent_80%)]
        "
      />

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.12 }}
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-7xl
        "
      >
        <div className="mx-auto max-w-[860px]">
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-border-subtle
                bg-surface-glass
                px-4
                py-2
                backdrop-blur-xl
              "
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />

              <span
                className="
                  text-xs
                  font-semibold
                  tracking-wide
                  text-foreground-subtle
                "
              >
                Now with advanced analytics · Free forever
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            id="hero-heading"
            variants={fadeUp}
            className="
              mt-8
              font-heading
              text-5xl
              font-black
              leading-[0.95]
              tracking-[-0.06em]
              text-foreground
              sm:text-6xl
              md:text-7xl
              lg:text-[84px]
            "
          >
            Track every smoke.

            <span
              className="
                mt-2
                block
                bg-gradient-to-r
                from-primary
                via-primary-hover
                to-primary
                bg-clip-text
                text-transparent
              "
            >
              Take back control.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="
              mx-auto
              mt-8
              max-w-[680px]
              text-lg
              leading-8
              text-foreground-subtle
              md:text-xl
            "
          >
            Smaky Track gives you a crystal-clear picture
            of your smoking habits — frequency, spending,
            trends, and progress — all inside a beautifully
            crafted dark dashboard.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            className="
              mt-12
              flex
              flex-col
              items-center
              justify-center
              gap-4
              sm:flex-row
            "
          >
            <Button
              asChild
              size="xl"
              className="
                group
                shadow-[0_0_40px_var(--color-primary-glow)]
              "
            >
              <Link
                href={
                  isLoggedIn
                    ? "/dashboard"
                    : "/signup"
                }
              >
                <Flame className="mr-2 h-5 w-5" />

                {isLoggedIn
                  ? "Go to dashboard"
                  : "Start tracking free"}

                <ArrowRight
                  className="
                    ml-2
                    h-4
                    w-4
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>
            </Button>

            {!isLoggedIn && (
              <Button
                asChild
                variant="secondary"
                size="xl"
                className="
                  border
                  border-border-subtle
                  bg-surface-glass
                  backdrop-blur-xl
                  hover:bg-surface-hover
                "
              >
                <Link href="/login">
                  Sign in
                </Link>
              </Button>
            )}
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={fadeUp}
            className="
              mt-6
              flex
              flex-wrap
              items-center
              justify-center
              gap-3
              text-sm
              text-foreground-disabled
            "
          >
            <span>No credit card</span>

            <div className="h-1 w-1 rounded-full bg-foreground-disabled" />

            <span>Google OAuth or email</span>

            <div className="h-1 w-1 rounded-full bg-foreground-disabled" />

            <span>Setup in 60 seconds</span>
          </motion.div>

          <HeroStatsCarousel />

          {/* Stats */}
          {/* <motion.div
            variants={fadeUp}
            className="
              mt-16
              grid
              grid-cols-2
              gap-4
              sm:grid-cols-4
            "
          >
            {stats.map(([value, label]) => (
              <div
                key={label}
                className="
                  rounded-3xl
                  border
                  border-border-subtle
                  bg-surface-glass
                  px-5
                  py-6
                  backdrop-blur-xl
                  transition-colors
                  hover:bg-surface-hover
                "
              >
                <div
                  className="
                    text-2xl
                    font-bold
                    text-foreground
                  "
                >
                  {value}
                </div>

                <div
                  className="
                    mt-1
                    text-sm
                    text-foreground-subtle
                  "
                >
                  {label}
                </div>
              </div>
            ))}
          </motion.div> */}
        </div>
      </motion.div>
    </section>
  );
}