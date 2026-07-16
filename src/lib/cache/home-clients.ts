import { revalidateTag } from "next/cache";

import { HOME_CLIENTS_CACHE_TAG } from "@/repositories/home-clients.repository";

/** Invalida o cache da vitrine pública após mutações no CRM. */
export function invalidateHomeClientsCache() {
  revalidateTag(HOME_CLIENTS_CACHE_TAG, "max");
}
