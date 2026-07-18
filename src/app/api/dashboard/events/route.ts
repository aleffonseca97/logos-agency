import { requireAuth, requireRole } from "@/lib/auth";
import {
  handleRouteError,
  jsonCreated,
  jsonOk,
  parseJsonBody,
} from "@/lib/api/http";
import { findEvents, createEvent } from "@/repositories/events.repository";
import { eventCreateSchema, eventsQuerySchema } from "@/lib/validators/dashboard";

export async function GET(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const query = eventsQuerySchema.safeParse({
    start: searchParams.get("start") ?? undefined,
    end: searchParams.get("end") ?? undefined,
  });

  if (!query.success) {
    return jsonOk([]);
  }

  const { start, end } = query.data;

  try {
    const events = await findEvents(start && end ? { start, end } : undefined);
    return jsonOk(events);
  } catch (e) {
    return handleRouteError("[api/dashboard/events]", e, "Erro ao carregar agenda.");
  }
}

export async function POST(request: Request) {
  const { user, error } = await requireRole("admin");
  if (error) return error;

  const parsed = await parseJsonBody(request, eventCreateSchema);
  if ("response" in parsed) return parsed.response;

  try {
    const event = await createEvent({
      title: parsed.data.title,
      type: parsed.data.type,
      description: parsed.data.description ?? null,
      start_at: parsed.data.start_at,
      end_at: parsed.data.end_at,
      lead_id: parsed.data.lead_id ?? null,
      client_id: parsed.data.client_id ?? null,
      google_calendar_id: parsed.data.google_calendar_id ?? null,
      created_by: user!.id,
    });
    return jsonCreated(event);
  } catch (e) {
    return handleRouteError("[api/dashboard/events POST]", e, "Erro ao criar evento.");
  }
}
