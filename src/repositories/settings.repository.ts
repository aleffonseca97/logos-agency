import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/admin";
import type { OrgSettings, OrgSettingsUpdate } from "@/types/settings";
import type { ProfileUpdate } from "@/types/profile";
import type { Project, ProjectInsert } from "@/types/project";

type Db = SupabaseClient<Database>;

export async function getOrgSettings(supabase: Db): Promise<OrgSettings | null> {
  const { data, error } = await supabase
    .from("org_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) return null;
  return data;
}

export async function updateOrgSettings(
  supabase: Db,
  updates: OrgSettingsUpdate,
) {
  const { data, error } = await supabase
    .from("org_settings")
    .update(updates)
    .eq("id", 1)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProfile(supabase: Db, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function updateProfile(
  supabase: Db,
  userId: string,
  updates: ProfileUpdate,
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function findProjects(supabase: Db): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createProject(supabase: Db, project: ProjectInsert) {
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(
  supabase: Db,
  id: string,
  updates: Partial<ProjectInsert>,
) {
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(supabase: Db, id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
