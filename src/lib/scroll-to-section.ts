export function scrollToSection(
  sectionId: string,
  options?: ScrollIntoViewOptions,
): void {
  const element = document.getElementById(sectionId);
  if (!element) return;

  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
    ...options,
  });
}
