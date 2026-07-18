import { ilike, or } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { clients, leads, projects, proposals } from "@/lib/db/schema";

export async function globalSearch(query: string) {
  const db = getDb();
  const term = `%${query}%`;

  const [leadRows, clientRows, projectRows, proposalRows] = await Promise.all([
    db
      .select({
        id: leads.id,
        name: leads.name,
        company: leads.company,
        email: leads.email,
        status: leads.status,
      })
      .from(leads)
      .where(
        or(
          ilike(leads.name, term),
          ilike(leads.company, term),
          ilike(leads.email, term),
        ),
      )
      .limit(5),
    db
      .select({
        id: clients.id,
        company: clients.company,
        city: clients.city,
        segment: clients.segment,
        status: clients.status,
      })
      .from(clients)
      .where(
        or(
          ilike(clients.company, term),
          ilike(clients.city, term),
          ilike(clients.segment, term),
          ilike(clients.website, term),
          ilike(clients.name, term),
          ilike(clients.email, term),
        ),
      )
      .limit(5),
    db
      .select({ id: projects.id, name: projects.name, status: projects.status })
      .from(projects)
      .where(ilike(projects.name, term))
      .limit(5),
    db
      .select({
        id: proposals.id,
        title: proposals.title,
        status: proposals.status,
        value: proposals.value,
      })
      .from(proposals)
      .where(ilike(proposals.title, term))
      .limit(5),
  ]);

  return {
    leads: leadRows,
    clients: clientRows,
    projects: projectRows,
    proposals: proposalRows.map((p) => ({
      ...p,
      value: Number(p.value),
    })),
  };
}
