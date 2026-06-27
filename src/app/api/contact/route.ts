import { NextResponse } from "next/server";

import { checkRateLimit, pruneRateLimitStore } from "@/lib/rate-limit";
import { getClientIp, getUserAgent } from "@/lib/request-meta";
import { isResendConfigured } from "@/lib/resend";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import {
  createContactFormSchema,
  isFormSubmittedTooFast,
  parseContactForm,
  zodErrorsToFormErrors,
} from "@/lib/validators/contact";
import { createLead, LeadServiceError } from "@/services/lead.service";
import { sendLeadEmails } from "@/services/email.service";
import { notifyAllAdmins } from "@/repositories/notifications.repository";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const contactSchema = createContactFormSchema({
  nameMin: "Name must be at least 2 characters.",
  companyRequired: "Please enter your company name.",
  emailInvalid: "Please enter a valid email.",
  whatsappRequired: "Please enter your WhatsApp number.",
  whatsappInvalid: "Please enter a valid WhatsApp number.",
  projectTypeRequired: "Please select a project type.",
  investmentRangeRequired: "Please select an investment range.",
  messageMin: "Message must be at least 10 characters.",
  messageMax: "Message is too long.",
});

function jsonError(
  message: string,
  status: number,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export async function POST(request: Request) {
  pruneRateLimitStore();

  if (!isSupabaseConfigured()) {
    console.error("[api/contact] Supabase não configurado");
    return jsonError(
      "Serviço temporariamente indisponível. Tente novamente mais tarde.",
      503,
    );
  }

  if (!isResendConfigured()) {
    console.error("[api/contact] Resend não configurado");
    return jsonError(
      "Serviço temporariamente indisponível. Tente novamente mais tarde.",
      503,
    );
  }

  const ip = getClientIp(request) ?? "unknown";
  const rateLimit = checkRateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);

  if (!rateLimit.success) {
    return jsonError(
      "Muitas tentativas. Aguarde alguns minutos antes de enviar novamente.",
      429,
      { retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000) },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError(
      "Dados inválidos. Verifique o formulário e tente novamente.",
      400,
    );
  }

  const parsed = parseContactForm(contactSchema, body);

  if (!parsed.success) {
    return jsonError("Verifique os campos do formulário.", 422, {
      errors: zodErrorsToFormErrors(parsed.error),
    });
  }

  const data = parsed.data;

  if (data.website) {
    return jsonError("Não foi possível processar o envio.", 400);
  }

  if (isFormSubmittedTooFast(data.formLoadedAt)) {
    return jsonError("Envio muito rápido. Tente novamente.", 400);
  }

  try {
    const lead = await createLead(data, {
      ip: ip === "unknown" ? undefined : ip,
      userAgent: getUserAgent(request),
    });

    try {
      await sendLeadEmails(lead);
    } catch (emailError) {
      console.error("[api/contact] email error (lead saved):", emailError);
    }

    try {
      const admin = getSupabaseAdmin();
      await notifyAllAdmins(admin, {
        type: "new_lead",
        title: "Novo lead recebido",
        message: `${lead.name} (${lead.company}) enviou um projeto via site.`,
        link: `/dashboard/leads/${lead.id}`,
      });
    } catch (notifError) {
      console.error("[api/contact] notification error:", notifError);
    }

    return NextResponse.json({ success: true, id: lead.id });
  } catch (error) {
    if (error instanceof LeadServiceError) {
      const status = error.code === "DUPLICATE" ? 409 : 500;
      return jsonError(error.message, status);
    }

    console.error("[api/contact] unexpected error:", error);
    return jsonError(
      "Não foi possível processar seu contato. Tente novamente em instantes.",
      500,
    );
  }
}
