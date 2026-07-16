import { NextResponse } from "next/server";

import { findHomeFeaturedClients } from "@/repositories/home-clients.repository";

export const runtime = "nodejs";

const CACHE_CONTROL =
  "public, s-maxage=300, stale-while-revalidate=600, max-age=60";

export async function GET() {
  try {
    const clients = await findHomeFeaturedClients();

    return NextResponse.json(
      { clients },
      {
        status: 200,
        headers: {
          "Cache-Control": CACHE_CONTROL,
        },
      },
    );
  } catch (error) {
    console.error("[api/public/home/clients]", error);
    return NextResponse.json(
      { error: "Erro ao carregar clientes.", clients: [] },
      { status: 500 },
    );
  }
}
