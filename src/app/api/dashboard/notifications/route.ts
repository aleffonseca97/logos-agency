import { requireAuth } from "@/lib/auth";
import {
  handleRouteError,
  jsonOk,
  parseJsonBody,
} from "@/lib/api/http";
import {
  countUnreadNotifications,
  findNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/repositories/notifications.repository";
import { notificationsPatchSchema } from "@/lib/validators/dashboard";

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const [notifications, unreadCount] = await Promise.all([
      findNotifications(user!.id),
      countUnreadNotifications(user!.id),
    ]);

    return jsonOk({ notifications, unreadCount });
  } catch (e) {
    return handleRouteError(
      "[api/dashboard/notifications]",
      e,
      "Erro ao carregar notificações.",
    );
  }
}

export async function PATCH(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const parsed = await parseJsonBody(request, notificationsPatchSchema);
  if ("response" in parsed) return parsed.response;

  try {
    if (parsed.data.markAll) {
      await markAllNotificationsRead(user!.id);
    } else if (parsed.data.id) {
      await markNotificationRead(parsed.data.id, user!.id);
    }

    const unreadCount = await countUnreadNotifications(user!.id);
    return jsonOk({ success: true, unreadCount });
  } catch (e) {
    return handleRouteError(
      "[api/dashboard/notifications PATCH]",
      e,
      "Erro ao atualizar notificações.",
    );
  }
}
