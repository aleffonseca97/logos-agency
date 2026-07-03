import { desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { mapProposal } from "@/lib/db/mappers";
import { proposals } from "@/lib/db/schema";
import type { Proposal, ProposalInsert } from "@/types/proposal";

export async function findProposals() {
  const db = getDb();
  const rows = await db.select().from(proposals).orderBy(desc(proposals.createdAt));
  return rows.map(mapProposal);
}

export async function findProposalById(id: string) {
  const db = getDb();
  const [row] = await db.select().from(proposals).where(eq(proposals.id, id)).limit(1);
  return row ? mapProposal(row) : null;
}

export async function createProposal(proposal: ProposalInsert) {
  const db = getDb();
  const [row] = await db
    .insert(proposals)
    .values({
      leadId: proposal.lead_id,
      clientId: proposal.client_id,
      title: proposal.title,
      value: proposal.value.toString(),
      description: proposal.description,
      deadline: proposal.deadline,
      status: proposal.status,
      createdBy: proposal.created_by,
    })
    .returning();

  return mapProposal(row);
}

export async function updateProposal(id: string, updates: Partial<ProposalInsert>) {
  const db = getDb();
  const [row] = await db
    .update(proposals)
    .set({
      ...(updates.lead_id !== undefined && { leadId: updates.lead_id }),
      ...(updates.client_id !== undefined && { clientId: updates.client_id }),
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.value !== undefined && { value: updates.value.toString() }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.deadline !== undefined && { deadline: updates.deadline }),
      ...(updates.status !== undefined && { status: updates.status }),
      ...(updates.created_by !== undefined && { createdBy: updates.created_by }),
      updatedAt: new Date(),
    })
    .where(eq(proposals.id, id))
    .returning();

  if (!row) throw new Error("Proposta não encontrada");
  return mapProposal(row);
}

export async function duplicateProposal(proposal: Proposal, userId: string) {
  return createProposal({
    lead_id: proposal.lead_id,
    client_id: proposal.client_id,
    title: `${proposal.title} (cópia)`,
    value: proposal.value,
    description: proposal.description,
    deadline: proposal.deadline,
    status: "Rascunho",
    created_by: userId,
  });
}

export async function deleteProposal(id: string) {
  const db = getDb();
  await db.delete(proposals).where(eq(proposals.id, id));
}
