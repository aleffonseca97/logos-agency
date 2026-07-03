import { and, asc, eq, gte, lte } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { mapEvent } from "@/lib/db/mappers";
import { events } from "@/lib/db/schema";
import type { CalendarEvent, EventInsert } from "@/types/event";

export async function findEvents(range?: { start: string; end: string }) {
  const db = getDb();
  const conditions = [];
  if (range) {
    conditions.push(gte(events.startAt, new Date(range.start)));
    conditions.push(lte(events.startAt, new Date(range.end)));
  }

  const rows = await db
    .select()
    .from(events)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(events.startAt));

  return rows.map(mapEvent);
}

export async function createEvent(event: EventInsert) {
  const db = getDb();
  const [row] = await db
    .insert(events)
    .values({
      title: event.title,
      type: event.type,
      description: event.description,
      startAt: new Date(event.start_at),
      endAt: new Date(event.end_at),
      leadId: event.lead_id,
      clientId: event.client_id,
      googleCalendarId: event.google_calendar_id,
      createdBy: event.created_by,
    })
    .returning();

  return mapEvent(row);
}

export async function updateEvent(id: string, updates: Partial<EventInsert>) {
  const db = getDb();
  const [row] = await db
    .update(events)
    .set({
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.type !== undefined && { type: updates.type }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.start_at !== undefined && { startAt: new Date(updates.start_at) }),
      ...(updates.end_at !== undefined && { endAt: new Date(updates.end_at) }),
      ...(updates.lead_id !== undefined && { leadId: updates.lead_id }),
      ...(updates.client_id !== undefined && { clientId: updates.client_id }),
      ...(updates.google_calendar_id !== undefined && {
        googleCalendarId: updates.google_calendar_id,
      }),
      ...(updates.created_by !== undefined && { createdBy: updates.created_by }),
      updatedAt: new Date(),
    })
    .where(eq(events.id, id))
    .returning();

  if (!row) throw new Error("Evento não encontrado");
  return mapEvent(row);
}

export async function deleteEvent(id: string) {
  const db = getDb();
  await db.delete(events).where(eq(events.id, id));
}

export async function findTodayEvents(): Promise<CalendarEvent[]> {
  const today = new Date();
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  return findEvents({ start: start.toISOString(), end: end.toISOString() });
}
