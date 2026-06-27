import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import {
  findLeadActivities,
  findLeadById,
  updateLead,
  deleteLead,
} from "@/repositories/leads.repository";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { supabase, error } = await requireAuth();
  if (error) return error;

  const { id } = await context.params;

  try {
    const [lead, activities] = await Promise.all([
      findLeadById(supabase, id),
      findLeadActivities(supabase, id),
    ]);

    if (!lead) {
      return NextResponse.json({ error: "Lead não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ lead, activities });
  } catch (e) {
    console.error("[api/dashboard/leads/[id]]", e);
    return NextResponse.json({ error: "Erro ao carregar lead." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { supabase, error } = await requireAuth();
  if (error) return error;

  const { id } = await context.params;
  const body = await request.json();

  try {
    const lead = await updateLead(supabase, id, body);
    return NextResponse.json(lead);
  } catch (e) {
    console.error("[api/dashboard/leads/[id] PATCH]", e);
    return NextResponse.json({ error: "Erro ao atualizar lead." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { supabase, error } = await requireAuth();
  if (error) return error;

  const { id } = await context.params;

  try {
    await deleteLead(supabase, id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[api/dashboard/leads/[id] DELETE]", e);
    return NextResponse.json({ error: "Erro ao excluir lead." }, { status: 500 });
  }
}
