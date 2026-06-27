import { ArrowRight } from "lucide-react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import { Button, type ButtonProps } from "./button";

export type CtaButtonProps = ButtonProps & {
  showArrow?: boolean;
  arrowClassName?: string;
};

const CtaButton = forwardRef<HTMLButtonElement, CtaButtonProps>(
  (
    {
      className,
      variant = "cta",
      size = "lg",
      showArrow = true,
      arrowClassName,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn("font-semibold", className)}
        {...props}
      >
        {children}
        {showArrow && (
          <ArrowRight
            className={cn(
              "transition-transform group-hover/button:translate-x-0.5",
              arrowClassName,
            )}
            aria-hidden
          />
        )}
      </Button>
    );
  },
);

CtaButton.displayName = "CtaButton";

export { CtaButton };
