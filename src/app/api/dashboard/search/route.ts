import { NextResponse, type NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { globalSearch } from "@/repositories/dashboard.repository";

export async function GET(request: NextRequest) {
  const { supabase, error } = await requireAuth();
  if (error) return error;

  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ leads: [], clients: [], projects: [], proposals: [] });
  }

  try {
    const results = await globalSearch(supabase, q);
    return NextResponse.json(results);
  } catch (e) {
    console.error("[api/dashboard/search]", e);
    return NextResponse.json({ error: "Erro na busca." }, { status: 500 });
  }
}
