import { desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { mapProject } from "@/lib/db/mappers";
import { projects } from "@/lib/db/schema";
import type { ProjectInsert } from "@/types/project";

export async function findProjects() {
  const db = getDb();
  const rows = await db.select().from(projects).orderBy(desc(projects.createdAt));
  return rows.map(mapProject);
}

export async function createProject(project: ProjectInsert) {
  const db = getDb();
  const [row] = await db
    .insert(projects)
    .values({
      clientId: project.client_id,
      leadId: project.lead_id,
      name: project.name,
      description: project.description,
      status: project.status,
      budget: project.budget?.toString() ?? null,
      startedAt: project.started_at ? new Date(project.started_at) : null,
      completedAt: project.completed_at ? new Date(project.completed_at) : null,
      createdBy: project.created_by,
    })
    .returning();

  return mapProject(row);
}

export async function updateProject(id: string, updates: Partial<ProjectInsert>) {
  const db = getDb();
  const [row] = await db
    .update(projects)
    .set({
      ...(updates.client_id !== undefined && { clientId: updates.client_id }),
      ...(updates.lead_id !== undefined && { leadId: updates.lead_id }),
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.status !== undefined && { status: updates.status }),
      ...(updates.budget !== undefined && {
        budget: updates.budget?.toString() ?? null,
      }),
      ...(updates.started_at !== undefined && {
        startedAt: updates.started_at ? new Date(updates.started_at) : null,
      }),
      ...(updates.completed_at !== undefined && {
        completedAt: updates.completed_at ? new Date(updates.completed_at) : null,
      }),
      ...(updates.created_by !== undefined && { createdBy: updates.created_by }),
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning();

  if (!row) throw new Error("Projeto não encontrado");
  return mapProject(row);
}

export async function deleteProject(id: string) {
  const db = getDb();
  await db.delete(projects).where(eq(projects.id, id));
}
