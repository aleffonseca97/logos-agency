import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type EffectContainerProps = React.ComponentPropsWithoutRef<"div">;

/** Container relativo para efeitos que envolvem conteúdo. */
export const EffectContainer = forwardRef<HTMLDivElement, EffectContainerProps>(
  function EffectContainer({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("relative isolate overflow-hidden", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

EffectContainer.displayName = "EffectContainer";
