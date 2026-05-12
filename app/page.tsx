import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { smokeEntries, users, packetPurchases } from "@/src/db/schema";
import { count, sum, sql } from "drizzle-orm";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { Button } from "@/src/components/ui/button";
import { APP_URL, DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/src/lib/seo";
import { Hero } from "@/src/components/home/hero";
import { Features } from "@/src/components/home/features";
import { HowItWorks } from "@/src/components/home/how-it-works";
import { NavBar } from "@/src/components/navbar/navbar";
import { LiveDashboardPreview } from "@/src/components/home/live-dashboard-preview";
import { Compare } from "@/src/components/home/compare";
import { Reviews } from "@/src/components/home/reviews";
import { Pricing } from "@/src/components/home/pricing";
import { Faq } from "@/src/components/home/faq";
import type { HeroStat } from "@/src/components/home/hero-stats";

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

async function getLandingStats(): Promise<HeroStat[]> {
  try {
    const now = new Date();
    const currMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [[logRow], [userRow], [spendRow], [currRow], [prevRow]] =
      await Promise.all([
        db.select({ total: count() }).from(smokeEntries),
        db.select({ total: count() }).from(users),
        db.select({ total: sum(packetPurchases.costMinor) }).from(packetPurchases),
        db
          .select({ total: count() })
          .from(smokeEntries)
          .where(sql`${smokeEntries.smokedAt} >= ${currMonthStart}`),
        db
          .select({ total: count() })
          .from(smokeEntries)
          .where(
            sql`${smokeEntries.smokedAt} >= ${prevMonthStart} AND ${smokeEntries.smokedAt} <= ${prevMonthEnd}`
          ),
      ]);

    const totalLogs = Number(logRow.total) ?? 0;
    const totalUsers = Number(userRow.total) ?? 0;
    const totalSpendBDT = Math.round((Number(spendRow.total) ?? 0) / 100);
    const prevCount = Number(prevRow.total) || 0;
    const currCount = Number(currRow.total) || 0;
    const reductionPct =
      prevCount > 0
        ? Math.round(((prevCount - currCount) / prevCount) * 100)
        : null;

    function fmtCount(n: number): string {
      if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
      if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
      return String(n);
    }
    function fmtMoney(bdt: number): string {
      if (bdt >= 1_000_000) return `৳${(bdt / 1_000_000).toFixed(1)}M`;
      if (bdt >= 1_000) return `৳${(bdt / 1_000).toFixed(0)}k`;
      return `৳${bdt}`;
    }

    const stats: HeroStat[] = [
      { value: `${fmtCount(totalUsers)}+`, label: "Active users" },
      { value: fmtCount(totalLogs), label: "Logs recorded" },
      { value: fmtMoney(totalSpendBDT), label: "Spending tracked" },
    ];
    if (reductionPct !== null) {
      stats.push({
        value: `${reductionPct > 0 ? "−" : "+"}${Math.abs(reductionPct)}%`,
        label: "Avg. reduction",
      });
    }
    return stats;
  } catch {
    // Fallback to static values if DB query fails
    return [
      { value: "12k+", label: "Active users" },
      { value: "2.4M", label: "Logs recorded" },
      { value: "৳180k", label: "Spending tracked" },
      { value: "−31%", label: "Avg. reduction" },
    ];
  }
}

export default async function LandingPage() {
  const [session, dynamicStats] = await Promise.all([
    auth(),
    getLandingStats(),
  ]);
  const isLoggedIn = Boolean(session?.user?.id);

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

      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Navbar */}
        <NavBar />

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <Hero isLoggedIn={isLoggedIn} dynamicStats={dynamicStats} />

          {/* Live Dashboard Section */}
          <LiveDashboardPreview />

          {/* Features Section */}
          <Features />

          {/* How It Works Section */}
          <HowItWorks />

          {/* Compare Section */}
          <Compare />

          {/* Reviews Section */}
          <Reviews />

          {/* Pricing Section */}
          <Pricing />

          {/* FAQ Section */}
          <Faq />

          {/* CTA Section */}
          <section
            className="py-32 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden"
            aria-labelledby="cta-heading"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary-soft/50 to-transparent pointer-events-none" />
            <div className="max-w-3xl mx-auto space-y-8 relative z-10">
              <h2
                id="cta-heading"
                className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight"
              >
                Ready to track smarter?
              </h2>
              <p className="text-xl text-foreground-subtle max-w-xl mx-auto font-medium">
                Join and start understanding your habits from day one.
              </p>
              <div className="pt-4">
                <Button asChild size="xl">
                  <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
                    {isLoggedIn ? "Open dashboard" : "Create free account"}
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border-subtle bg-background-secondary px-6 py-12 text-center">
          <p className="text-sm text-foreground-disabled font-medium">
            © {new Date().getFullYear()} Smaky Track. Built for awareness, not judgment.
          </p>
        </footer>
      </div>
    </>
  );
}
