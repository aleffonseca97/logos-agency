import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { createLeadActivity } from "@/repositories/leads.repository";
import { sanitizeText } from "@/lib/sanitize";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { supabase, user, error } = await requireAuth();
  if (error) return error;

  const { id } = await context.params;
  const { content, type = "note" } = await request.json();

  if (!content) {
    return NextResponse.json({ error: "Conteúdo obrigatório." }, { status: 400 });
  }

  try {
    const activity = await createLeadActivity(supabase, {
      lead_id: id,
      type,
      content: sanitizeText(content, 1000),
      created_by: user!.id,
    });

    return NextResponse.json(activity);
  } catch (e) {
    console.error("[api/dashboard/leads/[id]/activities]", e);
    return NextResponse.json({ error: "Erro ao criar atividade." }, { status: 500 });
  }
}
