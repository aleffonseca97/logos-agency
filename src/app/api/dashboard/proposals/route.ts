import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import {
  createProposal,
  duplicateProposal,
  findProposals,
  findProposalById,
} from "@/repositories/proposals.repository";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const proposals = await findProposals();
    return NextResponse.json(proposals);
  } catch {
    return NextResponse.json({ error: "Erro ao carregar propostas." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();

  try {
    if (body.duplicateId) {
      const original = await findProposalById(body.duplicateId);
      if (!original) {
        return NextResponse.json({ error: "Proposta não encontrada." }, { status: 404 });
      }
      const proposal = await duplicateProposal(original, user!.id);
      return NextResponse.json(proposal);
    }

    const proposal = await createProposal({
      ...body,
      created_by: user!.id,
    });
    return NextResponse.json(proposal);
  } catch {
    return NextResponse.json({ error: "Erro ao criar proposta." }, { status: 500 });
  }
}
