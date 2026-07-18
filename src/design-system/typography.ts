/**
 * LOGOS Design System — Typography
 *
 * Families: Sora (heading), Inter (body), Michroma (wordmark).
 * Carregadas em `src/config/fonts.ts` → CSS vars no `<html>`.
 */

export const fontFamily = {
  heading: "var(--font-heading)",
  body: "var(--font-body)",
  wordmark: "var(--font-wordmark)",
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const fontSize = {
  "display-2xl": "4.5rem",
  "display-xl": "3.75rem",
  "display-lg": "3rem",
  "display-md": "2.25rem",
  "display-sm": "1.875rem",
  h1: "2.25rem",
  h2: "1.875rem",
  h3: "1.5rem",
  h4: "1.25rem",
  h5: "1.125rem",
  h6: "1rem",
  "body-lg": "1.125rem",
  body: "1rem",
  "body-sm": "0.875rem",
  caption: "0.75rem",
  overline: "0.6875rem",
} as const;

export const lineHeight = {
  none: "1",
  tight: "1.15",
  snug: "1.25",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
} as const;

export const letterSpacing = {
  tighter: "-0.04em",
  tight: "-0.02em",
  normal: "0",
  wide: "0.02em",
  wider: "0.04em",
  widest: "0.08em",
} as const;

export const typographyPresets = {
  "display-2xl": {
    fontFamily: fontFamily.heading,
    fontSize: fontSize["display-2xl"],
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tighter,
    fontWeight: fontWeight.semibold,
  },
  "display-xl": {
    fontFamily: fontFamily.heading,
    fontSize: fontSize["display-xl"],
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tighter,
    fontWeight: fontWeight.semibold,
  },
  "display-lg": {
    fontFamily: fontFamily.heading,
    fontSize: fontSize["display-lg"],
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
    fontWeight: fontWeight.semibold,
  },
  h1: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h1,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
    fontWeight: fontWeight.semibold,
  },
  h2: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h2,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.tight,
    fontWeight: fontWeight.semibold,
  },
  h3: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h3,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeight.semibold,
  },
  "body-lg": {
    fontFamily: fontFamily.body,
    fontSize: fontSize["body-lg"],
    lineHeight: lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeight.regular,
  },
  body: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeight.regular,
  },
  "body-sm": {
    fontFamily: fontFamily.body,
    fontSize: fontSize["body-sm"],
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeight.regular,
  },
  caption: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wide,
    fontWeight: fontWeight.regular,
  },
  overline: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.overline,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.widest,
    fontWeight: fontWeight.medium,
  },
  wordmark: {
    fontFamily: fontFamily.wordmark,
    fontSize: fontSize.h4,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.wider,
    fontWeight: fontWeight.regular,
  },
} as const;

/** Classes utilitárias LOGOS para tipografia. */
export const typographyClasses = {
  font: {
    heading: "logos-font-heading",
    body: "logos-font-body",
    wordmark: "logos-font-wordmark",
  },
  display: {
    "2xl": "logos-text-display-2xl",
    xl: "logos-text-display-xl",
    lg: "logos-text-display-lg",
    md: "logos-text-display-md",
    sm: "logos-text-display-sm",
  },
  heading: {
    h1: "logos-text-h1",
    h2: "logos-text-h2",
    h3: "logos-text-h3",
    h4: "logos-text-h4",
    h5: "logos-text-h5",
    h6: "logos-text-h6",
  },
  body: {
    lg: "logos-text-body-lg",
    default: "logos-text-body",
    sm: "logos-text-body-sm",
  },
  caption: "logos-text-caption",
  overline: "logos-text-overline",
} as const;
