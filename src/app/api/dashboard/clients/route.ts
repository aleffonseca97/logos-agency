import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { findClients, createClientRecord } from "@/repositories/clients.repository";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const clients = await findClients();
    return NextResponse.json(clients);
  } catch {
    return NextResponse.json({ error: "Erro ao carregar clientes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();

  try {
    const client = await createClientRecord({
      ...body,
      created_by: user!.id,
    });
    return NextResponse.json(client);
  } catch {
    return NextResponse.json({ error: "Erro ao criar cliente." }, { status: 500 });
  }
}
