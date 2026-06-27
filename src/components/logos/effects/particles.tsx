"use client";

import { m, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

import { EffectLayer } from "./lib/effect-layer";
import { createParticles } from "./lib/particles-data";
import { effectTransition } from "./lib/transitions";
import { getIntensityConfig, type BaseEffectProps } from "./lib/types";

export function Particles({
  className,
  intensity = "subtle",
  disabled,
}: BaseEffectProps) {
  const reducedMotion = useReducedMotion();
  const config = getIntensityConfig(intensity);

  const particles = useMemo(
    () => createParticles(config.count),
    [config.count],
  );

  if (disabled) return null;

  return (
    <EffectLayer className={className}>
      {particles.map((particle) => (
        <m.span
          key={particle.id}
          className="bg-brand-white absolute block rounded-full will-change-transform"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: config.opacity,
          }}
          animate={
            reducedMotion
              ? undefined
              : {
                  y: [0, -40, 0],
                  opacity: [
                    config.opacity * 0.4,
                    config.opacity,
                    config.opacity * 0.4,
                  ],
                }
          }
          transition={effectTransition(
            particle.duration * config.speed,
            particle.delay,
          )}
        />
      ))}
    </EffectLayer>
  );
}
