import { cn } from "@/lib/utils";

type EffectLayerProps = {
  className?: string;
  children: React.ReactNode;
};

/** Camada decorativa — nunca intercepta interações nem polui a árvore de acessibilidade. */
export function EffectLayer({ className, children }: EffectLayerProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        "[contain:strict]",
        className,
      )}
    >
      {children}
    </div>
  );
}
