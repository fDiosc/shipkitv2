import { pgTable, uuid, varchar, jsonb, timestamp, integer, boolean, text, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Profiles (Synced with Clerk via Webhooks)
export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey(), // Clerk ID
  fullName: varchar("full_name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  subscriptionTier: varchar("subscription_tier", { length: 20 }).default("free"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 100 }),
  calComUsername: varchar("cal_com_username", { length: 255 }),
  aiGenerationsUsed: integer("ai_generations_used").default(0).notNull(),
  aiGenerationsResetAt: timestamp("ai_generations_reset_at").defaultNow().notNull(),
  onboardingStatus: jsonb("onboarding_status").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Landings
export const landings = pgTable("landings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id").references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  subdomain: varchar("subdomain", { length: 63 }).unique().notNull(),
  customDomain: varchar("custom_domain", { length: 255 }).unique(),

  designJson: jsonb("design_json").notNull(),
  templateId: varchar("template_id", { length: 50 }),
  integrations: jsonb("integrations").default({}),

  seoTitle: varchar("seo_title", { length: 60 }),
  seoDescription: varchar("seo_description", { length: 160 }),
  ogImageUrl: text("og_image_url"),

  status: varchar("status", { length: 20 }).default("draft"), // 'draft', 'published', 'archived'
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Leads
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  landingId: uuid("landing_id").references(() => landings.id, { onDelete: 'cascade' }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  metadata: jsonb("metadata"),

  contacted: boolean("contacted").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Analytics Daily
export const analyticsDaily = pgTable("analytics_daily", {
  id: uuid("id").defaultRandom().primaryKey(),
  landingId: uuid("landing_id").references(() => landings.id, { onDelete: 'cascade' }).notNull(),
  date: date("date").notNull(),
  pageViews: integer("page_views").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  leadsCount: integer("leads_count").default(0),
  revenueCents: integer("revenue_cents").default(0),
}, (table) => ({
  pk: [table.landingId, table.date],
}));

// Relations
export const landingsRelations = relations(landings, ({ many }) => ({
  leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  landing: one(landings, {
    fields: [leads.landingId],
    references: [landings.id],
  }),
}));
