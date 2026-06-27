import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Client, ClientInsert } from "@/types/client";
import type { CalendarEvent, EventInsert } from "@/types/event";
import type { LeadActivity, LeadInsert, LeadRow } from "@/types/lead";
import type { Notification } from "@/types/notification";
import type { Profile } from "@/types/profile";
import type { Project, ProjectInsert } from "@/types/project";
import type { Proposal, ProposalInsert } from "@/types/proposal";
import type { OrgSettings } from "@/types/settings";

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: Partial<LeadInsert>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      lead_activities: {
        Row: LeadActivity;
        Insert: Omit<LeadActivity, "id" | "created_at">;
        Update: Partial<LeadActivity>;
        Relationships: [];
      };
      clients: {
        Row: Client;
        Insert: ClientInsert;
        Update: Partial<ClientInsert>;
        Relationships: [];
      };
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: Partial<ProjectInsert>;
        Relationships: [];
      };
      proposals: {
        Row: Proposal;
        Insert: ProposalInsert;
        Update: Partial<ProposalInsert>;
        Relationships: [];
      };
      events: {
        Row: CalendarEvent;
        Insert: EventInsert;
        Update: Partial<EventInsert>;
        Relationships: [];
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, "id" | "created_at">;
        Update: Partial<Notification>;
        Relationships: [];
      };
      org_settings: {
        Row: OrgSettings;
        Insert: OrgSettings;
        Update: Partial<OrgSettings>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let adminClient: SupabaseClient<Database> | null = null;

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return { url, serviceRoleKey };
}

/** Cliente admin (service role) — apenas server-side, bypassa RLS. */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (adminClient) return adminClient;

  const { url, serviceRoleKey } = getSupabaseEnv();

  adminClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
