export const PROPOSAL_STATUSES = [
  "Rascunho",
  "Enviada",
  "Aceita",
  "Recusada",
  "Expirada",
] as const;

export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];

export type Proposal = {
  id: string;
  lead_id: string | null;
  client_id: string | null;
  title: string;
  value: number;
  description: string | null;
  deadline: string | null;
  status: ProposalStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ProposalInsert = Omit<Proposal, "id" | "created_at" | "updated_at">;
