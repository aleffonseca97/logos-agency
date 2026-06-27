import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (resendClient) return resendClient;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Resend não configurado. Defina RESEND_API_KEY no ambiente.",
    );
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getContactEmail(): string {
  return process.env.CONTACT_EMAIL ?? "logosdev.agency@gmail.com";
}

import { siteConfig } from "@/config/site";

export function getEmailFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL ??
    `${siteConfig.name} <onboarding@resend.dev>`
  );
}
