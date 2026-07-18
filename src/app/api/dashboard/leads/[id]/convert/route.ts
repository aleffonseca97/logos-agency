import { requireRole } from "@/lib/auth";
import {
  handleRouteError,
  jsonCreated,
  jsonError,
} from "@/lib/api/http";
import { convertLeadToClient } from "@/repositories/clients.repository";
import { findLeadById, updateLead } from "@/repositories/leads.repository";
import { LEAD_STATUS } from "@/types/lead";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { user, error } = await requireRole("admin");
  if (error) return error;

  const { id } = await context.params;

  try {
    const lead = await findLeadById(id);
    if (!lead) {
      return jsonError("Lead não encontrado.", 404);
    }

    const client = await convertLeadToClient({
      lead_id: lead.id,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      notes: lead.notes,
      created_by: user!.id,
    });

    await updateLead(id, { status: LEAD_STATUS.FECHADO });

    return jsonCreated(client);
  } catch (e) {
    return handleRouteError(
      "[api/dashboard/leads/[id]/convert]",
      e,
      "Erro ao converter lead.",
    );
  }
}
