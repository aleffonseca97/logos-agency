export const PROJECT_STATUSES = [
  "Em andamento",
  "Pausado",
  "Concluído",
  "Cancelado",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type Project = {
  id: string;
  client_id: string | null;
  lead_id: string | null;
  name: string;
  description: string | null;
  status: ProjectStatus;
  budget: number | null;
  started_at: string | null;
  completed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectInsert = Omit<Project, "id" | "created_at" | "updated_at">;
