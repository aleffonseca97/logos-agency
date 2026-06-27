import { SECTION_IDS } from "@/data/home-content";

export const CONTACT_SECTION_ID = SECTION_IDS.contact;

export const contactConfig = {
  sectionId: CONTACT_SECTION_ID,
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ??
    process.env.WHATSAPP_NUMBER ??
    "5511999999999",
  responseTimeHours: 24,
} as const;

export function getWhatsAppUrl(message: string): string {
  const number = contactConfig.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
