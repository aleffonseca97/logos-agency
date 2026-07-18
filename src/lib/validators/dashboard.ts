import { z } from "zod";

import { CLIENT_STATUS } from "@/types/client";
import { EVENT_TYPES } from "@/types/event";
import { LEAD_ACTIVITY_TYPES, LEAD_PIPELINE } from "@/types/lead";
import { PROJECT_STATUSES } from "@/types/project";
import { PROPOSAL_STATUSES } from "@/types/proposal";

const uuidOrNull = z.union([z.string().uuid(), z.null()]).optional();
const emptyToNull = (v: unknown) => (v === "" || v === undefined ? null : v);

export const clientStatusSchema = z.enum([
  CLIENT_STATUS.ATIVO,
  CLIENT_STATUS.INATIVO,
]);

export const clientCreateSchema = z.object({
  lead_id: uuidOrNull,
  company: z.string().trim().min(1, "Nome da empresa é obrigatório."),
  logo_url: z.preprocess(emptyToNull, z.string().nullable().optional()),
  website: z.preprocess(emptyToNull, z.string().nullable().optional()),
  segment: z.preprocess(emptyToNull, z.string().nullable().optional()),
  city: z.preprocess(emptyToNull, z.string().nullable().optional()),
  country: z.preprocess(emptyToNull, z.string().nullable().optional()),
  status: clientStatusSchema.optional().default(CLIENT_STATUS.ATIVO),
  client_since: z.preprocess(emptyToNull, z.string().nullable().optional()),
  featured_home: z.coerce.boolean().optional().default(false),
  display_order: z.coerce.number().int().optional().default(0),
  notes: z.preprocess(emptyToNull, z.string().nullable().optional()),
  name: z.preprocess(emptyToNull, z.string().nullable().optional()),
  email: z.preprocess(emptyToNull, z.string().nullable().optional()),
  phone: z.preprocess(emptyToNull, z.string().nullable().optional()),
});

export const clientUpdateSchema = clientCreateSchema.partial().extend({
  company: z.string().trim().min(1, "Nome da empresa é obrigatório.").optional(),
});

export const leadPipelineSchema = z.enum(LEAD_PIPELINE);

export const leadUpdateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  company: z.string().trim().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  project_type: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
  status: leadPipelineSchema.optional(),
  source: z.enum(["website", "referral", "social", "other"]).optional(),
  assigned_to: uuidOrNull,
  estimated_value: z.union([z.number(), z.null()]).optional(),
  notes: z.preprocess(emptyToNull, z.string().nullable().optional()),
});

export const leadStatusSchema = z.object({
  status: leadPipelineSchema,
});

export const leadActivitySchema = z.object({
  content: z.string().min(1, "Conteúdo obrigatório."),
  type: z.enum(LEAD_ACTIVITY_TYPES).optional().default("note"),
});

export const leadsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional().default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const projectCreateSchema = z.object({
  client_id: uuidOrNull,
  lead_id: uuidOrNull,
  name: z.string().trim().min(1, "Nome do projeto é obrigatório."),
  description: z.preprocess(emptyToNull, z.string().nullable().optional()),
  status: z.enum(PROJECT_STATUSES).optional().default("Em andamento"),
  budget: z.union([z.number(), z.null()]).optional().nullable(),
  started_at: z.preprocess(emptyToNull, z.string().nullable().optional()),
  completed_at: z.preprocess(emptyToNull, z.string().nullable().optional()),
});

export const proposalCreateSchema = z.object({
  duplicateId: z.string().uuid().optional(),
  lead_id: uuidOrNull,
  client_id: uuidOrNull,
  title: z.string().trim().min(1).optional(),
  value: z.coerce.number().optional(),
  description: z.preprocess(emptyToNull, z.string().nullable().optional()),
  deadline: z.preprocess(emptyToNull, z.string().nullable().optional()),
  status: z.enum(PROPOSAL_STATUSES).optional(),
});

export const eventCreateSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório."),
  type: z.enum(EVENT_TYPES).optional().default("meeting"),
  description: z.preprocess(emptyToNull, z.string().nullable().optional()),
  start_at: z.string().min(1, "Início é obrigatório."),
  end_at: z.string().min(1, "Fim é obrigatório."),
  lead_id: uuidOrNull,
  client_id: uuidOrNull,
  google_calendar_id: z.preprocess(emptyToNull, z.string().nullable().optional()),
});

export const eventsQuerySchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
});

export const profileUpdateSchema = z.object({
  full_name: z.string().trim().optional(),
  avatar_url: z.preprocess(emptyToNull, z.string().nullable().optional()),
  preferences: z.record(z.string(), z.unknown()).optional(),
});

export const orgSettingsUpdateSchema = z.object({
  company_name: z.string().trim().min(1).optional(),
  logo_url: z.preprocess(emptyToNull, z.string().nullable().optional()),
  whatsapp: z.preprocess(emptyToNull, z.string().nullable().optional()),
  contact_email: z.preprocess(emptyToNull, z.string().nullable().optional()),
  primary_color: z.string().optional(),
  social_links: z.record(z.string(), z.string()).optional(),
  resend_configured: z.boolean().optional(),
  database_configured: z.boolean().optional(),
  calendly_url: z.preprocess(emptyToNull, z.string().nullable().optional()),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória."),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
});

export const notificationsPatchSchema = z
  .object({
    markAll: z.boolean().optional(),
    id: z.string().uuid().optional(),
  })
  .refine((v) => v.markAll === true || Boolean(v.id), {
    message: "Informe markAll ou id.",
  });

export const searchQuerySchema = z.object({
  q: z.string().trim().optional().default(""),
});
