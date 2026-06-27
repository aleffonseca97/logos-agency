"use client";

import { m, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

import { EffectLayer } from "./lib/effect-layer";
import { effectTransition } from "./lib/transitions";
import { getIntensityConfig, type BaseEffectProps } from "./lib/types";

type ShapeConfig = {
  id: number;
  size: number;
  left: string;
  top: string;
  shape: "circle" | "ring";
  duration: number;
  delay: number;
};

function createShapes(count: number): ShapeConfig[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    size: 48 + (id % 4) * 32,
    left: `${((id * 41 + 10) % 80) + 5}%`,
    top: `${((id * 29 + 15) % 75) + 10}%`,
    shape: id % 3 === 0 ? "ring" : "circle",
    duration: 20 + (id % 5) * 4,
    delay: id * 1.2,
  }));
}

export function FloatingShapes({
  className,
  intensity = "subtle",
  disabled,
}: BaseEffectProps) {
  const reducedMotion = useReducedMotion();
  const config = getIntensityConfig(intensity);

  const shapes = useMemo(
    () => createShapes(Math.min(config.count, 8)),
    [config.count],
  );

  if (disabled) return null;

  return (
    <EffectLayer className={className}>
      {shapes.map((shape) => (
        <m.div
          key={shape.id}
          className="absolute will-change-transform"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.left,
            top: shape.top,
            borderRadius: "50%",
            border:
              shape.shape === "ring"
                ? `1px solid color-mix(in srgb, var(--logos-brand-primary) ${config.opacity * 200}%, transparent)`
                : "none",
            background:
              shape.shape === "circle"
                ? `color-mix(in srgb, var(--logos-brand-accent) ${config.opacity * 150}%, transparent)`
                : "transparent",
            filter:
              shape.shape === "circle"
                ? `blur(${config.blur / 3}px)`
                : undefined,
          }}
          animate={
            reducedMotion
              ? undefined
              : {
                  y: [0, -20, 8, 0],
                  x: [0, 12, -8, 0],
                  rotate: [0, 6, -4, 0],
                }
          }
          transition={effectTransition(
            shape.duration * config.speed,
            shape.delay,
          )}
        />
      ))}
    </EffectLayer>
  );
}
