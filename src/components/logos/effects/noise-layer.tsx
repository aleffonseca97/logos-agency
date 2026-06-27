import { cn } from "@/lib/utils";

import { EffectLayer } from "./lib/effect-layer";
import { getIntensityConfig, type BaseEffectProps } from "./lib/types";

/**
 * Textura de ruído estática — zero JS de animação para máxima performance.
 * SVG inline evita requisição de rede.
 */
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export function NoiseLayer({
  className,
  intensity = "subtle",
  disabled,
}: BaseEffectProps) {
  const config = getIntensityConfig(intensity);

  if (disabled) return null;

  return (
    <EffectLayer className={className}>
      <div
        className={cn("absolute inset-0 mix-blend-overlay")}
        style={{
          backgroundImage: NOISE_SVG,
          opacity: config.opacity * 0.35,
          backgroundSize: "128px 128px",
        }}
      />
    </EffectLayer>
  );
}
