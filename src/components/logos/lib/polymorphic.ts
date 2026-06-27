import type {
  ComponentPropsWithRef,
  ElementType,
  ReactElement,
  Ref,
} from "react";

export type PolymorphicProps<
  T extends ElementType,
  OwnProps = object,
> = OwnProps & {
  as?: T;
} & Omit<ComponentPropsWithRef<T>, keyof OwnProps | "as">;

export type PolymorphicRef<T extends ElementType> =
  ComponentPropsWithRef<T>["ref"];

export function resolveElement<T extends ElementType>(
  as: T | undefined,
  defaultElement: ElementType,
): ElementType {
  return as ?? defaultElement;
}

export type PolymorphicComponent<DefaultTag extends ElementType, OwnProps> = <
  T extends ElementType = DefaultTag,
>(
  props: PolymorphicProps<T, OwnProps> & { ref?: Ref<Element> },
) => ReactElement | null;
