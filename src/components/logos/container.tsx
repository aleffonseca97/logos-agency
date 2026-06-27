import { type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cnVariants } from "./lib/cn-variants";
import { resolveElement, type PolymorphicProps } from "./lib/polymorphic";
import { containerVariants } from "./variants/container";

export type ContainerProps<T extends React.ElementType = "div"> =
  PolymorphicProps<T, VariantProps<typeof containerVariants>>;

const Container = forwardRef(function Container<
  T extends React.ElementType = "div",
>(
  { as, className, size, padding, ...props }: ContainerProps<T>,
  ref: React.Ref<Element>,
) {
  const Component = resolveElement(as, "div");

  return (
    <Component
      ref={ref}
      data-slot="logos-container"
      className={cnVariants(containerVariants, { size, padding }, className)}
      {...props}
    />
  );
});

Container.displayName = "Container";

export { Container, containerVariants };
