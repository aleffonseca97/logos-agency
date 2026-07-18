function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToSection(
  sectionId: string,
  options?: ScrollIntoViewOptions,
): void {
  const element = document.getElementById(sectionId);
  if (!element) return;

  element.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
    ...options,
  });
}
