import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  or,
} from "drizzle-orm";

import { getDb } from "@/lib/db";
import { mapLead, mapLeadActivity } from "@/lib/db/mappers";
import { leadActivities, leads, profiles } from "@/lib/db/schema";
import type {
  LeadActivity,
  LeadPipelineStatus,
  LeadRow,
  LeadsQueryParams,
  LeadWithAssignee,
  PaginatedLeads,
} from "@/types/lead";

export async function findLeads(
  params: LeadsQueryParams = {},
): Promise<PaginatedLeads> {
  const db = getDb();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const sortBy = params.sortBy ?? "created_at";
  const sortOrder = params.sortOrder ?? "desc";
  const offset = (page - 1) * pageSize;

  const conditions = [];
  if (params.search) {
    const term = `%${params.search}%`;
    conditions.push(
      or(
        ilike(leads.name, term),
        ilike(leads.company, term),
        ilike(leads.email, term),
        ilike(leads.phone, term),
      ),
    );
  }
  if (params.status) {
    conditions.push(eq(leads.status, params.status));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderColumn =
    sortBy === "created_at"
      ? leads.createdAt
      : sortBy === "name"
        ? leads.name
        : sortBy === "status"
          ? leads.status
          : leads.createdAt;

  const orderFn = sortOrder === "asc" ? asc : desc;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(leads)
      .where(whereClause)
      .orderBy(orderFn(orderColumn))
      .limit(pageSize)
      .offset(offset),
    db.select({ total: count() }).from(leads).where(whereClause),
  ]);

  const mappedLeads = rows.map(mapLead);
  const assigneeIds = [
    ...new Set(mappedLeads.map((l) => l.assigned_to).filter(Boolean)),
  ] as string[];

  let assignees: Record<string, { full_name: string | null; email: string | null }> = {};

  if (assigneeIds.length > 0) {
    const profileRows = await db
      .select({ id: profiles.id, fullName: profiles.fullName, email: profiles.email })
      .from(profiles)
      .where(inArray(profiles.id, assigneeIds));

    assignees = Object.fromEntries(
      profileRows.map((p) => [
        p.id,
        { full_name: p.fullName, email: p.email },
      ]),
    );
  }

  const withAssignee: LeadWithAssignee[] = mappedLeads.map((lead) => ({
    ...lead,
    assignee: lead.assigned_to ? assignees[lead.assigned_to] ?? null : null,
  }));

  return {
    data: withAssignee,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  };
}

export async function findLeadById(id: string): Promise<LeadRow | null> {
  const db = getDb();
  const [row] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return row ? mapLead(row) : null;
}

export async function updateLead(
  id: string,
  updates: Partial<Omit<LeadRow, "id" | "created_at">>,
) {
  const db = getDb();
  const [row] = await db
    .update(leads)
    .set({
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.company !== undefined && { company: updates.company }),
      ...(updates.email !== undefined && { email: updates.email }),
      ...(updates.phone !== undefined && { phone: updates.phone }),
      ...(updates.project_type !== undefined && { projectType: updates.project_type }),
      ...(updates.budget !== undefined && { budget: updates.budget }),
      ...(updates.message !== undefined && { message: updates.message }),
      ...(updates.status !== undefined && { status: updates.status }),
      ...(updates.source !== undefined && { source: updates.source }),
      ...(updates.ip !== undefined && { ip: updates.ip }),
      ...(updates.user_agent !== undefined && { userAgent: updates.user_agent }),
      ...(updates.assigned_to !== undefined && { assignedTo: updates.assigned_to }),
      ...(updates.estimated_value !== undefined && {
        estimatedValue: updates.estimated_value?.toString() ?? null,
      }),
      ...(updates.notes !== undefined && { notes: updates.notes }),
      updatedAt: new Date(),
    })
    .where(eq(leads.id, id))
    .returning();

  if (!row) throw new Error("Lead não encontrado");
  return mapLead(row);
}

export async function deleteLead(id: string) {
  const db = getDb();
  await db.delete(leads).where(eq(leads.id, id));
}

export async function findLeadActivities(leadId: string): Promise<LeadActivity[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(leadActivities)
    .where(eq(leadActivities.leadId, leadId))
    .orderBy(desc(leadActivities.createdAt));

  return rows.map(mapLeadActivity);
}

export async function createLeadActivity(
  activity: Omit<LeadActivity, "id" | "created_at">,
) {
  const db = getDb();
  const [row] = await db
    .insert(leadActivities)
    .values({
      leadId: activity.lead_id,
      type: activity.type,
      content: activity.content,
      createdBy: activity.created_by,
    })
    .returning();

  return mapLeadActivity(row);
}

export async function findAllLeadsForExport(): Promise<LeadRow[]> {
  const db = getDb();
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
  return rows.map(mapLead);
}

export async function updateLeadsStatus(
  id: string,
  status: LeadPipelineStatus,
  userId?: string,
) {
  const lead = await updateLead(id, { status });

  if (userId) {
    await createLeadActivity({
      lead_id: id,
      type: "status_change",
      content: `Status alterado para: ${status}`,
      created_by: userId,
    });
  }

  return lead;
}

export async function insertLead(
  payload: {
    name: string;
    company: string;
    email: string;
    phone: string;
    projectType: string;
    budget: string;
    message: string;
    status: string;
    source: string;
    ip?: string | null;
    userAgent?: string | null;
  },
) {
  const db = getDb();
  const [row] = await db
    .insert(leads)
    .values({
      name: payload.name,
      company: payload.company,
      email: payload.email,
      phone: payload.phone,
      projectType: payload.projectType,
      budget: payload.budget,
      message: payload.message,
      status: payload.status,
      source: payload.source,
      ip: payload.ip ?? null,
      userAgent: payload.userAgent ?? null,
    })
    .returning();

  return mapLead(row);
}

export async function hasRecentLeadByEmail(email: string, since: Date): Promise<boolean> {
  const db = getDb();
  const [row] = await db
    .select({ id: leads.id })
    .from(leads)
    .where(and(eq(leads.email, email), gte(leads.createdAt, since)))
    .limit(1);

  return Boolean(row);
}
