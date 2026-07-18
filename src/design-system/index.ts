/**
 * LOGOS Design System — public API
 *
 * Preferir imports de `@/design-system` ou módulos canônicos:
 *   colors | spacing | typography | motion | tokens
 */

export { tokens } from "./tokens";
export type { LogosTokens } from "./tokens";

export {
  blur,
  blurTokens,
  breakpoints,
  containerPadding,
  containers,
  glass,
  glassClasses,
  grid,
  iconLibrary,
  iconSize,
  iconSizeClasses,
  radius,
  radiusTokens,
  shadows,
  zIndex,
  type Breakpoint,
} from "./tokens";

export {
  brandColors,
  colorClasses,
  colorTokens,
  gradients,
  type BrandColorKey,
} from "./colors";

export { layoutSpacing, spacing, spacingTokens, type SpacingKey } from "./spacing";

export {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  typographyClasses,
  typographyPresets,
} from "./typography";

export {
  durations,
  easings,
  effectIntensity,
  motionTransitions,
  motionVariants,
  sectionFadeIn,
  sectionFadeUp,
  sectionStagger,
  sectionViewport,
  type EffectIntensity,
} from "./motion";

export { themes, logosBrandColors, type ThemeId } from "./themes";
export type { BrandColors, LogosTheme } from "./types";
