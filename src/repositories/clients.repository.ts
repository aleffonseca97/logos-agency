import { asc, desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { mapClient } from "@/lib/db/mappers";
import { clients } from "@/lib/db/schema";
import type { Client, ClientInsert } from "@/types/client";

export async function findClients() {
  const db = getDb();
  const rows = await db
    .select()
    .from(clients)
    .orderBy(asc(clients.displayOrder), desc(clients.createdAt));
  return rows.map(mapClient);
}

export async function findClientById(id: string) {
  const db = getDb();
  const [row] = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return row ? mapClient(row) : null;
}

export async function createClientRecord(client: ClientInsert) {
  const db = getDb();
  const [row] = await db
    .insert(clients)
    .values({
      leadId: client.lead_id,
      company: client.company,
      logoUrl: client.logo_url,
      website: client.website,
      segment: client.segment,
      city: client.city,
      country: client.country,
      status: client.status,
      clientSince: client.client_since,
      featuredHome: client.featured_home,
      displayOrder: client.display_order,
      notes: client.notes,
      name: client.name,
      email: client.email,
      phone: client.phone,
      createdBy: client.created_by,
    })
    .returning();

  return mapClient(row);
}

export async function convertLeadToClient(lead: {
  lead_id: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  notes: string | null;
  created_by: string;
}): Promise<Client> {
  return createClientRecord({
    lead_id: lead.lead_id,
    company: lead.company,
    logo_url: null,
    website: null,
    segment: null,
    city: null,
    country: null,
    status: "ativo",
    client_since: new Date().toISOString().slice(0, 10),
    featured_home: false,
    display_order: 0,
    notes: lead.notes,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    created_by: lead.created_by,
  });
}

export async function updateClient(id: string, updates: Partial<ClientInsert>) {
  const db = getDb();
  const [row] = await db
    .update(clients)
    .set({
      ...(updates.lead_id !== undefined && { leadId: updates.lead_id }),
      ...(updates.company !== undefined && { company: updates.company }),
      ...(updates.logo_url !== undefined && { logoUrl: updates.logo_url }),
      ...(updates.website !== undefined && { website: updates.website }),
      ...(updates.segment !== undefined && { segment: updates.segment }),
      ...(updates.city !== undefined && { city: updates.city }),
      ...(updates.country !== undefined && { country: updates.country }),
      ...(updates.status !== undefined && { status: updates.status }),
      ...(updates.client_since !== undefined && { clientSince: updates.client_since }),
      ...(updates.featured_home !== undefined && { featuredHome: updates.featured_home }),
      ...(updates.display_order !== undefined && { displayOrder: updates.display_order }),
      ...(updates.notes !== undefined && { notes: updates.notes }),
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.email !== undefined && { email: updates.email }),
      ...(updates.phone !== undefined && { phone: updates.phone }),
      ...(updates.created_by !== undefined && { createdBy: updates.created_by }),
      updatedAt: new Date(),
    })
    .where(eq(clients.id, id))
    .returning();

  if (!row) throw new Error("Cliente não encontrado");
  return mapClient(row);
}

export async function deleteClient(id: string) {
  const db = getDb();
  await db.delete(clients).where(eq(clients.id, id));
}
