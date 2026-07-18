import { jsonError, jsonOk } from "@/lib/api/http";
import { findHomeFeaturedClients } from "@/repositories/home-clients.repository";

export const runtime = "nodejs";

const CACHE_CONTROL =
  "public, s-maxage=300, stale-while-revalidate=600, max-age=60";

export async function GET() {
  try {
    const clients = await findHomeFeaturedClients();

    return jsonOk(
      { clients },
      {
        headers: {
          "Cache-Control": CACHE_CONTROL,
        },
      },
    );
  } catch (error) {
    console.error("[api/public/home/clients]", error);
    return jsonError("Erro ao carregar clientes.", 500, { clients: [] });
  }
}
