import { cva } from "class-variance-authority";

export const tooltipContentVariants = cva("", {
  variants: {
    variant: {
      default: "bg-foreground text-background",
      brand:
        "border border-brand-primary/20 bg-brand-surface text-logos-text shadow-logos-md",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
