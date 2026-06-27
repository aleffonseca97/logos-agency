"use client";

import { m, useReducedMotion } from "framer-motion";
import { useRef } from "react";

import { EffectContainer } from "./lib/effect-container";
import { useMousePosition } from "./lib/use-mouse-position";
import { getIntensityConfig, type EffectWrapperProps } from "./lib/types";

export function CursorSpotlight({
  children,
  className,
  intensity = "subtle",
  disabled,
}: EffectWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition(containerRef);
  const reducedMotion = useReducedMotion();
  const config = getIntensityConfig(intensity);

  return (
    <EffectContainer ref={containerRef} className={className}>
      {!disabled && !reducedMotion && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <m.div
            className="absolute size-96 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
            style={{
              x,
              y,
              background: `radial-gradient(circle,
                color-mix(in srgb, var(--logos-brand-white) ${config.opacity * 100}%, transparent) 0%,
                color-mix(in srgb, var(--logos-brand-primary) ${config.opacity * 40}%, transparent) 25%,
                transparent 55%)`,
            }}
          />
        </m.div>
      )}
      <div className="relative z-10">{children}</div>
    </EffectContainer>
  );
}
