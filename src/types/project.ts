export type Project = {
  id: string;
  client_id: string | null;
  lead_id: string | null;
  name: string;
  description: string | null;
  status: string;
  budget: number | null;
  started_at: string | null;
  completed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectInsert = Omit<Project, "id" | "created_at" | "updated_at">;
