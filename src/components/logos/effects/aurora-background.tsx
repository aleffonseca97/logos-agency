"use client";

import { m, useReducedMotion } from "framer-motion";

import { EffectLayer } from "./lib/effect-layer";
import { effectTransition } from "./lib/transitions";
import { getIntensityConfig, type BaseEffectProps } from "./lib/types";

export function AuroraBackground({
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
        className="absolute -inset-[40%] will-change-transform"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 50% 50%,
              color-mix(in srgb, var(--logos-brand-primary) 35%, transparent),
              transparent 70%),
            radial-gradient(ellipse 40% 35% at 30% 60%,
              color-mix(in srgb, var(--logos-brand-accent) 25%, transparent),
              transparent 65%),
            radial-gradient(ellipse 45% 30% at 70% 40%,
              color-mix(in srgb, var(--logos-brand-secondary) 20%, transparent),
              transparent 60%)
          `,
          opacity: config.opacity * 2.5,
          filter: `blur(${config.blur}px)`,
        }}
        animate={
          reducedMotion
            ? undefined
            : {
                rotate: [0, 3, -2, 0],
                scale: [1, 1.05, 0.98, 1],
              }
        }
        transition={effectTransition(28 * config.speed)}
      />
    </EffectLayer>
  );
}
