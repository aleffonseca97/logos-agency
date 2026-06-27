import { type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { Container } from "./container";
import { cnVariants } from "./lib/cn-variants";
import { resolveElement, type PolymorphicProps } from "./lib/polymorphic";
import { containerVariants } from "./variants/container";
import { sectionVariants } from "./variants/section";

export type SectionProps<T extends React.ElementType = "section"> =
  PolymorphicProps<
    T,
    VariantProps<typeof sectionVariants> & {
      contained?: boolean;
      containerSize?: VariantProps<typeof containerVariants>["size"];
    }
  >;

const Section = forwardRef(function Section<
  T extends React.ElementType = "section",
>(
  {
    as,
    className,
    spacing,
    variant,
    contained = false,
    containerSize,
    children,
    ...props
  }: SectionProps<T>,
  ref: React.Ref<Element>,
) {
  const Component = resolveElement(as, "section");

  const content =
    contained || containerSize ? (
      <Container size={containerSize}>{children}</Container>
    ) : (
      children
    );

  return (
    <Component
      ref={ref}
      data-slot="logos-section"
      className={cnVariants(sectionVariants, { spacing, variant }, className)}
      {...props}
    >
      {content}
    </Component>
  );
});

Section.displayName = "Section";

export { Section, sectionVariants };
