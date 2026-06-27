import { cva } from "class-variance-authority";

export const footerVariants = cva("w-full", {
  variants: {
    variant: {
      default: "border-t border-logos-border bg-brand-background",
      surface: "border-t border-logos-border bg-brand-surface",
      minimal: "bg-transparent",
      glass: "logos-glass border-t border-logos-border",
    },
    spacing: {
      sm: "py-8",
      md: "py-12",
      lg: "py-16",
    },
  },
  defaultVariants: {
    variant: "default",
    spacing: "md",
  },
});
