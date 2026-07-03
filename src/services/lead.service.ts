import type { ContactFormInput } from "@/lib/validators/contact";
import { isDatabaseConfigured } from "@/lib/db";
import {
  hasRecentLeadByEmail,
  insertLead,
} from "@/repositories/leads.repository";
import { LEAD_STATUS, type LeadRow } from "@/types/lead";

const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;

export type CreateLeadMeta = {
  ip?: string;
  userAgent?: string;
};

export class LeadServiceError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "DUPLICATE"
      | "DATABASE"
      | "NOT_CONFIGURED" = "DATABASE",
  ) {
    super(message);
    this.name = "LeadServiceError";
  }
}

function mapFormToLeadInsert(data: ContactFormInput, meta: CreateLeadMeta) {
  return {
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.whatsapp,
    projectType: data.projectType,
    budget: data.investmentRange,
    message: data.message,
    status: LEAD_STATUS.NOVO,
    source: "website" as const,
    ip: meta.ip ?? null,
    userAgent: meta.userAgent ?? null,
  };
}

export async function hasRecentDuplicateLead(email: string): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    throw new LeadServiceError("Banco de dados não configurado.", "NOT_CONFIGURED");
  }

  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS);
  try {
    return await hasRecentLeadByEmail(email, since);
  } catch {
    throw new LeadServiceError("Erro ao verificar envios recentes.", "DATABASE");
  }
}

export async function createLead(
  data: ContactFormInput,
  meta: CreateLeadMeta,
): Promise<LeadRow> {
  if (!isDatabaseConfigured()) {
    throw new LeadServiceError("Banco de dados não configurado.", "NOT_CONFIGURED");
  }

  const isDuplicate = await hasRecentDuplicateLead(data.email);

  if (isDuplicate) {
    throw new LeadServiceError(
      "Você já enviou um projeto recentemente. Aguarde alguns minutos antes de tentar novamente.",
      "DUPLICATE",
    );
  }

  const payload = mapFormToLeadInsert(data, meta);

  try {
    return await insertLead(payload);
  } catch (error) {
    console.error("[lead.service] insert error:", error);
    throw new LeadServiceError(
      "Não foi possível salvar seu contato. Tente novamente em instantes.",
      "DATABASE",
    );
  }
}
