export const CLIENT_STATUS = {
  ATIVO: "ativo",
  INATIVO: "inativo",
} as const;

export type ClientStatus = (typeof CLIENT_STATUS)[keyof typeof CLIENT_STATUS];

export type Client = {
  id: string;
  lead_id: string | null;
  company: string;
  logo_url: string | null;
  website: string | null;
  segment: string | null;
  city: string | null;
  country: string | null;
  status: ClientStatus;
  client_since: string | null;
  featured_home: boolean;
  display_order: number;
  notes: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientInsert = Omit<Client, "id" | "created_at" | "updated_at">;
