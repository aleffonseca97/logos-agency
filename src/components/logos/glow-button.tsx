import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import { Button, type ButtonProps } from "./button";

export type GlowButtonProps = ButtonProps & {
  pulse?: boolean;
};

const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = "glow", pulse = false, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          pulse && "animate-pulse motion-reduce:animate-none",
          className,
        )}
        {...props}
      />
    );
  },
);

GlowButton.displayName = "GlowButton";

export { GlowButton };
