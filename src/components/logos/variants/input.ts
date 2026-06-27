import { cva } from "class-variance-authority";

export const logosInputVariants = cva(
  "logos-font-body w-full min-w-0 rounded-lg border bg-transparent text-logos-text transition-colors outline-none placeholder:text-logos-text-muted focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-logos-border focus-visible:border-brand-primary focus-visible:ring-brand-primary/20",
        filled:
          "border-transparent bg-logos-surface focus-visible:border-brand-primary focus-visible:ring-brand-primary/20",
        ghost:
          "border-transparent bg-transparent focus-visible:border-logos-border focus-visible:ring-ring/30",
      },
      inputSize: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-3.5 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  },
);
