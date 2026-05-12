"use client";

import { useRelativeTime } from "@/src/hooks/use-relative-time";

interface LastSmokeRelativeProps {
  date: Date | null;
}

export function LastSmokeRelative({ date }: LastSmokeRelativeProps) {
  const label = useRelativeTime(date);

  return (
    <p className="font-heading text-xl font-semibold text-foreground leading-none">
      {label}
    </p>
  );
}
