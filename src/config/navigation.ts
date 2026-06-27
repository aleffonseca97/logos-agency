import { SECTION_IDS } from "@/data/home-content";

export const siteNav = [
  { labelKey: "services" as const, href: `#${SECTION_IDS.services}` },
  { labelKey: "technologies" as const, href: `#${SECTION_IDS.technologies}` },
  { labelKey: "cases" as const, href: `#${SECTION_IDS.cases}` },
  { labelKey: "faq" as const, href: `#${SECTION_IDS.faq}` },
] as const;

export const siteCta = {
  primary: {
    labelKey: "scheduleCall" as const,
    href: `#${SECTION_IDS.contact}`,
  },
  secondary: { labelKey: "viewCases" as const, href: `#${SECTION_IDS.cases}` },
} as const;

export const footerLinkGroups = {
  services: [
    { labelKey: "services" as const, href: `#${SECTION_IDS.services}` },
    { labelKey: "technologies" as const, href: `#${SECTION_IDS.technologies}` },
    { labelKey: "cases" as const, href: `#${SECTION_IDS.cases}` },
    { labelKey: "faq" as const, href: `#${SECTION_IDS.faq}` },
  ],
  company: [
    { labelKey: "about" as const, href: `#${SECTION_IDS.services}` },
    { labelKey: "cases" as const, href: `#${SECTION_IDS.cases}` },
    { labelKey: "testimonials" as const, href: `#${SECTION_IDS.testimonials}` },
    { labelKey: "contact" as const, href: `#${SECTION_IDS.contact}` },
  ],
  legal: [
    { labelKey: "privacy" as const, href: "#" },
    { labelKey: "terms" as const, href: "#" },
    { labelKey: "cookies" as const, href: "#" },
  ],
} as const;
