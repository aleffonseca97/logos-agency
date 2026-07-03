import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import {
  countUnreadNotifications,
  findNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/repositories/notifications.repository";

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const [notifications, unreadCount] = await Promise.all([
      findNotifications(user!.id),
      countUnreadNotifications(user!.id),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (e) {
    console.error("[api/dashboard/notifications]", e);
    return NextResponse.json({ error: "Erro ao carregar notificações." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();

  try {
    if (body.markAll) {
      await markAllNotificationsRead(user!.id);
    } else if (body.id) {
      await markNotificationRead(body.id, user!.id);
    }

    const unreadCount = await countUnreadNotifications(user!.id);
    return NextResponse.json({ success: true, unreadCount });
  } catch (e) {
    console.error("[api/dashboard/notifications PATCH]", e);
    return NextResponse.json({ error: "Erro ao atualizar notificações." }, { status: 500 });
  }
}
