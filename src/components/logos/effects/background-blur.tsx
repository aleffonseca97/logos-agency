"use client";

import { m, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

import { EffectLayer } from "./lib/effect-layer";
import { effectTransition } from "./lib/transitions";
import { getIntensityConfig, type BaseEffectProps } from "./lib/types";

type BackgroundBlurProps = BaseEffectProps & {
  /** Direção do fade do blur */
  fade?: "top" | "bottom" | "center" | "edges";
};

const FADE_MASKS = {
  top: "linear-gradient(to bottom, black 0%, transparent 80%)",
  bottom: "linear-gradient(to top, black 0%, transparent 80%)",
  center:
    "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 75%)",
  edges:
    "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, black 100%)",
} as const;

export function BackgroundBlur({
  className,
  intensity = "subtle",
  disabled,
  fade = "center",
}: BackgroundBlurProps) {
  const reducedMotion = useReducedMotion();
  const config = getIntensityConfig(intensity);

  if (disabled) return null;

  return (
    <EffectLayer className={className}>
      <m.div
        className={cn(
          "absolute inset-0 backdrop-blur-sm will-change-[opacity]",
        )}
        style={{
          WebkitMaskImage: FADE_MASKS[fade],
          maskImage: FADE_MASKS[fade],
          opacity: config.opacity * 1.5,
        }}
        animate={
          reducedMotion
            ? undefined
            : {
                opacity: [config.opacity, config.opacity * 1.8, config.opacity],
              }
        }
        transition={effectTransition(8 * config.speed)}
      />
    </EffectLayer>
  );
}
