import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cnVariants } from "./lib/cn-variants";
import { logosButtonVariants } from "./variants/button";

export type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof logosButtonVariants>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      ...props
    },
    ref,
  ) => {
    return (
      <ButtonPrimitive
        ref={ref}
        data-slot="logos-button"
        className={cnVariants(
          logosButtonVariants,
          { variant, size, fullWidth },
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, logosButtonVariants };
