import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string | number;
  change?: string;
  icon?: LucideIcon;
  className?: string;
};

export function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "logos-glass group relative overflow-hidden rounded-xl p-5 transition-all duration-300",
        "hover:border-brand-primary/20 hover:shadow-logos-glow",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 size-28 rounded-full bg-brand-primary/10 opacity-50 blur-2xl transition-opacity group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-logos-text-muted text-[11px] font-medium tracking-[0.08em] uppercase">
            {label}
          </p>
          <p className="text-logos-text mt-2 text-2xl font-semibold tracking-tight tabular-nums sm:text-[1.65rem]">
            {value}
          </p>
          {change && (
            <p className="text-logos-text-muted mt-1.5 text-xs">{change}</p>
          )}
        </div>
        {Icon && (
          <div className="bg-brand-primary/10 text-brand-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
            <Icon className="size-4" aria-hidden />
          </div>
        )}
      </div>
    </div>
  );
}
