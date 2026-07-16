import type { LucideIcon } from "lucide-react";
import { Code2, Layers, Palette, Rocket, Search, Shield } from "lucide-react";

export const SECTION_IDS = {
  services: "services",
  clients: "clients",
  technologies: "technologies",
  cases: "cases",
  testimonials: "testimonials",
  faq: "faq",
  contact: "contact",
} as const;

export const SERVICE_KEYS = [
  "digitalArchitecture",
  "interfaceDesign",
  "softwareEngineering",
  "digitalProducts",
  "seoPerformance",
  "securityCompliance",
] as const;

export type ServiceKey = (typeof SERVICE_KEYS)[number];

export const serviceIcons: Record<ServiceKey, LucideIcon> = {
  digitalArchitecture: Layers,
  interfaceDesign: Palette,
  softwareEngineering: Code2,
  digitalProducts: Rocket,
  seoPerformance: Search,
  securityCompliance: Shield,
};

export const homeTechnologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Node.js",
  "PostgreSQL",
  "Vercel",
  "AWS",
  "Figma",
  "GraphQL",
  "Docker",
] as const;

export const CASE_KEYS = ["fintech", "saas", "healthtech"] as const;

export type CaseKey = (typeof CASE_KEYS)[number];

export const caseMetrics: Record<CaseKey, string> = {
  fintech: "+340%",
  saas: "2.4M",
  healthtech: "99.99%",
};

export const TESTIMONIAL_KEYS = ["marina", "rafael", "ana"] as const;

export type TestimonialKey = (typeof TESTIMONIAL_KEYS)[number];

export const featuredTestimonial: TestimonialKey = "marina";

export const FAQ_KEYS = [
  "whatIsLogos",
  "timeline",
  "internalTeams",
  "postLaunch",
  "investment",
] as const;

export type FaqKey = (typeof FAQ_KEYS)[number];

export const HERO_STAT_KEYS = ["projects", "response", "uptime"] as const;

export const HERO_VISUAL_STAT_KEYS = ["requests", "latency", "availability"] as const;

export const HERO_VISUAL_STAT_VALUES: Record<
  (typeof HERO_VISUAL_STAT_KEYS)[number],
  string
> = {
  requests: "2.4M",
  latency: "12ms",
  availability: "99.99%",
};
