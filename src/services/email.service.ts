import {
  buildClientConfirmationEmailHtml,
  buildTeamLeadEmailHtml,
} from "@/lib/emails/templates";
import { siteConfig } from "@/config/site";
import {
  getContactEmail,
  getEmailFromAddress,
  getResendClient,
} from "@/lib/resend";
import type { LeadRow } from "@/types/lead";

export class EmailServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailServiceError";
  }
}

export async function sendTeamLeadNotification(
  lead: LeadRow,
): Promise<void> {
  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from: getEmailFromAddress(),
    to: getContactEmail(),
    subject: "🚀 Novo Lead recebido",
    html: buildTeamLeadEmailHtml(lead),
  });

  if (error) {
    console.error("[email.service] team notification error:", error);
    throw new EmailServiceError(
      "Não foi possível notificar a equipe sobre o novo lead.",
    );
  }
}

export async function sendClientConfirmationEmail(
  lead: LeadRow,
): Promise<void> {
  const resend = getResendClient();
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://logosframework.com";

  const { error } = await resend.emails.send({
    from: getEmailFromAddress(),
    to: lead.email,
    subject: `Recebemos seu projeto — ${siteConfig.name}`,
    html: buildClientConfirmationEmailHtml({
      name: lead.name,
      siteUrl,
    }),
  });

  if (error) {
    console.error("[email.service] client confirmation error:", error);
    throw new EmailServiceError(
      "Não foi possível enviar o e-mail de confirmação.",
    );
  }
}

export async function sendLeadEmails(lead: LeadRow): Promise<void> {
  await Promise.all([
    sendTeamLeadNotification(lead),
    sendClientConfirmationEmail(lead),
  ]);
}
