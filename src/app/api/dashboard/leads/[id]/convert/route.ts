import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { convertLeadToClient } from "@/repositories/clients.repository";
import { findLeadById, updateLead } from "@/repositories/leads.repository";
import { LEAD_STATUS } from "@/types/lead";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { id } = await context.params;

  try {
    const lead = await findLeadById(id);
    if (!lead) {
      return NextResponse.json({ error: "Lead não encontrado." }, { status: 404 });
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

    return NextResponse.json(client);
  } catch (e) {
    console.error("[api/dashboard/leads/[id]/convert]", e);
    return NextResponse.json({ error: "Erro ao converter lead." }, { status: 500 });
  }
}
