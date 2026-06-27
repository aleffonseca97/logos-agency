import type { ContactFormInput } from "@/lib/validators/contact";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
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

function mapFormToLeadInsert(
  data: ContactFormInput,
  meta: CreateLeadMeta,
) {
  return {
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.whatsapp,
    project_type: data.projectType,
    budget: data.investmentRange,
    message: data.message,
    status: LEAD_STATUS.NOVO,
    source: "website" as const,
    ip: meta.ip ?? null,
    user_agent: meta.userAgent ?? null,
    assigned_to: null,
    estimated_value: null,
    notes: null,
  };
}

export async function hasRecentDuplicateLead(email: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();

  const { data, error } = await supabase
    .from("leads")
    .select("id")
    .eq("email", email)
    .gte("created_at", since)
    .limit(1);

  if (error) {
    throw new LeadServiceError("Erro ao verificar envios recentes.", "DATABASE");
  }

  return (data?.length ?? 0) > 0;
}

export async function createLead(
  data: ContactFormInput,
  meta: CreateLeadMeta,
): Promise<LeadRow> {
  const isDuplicate = await hasRecentDuplicateLead(data.email);

  if (isDuplicate) {
    throw new LeadServiceError(
      "Você já enviou um projeto recentemente. Aguarde alguns minutos antes de tentar novamente.",
      "DUPLICATE",
    );
  }

  const supabase = getSupabaseAdmin();
  const payload = mapFormToLeadInsert(data, meta);

  const { data: lead, error } = await supabase
    .from("leads")
    .insert(payload)
    .select()
    .single();

  if (error || !lead) {
    console.error("[lead.service] insert error:", error);
    throw new LeadServiceError(
      "Não foi possível salvar seu contato. Tente novamente em instantes.",
      "DATABASE",
    );
  }

  return lead;
}
