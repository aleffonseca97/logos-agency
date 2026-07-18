import { requireAuth } from "@/lib/auth";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { getDashboardMetrics } from "@/repositories/metrics.repository";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const metrics = await getDashboardMetrics();
    return jsonOk(metrics);
  } catch (e) {
    return handleRouteError(
      "[api/dashboard/metrics]",
      e,
      "Erro ao carregar métricas.",
    );
  }
}
