import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/admin";
import type { NotificationType } from "@/types/notification";

type Db = SupabaseClient<Database>;

export async function findNotifications(supabase: Db, userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data ?? [];
}

export async function countUnreadNotifications(
  supabase: Db,
  userId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) return 0;
  return count ?? 0;
}

export async function markNotificationRead(
  supabase: Db,
  id: string,
  userId: string,
) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function markAllNotificationsRead(
  supabase: Db,
  userId: string,
) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) throw error;
}

export async function createNotification(
  supabase: Db,
  notification: {
    user_id: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
  },
) {
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      ...notification,
      link: notification.link ?? null,
      read: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function notifyAllAdmins(
  supabase: Db,
  notification: Omit<Parameters<typeof createNotification>[1], "user_id">,
) {
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin");

  if (!profiles?.length) return;

  await Promise.all(
    profiles.map((p) =>
      createNotification(supabase, { ...notification, user_id: p.id }),
    ),
  );
}
