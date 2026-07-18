import type { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { handleRouteError, jsonError, jsonOk } from "@/lib/api/http";
import { findLeads } from "@/repositories/leads.repository";
import { leadsQuerySchema } from "@/lib/validators/dashboard";
import type { Lead } from "@/types/lead";

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const parsed = leadsQuerySchema.safeParse({
    page: request.nextUrl.searchParams.get("page") ?? undefined,
    pageSize: request.nextUrl.searchParams.get("pageSize") ?? undefined,
    search: request.nextUrl.searchParams.get("search") ?? undefined,
    status: request.nextUrl.searchParams.get("status") ?? undefined,
    sortBy: request.nextUrl.searchParams.get("sortBy") ?? undefined,
    sortOrder: request.nextUrl.searchParams.get("sortOrder") ?? undefined,
  });

  if (!parsed.success) {
    return jsonError("Parâmetros inválidos.", 400);
  }

  try {
    const result = await findLeads({
      ...parsed.data,
      sortBy: parsed.data.sortBy as keyof Lead,
    });

    return jsonOk(result);
  } catch (e) {
    return handleRouteError("[api/dashboard/leads]", e, "Erro ao carregar leads.");
  }
}
