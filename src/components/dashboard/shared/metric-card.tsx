import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string | number;
  change?: string;
  className?: string;
};

export function MetricCard({ label, value, change, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "logos-glass group relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:shadow-logos-glow",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 -right-8 size-24 rounded-full bg-brand-primary/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-60"
      />
      <p className="text-logos-text-muted text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <p className="text-logos-text mt-2 text-2xl font-semibold tracking-tight">
        {value}
      </p>
      {change && (
        <p className="text-brand-primary mt-1 text-xs">{change}</p>
      )}
    </div>
  );
}
