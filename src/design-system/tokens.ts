/**
 * LOGOS Design System — Tokens (agregador)
 *
 * API canônica de tokens primitivos e compostos.
 * CSS espelho: `src/styles/tokens.css` + `src/styles/themes/logos-default.css`.
 */

import { brandColors, colorTokens, gradients } from "./colors";
import {
  durations,
  easings,
  effectIntensity,
  motionTransitions,
  motionVariants,
  sectionFadeIn,
  sectionFadeUp,
  sectionStagger,
  sectionViewport,
} from "./motion";
import { layoutSpacing, spacing, spacingTokens } from "./spacing";
import {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  typographyClasses,
  typographyPresets,
} from "./typography";

/* ── Radius ── */

export const radius = {
  none: "0",
  xs: "0.25rem",
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  "3xl": "2rem",
  full: "9999px",
} as const;

export const radiusTokens = Object.fromEntries(
  Object.entries(radius).map(([key]) => [key, `var(--logos-radius-${key})`]),
) as Record<keyof typeof radius, string>;

/* ── Shadows ── */

export const shadows = {
  none: "none",
  xs: "var(--logos-shadow-xs)",
  sm: "var(--logos-shadow-sm)",
  md: "var(--logos-shadow-md)",
  lg: "var(--logos-shadow-lg)",
  xl: "var(--logos-shadow-xl)",
  glow: "var(--logos-shadow-glow)",
  "glow-accent": "var(--logos-shadow-glow-accent)",
} as const;

/* ── Blur ── */

export const blur = {
  none: "0",
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "40px",
  "3xl": "64px",
} as const;

export const blurTokens = Object.fromEntries(
  Object.entries(blur).map(([key]) => [key, `var(--logos-blur-${key})`]),
) as Record<keyof typeof blur, string>;

/* ── Glass ── */

export const glass = {
  bg: "var(--logos-glass-bg)",
  bgStrong: "var(--logos-glass-bg-strong)",
  border: "var(--logos-glass-border)",
  blur: "var(--logos-glass-blur)",
  shadow: "var(--logos-glass-shadow)",
} as const;

export const glassClasses = {
  default: "logos-glass",
  strong: "logos-glass-strong",
  navbar: "logos-navbar-pill",
} as const;

/* ── Grid & Breakpoints & Containers ── */

export const breakpoints = {
  xs: "475px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const containers = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1400px",
  full: "100%",
} as const;

export const containerPadding = {
  DEFAULT: "1rem",
  sm: "1.5rem",
  lg: "2rem",
} as const;

export const grid = {
  columns: 12,
  gap: "var(--logos-space-6)",
  gapSm: "var(--logos-space-4)",
  gapLg: "var(--logos-space-8)",
} as const;

/* ── Icons (Lucide) ── */

export const iconSize = {
  xs: "0.75rem",
  sm: "1rem",
  md: "1.25rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "2.5rem",
} as const;

export const iconSizeClasses = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
  "2xl": "size-10",
} as const;

/** Biblioteca de ícones padrão do produto. */
export const iconLibrary = "lucide-react" as const;

/* ── Z-index ── */

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 40,
  sticky: 50,
  overlay: 60,
  modal: 70,
  toast: 80,
  tooltip: 90,
} as const;

/* ── Aggregated tokens object ── */

export const tokens = {
  colors: colorTokens,
  brand: brandColors,
  gradients,
  spacing,
  spacingTokens,
  layoutSpacing,
  radius,
  radiusTokens,
  shadows,
  blur,
  blurTokens,
  glass,
  glassClasses,
  breakpoints,
  containers,
  containerPadding,
  grid,
  iconSize,
  iconSizeClasses,
  iconLibrary,
  zIndex,
  typography: {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    presets: typographyPresets,
    classes: typographyClasses,
  },
  motion: {
    easings,
    durations,
    transitions: motionTransitions,
    variants: motionVariants,
    sectionStagger,
    sectionFadeUp,
    sectionFadeIn,
    sectionViewport,
    effectIntensity,
  },
} as const;

export type LogosTokens = typeof tokens;
