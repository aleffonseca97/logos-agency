"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({
  children,
  scriptProps: userScriptProps,
  ...props
}: ThemeProviderProps) {
  // next-themes injects an inline <script> for pre-hydration theme. React 19
  // errors when that script is rendered on the client. SSR keeps a runnable
  // script; on the client, mark it non-JS so React won't treat it as executable.
  const scriptProps =
    userScriptProps ??
    (typeof window === "undefined"
      ? undefined
      : ({ type: "application/json" } as const));

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      storageKey="logos-theme"
      disableTransitionOnChange
      {...props}
      scriptProps={scriptProps}
    >
      {children}
    </NextThemesProvider>
  );
}
