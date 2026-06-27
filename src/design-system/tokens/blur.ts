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
