import { cva } from "class-variance-authority";

export const logosButtonVariants = cva(
  "logos-font-body group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-brand-white hover:bg-brand-primary/90 focus-visible:ring-brand-primary/40",
        secondary:
          "bg-brand-secondary text-brand-white hover:bg-brand-secondary/90 focus-visible:ring-brand-secondary/40",
        accent:
          "bg-brand-accent text-brand-white hover:bg-brand-accent/90 focus-visible:ring-brand-accent/40",
        outline:
          "border-logos-border bg-transparent text-logos-text hover:bg-logos-surface hover:border-logos-border",
        ghost: "bg-transparent text-logos-text hover:bg-logos-surface",
        destructive:
          "bg-destructive/15 text-destructive hover:bg-destructive/25 focus-visible:ring-destructive/30",
        link: "text-brand-primary underline-offset-4 hover:underline",
        cta: "bg-brand-primary text-brand-white shadow-logos-glow hover:bg-brand-primary/90 hover:shadow-logos-glow-accent focus-visible:ring-brand-primary/50",
        glow: "bg-brand-primary text-brand-white shadow-logos-glow ring-1 ring-brand-primary/30 hover:bg-brand-primary/90 hover:shadow-logos-glow-accent hover:ring-brand-accent/40",
        "nav-cta":
          "rounded-full border border-brand-primary/45 bg-brand-primary/[0.06] text-brand-primary shadow-[0_0_20px_color-mix(in_srgb,var(--logos-brand-primary)_22%,transparent)] hover:border-brand-primary/65 hover:bg-brand-primary/10 hover:shadow-logos-glow focus-visible:ring-brand-primary/40",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-sm",
        xl: "h-12 px-8 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);
