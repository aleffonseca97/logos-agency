import { requireAuth, requireRole } from "@/lib/auth";
import {
  handleRouteError,
  jsonError,
  jsonOk,
  parseJsonBody,
} from "@/lib/api/http";
import { invalidateHomeClientsCache } from "@/lib/cache/home-clients";
import {
  deleteClient,
  findClientById,
  updateClient,
} from "@/repositories/clients.repository";
import { clientUpdateSchema } from "@/lib/validators/dashboard";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await context.params;

  try {
    const client = await findClientById(id);
    if (!client) {
      return jsonError("Cliente não encontrado.", 404);
    }
    return jsonOk(client);
  } catch (e) {
    return handleRouteError("[api/dashboard/clients/[id]]", e, "Erro ao carregar cliente.");
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { error } = await requireRole("admin");
  if (error) return error;

  const { id } = await context.params;

  const parsed = await parseJsonBody(request, clientUpdateSchema);
  if ("response" in parsed) return parsed.response;

  try {
    const client = await updateClient(id, {
      ...parsed.data,
      ...(parsed.data.lead_id !== undefined && { lead_id: parsed.data.lead_id }),
      ...(parsed.data.logo_url !== undefined && { logo_url: parsed.data.logo_url }),
      ...(parsed.data.website !== undefined && { website: parsed.data.website }),
      ...(parsed.data.segment !== undefined && { segment: parsed.data.segment }),
      ...(parsed.data.city !== undefined && { city: parsed.data.city }),
      ...(parsed.data.country !== undefined && { country: parsed.data.country }),
      ...(parsed.data.client_since !== undefined && {
        client_since: parsed.data.client_since,
      }),
      ...(parsed.data.notes !== undefined && { notes: parsed.data.notes }),
      ...(parsed.data.name !== undefined && { name: parsed.data.name }),
      ...(parsed.data.email !== undefined && { email: parsed.data.email }),
      ...(parsed.data.phone !== undefined && { phone: parsed.data.phone }),
    });
    invalidateHomeClientsCache();
    return jsonOk(client);
  } catch (e) {
    return handleRouteError(
      "[api/dashboard/clients/[id] PATCH]",
      e,
      "Erro ao atualizar cliente.",
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireRole("admin");
  if (error) return error;

  const { id } = await context.params;

  try {
    await deleteClient(id);
    invalidateHomeClientsCache();
    return jsonOk({ success: true });
  } catch (e) {
    return handleRouteError(
      "[api/dashboard/clients/[id] DELETE]",
      e,
      "Erro ao excluir cliente.",
    );
  }
}
