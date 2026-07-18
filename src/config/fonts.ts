import { Inter, Michroma, Sora } from "next/font/google";

export const fontHeading = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const fontBody = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const fontWordmark = Michroma({
  variable: "--font-wordmark",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export const fontVariables = `${fontHeading.variable} ${fontBody.variable} ${fontWordmark.variable}`;
