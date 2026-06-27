export const PROJECT_TYPE_KEYS = [
  "landingPage",
  "institutionalSite",
  "ecommerce",
  "webSystem",
  "application",
  "other",
] as const;

export type ProjectTypeKey = (typeof PROJECT_TYPE_KEYS)[number];

export const INVESTMENT_RANGE_KEYS = [
  "upTo5000",
  "5000To10000",
  "10000To20000",
  "above20000",
] as const;

export type InvestmentRangeKey = (typeof INVESTMENT_RANGE_KEYS)[number];

export type ContactFormData = {
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  projectType: ProjectTypeKey | "";
  investmentRange: InvestmentRangeKey | "";
  message: string;
  website: string;
  formLoadedAt: number;
};

export type ContactFormField = keyof Omit<
  ContactFormData,
  "website" | "formLoadedAt"
>;

export const initialContactFormData: ContactFormData = {
  name: "",
  company: "",
  email: "",
  whatsapp: "",
  projectType: "",
  investmentRange: "",
  message: "",
  website: "",
  formLoadedAt: 0,
};
