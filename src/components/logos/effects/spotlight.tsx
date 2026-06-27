"use client";

import { m, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

import { EffectLayer } from "./lib/effect-layer";
import { effectTransition } from "./lib/transitions";
import { getIntensityConfig, type BaseEffectProps } from "./lib/types";

type SpotlightProps = BaseEffectProps & {
  /** Posição horizontal do foco (0–100) */
  x?: number;
  /** Posição vertical do foco (0–100) */
  y?: number;
};

export function Spotlight({
  className,
  intensity = "subtle",
  disabled,
  x = 50,
  y = 0,
}: SpotlightProps) {
  const reducedMotion = useReducedMotion();
  const config = getIntensityConfig(intensity);

  if (disabled) return null;

  return (
    <EffectLayer className={className}>
      <m.div
        className={cn("absolute inset-0 will-change-[opacity]")}
        style={{
          background: `radial-gradient(ellipse 60% 50% at ${x}% ${y}%,
            color-mix(in srgb, var(--logos-brand-primary) 18%, transparent),
            transparent 70%)`,
          opacity: config.opacity * 2,
        }}
        animate={
          reducedMotion
            ? undefined
            : {
                opacity: [
                  config.opacity * 1.5,
                  config.opacity * 2.2,
                  config.opacity * 1.5,
                ],
              }
        }
        transition={effectTransition(10 * config.speed)}
      />
    </EffectLayer>
  );
}
