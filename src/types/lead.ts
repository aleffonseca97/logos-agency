export const LEAD_PIPELINE = [
  "Novo",
  "Contato feito",
  "Reunião marcada",
  "Proposta enviada",
  "Negociação",
  "Fechado",
  "Perdido",
] as const;

export type LeadPipelineStatus = (typeof LEAD_PIPELINE)[number];

export const LEAD_STATUS = {
  NOVO: "Novo",
  CONTATO_FEITO: "Contato feito",
  REUNIAO_MARCADA: "Reunião marcada",
  PROPOSTA_ENVIADA: "Proposta enviada",
  NEGOCIACAO: "Negociação",
  FECHADO: "Fechado",
  PERDIDO: "Perdido",
} as const satisfies Record<string, LeadPipelineStatus>;

export type LeadStatus = LeadPipelineStatus;

export const LEAD_ACTIVITY_TYPES = [
  "note",
  "call",
  "email",
  "meeting",
  "status_change",
] as const;

export type LeadActivityType = (typeof LEAD_ACTIVITY_TYPES)[number];

export type LeadSource = "website" | "referral" | "social" | "other";

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  project_type: string;
  budget: string;
  message: string;
  status: LeadStatus;
  source: LeadSource;
  ip: string | null;
  user_agent: string | null;
  assigned_to: string | null;
  estimated_value: number | null;
  notes: string | null;
};

export type LeadInsert = Omit<Lead, "id" | "created_at" | "updated_at"> & {
  updated_at?: string;
};

export type LeadRow = Lead;

export type LeadActivity = {
  id: string;
  lead_id: string;
  type: LeadActivityType;
  content: string;
  created_by: string | null;
  created_at: string;
};

export type LeadWithAssignee = Lead & {
  assignee?: { full_name: string | null; email: string | null } | null;
};

export type LeadsQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sortBy?: keyof Lead;
  sortOrder?: "asc" | "desc";
};

export type PaginatedLeads = {
  data: LeadWithAssignee[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
