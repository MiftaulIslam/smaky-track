"use client";

import { useRelativeTime } from "@/src/hooks/use-relative-time";

interface LastSmokeRelativeProps {
  date: Date | null;
}

export function LastSmokeRelative({ date }: LastSmokeRelativeProps) {
  const label = useRelativeTime(date);

  return (
    <p className="font-heading text-[20px] font-semibold text-ghost-white leading-none">
      {label}
    </p>
  );
}
