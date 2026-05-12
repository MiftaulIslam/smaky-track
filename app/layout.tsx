import type { Metadata, Viewport } from "next";
import { Geist, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/src/providers";
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION, APP_URL } from "@/src/lib/seo";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${DEFAULT_TITLE}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "smoking tracker",
    "cigarette tracker",
    "quit smoking",
    "smoking analytics",
    "health tracker",
    "spending tracker",
  ],
  authors: [{ name: "Smaky Track" }],
  creator: "Smaky Track",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: DEFAULT_TITLE,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("dark", "h-full", "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
