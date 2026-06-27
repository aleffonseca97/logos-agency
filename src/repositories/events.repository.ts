import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/admin";
import type { EventInsert, CalendarEvent } from "@/types/event";

type Db = SupabaseClient<Database>;

export async function findEvents(
  supabase: Db,
  range?: { start: string; end: string },
) {
  let query = supabase.from("events").select("*").order("start_at");

  if (range) {
    query = query.gte("start_at", range.start).lte("start_at", range.end);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createEvent(supabase: Db, event: EventInsert) {
  const { data, error } = await supabase
    .from("events")
    .insert(event)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(
  supabase: Db,
  id: string,
  updates: Partial<EventInsert>,
) {
  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(supabase: Db, id: string) {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}

export async function findTodayEvents(supabase: Db): Promise<CalendarEvent[]> {
  const today = new Date();
  const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();
  return findEvents(supabase, { start, end });
}
