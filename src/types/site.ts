export type SiteLocale = "en" | "pt-BR" | "it-IT";

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  keywords?: string[];
  links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}
