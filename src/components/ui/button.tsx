import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-glow focus-visible:ring-offset-2 focus-visible:ring-offset-midnight-base cursor-pointer select-none",
  {
    variants: {
      variant: {
        // White pill — primary action
        default:
          "bg-canvas-white text-storm-gray rounded-full hover:bg-ghost-white active:scale-95",
        // Ghost — secondary action
        ghost:
          "bg-transparent text-canvas-white border border-ghost-white rounded-lg hover:bg-white/5 active:scale-95",
        // Destructive
        destructive:
          "bg-destructive text-white rounded-full hover:bg-red-600 active:scale-95",
        // Outline
        outline:
          "border border-gunmetal text-ghost-white rounded-lg bg-transparent hover:bg-white/5 active:scale-95",
        // Link-like nav
        link: "text-ghost-white underline-offset-4 hover:underline bg-transparent rounded-none p-0 h-auto",
        // Glow accent
        accent:
          "bg-interactive-glow text-white rounded-full hover:opacity-90 active:scale-95",
      },
      size: {
        default: "h-9 px-5 py-2 text-[14px]",
        sm: "h-7 px-3 text-[13px]",
        lg: "h-11 px-7 text-[15px]",
        xl: "h-14 px-8 text-[16px]",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
