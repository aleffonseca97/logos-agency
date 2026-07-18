import { requireAuth, requireRole } from "@/lib/auth";
import {
  handleRouteError,
  jsonCreated,
  jsonOk,
  parseJsonBody,
} from "@/lib/api/http";
import { invalidateHomeClientsCache } from "@/lib/cache/home-clients";
import { createClientRecord, findClients } from "@/repositories/clients.repository";
import { clientCreateSchema } from "@/lib/validators/dashboard";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const clients = await findClients();
    return jsonOk(clients);
  } catch (e) {
    return handleRouteError("[api/dashboard/clients]", e, "Erro ao carregar clientes.");
  }
}

export async function POST(request: Request) {
  const { user, error } = await requireRole("admin");
  if (error) return error;

  const parsed = await parseJsonBody(request, clientCreateSchema);
  if ("response" in parsed) return parsed.response;

  try {
    const client = await createClientRecord({
      ...parsed.data,
      lead_id: parsed.data.lead_id ?? null,
      logo_url: parsed.data.logo_url ?? null,
      website: parsed.data.website ?? null,
      segment: parsed.data.segment ?? null,
      city: parsed.data.city ?? null,
      country: parsed.data.country ?? null,
      client_since: parsed.data.client_since ?? null,
      notes: parsed.data.notes ?? null,
      name: parsed.data.name ?? null,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      created_by: user!.id,
    });
    invalidateHomeClientsCache();
    return jsonCreated(client);
  } catch (e) {
    return handleRouteError("[api/dashboard/clients POST]", e, "Erro ao criar cliente.");
  }
}
