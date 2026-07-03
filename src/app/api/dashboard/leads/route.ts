import { NextResponse, type NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { findLeads } from "@/repositories/leads.repository";

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = request.nextUrl;

  try {
    const result = await findLeads({
      page: Number(searchParams.get("page") ?? 1),
      pageSize: Number(searchParams.get("pageSize") ?? 10),
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      sortBy: (searchParams.get("sortBy") as "created_at") ?? "created_at",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc",
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("[api/dashboard/leads]", e);
    return NextResponse.json(
      { error: "Erro ao carregar leads." },
      { status: 500 },
    );
  }
}
