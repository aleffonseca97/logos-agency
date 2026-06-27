"use client";

import { m, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

import { EffectContainer } from "./lib/effect-container";
import { effectLoop } from "./lib/transitions";
import { getIntensityConfig, type EffectWrapperProps } from "./lib/types";

type GradientBorderProps = EffectWrapperProps & {
  borderRadius?: string;
};

export function GradientBorder({
  children,
  className,
  intensity = "subtle",
  disabled,
  borderRadius = "0.75rem",
}: GradientBorderProps) {
  const reducedMotion = useReducedMotion();
  const config = getIntensityConfig(intensity);

  return (
    <EffectContainer className={cn("rounded-xl", className)}>
      {!disabled && (
        <>
          <m.div
            aria-hidden
            className="pointer-events-none absolute -inset-full z-0 will-change-transform"
            style={{
              background: `conic-gradient(from 0deg,
                var(--logos-brand-primary),
                var(--logos-brand-accent),
                var(--logos-brand-secondary),
                var(--logos-brand-primary))`,
              opacity: config.opacity * 2.5,
            }}
            animate={reducedMotion ? undefined : { rotate: 360 }}
            transition={effectLoop(14 / config.speed)}
          />
          <div
            aria-hidden
            className="bg-brand-surface pointer-events-none absolute inset-[1px] z-[1]"
            style={{ borderRadius }}
          />
        </>
      )}
      <div className="relative z-10" style={{ borderRadius }}>
        {children}
      </div>
    </EffectContainer>
  );
}
