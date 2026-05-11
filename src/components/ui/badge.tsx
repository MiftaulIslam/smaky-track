import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-canvas-white text-storm-gray",
        secondary: "bg-gunmetal text-ghost-white",
        outline: "border border-gunmetal text-ghost-white",
        accent: "bg-interactive-glow/20 text-interactive-glow border border-interactive-glow/30",
        destructive: "bg-red-500/20 text-red-400 border border-red-500/30",
        success: "bg-green-500/20 text-green-400 border border-green-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
