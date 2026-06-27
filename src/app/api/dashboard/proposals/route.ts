import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import {
  createProposal,
  duplicateProposal,
  findProposals,
  findProposalById,
} from "@/repositories/proposals.repository";

export async function GET() {
  const { supabase, error } = await requireAuth();
  if (error) return error;

  try {
    const proposals = await findProposals(supabase);
    return NextResponse.json(proposals);
  } catch (e) {
    return NextResponse.json({ error: "Erro ao carregar propostas." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { supabase, user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();

  try {
    if (body.duplicateId) {
      const original = await findProposalById(supabase, body.duplicateId);
      if (!original) {
        return NextResponse.json({ error: "Proposta não encontrada." }, { status: 404 });
      }
      const proposal = await duplicateProposal(supabase, original, user!.id);
      return NextResponse.json(proposal);
    }

    const proposal = await createProposal(supabase, {
      ...body,
      created_by: user!.id,
    });
    return NextResponse.json(proposal);
  } catch (e) {
    return NextResponse.json({ error: "Erro ao criar proposta." }, { status: 500 });
  }
}
