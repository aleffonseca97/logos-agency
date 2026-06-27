export type OrgSettings = {
  id: number;
  company_name: string;
  logo_url: string | null;
  whatsapp: string | null;
  contact_email: string | null;
  primary_color: string;
  social_links: Record<string, string>;
  resend_configured: boolean;
  supabase_configured: boolean;
  calendly_url: string | null;
  updated_at: string;
};

export type OrgSettingsUpdate = Partial<
  Omit<OrgSettings, "id" | "updated_at">
>;
