import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/admin";
import type { Client, ClientInsert } from "@/types/client";

type Db = SupabaseClient<Database>;

export async function findClients(supabase: Db) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function findClientById(supabase: Db, id: string) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createClient(supabase: Db, client: ClientInsert) {
  const { data, error } = await supabase
    .from("clients")
    .insert(client)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function convertLeadToClient(
  supabase: Db,
  lead: ClientInsert,
): Promise<Client> {
  return createClient(supabase, lead);
}

export async function updateClient(
  supabase: Db,
  id: string,
  updates: Partial<ClientInsert>,
) {
  const { data, error } = await supabase
    .from("clients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClient(supabase: Db, id: string) {
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw error;
}
