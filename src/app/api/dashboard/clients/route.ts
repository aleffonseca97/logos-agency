import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { invalidateHomeClientsCache } from "@/lib/cache/home-clients";
import { createClientRecord, findClients } from "@/repositories/clients.repository";
import type { ClientInsert } from "@/types/client";

function normalizeClientBody(body: Record<string, unknown>, createdBy?: string): ClientInsert {
  return {
    lead_id: (body.lead_id as string | null) ?? null,
    company: String(body.company ?? "").trim(),
    logo_url: (body.logo_url as string | null) ?? null,
    website: (body.website as string | null) || null,
    segment: (body.segment as string | null) || null,
    city: (body.city as string | null) || null,
    country: (body.country as string | null) || null,
    status: body.status === "inativo" ? "inativo" : "ativo",
    client_since: (body.client_since as string | null) || null,
    featured_home: Boolean(body.featured_home),
    display_order: Number.isFinite(Number(body.display_order))
      ? Number(body.display_order)
      : 0,
    notes: (body.notes as string | null) || null,
    name: (body.name as string | null) || null,
    email: (body.email as string | null) || null,
    phone: (body.phone as string | null) || null,
    created_by: createdBy ?? ((body.created_by as string | null) ?? null),
  };
}

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const clients = await findClients();
    return NextResponse.json(clients);
  } catch (e) {
    console.error("[api/dashboard/clients]", e);
    return NextResponse.json({ error: "Erro ao carregar clientes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const payload = normalizeClientBody(body, user!.id);

  if (!payload.company) {
    return NextResponse.json({ error: "Nome da empresa é obrigatório." }, { status: 400 });
  }

  try {
    const client = await createClientRecord(payload);
    invalidateHomeClientsCache();
    return NextResponse.json(client, { status: 201 });
  } catch (e) {
    console.error("[api/dashboard/clients POST]", e);
    return NextResponse.json({ error: "Erro ao criar cliente." }, { status: 500 });
  }
}
