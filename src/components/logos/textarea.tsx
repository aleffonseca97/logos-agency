import { type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import { cnVariants } from "./lib/cn-variants";
import { getFieldAriaProps, type FieldControlProps } from "./lib/form-field";
import { logosInputVariants } from "./variants/input";

const textareaSizeClasses = {
  sm: "min-h-20 px-3 py-2 text-xs",
  md: "min-h-24 px-3.5 py-2.5 text-sm",
  lg: "min-h-32 px-4 py-3 text-base",
} as const;

export type TextareaProps = React.ComponentProps<"textarea"> &
  Omit<VariantProps<typeof logosInputVariants>, "inputSize"> &
  FieldControlProps & {
    textareaSize?: keyof typeof textareaSizeClasses;
  };

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, variant, textareaSize = "md", invalid, errorId, ...props },
    ref,
  ) => {
    return (
      <textarea
        ref={ref}
        data-slot="logos-textarea"
        className={cn(
          cnVariants(logosInputVariants, { variant }, className),
          "field-sizing-content resize-y",
          textareaSizeClasses[textareaSize],
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

Textarea.displayName = "Textarea";

export { Textarea };
