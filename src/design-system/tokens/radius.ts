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
