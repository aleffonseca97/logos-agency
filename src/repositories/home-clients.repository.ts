import { and, asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { getDb, isDatabaseConfigured } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import type { HomeClient } from "@/types/home-client";

export const HOME_CLIENTS_CACHE_TAG = "public-home-clients";
const HOME_CLIENTS_REVALIDATE_SECONDS = 300;

async function queryHomeFeaturedClients(): Promise<HomeClient[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const db = getDb();
  const rows = await db
    .select({
      id: clients.id,
      company: clients.company,
      logoUrl: clients.logoUrl,
    })
    .from(clients)
    .where(and(eq(clients.status, "ativo"), eq(clients.featuredHome, true)))
    .orderBy(asc(clients.displayOrder));

  return rows.map((row) => ({
    id: row.id,
    company: row.company,
    logo_url: row.logoUrl,
  }));
}

/**
 * Clientes ativos com destaque na Home, ordenados por `display_order`.
 * Resultado em cache (5 min) para evitar consultas desnecessárias.
 */
export const findHomeFeaturedClients = unstable_cache(
  queryHomeFeaturedClients,
  [HOME_CLIENTS_CACHE_TAG],
  {
    revalidate: HOME_CLIENTS_REVALIDATE_SECONDS,
    tags: [HOME_CLIENTS_CACHE_TAG],
  },
);
