import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/src/auth";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { Button } from "@/src/components/ui/button";
import { APP_URL, DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/src/lib/seo";
import { Hero } from "@/src/components/home/hero";
import { Features } from "@/src/components/home/features";
import { NavBar } from "@/src/components/navbar/navbar";
import { LiveDashboardPreview } from "@/src/components/home/live-dashboard-preview";

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

export default async function LandingPage() {
  const session = await auth();
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
          <Hero isLoggedIn={isLoggedIn} />

          {/* Live Dashboard Section */}
          <LiveDashboardPreview />
          {/* Features Section */}
          <Features />

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
