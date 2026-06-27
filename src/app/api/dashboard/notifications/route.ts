import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import {
  countUnreadNotifications,
  findNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/repositories/notifications.repository";

export async function GET() {
  const { supabase, user, error } = await requireAuth();
  if (error) return error;

  try {
    const [notifications, unreadCount] = await Promise.all([
      findNotifications(supabase, user!.id),
      countUnreadNotifications(supabase, user!.id),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (e) {
    console.error("[api/dashboard/notifications]", e);
    return NextResponse.json({ error: "Erro ao carregar notificações." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { supabase, user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();

  try {
    if (body.markAll) {
      await markAllNotificationsRead(supabase, user!.id);
    } else if (body.id) {
      await markNotificationRead(supabase, body.id, user!.id);
    }

    const unreadCount = await countUnreadNotifications(supabase, user!.id);
    return NextResponse.json({ success: true, unreadCount });
  } catch (e) {
    console.error("[api/dashboard/notifications PATCH]", e);
    return NextResponse.json({ error: "Erro ao atualizar notificações." }, { status: 500 });
  }
}
