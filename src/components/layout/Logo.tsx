import Link from "next/link";

interface LogoProps {
  collapsed?: boolean;
}

export function Logo({ collapsed }: LogoProps) {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
      aria-label="Smaky Track home"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 border border-primary/30">
        <span className="text-base leading-none" role="img" aria-label="cigarette">
          🚬
        </span>
      </div>
      {!collapsed && (
        <span className="font-heading text-sm font-semibold text-foreground tracking-wide">
          Smaky Track
        </span>
      )}
    </Link>
  );
}
