import { z } from "zod";

import {
  INVESTMENT_RANGE_KEYS,
  PROJECT_TYPE_KEYS,
} from "@/components/contact/types";
import { sanitizeEmail, sanitizePhone, sanitizeText } from "@/lib/sanitize";

const phoneRefine = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
};

export type ContactValidationMessages = {
  nameMin: string;
  companyRequired: string;
  emailInvalid: string;
  whatsappRequired: string;
  whatsappInvalid: string;
  projectTypeRequired: string;
  investmentRangeRequired: string;
  messageMin: string;
  messageMax: string;
};

export function createContactFormSchema(messages: ContactValidationMessages) {
  return z.object({
    name: z
      .string()
      .transform((v) => sanitizeText(v, 100))
      .pipe(z.string().min(2, messages.nameMin)),
    company: z
      .string()
      .transform((v) => sanitizeText(v, 150))
      .pipe(z.string().min(1, messages.companyRequired)),
    email: z
      .string()
      .transform((v) => sanitizeEmail(v))
      .pipe(z.string().email(messages.emailInvalid)),
    whatsapp: z
      .string()
      .transform((v) => sanitizePhone(v))
      .pipe(
        z
          .string()
          .min(1, messages.whatsappRequired)
          .refine(phoneRefine, messages.whatsappInvalid),
      ),
    projectType: z.enum(PROJECT_TYPE_KEYS, {
      message: messages.projectTypeRequired,
    }),
    investmentRange: z.enum(INVESTMENT_RANGE_KEYS, {
      message: messages.investmentRangeRequired,
    }),
    message: z
      .string()
      .transform((v) => sanitizeText(v, 2000))
      .pipe(
        z
          .string()
          .min(10, messages.messageMin)
          .max(2000, messages.messageMax),
      ),
    website: z
      .string()
      .optional()
      .transform((v) => sanitizeText(v ?? "", 0)),
    formLoadedAt: z.number().optional(),
  });
}

export type ContactFormInput = z.infer<
  ReturnType<typeof createContactFormSchema>
>;

export type ContactFormField = keyof Omit<
  ContactFormInput,
  "website" | "formLoadedAt"
>;

export type ContactFormErrors = Partial<Record<ContactFormField, string>>;

const FIELD_LABELS: Record<ContactFormField, string> = {
  name: "name",
  company: "company",
  email: "email",
  whatsapp: "whatsapp",
  projectType: "projectType",
  investmentRange: "investmentRange",
  message: "message",
};

export function parseContactForm(
  schema: ReturnType<typeof createContactFormSchema>,
  data: unknown,
) {
  return schema.safeParse(data);
}

export function zodErrorsToFormErrors(error: z.ZodError): ContactFormErrors {
  const errors: ContactFormErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      typeof field === "string" &&
      field in FIELD_LABELS &&
      !errors[field as ContactFormField]
    ) {
      errors[field as ContactFormField] = issue.message;
    }
  }

  return errors;
}

export function validateContactField(
  schema: ReturnType<typeof createContactFormSchema>,
  field: ContactFormField,
  value: unknown,
): string | undefined {
  const shape = schema.shape[field];
  const result = shape.safeParse(value ?? "");
  if (result.success) return undefined;
  return result.error.issues[0]?.message;
}

export const MIN_FORM_SUBMIT_MS = 3000;

export function isFormSubmittedTooFast(formLoadedAt?: number): boolean {
  if (!formLoadedAt) return false;
  return Date.now() - formLoadedAt < MIN_FORM_SUBMIT_MS;
}
