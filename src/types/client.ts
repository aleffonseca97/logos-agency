export type Client = {
  id: string;
  lead_id: string | null;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientInsert = Omit<Client, "id" | "created_at" | "updated_at">;
