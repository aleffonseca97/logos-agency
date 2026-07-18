/**
 * LOGOS Design System — Colors
 *
 * Fonte de verdade TypeScript para a identidade visual.
 * Hex de marca: sincronize com `src/styles/themes/logos-default.css`
 * e `src/design-system/themes/brand-colors.ts`.
 *
 * Em runtime, componentes devem preferir classes Tailwind (`bg-brand-primary`,
 * `text-logos-text`) ou `var(--logos-*)` — não estes hex literais.
 */

/** Hex canônicos da marca (não altere sem atualizar o CSS do tema). */
export const brandColors = {
  primary: "#2563EB",
  secondary: "#1D4ED8",
  accent: "#4F46E5",
  background: "#0B0F19",
  surface: "#111827",
  white: "#F8FAFC",
} as const;

export type BrandColorKey = keyof typeof brandColors;

/** Referências CSS semânticas — resolvem via tema ativo. */
export const colorTokens = {
  brand: {
    primary: "var(--logos-brand-primary)",
    secondary: "var(--logos-brand-secondary)",
    accent: "var(--logos-brand-accent)",
    background: "var(--logos-brand-background)",
    surface: "var(--logos-brand-surface)",
    white: "var(--logos-brand-white)",
  },
  semantic: {
    bg: "var(--logos-bg)",
    surface: "var(--logos-surface)",
    text: "var(--logos-text)",
    textMuted: "var(--logos-text-muted)",
    border: "var(--logos-border)",
    borderSubtle: "var(--logos-border-subtle)",
    ring: "var(--logos-ring)",
  },
  status: {
    destructive: "var(--destructive)",
    success: "#34D399",
    warning: "#FBBF24",
  },
  chart: {
    1: "var(--chart-1)",
    2: "var(--chart-2)",
    3: "var(--chart-3)",
    4: "var(--chart-4)",
    5: "var(--chart-5)",
  },
  sidebar: {
    bg: "var(--sidebar)",
    foreground: "var(--sidebar-foreground)",
    primary: "var(--sidebar-primary)",
    primaryForeground: "var(--sidebar-primary-foreground)",
    accent: "var(--sidebar-accent)",
    accentForeground: "var(--sidebar-accent-foreground)",
    border: "var(--sidebar-border)",
    ring: "var(--sidebar-ring)",
  },
} as const;

/** Gradientes de marca (espelham utilities CSS). */
export const gradients = {
  /** Espelha `.logos-text-gradient` em utilities.css */
  text: "linear-gradient(to right, var(--logos-brand-primary), var(--logos-brand-accent), var(--logos-brand-secondary))",
  brand:
    "linear-gradient(135deg, var(--logos-brand-primary), var(--logos-brand-accent))",
  surface:
    "linear-gradient(180deg, var(--logos-brand-surface), var(--logos-brand-background))",
  glow: "radial-gradient(circle, color-mix(in srgb, var(--logos-brand-primary) 30%, transparent), transparent 70%)",
} as const;

/** Classes Tailwind canônicas para cor. */
export const colorClasses = {
  bg: {
    primary: "bg-brand-primary",
    secondary: "bg-brand-secondary",
    accent: "bg-brand-accent",
    page: "bg-logos-bg",
    surface: "bg-logos-surface",
    brandSurface: "bg-brand-surface",
  },
  text: {
    default: "text-logos-text",
    muted: "text-logos-text-muted",
    primary: "text-brand-primary",
    accent: "text-brand-accent",
    white: "text-brand-white",
    gradient: "logos-text-gradient",
  },
  border: {
    default: "border-logos-border",
    subtle: "border-logos-border-subtle",
  },
} as const;
