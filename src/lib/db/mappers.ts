import type { CalendarEvent } from "@/types/event";
import type { Client } from "@/types/client";
import type { Notification } from "@/types/notification";
import type { Profile } from "@/types/profile";
import type { Project } from "@/types/project";
import type { Proposal } from "@/types/proposal";
import type { Lead, LeadActivity } from "@/types/lead";
import type { OrgSettings } from "@/types/settings";

import type {
  clients,
  events,
  leadActivities,
  leads,
  notifications,
  orgSettings,
  profiles,
  projects,
  proposals,
} from "./schema";

type Timestamp = Date | string;

function toIso(value: Timestamp | null | undefined): string {
  if (!value) return new Date().toISOString();
  return value instanceof Date ? value.toISOString() : value;
}

function toIsoOrNull(value: Timestamp | null | undefined): string | null {
  if (value == null) return null;
  return value instanceof Date ? value.toISOString() : value;
}

function toNumber(value: string | null | undefined): number | null {
  if (value == null) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

export function mapLead(row: typeof leads.$inferSelect): Lead {
  return {
    id: row.id,
    created_at: toIso(row.createdAt),
    updated_at: toIso(row.updatedAt),
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    project_type: row.projectType,
    budget: row.budget,
    message: row.message,
    status: row.status as Lead["status"],
    source: row.source as Lead["source"],
    ip: row.ip,
    user_agent: row.userAgent,
    assigned_to: row.assignedTo,
    estimated_value: toNumber(row.estimatedValue),
    notes: row.notes,
  };
}

export function mapLeadActivity(row: typeof leadActivities.$inferSelect): LeadActivity {
  return {
    id: row.id,
    lead_id: row.leadId,
    type: row.type,
    content: row.content,
    created_by: row.createdBy,
    created_at: toIso(row.createdAt),
  };
}

export function mapClient(row: typeof clients.$inferSelect): Client {
  return {
    id: row.id,
    lead_id: row.leadId,
    company: row.company,
    logo_url: row.logoUrl,
    website: row.website,
    segment: row.segment,
    city: row.city,
    country: row.country,
    status: row.status as Client["status"],
    client_since: row.clientSince,
    featured_home: row.featuredHome,
    display_order: row.displayOrder,
    notes: row.notes,
    name: row.name,
    email: row.email,
    phone: row.phone,
    created_by: row.createdBy,
    created_at: toIso(row.createdAt),
    updated_at: toIso(row.updatedAt),
  };
}

export function mapProject(row: typeof projects.$inferSelect): Project {
  return {
    id: row.id,
    client_id: row.clientId,
    lead_id: row.leadId,
    name: row.name,
    description: row.description,
    status: row.status,
    budget: toNumber(row.budget),
    started_at: toIsoOrNull(row.startedAt),
    completed_at: toIsoOrNull(row.completedAt),
    created_by: row.createdBy,
    created_at: toIso(row.createdAt),
    updated_at: toIso(row.updatedAt),
  };
}

export function mapProposal(row: typeof proposals.$inferSelect): Proposal {
  return {
    id: row.id,
    lead_id: row.leadId,
    client_id: row.clientId,
    title: row.title,
    value: toNumber(row.value) ?? 0,
    description: row.description,
    deadline: row.deadline,
    status: row.status as Proposal["status"],
    created_by: row.createdBy,
    created_at: toIso(row.createdAt),
    updated_at: toIso(row.updatedAt),
  };
}

export function mapEvent(row: typeof events.$inferSelect): CalendarEvent {
  return {
    id: row.id,
    title: row.title,
    type: row.type as CalendarEvent["type"],
    description: row.description,
    start_at: toIso(row.startAt),
    end_at: toIso(row.endAt),
    lead_id: row.leadId,
    client_id: row.clientId,
    google_calendar_id: row.googleCalendarId,
    created_by: row.createdBy,
    created_at: toIso(row.createdAt),
    updated_at: toIso(row.updatedAt),
  };
}

export function mapNotification(row: typeof notifications.$inferSelect): Notification {
  return {
    id: row.id,
    user_id: row.userId,
    type: row.type as Notification["type"],
    title: row.title,
    message: row.message,
    link: row.link,
    read: row.read,
    created_at: toIso(row.createdAt),
  };
}

export function mapProfile(row: typeof profiles.$inferSelect): Profile {
  return {
    id: row.id,
    full_name: row.fullName,
    avatar_url: row.avatarUrl,
    email: row.email,
    role: row.role as Profile["role"],
    preferences: (row.preferences ?? {}) as Record<string, unknown>,
    created_at: toIso(row.createdAt),
    updated_at: toIso(row.updatedAt),
  };
}

export function mapOrgSettings(row: typeof orgSettings.$inferSelect): OrgSettings {
  return {
    id: row.id,
    company_name: row.companyName,
    logo_url: row.logoUrl,
    whatsapp: row.whatsapp,
    contact_email: row.contactEmail,
    primary_color: row.primaryColor ?? "#2563eb",
    social_links: (row.socialLinks ?? {}) as Record<string, string>,
    resend_configured: row.resendConfigured,
    database_configured: row.databaseConfigured,
    calendly_url: row.calendlyUrl,
    updated_at: toIso(row.updatedAt),
  };
}
