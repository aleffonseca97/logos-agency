import type { LogosTheme } from "@/design-system/types";

import { logosBrandColors } from "./brand-colors";

export const logosDefaultTheme = {
  id: "logos-default",
  name: "LOGOS Default",
  brand: logosBrandColors,
} satisfies LogosTheme;
