"use client";

import { m, useReducedMotion } from "framer-motion";
import { forwardRef, useId, useState } from "react";

import { Input } from "@/components/logos/input";
import { Textarea } from "@/components/logos/textarea";
import { cn } from "@/lib/utils";

type ContactFieldBaseProps = {
  label: string;
  error?: string;
  className?: string;
};

type ContactInputProps = ContactFieldBaseProps &
  Omit<React.ComponentProps<typeof Input>, "id" | "invalid" | "errorId"> & {
    fieldType?: "text" | "email" | "tel";
  };

type ContactSelectProps = ContactFieldBaseProps &
  Omit<React.ComponentProps<"select">, "id"> & {
    options: readonly { value: string; label: string }[];
    placeholder?: string;
  };

type ContactTextareaProps = ContactFieldBaseProps &
  Omit<
    React.ComponentProps<typeof Textarea>,
    "id" | "invalid" | "errorId"
  >;

function FieldLabel({ id, label }: { id: string; label: string }) {
  return (
    <label
      htmlFor={id}
      className="text-logos-text text-sm font-medium tracking-tight"
    >
      {label}
    </label>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;

  return (
    <p
      id={id}
      role="alert"
      className="text-destructive text-xs leading-relaxed"
    >
      {error}
    </p>
  );
}

function FocusGlow({ isFocused }: { isFocused: boolean }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <m.div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-lg"
      initial={false}
      animate={{
        opacity: isFocused ? 1 : 0,
        boxShadow: isFocused
          ? "0 0 20px color-mix(in srgb, var(--logos-brand-primary) 35%, transparent)"
          : "0 0 0px transparent",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        border: "1px solid color-mix(in srgb, var(--logos-brand-primary) 40%, transparent)",
      }}
    />
  );
}

export const ContactInput = forwardRef<HTMLInputElement, ContactInputProps>(
  function ContactInput(
    { label, error, className, fieldType = "text", onFocus, onBlur, ...props },
    ref,
  ) {
    const id = useId();
    const errorId = `${id}-error`;
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={cn("space-y-2", className)}>
        <FieldLabel id={id} label={label} />
        <div className="relative">
          <FocusGlow isFocused={isFocused && !error} />
          <Input
            ref={ref}
            id={id}
            type={fieldType}
            variant="filled"
            inputSize="lg"
            invalid={Boolean(error)}
            errorId={error ? errorId : undefined}
            className="relative z-10 transition-all duration-200 hover:border-brand-primary/30"
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            {...props}
          />
        </div>
        <FieldError id={errorId} error={error} />
      </div>
    );
  },
);

export const ContactSelect = forwardRef<HTMLSelectElement, ContactSelectProps>(
  function ContactSelect(
    {
      label,
      error,
      className,
      options,
      placeholder,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) {
    const id = useId();
    const errorId = `${id}-error`;
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={cn("space-y-2", className)}>
        <FieldLabel id={id} label={label} />
        <div className="relative">
          <FocusGlow isFocused={isFocused && !error} />
          <select
            ref={ref}
            id={id}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "logos-font-body relative z-10 h-12 w-full min-w-0 appearance-none rounded-lg border bg-logos-surface px-4 text-sm text-logos-text transition-all duration-200 outline-none",
              "hover:border-brand-primary/30 focus-visible:border-brand-primary focus-visible:ring-3 focus-visible:ring-brand-primary/20",
              error
                ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                : "border-transparent",
            )}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            {...props}
          >
            <option value="" disabled hidden={!placeholder}>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <FieldError id={errorId} error={error} />
      </div>
    );
  },
);

export const ContactTextarea = forwardRef<
  HTMLTextAreaElement,
  ContactTextareaProps
>(function ContactTextarea(
  { label, error, className, onFocus, onBlur, ...props },
  ref,
) {
  const id = useId();
  const errorId = `${id}-error`;
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <FieldLabel id={id} label={label} />
      <div className="relative">
        <FocusGlow isFocused={isFocused && !error} />
        <Textarea
          ref={ref}
          id={id}
          variant="filled"
          textareaSize="lg"
          invalid={Boolean(error)}
          errorId={error ? errorId : undefined}
          className="relative z-10 min-h-32 transition-all duration-200 hover:border-brand-primary/30"
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          {...props}
        />
      </div>
      <FieldError id={errorId} error={error} />
    </div>
  );
});
