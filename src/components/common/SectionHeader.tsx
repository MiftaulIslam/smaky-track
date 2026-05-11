import { cn } from "@/src/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionHeader({ title, description, action, className, id }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div>
        <h2 id={id} className="font-heading text-[18px] font-semibold text-ghost-white leading-[1.5]">
          {title}
        </h2>
        {description && (
          <p className="text-[14px] text-slate-text mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
