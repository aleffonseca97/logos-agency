import { requireAuth } from "@/lib/auth";
import {
  handleRouteError,
  jsonCreated,
  parseJsonBody,
} from "@/lib/api/http";
import { createLeadActivity } from "@/repositories/leads.repository";
import { sanitizeText } from "@/lib/sanitize";
import { leadActivitySchema } from "@/lib/validators/dashboard";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { id } = await context.params;

  const parsed = await parseJsonBody(request, leadActivitySchema);
  if ("response" in parsed) return parsed.response;

  try {
    const activity = await createLeadActivity({
      lead_id: id,
      type: parsed.data.type,
      content: sanitizeText(parsed.data.content, 1000),
      created_by: user!.id,
    });

    return jsonCreated(activity);
  } catch (e) {
    return handleRouteError(
      "[api/dashboard/leads/[id]/activities]",
      e,
      "Erro ao criar atividade.",
    );
  }
}
