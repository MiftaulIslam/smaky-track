"use client";

import { useState, useEffect, useCallback } from "react";
import { formatRelativeTime } from "@/src/lib/dates";

export function useRelativeTime(date: Date | null | undefined, intervalMs = 60_000) {
  const compute = useCallback(
    () => (date ? formatRelativeTime(date) : "Never"),
    [date]
  );

  const [label, setLabel] = useState<string>(compute);

  useEffect(() => {
    if (!date) return;
    const id = setInterval(() => setLabel(compute()), intervalMs);
    return () => clearInterval(id);
  }, [date, intervalMs, compute]);

  return label;
}
