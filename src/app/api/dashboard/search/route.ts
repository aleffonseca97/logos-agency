import type { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { globalSearch } from "@/repositories/search.repository";
import { searchQuerySchema } from "@/lib/validators/dashboard";

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const parsed = searchQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get("q") ?? "",
  });

  const q = parsed.success ? parsed.data.q.trim() : "";
  if (!q || q.length < 2) {
    return jsonOk({ leads: [], clients: [], projects: [], proposals: [] });
  }

  try {
    const results = await globalSearch(q);
    return jsonOk(results);
  } catch (e) {
    return handleRouteError("[api/dashboard/search]", e, "Erro na busca.");
  }
}
