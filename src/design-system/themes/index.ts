import { logosDefaultTheme } from "./logos-default";

export const themes = {
  [logosDefaultTheme.id]: logosDefaultTheme,
} as const;

export type ThemeId = keyof typeof themes & string;

export { logosDefaultTheme };
export { logosBrandColors } from "./brand-colors";
