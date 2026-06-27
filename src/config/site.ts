export const siteConfig = {
  name: "LOGOS",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  links: {
    twitter: "@logosframework",
    linkedin: "https://www.linkedin.com/company/logos-framework",
  },
} as const;
