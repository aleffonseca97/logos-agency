import { cva } from "class-variance-authority";

import { glassSurfaceClasses } from "./glass";

export const cardVariants = cva(
  "flex flex-col rounded-xl border text-logos-text transition-colors",
  {
    variants: {
      variant: {
        default: "border-logos-border bg-brand-surface",
        outline: "border-logos-border bg-transparent",
        glass: glassSurfaceClasses,
        elevated: "border-logos-border-subtle bg-brand-surface shadow-logos-md",
        ghost: "border-transparent bg-transparent",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  },
);
