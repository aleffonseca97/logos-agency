/**
 * Fonte única de verdade para cores de marca (TypeScript).
 * Mantenha em sincronia com src/styles/themes/*.css
 */
export const logosBrandColors = {
  primary: "#2563EB",
  secondary: "#1D4ED8",
  accent: "#4F46E5",
  background: "#0B0F19",
  surface: "#111827",
  white: "#F8FAFC",
} as const;

export type BrandColorKey = keyof typeof logosBrandColors;
