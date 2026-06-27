"use client";

import { m, useReducedMotion } from "framer-motion";

import { EffectLayer } from "./lib/effect-layer";
import { effectTransition } from "./lib/transitions";
import { getIntensityConfig, type BaseEffectProps } from "./lib/types";

export function AnimatedGrid({
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
        className="absolute inset-0 will-change-[opacity]"
        style={{
          backgroundImage: `
            linear-gradient(color-mix(in srgb, var(--logos-brand-white) 6%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in srgb, var(--logos-brand-white) 6%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          opacity: config.opacity,
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 75%)",
        }}
        animate={
          reducedMotion
            ? undefined
            : {
                opacity: [
                  config.opacity * 0.6,
                  config.opacity,
                  config.opacity * 0.6,
                ],
                backgroundPosition: ["0px 0px", "24px 24px", "0px 0px"],
              }
        }
        transition={effectTransition(16 * config.speed)}
      />
    </EffectLayer>
  );
}
