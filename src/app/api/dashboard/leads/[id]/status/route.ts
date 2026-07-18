import { requireAuth } from "@/lib/auth";
import {
  handleRouteError,
  jsonOk,
  parseJsonBody,
} from "@/lib/api/http";
import { updateLeadsStatus } from "@/repositories/leads.repository";
import { leadStatusSchema } from "@/lib/validators/dashboard";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { id } = await context.params;

  const parsed = await parseJsonBody(request, leadStatusSchema);
  if ("response" in parsed) return parsed.response;

  try {
    const lead = await updateLeadsStatus(id, parsed.data.status, user!.id);
    return jsonOk(lead);
  } catch (e) {
    return handleRouteError(
      "[api/dashboard/leads/[id]/status]",
      e,
      "Erro ao atualizar status.",
    );
  }
}
