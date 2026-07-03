import { and, count, desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { mapNotification } from "@/lib/db/mappers";
import { notifications, profiles } from "@/lib/db/schema";
import type { NotificationType } from "@/types/notification";

export async function findNotifications(userId: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  return rows.map(mapNotification);
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  const db = getDb();
  const [row] = await db
    .select({ total: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));

  return row?.total ?? 0;
}

export async function markNotificationRead(id: string, userId: string) {
  const db = getDb();
  await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
}

export async function markAllNotificationsRead(userId: string) {
  const db = getDb();
  await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
}

export async function createNotification(notification: {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}) {
  const db = getDb();
  const [row] = await db
    .insert(notifications)
    .values({
      userId: notification.user_id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link: notification.link ?? null,
      read: false,
    })
    .returning();

  return mapNotification(row);
}

export async function notifyAllAdmins(
  notification: Omit<Parameters<typeof createNotification>[0], "user_id">,
) {
  const db = getDb();
  const adminProfiles = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.role, "admin"));

  if (!adminProfiles.length) return;

  await Promise.all(
    adminProfiles.map((p) =>
      createNotification({ ...notification, user_id: p.id }),
    ),
  );
}
