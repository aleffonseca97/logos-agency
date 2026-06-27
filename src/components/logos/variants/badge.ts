import { cva } from "class-variance-authority";

export const logosBadgeVariants = cva(
  "logos-font-body inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary/15 text-brand-primary",
        secondary: "bg-brand-secondary/15 text-brand-secondary",
        accent: "bg-brand-accent/15 text-brand-accent",
        outline: "border-logos-border text-logos-text",
        muted: "bg-logos-surface text-logos-text-muted",
        success: "bg-emerald-500/15 text-emerald-400",
        warning: "bg-amber-500/15 text-amber-400",
        destructive: "bg-destructive/15 text-destructive",
      },
      size: {
        sm: "px-2 py-0 text-[0.65rem]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);
