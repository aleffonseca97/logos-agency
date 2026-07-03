import { desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { mapClient } from "@/lib/db/mappers";
import { clients } from "@/lib/db/schema";
import type { Client, ClientInsert } from "@/types/client";

export async function findClients() {
  const db = getDb();
  const rows = await db.select().from(clients).orderBy(desc(clients.createdAt));
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
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      notes: client.notes,
      createdBy: client.created_by,
    })
    .returning();

  return mapClient(row);
}

export async function convertLeadToClient(lead: ClientInsert): Promise<Client> {
  return createClientRecord(lead);
}

export async function updateClient(id: string, updates: Partial<ClientInsert>) {
  const db = getDb();
  const [row] = await db
    .update(clients)
    .set({
      ...(updates.lead_id !== undefined && { leadId: updates.lead_id }),
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.company !== undefined && { company: updates.company }),
      ...(updates.email !== undefined && { email: updates.email }),
      ...(updates.phone !== undefined && { phone: updates.phone }),
      ...(updates.notes !== undefined && { notes: updates.notes }),
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
