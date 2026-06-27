"use client";

import { m, useReducedMotion } from "framer-motion";

import { EffectLayer } from "./lib/effect-layer";
import { effectTransition } from "./lib/transitions";
import { getIntensityConfig, type BaseEffectProps } from "./lib/types";

export function AnimatedGradient({
  className,
  intensity = "subtle",
  disabled,
}: BaseEffectProps) {
  const reducedMotion = useReducedMotion();
  const config = getIntensityConfig(intensity);

  if (disabled) return null;

  return (
    <EffectLayer className={className}>
      <m.div
        className="absolute inset-0 will-change-[background-position]"
        style={{
          background: `linear-gradient(
            135deg,
            color-mix(in srgb, var(--logos-brand-background) 100%, transparent),
            color-mix(in srgb, var(--logos-brand-primary) ${config.opacity * 250}%, transparent),
            color-mix(in srgb, var(--logos-brand-accent) ${config.opacity * 200}%, transparent),
            color-mix(in srgb, var(--logos-brand-background) 100%, transparent)
          )`,
          backgroundSize: "300% 300%",
          opacity: config.opacity * 2,
        }}
        animate={
          reducedMotion
            ? undefined
            : {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }
        }
        transition={effectTransition(18 * config.speed)}
      />
    </EffectLayer>
  );
}
