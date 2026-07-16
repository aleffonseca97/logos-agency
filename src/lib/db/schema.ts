import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  email: text("email"),
  role: text("role").notNull().default("admin"),
  preferences: jsonb("preferences").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  projectType: text("project_type").notNull(),
  budget: text("budget").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("Novo"),
  source: text("source").notNull().default("website"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
  estimatedValue: numeric("estimated_value", { precision: 12, scale: 2 }),
  notes: text("notes"),
});

export const leadActivities = pgTable("lead_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  type: text("type").notNull().default("note"),
  content: text("content").notNull(),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
  company: text("company").notNull(),
  logoUrl: text("logo_url"),
  website: text("website"),
  segment: text("segment"),
  city: text("city"),
  country: text("country"),
  status: text("status").notNull().default("ativo"),
  clientSince: date("client_since"),
  featuredHome: boolean("featured_home").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  notes: text("notes"),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("Em andamento"),
  budget: numeric("budget", { precision: 12, scale: 2 }),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const proposals = pgTable("proposals", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  value: numeric("value", { precision: 12, scale: 2 }).notNull().default("0"),
  description: text("description"),
  deadline: date("deadline"),
  status: text("status").notNull().default("Rascunho"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  type: text("type").notNull().default("meeting"),
  description: text("description"),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }).notNull(),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
  googleCalendarId: text("google_calendar_id"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  link: text("link"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orgSettings = pgTable("org_settings", {
  id: integer("id").primaryKey().default(1),
  companyName: text("company_name").notNull().default("LOGOS Framework"),
  logoUrl: text("logo_url"),
  whatsapp: text("whatsapp"),
  contactEmail: text("contact_email"),
  primaryColor: text("primary_color").default("#2563eb"),
  socialLinks: jsonb("social_links").notNull().default({}),
  resendConfigured: boolean("resend_configured").notNull().default(false),
  databaseConfigured: boolean("database_configured").notNull().default(false),
  calendlyUrl: text("calendly_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.id] }),
}));
