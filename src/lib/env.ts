import "server-only";

export function getAppUrl(): string {
  return process.env.APP_URL ?? "http://localhost:3000";
}

export function getWhatsAppNumber(): string {
  return (process.env.WHATSAPP_NUMBER ?? "5511999999999").replace(/\D/g, "");
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
}
