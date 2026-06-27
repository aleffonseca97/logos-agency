import type { LogosTheme } from "./types";
import { themes, type ThemeId } from "./themes";
import * as tokens from "./tokens";

export { tokens };
export { themes, type ThemeId };
export type { BrandColors, LogosTheme } from "./types";

export function getTheme(id: ThemeId = "logos-default"): LogosTheme {
  return themes[id];
}

export function applyThemeToElement(
  element: HTMLElement,
  themeId: ThemeId = "logos-default",
): void {
  element.setAttribute("data-theme", themeId);
}

export function createThemeCssVars(theme: LogosTheme): Record<string, string> {
  return {
    "--logos-brand-primary": theme.brand.primary,
    "--logos-brand-secondary": theme.brand.secondary,
    "--logos-brand-accent": theme.brand.accent,
    "--logos-brand-background": theme.brand.background,
    "--logos-brand-surface": theme.brand.surface,
    "--logos-brand-white": theme.brand.white,
  };
}
