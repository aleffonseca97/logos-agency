"use client";

import { m, useReducedMotion } from "framer-motion";

import { EffectLayer } from "./lib/effect-layer";
import { effectLoop } from "./lib/transitions";
import { getIntensityConfig, type BaseEffectProps } from "./lib/types";

export function LightRays({
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
        className="absolute -inset-1/2 will-change-transform"
        style={{
          background: `conic-gradient(from 0deg at 50% 100%,
            transparent 0deg,
            color-mix(in srgb, var(--logos-brand-primary) ${config.opacity * 200}%, transparent) 15deg,
            transparent 30deg,
            color-mix(in srgb, var(--logos-brand-accent) ${config.opacity * 150}%, transparent) 45deg,
            transparent 60deg,
            color-mix(in srgb, var(--logos-brand-primary) ${config.opacity * 120}%, transparent) 75deg,
            transparent 90deg)`,
          opacity: config.opacity * 1.5,
          filter: `blur(${config.blur / 2}px)`,
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 100%, black 10%, transparent 70%)",
        }}
        animate={reducedMotion ? undefined : { rotate: 360 }}
        transition={effectLoop(60 / config.speed)}
      />
    </EffectLayer>
  );
}
