export const EVENT_TYPES = ["meeting", "call", "follow-up"] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export type CalendarEvent = {
  id: string;
  title: string;
  type: EventType;
  description: string | null;
  start_at: string;
  end_at: string;
  lead_id: string | null;
  client_id: string | null;
  google_calendar_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type EventInsert = Omit<CalendarEvent, "id" | "created_at" | "updated_at">;

export type CalendarView = "month" | "week" | "day";
