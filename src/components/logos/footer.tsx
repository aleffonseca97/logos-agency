import { type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import { Container } from "./container";
import { cnVariants } from "./lib/cn-variants";
import { resolveElement, type PolymorphicProps } from "./lib/polymorphic";
import { footerVariants } from "./variants/footer";

export type FooterProps<T extends React.ElementType = "footer"> =
  PolymorphicProps<T, VariantProps<typeof footerVariants>>;

const Footer = forwardRef(function Footer<
  T extends React.ElementType = "footer",
>(
  { as, className, variant, spacing, children, ...props }: FooterProps<T>,
  ref: React.Ref<Element>,
) {
  const Component = resolveElement(as, "footer");

  return (
    <Component
      ref={ref}
      data-slot="logos-footer"
      className={cnVariants(footerVariants, { variant, spacing }, className)}
      {...props}
    >
      {children}
    </Component>
  );
});

Footer.displayName = "Footer";

function FooterInner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Container
      data-slot="logos-footer-inner"
      className={cn("flex flex-col gap-8", className)}
      {...props}
    />
  );
}

function FooterTop({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="logos-footer-top"
      className={cn(
        "flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between",
        className,
      )}
      {...props}
    />
  );
}

function FooterBrand({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="logos-footer-brand"
      className={cn("flex max-w-sm flex-col gap-3", className)}
      {...props}
    />
  );
}

function FooterNav({
  className,
  "aria-label": ariaLabel = "Rodapé",
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="logos-footer-nav"
      aria-label={ariaLabel}
      className={cn("grid gap-8 sm:grid-cols-2 lg:grid-cols-3", className)}
      {...props}
    />
  );
}

function FooterColumn({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="logos-footer-column"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}

function FooterColumnTitle({
  className,
  ...props
}: React.ComponentProps<"h4">) {
  return (
    <h4
      data-slot="logos-footer-column-title"
      className={cn("logos-font-heading text-sm font-semibold", className)}
      {...props}
    />
  );
}

function FooterLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="logos-footer-link"
      className={cn(
        "text-logos-text-muted hover:text-logos-text text-sm transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function FooterBottom({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="logos-footer-bottom"
      className={cn(
        "border-logos-border flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    />
  );
}

function FooterCopyright({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="logos-footer-copyright"
      className={cn("text-logos-text-muted text-sm", className)}
      {...props}
    />
  );
}

export {
  Footer,
  FooterBottom,
  FooterBrand,
  FooterColumn,
  FooterColumnTitle,
  FooterCopyright,
  FooterInner,
  FooterLink,
  FooterNav,
  FooterTop,
  footerVariants,
};
