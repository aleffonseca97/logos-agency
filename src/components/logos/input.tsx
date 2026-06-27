import { Input as InputPrimitive } from "@base-ui/react/input";
import { type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import { cnVariants } from "./lib/cn-variants";
import { getFieldAriaProps, type FieldControlProps } from "./lib/form-field";
import { logosInputVariants } from "./variants/input";

export type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof logosInputVariants> &
  FieldControlProps;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      invalid,
      errorId,
      type = "text",
      ...props
    },
    ref,
  ) => {
    return (
      <InputPrimitive
        ref={ref}
        type={type}
        data-slot="logos-input"
        className={cn(
          cnVariants(logosInputVariants, { variant, inputSize }, className),
          invalid &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
        )}
        {...getFieldAriaProps({
          invalid,
          errorId,
          ariaInvalid: props["aria-invalid"],
        })}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input, logosInputVariants };
