import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/admin";
import type {
  LeadActivity,
  LeadPipelineStatus,
  LeadRow,
  LeadsQueryParams,
  LeadWithAssignee,
  PaginatedLeads,
} from "@/types/lead";

type Db = SupabaseClient<Database>;

export async function findLeads(
  supabase: Db,
  params: LeadsQueryParams = {},
): Promise<PaginatedLeads> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const sortBy = params.sortBy ?? "created_at";
  const sortOrder = params.sortOrder ?? "desc";
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" });

  if (params.search) {
    const term = `%${params.search}%`;
    query = query.or(
      `name.ilike.${term},company.ilike.${term},email.ilike.${term},phone.ilike.${term}`,
    );
  }

  if (params.status) {
    query = query.eq("status", params.status as LeadPipelineStatus);
  }

  query = query.order(sortBy, { ascending: sortOrder === "asc" }).range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  const leads = (data ?? []) as LeadRow[];
  const assigneeIds = [
    ...new Set(leads.map((l) => l.assigned_to).filter(Boolean)),
  ] as string[];

  let assignees: Record<string, { full_name: string | null; email: string | null }> = {};

  if (assigneeIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", assigneeIds);

    if (profiles) {
      assignees = Object.fromEntries(
        profiles.map((p) => [p.id, { full_name: p.full_name, email: p.email }]),
      );
    }
  }

  const withAssignee: LeadWithAssignee[] = leads.map((lead) => ({
    ...lead,
    assignee: lead.assigned_to ? assignees[lead.assigned_to] ?? null : null,
  }));

  const total = count ?? 0;

  return {
    data: withAssignee,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  };
}

export async function findLeadById(
  supabase: Db,
  id: string,
): Promise<LeadRow | null> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function updateLead(
  supabase: Db,
  id: string,
  updates: Partial<Omit<LeadRow, "id" | "created_at">>,
) {
  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLead(supabase: Db, id: string) {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}

export async function findLeadActivities(
  supabase: Db,
  leadId: string,
): Promise<LeadActivity[]> {
  const { data, error } = await supabase
    .from("lead_activities")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createLeadActivity(
  supabase: Db,
  activity: Omit<LeadActivity, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("lead_activities")
    .insert(activity)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function findAllLeadsForExport(supabase: Db): Promise<LeadRow[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function updateLeadsStatus(
  supabase: Db,
  id: string,
  status: LeadPipelineStatus,
  userId?: string,
) {
  const lead = await updateLead(supabase, id, { status });

  if (userId) {
    await createLeadActivity(supabase, {
      lead_id: id,
      type: "status_change",
      content: `Status alterado para: ${status}`,
      created_by: userId,
    });
  }

  return lead;
}
