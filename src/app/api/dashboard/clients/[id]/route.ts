import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { invalidateHomeClientsCache } from "@/lib/cache/home-clients";
import {
  deleteClient,
  findClientById,
  updateClient,
} from "@/repositories/clients.repository";
import type { ClientInsert } from "@/types/client";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await context.params;

  try {
    const client = await findClientById(id);
    if (!client) {
      return NextResponse.json({ error: "Cliente não encontrado." }, { status: 404 });
    }
    return NextResponse.json(client);
  } catch (e) {
    console.error("[api/dashboard/clients/[id]]", e);
    return NextResponse.json({ error: "Erro ao carregar cliente." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await context.params;
  const body = (await request.json()) as Partial<ClientInsert>;

  if (body.company !== undefined && !String(body.company).trim()) {
    return NextResponse.json({ error: "Nome da empresa é obrigatório." }, { status: 400 });
  }

  const updates: Partial<ClientInsert> = {
    ...body,
    ...(body.company !== undefined && { company: String(body.company).trim() }),
    ...(body.status !== undefined && {
      status: body.status === "inativo" ? "inativo" : "ativo",
    }),
    ...(body.display_order !== undefined && {
      display_order: Number.isFinite(Number(body.display_order))
        ? Number(body.display_order)
        : 0,
    }),
    ...(body.featured_home !== undefined && {
      featured_home: Boolean(body.featured_home),
    }),
  };

  try {
    const client = await updateClient(id, updates);
    invalidateHomeClientsCache();
    return NextResponse.json(client);
  } catch (e) {
    console.error("[api/dashboard/clients/[id] PATCH]", e);
    return NextResponse.json({ error: "Erro ao atualizar cliente." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await context.params;

  try {
    await deleteClient(id);
    invalidateHomeClientsCache();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[api/dashboard/clients/[id] DELETE]", e);
    return NextResponse.json({ error: "Erro ao excluir cliente." }, { status: 500 });
  }
}
