export type EffectIntensity = "subtle" | "medium" | "strong";

export type BaseEffectProps = {
  className?: string;
  intensity?: EffectIntensity;
  disabled?: boolean;
};

export type EffectWrapperProps = BaseEffectProps & {
  children?: React.ReactNode;
};

export type IntensityConfig = {
  opacity: number;
  speed: number;
  count: number;
  blur: number;
};

export const INTENSITY_CONFIG: Record<EffectIntensity, IntensityConfig> = {
  subtle: { opacity: 0.12, speed: 1.4, count: 12, blur: 64 },
  medium: { opacity: 0.2, speed: 1, count: 20, blur: 80 },
  strong: { opacity: 0.28, speed: 0.75, count: 28, blur: 96 },
};

export function getIntensityConfig(
  intensity: EffectIntensity = "subtle",
): IntensityConfig {
  return INTENSITY_CONFIG[intensity];
}
