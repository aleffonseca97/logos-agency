import { desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { mapOrgSettings, mapProfile, mapProject } from "@/lib/db/mappers";
import { orgSettings, profiles, projects } from "@/lib/db/schema";
import type { ProfileUpdate } from "@/types/profile";
import type { ProjectInsert } from "@/types/project";
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

export async function getProfile(userId: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  return row ? mapProfile(row) : null;
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const db = getDb();
  const [row] = await db
    .update(profiles)
    .set({
      ...(updates.full_name !== undefined && { fullName: updates.full_name }),
      ...(updates.avatar_url !== undefined && { avatarUrl: updates.avatar_url }),
      ...(updates.preferences !== undefined && { preferences: updates.preferences }),
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, userId))
    .returning();

  if (!row) throw new Error("Perfil não encontrado");
  return mapProfile(row);
}

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
