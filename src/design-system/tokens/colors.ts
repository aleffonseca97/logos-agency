/**
 * Chaves semânticas de cor — valores reais vivem em CSS via tema.
 * Use estas chaves para tipagem e acesso programático.
 */
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
} as const;
