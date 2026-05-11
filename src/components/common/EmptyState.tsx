import { cn } from "@/src/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-[24px] border border-gunmetal bg-[rgba(212,212,212,0.04)] p-12 text-center",
        className
      )}
    >
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-gunmetal bg-white/5">
          <Icon className="h-6 w-6 text-slate-text" />
        </div>
      )}
      <div className="space-y-1">
        <p className="font-heading text-[16px] font-semibold text-ghost-white">{title}</p>
        {description && (
          <p className="text-[14px] text-slate-text max-w-sm">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
