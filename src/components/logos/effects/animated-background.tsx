"use client";

import { m, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

import { EffectLayer } from "./lib/effect-layer";
import { effectTransition } from "./lib/transitions";
import { getIntensityConfig, type BaseEffectProps } from "./lib/types";

const ORBS = [
  {
    size: "45%",
    left: "5%",
    top: "10%",
    color: "var(--logos-brand-primary)",
  },
  {
    size: "35%",
    left: "55%",
    top: "45%",
    color: "var(--logos-brand-accent)",
  },
  {
    size: "30%",
    left: "30%",
    top: "60%",
    color: "var(--logos-brand-secondary)",
  },
] as const;

export function AnimatedBackground({
  className,
  intensity = "subtle",
  disabled,
}: BaseEffectProps) {
  const reducedMotion = useReducedMotion();
  const config = getIntensityConfig(intensity);

  const orbs = useMemo(() => ORBS, []);

  if (disabled) return null;

  return (
    <EffectLayer className={className}>
      {orbs.map((orb, index) => (
        <m.div
          key={index}
          className="absolute rounded-full will-change-transform"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.left,
            top: orb.top,
            background: orb.color,
            opacity: config.opacity,
            filter: `blur(${config.blur}px)`,
          }}
          animate={
            reducedMotion
              ? undefined
              : {
                  x: [0, 24, -16, 0],
                  y: [0, -20, 12, 0],
                  scale: [1, 1.04, 0.97, 1],
                }
          }
          transition={effectTransition(22 * config.speed, index * 3)}
        />
      ))}
    </EffectLayer>
  );
}
