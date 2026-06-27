import { type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import { Container } from "./container";
import { cnVariants } from "./lib/cn-variants";
import { resolveElement, type PolymorphicProps } from "./lib/polymorphic";
import { navbarVariants } from "./variants/navbar";

export type NavbarProps<T extends React.ElementType = "header"> =
  PolymorphicProps<T, VariantProps<typeof navbarVariants>>;

const Navbar = forwardRef(function Navbar<
  T extends React.ElementType = "header",
>(
  { as, className, variant, size, children, ...props }: NavbarProps<T>,
  ref: React.Ref<Element>,
) {
  const Component = resolveElement(as, "header");

  return (
    <Component
      ref={ref}
      data-slot="logos-navbar"
      className={cnVariants(navbarVariants, { variant, size }, className)}
      {...props}
    >
      {children}
    </Component>
  );
});

Navbar.displayName = "Navbar";

function NavbarInner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Container
      data-slot="logos-navbar-inner"
      className={cn(
        "flex items-center justify-between gap-3 sm:gap-4",
        className,
      )}
      {...props}
    />
  );
}

function NavbarBrand({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="logos-navbar-brand"
      className={cn("flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  );
}

function NavbarNav({
  className,
  "aria-label": ariaLabel,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="logos-navbar-nav"
      aria-label={ariaLabel}
      className={cn("hidden items-center gap-1 lg:flex xl:gap-2", className)}
      {...props}
    />
  );
}

function NavbarItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="logos-navbar-item"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

function NavbarLink({
  className,
  active,
  ...props
}: React.ComponentProps<"a"> & { active?: boolean }) {
  return (
    <a
      data-slot="logos-navbar-link"
      aria-current={active ? "page" : undefined}
      className={cn(
        "logos-font-body text-logos-text-muted hover:text-logos-text rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 aria-[current=page]:text-logos-text lg:px-3.5",
        className,
      )}
      {...props}
    />
  );
}

function NavbarActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="logos-navbar-actions"
      className={cn("flex shrink-0 items-center gap-1.5 sm:gap-2", className)}
      {...props}
    />
  );
}

function NavbarMobileTrigger({
  className,
  "aria-label": ariaLabel,
  "aria-expanded": ariaExpanded,
  "aria-controls": ariaControls,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="logos-navbar-mobile-trigger"
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      className={cn(
        "text-logos-text hover:bg-logos-surface/60 inline-flex size-9 items-center justify-center rounded-full transition-colors sm:size-10 lg:hidden",
        className,
      )}
      {...props}
    />
  );
}

export {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarInner,
  NavbarItem,
  NavbarLink,
  NavbarMobileTrigger,
  NavbarNav,
  navbarVariants,
};
