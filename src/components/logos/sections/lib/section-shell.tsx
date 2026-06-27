import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Container } from "../../container";
import { Section, type SectionProps } from "../../section";

type SectionShellProps = SectionProps & {
  effects?: ReactNode;
  children: ReactNode;
};

export function SectionShell({
  effects,
  children,
  className,
  ...props
}: SectionShellProps) {
  return (
    <Section className={cn("relative overflow-hidden", className)} {...props}>
      {effects}
      <Container className="relative space-y-12 lg:space-y-16">
        {children}
      </Container>
    </Section>
  );
}
