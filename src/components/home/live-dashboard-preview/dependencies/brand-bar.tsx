import React from "react";

export const BrandBar = ({
  name,
  value,
  color,
}: {
  name: string;
  value: number;
  color?: string;
}) => {
  const accent = color ?? "var(--color-primary)";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{name}</span>
        <span className="font-semibold tabular-nums" style={{ color: accent }}>
          {value}%
        </span>
      </div>

      <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface-elevated">
        {/* glow shadow behind the fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full blur-sm opacity-50"
          style={{ width: `${value}%`, background: accent }}
        />
        {/* solid fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${value}%`, background: accent }}
        />
      </div>
    </div>
  );
};
