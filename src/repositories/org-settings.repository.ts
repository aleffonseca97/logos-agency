import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { mapOrgSettings } from "@/lib/db/mappers";
import { orgSettings } from "@/lib/db/schema";
import type { OrgSettingsUpdate } from "@/types/settings";

export async function getOrgSettings() {
  const db = getDb();
  const [row] = await db
    .select()
    .from(orgSettings)
    .where(eq(orgSettings.id, 1))
    .limit(1);

  return row ? mapOrgSettings(row) : null;
}

export async function updateOrgSettings(updates: OrgSettingsUpdate) {
  const db = getDb();
  const [row] = await db
    .update(orgSettings)
    .set({
      ...(updates.company_name !== undefined && { companyName: updates.company_name }),
      ...(updates.logo_url !== undefined && { logoUrl: updates.logo_url }),
      ...(updates.whatsapp !== undefined && { whatsapp: updates.whatsapp }),
      ...(updates.contact_email !== undefined && { contactEmail: updates.contact_email }),
      ...(updates.primary_color !== undefined && { primaryColor: updates.primary_color }),
      ...(updates.social_links !== undefined && { socialLinks: updates.social_links }),
      ...(updates.resend_configured !== undefined && {
        resendConfigured: updates.resend_configured,
      }),
      ...(updates.database_configured !== undefined && {
        databaseConfigured: updates.database_configured,
      }),
      ...(updates.calendly_url !== undefined && { calendlyUrl: updates.calendly_url }),
      updatedAt: new Date(),
    })
    .where(eq(orgSettings.id, 1))
    .returning();

  if (!row) throw new Error("Configurações não encontradas");
  return mapOrgSettings(row);
}
