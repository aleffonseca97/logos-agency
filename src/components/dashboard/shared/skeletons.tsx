import { cn } from "@/lib/utils";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="logos-glass overflow-hidden rounded-xl">
      <div className="border-logos-border border-b p-4">
        <div className="bg-logos-surface/60 h-8 w-48 animate-pulse rounded-lg" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center gap-4 p-4",
            i < rows - 1 && "border-logos-border border-b",
          )}
        >
          <div className="bg-logos-surface/60 h-4 flex-1 animate-pulse rounded" />
          <div className="bg-logos-surface/60 h-4 w-24 animate-pulse rounded" />
          <div className="bg-logos-surface/60 h-4 w-20 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="logos-glass h-28 animate-pulse rounded-xl"
        />
      ))}
    </div>
  );
}
