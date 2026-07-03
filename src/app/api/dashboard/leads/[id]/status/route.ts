import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { updateLeadsStatus } from "@/repositories/leads.repository";
import { LEAD_PIPELINE, type LeadPipelineStatus } from "@/types/lead";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { id } = await context.params;
  const { status } = await request.json();

  if (
    !status ||
    typeof status !== "string" ||
    !LEAD_PIPELINE.includes(status as LeadPipelineStatus)
  ) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }

  try {
    const lead = await updateLeadsStatus(
      id,
      status as LeadPipelineStatus,
      user!.id,
    );
    return NextResponse.json(lead);
  } catch (e) {
    console.error("[api/dashboard/leads/[id]/status]", e);
    return NextResponse.json({ error: "Erro ao atualizar status." }, { status: 500 });
  }
}
