import { cva } from "class-variance-authority";

export const sectionVariants = cva("relative w-full", {
  variants: {
    spacing: {
      none: "py-0",
      sm: "py-8 md:py-12",
      md: "py-12 md:py-16",
      lg: "py-16 md:py-24",
      xl: "py-24 md:py-32",
    },
    variant: {
      default: "bg-transparent",
      background: "bg-brand-background",
      surface: "bg-brand-surface",
      muted: "bg-logos-surface/50",
      glass: "logos-glass",
    },
  },
  defaultVariants: {
    spacing: "md",
    variant: "default",
  },
});
