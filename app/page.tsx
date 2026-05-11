import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  BarChart3,
  Calendar,
  Cigarette,
  Flame,
  Shield,
  TrendingDown,
  Wallet,
  Zap,
} from "lucide-react";
import { APP_URL, DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: APP_URL },
  openGraph: {
    type: "website",
    url: APP_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

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

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Smaky Track",
    url: APP_URL,
    description: DEFAULT_DESCRIPTION,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Cigarette smoking logger",
      "Spending analytics",
      "Brand statistics",
      "Contribution calendar heatmap",
      "Reduction tracking",
      "Google OAuth sign-in",
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="min-h-screen bg-midnight-base text-ghost-white">
        {/* Navbar */}
        <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between border-b border-gunmetal/60 bg-midnight-base/80 px-6 md:px-12 h-16 backdrop-blur-[8px]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-interactive-glow/20 border border-interactive-glow/30">
              <span className="text-[14px]" role="img" aria-label="cigarette">🚬</span>
            </div>
            <span className="font-heading text-[15px] font-semibold text-ghost-white">
              Smaky Track
            </span>
          </div>
          <nav className="flex items-center gap-3" aria-label="Primary navigation">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Get started</Link>
            </Button>
          </nav>
        </header>

        {/* Hero */}
        <main>
          <section
            className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24 pb-20"
            aria-labelledby="hero-heading"
          >
            {/* Background gradients */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(107,98,242,0.2), transparent)",
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 50% 30% at 80% 80%, rgba(72,103,175,0.1), transparent)",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <div>
                <Badge variant="accent" className="mb-6">
                  <Zap className="h-3 w-3 mr-1" />
                  Now with advanced analytics
                </Badge>
              </div>

              <h1
                id="hero-heading"
                className="font-heading text-[40px] sm:text-[56px] md:text-[64px] font-bold text-ghost-white leading-[1] tracking-[-0.672px]"
              >
                Track every smoke.
                <br />
                <span style={{ color: "#6b62f2" }}>Take back control.</span>
              </h1>

              <p className="text-[18px] text-ash-text leading-[1.6] max-w-xl mx-auto">
                Smaky Track gives you a clear picture of your smoking habits — frequency,
                spending, trends, and progress — all in a beautiful dark dashboard.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Button asChild size="xl">
                  <Link href="/signup">
                    <Flame className="h-4 w-4" aria-hidden="true" />
                    Start tracking free
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="xl">
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>

              <p className="text-[13px] text-slate-text">
                Free to use · Google OAuth or email · No credit card
              </p>
            </div>
          </section>

          {/* Features */}
          <section
            className="py-24 px-6"
            aria-labelledby="features-heading"
          >
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  id="features-heading"
                  className="font-heading text-[32px] font-semibold text-ghost-white mb-4"
                >
                  Everything you need to track smarter
                </h2>
                <p className="text-[16px] text-ash-text max-w-lg mx-auto">
                  Built for real awareness. Log once, gain clarity for days.
                </p>
              </div>

              <ul
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                role="list"
              >
                {features.map((feature) => (
                  <li
                    key={feature.title}
                    className="rounded-[24px] border border-gunmetal bg-[rgba(212,212,212,0.04)] p-6 space-y-3 hover:border-[rgba(107,98,242,0.3)] transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-interactive-glow/15 border border-interactive-glow/25">
                      <feature.icon
                        className="h-5 w-5 text-interactive-glow"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-heading text-[16px] font-semibold text-ghost-white">
                      {feature.title}
                    </h3>
                    <p className="text-[14px] text-ash-text leading-[1.6]">
                      {feature.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section
            className="py-24 px-6 text-center"
            aria-labelledby="cta-heading"
          >
            <div className="max-w-xl mx-auto space-y-6">
              <h2
                id="cta-heading"
                className="font-heading text-[36px] font-semibold text-ghost-white"
              >
                Ready to track smarter?
              </h2>
              <p className="text-[16px] text-ash-text">
                Join and start understanding your habits from day one.
              </p>
              <Button asChild size="xl" className="mx-auto">
                <Link href="/signup">
                  Create free account
                </Link>
              </Button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-gunmetal px-6 py-8 text-center">
          <p className="text-[13px] text-slate-text">
            © {new Date().getFullYear()} Smaky Track. Built for awareness, not judgment.
          </p>
        </footer>
      </div>
    </>
  );
}
