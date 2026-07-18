import { requireAuth, requireRole } from "@/lib/auth";
import {
  handleRouteError,
  jsonError,
  jsonOk,
  parseJsonBody,
} from "@/lib/api/http";
import {
  findLeadActivities,
  findLeadById,
  updateLead,
  deleteLead,
} from "@/repositories/leads.repository";
import { leadUpdateSchema } from "@/lib/validators/dashboard";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await context.params;

  try {
    const [lead, activities] = await Promise.all([
      findLeadById(id),
      findLeadActivities(id),
    ]);

    if (!lead) {
      return jsonError("Lead não encontrado.", 404);
    }

    return jsonOk({ lead, activities });
  } catch (e) {
    return handleRouteError("[api/dashboard/leads/[id]]", e, "Erro ao carregar lead.");
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await context.params;

  const parsed = await parseJsonBody(request, leadUpdateSchema);
  if ("response" in parsed) return parsed.response;

  try {
    const lead = await updateLead(id, parsed.data);
    return jsonOk(lead);
  } catch (e) {
    return handleRouteError(
      "[api/dashboard/leads/[id] PATCH]",
      e,
      "Erro ao atualizar lead.",
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireRole("admin");
  if (error) return error;

  const { id } = await context.params;

  try {
    await deleteLead(id);
    return jsonOk({ success: true });
  } catch (e) {
    return handleRouteError(
      "[api/dashboard/leads/[id] DELETE]",
      e,
      "Erro ao excluir lead.",
    );
  }
}
