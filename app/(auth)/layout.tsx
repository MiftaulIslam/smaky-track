import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-midnight-base p-4">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(107,98,242,0.15), transparent)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
