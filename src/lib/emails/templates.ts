import type { LeadRow } from "@/types/lead";
import { branding } from "@/config/branding";
import { siteConfig } from "@/config/site";
import { getAppUrl } from "@/lib/env";

const BRAND = {
  background: "#0b0f19",
  surface: "#111827",
  primary: "#2563eb",
  accent: "#4f46e5",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  border: "rgba(248, 250, 252, 0.12)",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

function brandLogoHtml(height = 30): string {
  const src = escapeHtml(`${getAppUrl()}${branding.logo.markSrc}`);
  const width = height;

  return `<img src="${src}" alt="${escapeHtml(siteConfig.name)}" width="${width}" height="${height}" style="height:${height}px;width:${width}px;display:block;margin:0 auto 8px;" />`;
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${BRAND.border};color:${BRAND.textMuted};font-size:13px;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:12px 0;border-bottom:1px solid ${BRAND.border};color:${BRAND.text};font-size:14px;line-height:1.6;">${escapeHtml(value)}</td>
    </tr>
  `;
}

export function buildTeamLeadEmailHtml(lead: LeadRow): string {
  const submittedAt = formatDate(lead.created_at);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Novo Lead — ${escapeHtml(siteConfig.name)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.background};font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.background};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 24px;background:linear-gradient(135deg, ${BRAND.primary}22, ${BRAND.accent}22);">
              ${brandLogoHtml(28)}
              <h1 style="margin:0;font-size:24px;line-height:1.3;color:${BRAND.text};">🚀 Novo Lead recebido</h1>
              <p style="margin:12px 0 0;color:${BRAND.textMuted};font-size:14px;">Um visitante enviou o formulário de contato do site.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${row("Nome", lead.name)}
                ${row("Empresa", lead.company)}
                ${row("E-mail", lead.email)}
                ${row("Telefone", lead.phone)}
                ${row("Tipo de projeto", lead.project_type)}
                ${row("Orçamento", lead.budget)}
                ${row("Mensagem", lead.message)}
                ${row("Data", submittedAt)}
                ${row("Origem", lead.source)}
                ${row("Status", lead.status)}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function buildClientConfirmationEmailHtml(params: {
  name: string;
  siteUrl: string;
}): string {
  const firstName = escapeHtml(params.name.split(" ")[0] ?? params.name);
  const siteUrl = escapeHtml(params.siteUrl);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recebemos seu projeto — ${escapeHtml(siteConfig.name)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.background};font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.background};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:16px;overflow:hidden;box-shadow:0 0 24px ${BRAND.primary}33;">
          <tr>
            <td style="padding:40px 32px 24px;text-align:center;background:linear-gradient(135deg, ${BRAND.primary}22, ${BRAND.accent}22);">
              ${brandLogoHtml(32)}
              <h1 style="margin:0;font-size:28px;line-height:1.25;color:${BRAND.text};">Recebemos seu projeto!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 32px;text-align:center;">
              <p style="margin:0 0 16px;color:${BRAND.text};font-size:16px;line-height:1.7;">Olá, ${firstName}!</p>
              <p style="margin:0 0 24px;color:${BRAND.textMuted};font-size:15px;line-height:1.7;">
                Obrigado por entrar em contato.<br />
                Nossa equipe analisará seu projeto e responderá em até <strong style="color:${BRAND.text};">24 horas</strong>.
              </p>
              <a href="${siteUrl}" style="display:inline-block;padding:14px 28px;background:${BRAND.primary};color:${BRAND.text};text-decoration:none;border-radius:10px;font-size:14px;font-weight:600;box-shadow:0 0 20px ${BRAND.primary}44;">
                Visitar nosso site
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid ${BRAND.border};text-align:center;">
              <p style="margin:0;color:${BRAND.textMuted};font-size:12px;line-height:1.6;">
                © ${new Date().getFullYear()} ${escapeHtml(siteConfig.name)} · LOGOS Framework
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
