import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "logos-glass flex flex-col items-center justify-center rounded-xl px-6 py-16 text-center",
        className,
      )}
    >
      <div className="bg-brand-primary/10 mb-4 flex size-12 items-center justify-center rounded-full">
        <Icon className="text-brand-primary size-6" aria-hidden />
      </div>
      <h3 className="text-logos-text text-lg font-semibold">{title}</h3>
      <p className="text-logos-text-muted mt-2 max-w-sm text-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
