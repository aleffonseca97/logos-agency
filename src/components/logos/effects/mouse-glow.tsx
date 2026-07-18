"use client";

import { m } from "framer-motion";
import { useRef } from "react";

import { useSafeReducedMotion } from "@/hooks/use-safe-reduced-motion";

import { EffectContainer } from "./lib/effect-container";
import { useMousePosition } from "./lib/use-mouse-position";
import { getIntensityConfig, type EffectWrapperProps } from "./lib/types";

export function MouseGlow({
  children,
  className,
  intensity = "subtle",
  disabled,
}: EffectWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition(containerRef);
  const reducedMotion = useSafeReducedMotion();
  const config = getIntensityConfig(intensity);

  return (
    <EffectContainer ref={containerRef} className={className}>
      {!disabled && !reducedMotion && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <m.div
            className="absolute size-72 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
            style={{
              x,
              y,
              background: `radial-gradient(circle,
                color-mix(in srgb, var(--logos-brand-primary) ${config.opacity * 120}%, transparent) 0%,
                transparent 70%)`,
              filter: `blur(${config.blur / 2}px)`,
            }}
          />
        </m.div>
      )}
      <div className="relative z-10">{children}</div>
    </EffectContainer>
  );
}
