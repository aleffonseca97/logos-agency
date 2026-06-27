import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/admin";
import type { Proposal, ProposalInsert } from "@/types/proposal";

type Db = SupabaseClient<Database>;

export async function findProposals(supabase: Db) {
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function findProposalById(supabase: Db, id: string) {
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createProposal(supabase: Db, proposal: ProposalInsert) {
  const { data, error } = await supabase
    .from("proposals")
    .insert(proposal)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProposal(
  supabase: Db,
  id: string,
  updates: Partial<ProposalInsert>,
) {
  const { data, error } = await supabase
    .from("proposals")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function duplicateProposal(
  supabase: Db,
  proposal: Proposal,
  userId: string,
) {
  return createProposal(supabase, {
    lead_id: proposal.lead_id,
    client_id: proposal.client_id,
    title: `${proposal.title} (cópia)`,
    value: proposal.value,
    description: proposal.description,
    deadline: proposal.deadline,
    status: "Rascunho",
    created_by: userId,
  });
}

export async function deleteProposal(supabase: Db, id: string) {
  const { error } = await supabase.from("proposals").delete().eq("id", id);
  if (error) throw error;
}
