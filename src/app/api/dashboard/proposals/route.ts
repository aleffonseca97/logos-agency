import { requireAuth, requireRole } from "@/lib/auth";
import {
  handleRouteError,
  jsonCreated,
  jsonError,
  jsonOk,
  parseJsonBody,
} from "@/lib/api/http";
import {
  createProposal,
  duplicateProposal,
  findProposals,
  findProposalById,
} from "@/repositories/proposals.repository";
import { proposalCreateSchema } from "@/lib/validators/dashboard";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const proposals = await findProposals();
    return jsonOk(proposals);
  } catch (e) {
    return handleRouteError("[api/dashboard/proposals]", e, "Erro ao carregar propostas.");
  }
}

export async function POST(request: Request) {
  const { user, error } = await requireRole("admin");
  if (error) return error;

  const parsed = await parseJsonBody(request, proposalCreateSchema);
  if ("response" in parsed) return parsed.response;

  try {
    if (parsed.data.duplicateId) {
      const original = await findProposalById(parsed.data.duplicateId);
      if (!original) {
        return jsonError("Proposta não encontrada.", 404);
      }
      const proposal = await duplicateProposal(original, user!.id);
      return jsonCreated(proposal);
    }

    if (!parsed.data.title) {
      return jsonError("Título é obrigatório.", 400);
    }

    const proposal = await createProposal({
      lead_id: parsed.data.lead_id ?? null,
      client_id: parsed.data.client_id ?? null,
      title: parsed.data.title,
      value: parsed.data.value ?? 0,
      description: parsed.data.description ?? null,
      deadline: parsed.data.deadline ?? null,
      status: parsed.data.status ?? "Rascunho",
      created_by: user!.id,
    });
    return jsonCreated(proposal);
  } catch (e) {
    return handleRouteError("[api/dashboard/proposals POST]", e, "Erro ao criar proposta.");
  }
}
