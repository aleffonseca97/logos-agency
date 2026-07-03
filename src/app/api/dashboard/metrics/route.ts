import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { getDashboardMetrics } from "@/repositories/dashboard.repository";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const metrics = await getDashboardMetrics();
    return NextResponse.json(metrics);
  } catch (e) {
    console.error("[api/dashboard/metrics]", e);
    return NextResponse.json(
      { error: "Erro ao carregar métricas." },
      { status: 500 },
    );
  }
}
