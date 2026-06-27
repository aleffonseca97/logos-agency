"use client";

import { m, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

import { EffectContainer } from "./lib/effect-container";
import { effectTransition } from "./lib/transitions";
import { getIntensityConfig, type EffectWrapperProps } from "./lib/types";

type GlowBorderProps = EffectWrapperProps & {
  borderRadius?: string;
};

export function GlowBorder({
  children,
  className,
  intensity = "subtle",
  disabled,
  borderRadius = "0.75rem",
}: GlowBorderProps) {
  const reducedMotion = useReducedMotion();
  const config = getIntensityConfig(intensity);

  return (
    <EffectContainer className={cn("rounded-xl", className)}>
      {!disabled && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius,
            boxShadow: `0 0 ${config.blur / 2}px color-mix(in srgb, var(--logos-brand-primary) 30%, transparent),
                        inset 0 0 ${config.blur / 3}px color-mix(in srgb, var(--logos-brand-primary) 10%, transparent)`,
            border: `1px solid color-mix(in srgb, var(--logos-brand-primary) 25%, transparent)`,
          }}
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: [
                    config.opacity * 1.5,
                    config.opacity * 2.5,
                    config.opacity * 1.5,
                  ],
                }
          }
          transition={effectTransition(6 * config.speed)}
        />
      )}
      <div className="relative z-10 h-full w-full" style={{ borderRadius }}>
        {children}
      </div>
    </EffectContainer>
  );
}
