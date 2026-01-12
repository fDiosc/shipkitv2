import { pgTable, uuid, varchar, jsonb, timestamp, integer, boolean, text, date, real, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ═══════════════════════════════════════════════════════════
// PROFILES (Synced with Clerk via Webhooks)
// ═══════════════════════════════════════════════════════════

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey(), // Clerk ID
  fullName: varchar("full_name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  // Note: subscriptionTier moved to workspaces, kept here for backwards compat
  subscriptionTier: varchar("subscription_tier", { length: 20 }).default("free"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 100 }),
  calComUsername: varchar("cal_com_username", { length: 255 }),
  storylaneId: varchar("storylane_id", { length: 255 }),
  aiGenerationsUsed: integer("ai_generations_used").default(0).notNull(),
  aiGenerationsResetAt: timestamp("ai_generations_reset_at").defaultNow().notNull(),
  onboardingStatus: jsonb("onboarding_status").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════
// WORKSPACES (Multi-tenancy layer)
// ═══════════════════════════════════════════════════════════

export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 63 }).unique().notNull(), // URL-friendly identifier

  // Billing & Limits
  plan: varchar("plan", { length: 20 }).default("free"), // 'free', 'pro', 'enterprise'
  stripeCustomerId: varchar("stripe_customer_id", { length: 100 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 100 }),

  // Settings
  logoUrl: text("logo_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Workspace Members (junction table: user <-> workspace)
export const workspaceMembers = pgTable("workspace_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  userId: varchar("user_id").references(() => profiles.id, { onDelete: 'cascade' }).notNull(),

  role: varchar("role", { length: 20 }).default("member").notNull(), // 'owner', 'admin', 'member', 'viewer'

  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Unique constraint: one user per workspace
  uniqUserWorkspace: unique().on(table.workspaceId, table.userId),
}));

// ═══════════════════════════════════════════════════════════
// LANDINGS (Updated to use workspaceId)
// ═══════════════════════════════════════════════════════════

export const landings = pgTable("landings", {
  id: uuid("id").defaultRandom().primaryKey(),

  // New: workspace-based ownership
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: 'cascade' }),
  createdById: varchar("created_by_id").references(() => profiles.id, { onDelete: 'set null' }),

  // Legacy: userId kept for migration compatibility (will be removed later)
  userId: varchar("user_id").references(() => profiles.id, { onDelete: 'cascade' }),

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

// ═══════════════════════════════════════════════════════════
// LEADS
// ═══════════════════════════════════════════════════════════

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  landingId: uuid("landing_id").references(() => landings.id, { onDelete: 'cascade' }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  metadata: jsonb("metadata"),

  contacted: boolean("contacted").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════
// ANALYTICS DAILY (Landings)
// ═══════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════
// PRODUCTSTORY: DEMOS
// ═══════════════════════════════════════════════════════════

export const demos = pgTable("demos", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  createdById: varchar("created_by_id").references(() => profiles.id, { onDelete: 'set null' }),

  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),

  status: varchar("status", { length: 20 }).default("draft"), // 'draft', 'published'
  publicId: varchar("public_id", { length: 21 }).unique().notNull(), // nanoid for public URLs

  // Settings
  showBranding: boolean("show_branding").default(true),
  password: varchar("password", { length: 255 }), // optional password protection
  allowedDomains: text("allowed_domains"), // comma-separated domains for embed

  thumbnailUrl: text("thumbnail_url"),

  // Published version tracking
  currentRevisionId: uuid("current_revision_id"), // Points to demoRevisions

  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════
// PRODUCTSTORY: DEMO SCREENS
// ═══════════════════════════════════════════════════════════

export const demoScreens = pgTable("demo_screens", {
  id: uuid("id").defaultRandom().primaryKey(),
  demoId: uuid("demo_id").references(() => demos.id, { onDelete: 'cascade' }).notNull(),

  order: integer("order").notNull(),
  imageUrl: text("image_url").notNull(),
  width: integer("width"),
  height: integer("height"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════
// PRODUCTSTORY: HOTSPOTS (Guide Edit Panel fields)
// ═══════════════════════════════════════════════════════════

export const demoHotspots = pgTable("demo_hotspots", {
  id: uuid("id").defaultRandom().primaryKey(),
  screenId: uuid("screen_id").references(() => demoScreens.id, { onDelete: 'cascade' }).notNull(),

  type: varchar("type", { length: 20 }).default("navigate"), // 'navigate', 'tooltip', 'modal'
  targetScreenId: uuid("target_screen_id").references(() => demoScreens.id, { onDelete: 'set null' }),

  // Bounding box (relative coordinates 0..1)
  x: real("x").notNull(),
  y: real("y").notNull(),
  w: real("w").notNull(),
  h: real("h").notNull(),

  // Basic content
  label: varchar("label", { length: 255 }),
  tooltipText: text("tooltip_text"),
  htmlContent: text("html_content"), // Rich text content

  // ═══ STYLE SECTION ═══
  backgroundColor: varchar("background_color", { length: 9 }).default("#7C3AED"),
  textColor: varchar("text_color", { length: 9 }).default("#FFFFFF"),
  hotspotColor: varchar("hotspot_color", { length: 9 }).default("#7C3AED"),
  fontFamily: varchar("font_family", { length: 50 }).default("Inter"),
  fontSize: varchar("font_size", { length: 10 }).default("md"), // sm, md, lg
  borderRadius: integer("border_radius").default(8),

  // ═══ HIGHLIGHT SECTION ═══
  backdropEnabled: boolean("backdrop_enabled").default(true),
  backdropOpacity: real("backdrop_opacity").default(0.6),
  backdropColor: varchar("backdrop_color", { length: 9 }).default("#000000"),
  spotlightEnabled: boolean("spotlight_enabled").default(false),
  spotlightColor: varchar("spotlight_color", { length: 9 }).default("#7C3AED"),
  spotlightPadding: integer("spotlight_padding").default(8),

  // ═══ CTAs SECTION ═══
  primaryCtaEnabled: boolean("primary_cta_enabled").default(true),
  primaryCtaText: varchar("primary_cta_text", { length: 100 }).default("Next"),
  primaryCtaAction: varchar("primary_cta_action", { length: 20 }).default("next"), // next, url, chapter
  primaryCtaUrl: text("primary_cta_url"),
  secondaryCtaEnabled: boolean("secondary_cta_enabled").default(false),
  secondaryCtaText: varchar("secondary_cta_text", { length: 100 }),
  secondaryCtaUrl: text("secondary_cta_url"),

  // ═══ POSITION SECTION ═══
  arrowPosition: varchar("arrow_position", { length: 20 }).default("top-left"),
  offsetX: real("offset_x").default(0),
  offsetY: real("offset_y").default(0),

  // ═══ CONFIG SECTION ═══
  showStepNumber: boolean("show_step_number").default(true),
  showPreviousButton: boolean("show_previous_button").default(false),
  hideOnMouseOut: boolean("hide_on_mouse_out").default(false),
  autoAdvanceEnabled: boolean("auto_advance_enabled").default(false),
  autoAdvanceDelay: integer("auto_advance_delay").default(5),

  // ═══ ORDERING ═══
  orderInScreen: integer("order_in_screen").default(0), // For multiple hotspots per screen

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════
// PRODUCTSTORY: GUIDED STEPS
// ═══════════════════════════════════════════════════════════

export const demoSteps = pgTable("demo_steps", {
  id: uuid("id").defaultRandom().primaryKey(),
  demoId: uuid("demo_id").references(() => demos.id, { onDelete: 'cascade' }).notNull(),

  order: integer("order").notNull(),
  screenId: uuid("screen_id").references(() => demoScreens.id, { onDelete: 'cascade' }).notNull(),
  hotspotId: uuid("hotspot_id").references(() => demoHotspots.id, { onDelete: 'set null' }),

  title: varchar("title", { length: 255 }),
  body: text("body"),
  placement: varchar("placement", { length: 20 }).default("bottom"), // top, right, bottom, left

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════
// PRODUCTSTORY: REVISIONS (published snapshots)
// ═══════════════════════════════════════════════════════════

export const demoRevisions = pgTable("demo_revisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  demoId: uuid("demo_id").references(() => demos.id, { onDelete: 'cascade' }).notNull(),

  revisionNumber: integer("revision_number").notNull(),
  content: jsonb("content").notNull(), // Complete snapshot: screens, hotspots, steps, settings

  publishedAt: timestamp("published_at").defaultNow().notNull(),
  publishedBy: varchar("published_by", { length: 36 }), // userId who published
});

// ═══════════════════════════════════════════════════════════
// PRODUCTSTORY: CHAPTERS (for grouping steps)
// ═══════════════════════════════════════════════════════════

export const demoChapters = pgTable("demo_chapters", {
  id: uuid("id").defaultRandom().primaryKey(),
  demoId: uuid("demo_id").references(() => demos.id, { onDelete: 'cascade' }).notNull(),

  name: varchar("name", { length: 255 }).notNull(),
  order: integer("order").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════
// PRODUCTSTORY: THEMES (reusable styling presets)
// ═══════════════════════════════════════════════════════════

export const demoThemes = pgTable("demo_themes", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),

  name: varchar("name", { length: 100 }).notNull(),
  isDefault: boolean("is_default").default(false),

  // Style presets (JSON)
  backgroundColor: varchar("background_color", { length: 9 }).default("#7C3AED"),
  textColor: varchar("text_color", { length: 9 }).default("#FFFFFF"),
  hotspotColor: varchar("hotspot_color", { length: 9 }).default("#7C3AED"),
  fontFamily: varchar("font_family", { length: 50 }).default("Inter"),
  borderRadius: integer("border_radius").default(8),
  backdropColor: varchar("backdrop_color", { length: 9 }).default("#000000"),
  backdropOpacity: real("backdrop_opacity").default(0.6),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════
// PRODUCTSTORY: LEAD FORMS
// ═══════════════════════════════════════════════════════════

export const demoLeadForms = pgTable("demo_lead_forms", {
  id: uuid("id").defaultRandom().primaryKey(),
  demoId: uuid("demo_id").references(() => demos.id, { onDelete: 'cascade' }).notNull().unique(),

  enabled: boolean("enabled").default(false),
  trigger: varchar("trigger", { length: 20 }).default("on_open"), // on_open, after_delay, after_step, on_exit
  triggerDelay: integer("trigger_delay"), // seconds if trigger is after_delay
  triggerStepIndex: integer("trigger_step_index"), // step index if trigger is after_step

  // Fields config as JSON
  fields: jsonb("fields").$type<Array<{
    id: string;
    type: 'email' | 'text' | 'select';
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
  }>>(),

  // Styling
  title: varchar("title", { length: 255 }).default("Get a personalized demo"),
  subtitle: text("subtitle"),
  buttonText: varchar("button_text", { length: 100 }).default("Continue"),
  backgroundColor: varchar("background_color", { length: 9 }),
  buttonColor: varchar("button_color", { length: 9 }),

  // Webhook integration
  webhookUrl: text("webhook_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════
// PRODUCTSTORY: ANALYTICS EVENTS
// ═══════════════════════════════════════════════════════════

export const demoAnalyticsEvents = pgTable("demo_analytics_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  demoId: uuid("demo_id").references(() => demos.id, { onDelete: 'cascade' }).notNull(),

  viewerId: varchar("viewer_id", { length: 64 }).notNull(), // cookie-based
  sessionId: varchar("session_id", { length: 64 }).notNull(),

  eventType: varchar("event_type", { length: 50 }).notNull(), // demo_view, screen_view, hotspot_click, step_next, step_back, demo_complete

  screenId: uuid("screen_id"),
  stepIndex: integer("step_index"),
  hotspotId: uuid("hotspot_id"),

  referrer: text("referrer"),
  userAgent: text("user_agent"),

  ts: timestamp("ts").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════
// PRODUCTSTORY: ANALYTICS DAILY AGGREGATES
// ═══════════════════════════════════════════════════════════

export const demoAnalyticsDaily = pgTable("demo_analytics_daily", {
  id: uuid("id").defaultRandom().primaryKey(),
  demoId: uuid("demo_id").references(() => demos.id, { onDelete: 'cascade' }).notNull(),
  date: date("date").notNull(),

  views: integer("views").default(0),
  uniqueViewers: integer("unique_viewers").default(0),
  completions: integer("completions").default(0),
  avgTimeSeconds: integer("avg_time_seconds").default(0),
});

// ═══════════════════════════════════════════════════════════
// RELATIONS
// ═══════════════════════════════════════════════════════════

// Profile relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  workspaceMemberships: many(workspaceMembers),
  createdLandings: many(landings, { relationName: 'createdBy' }),
  createdDemos: many(demos, { relationName: 'createdBy' }),
}));

// Workspace relations
export const workspacesRelations = relations(workspaces, ({ many }) => ({
  members: many(workspaceMembers),
  landings: many(landings),
  demos: many(demos),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, { fields: [workspaceMembers.workspaceId], references: [workspaces.id] }),
  user: one(profiles, { fields: [workspaceMembers.userId], references: [profiles.id] }),
}));

// Landing relations
export const landingsRelations = relations(landings, ({ one, many }) => ({
  workspace: one(workspaces, { fields: [landings.workspaceId], references: [workspaces.id] }),
  createdBy: one(profiles, { fields: [landings.createdById], references: [profiles.id], relationName: 'createdBy' }),
  leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  landing: one(landings, { fields: [leads.landingId], references: [landings.id] }),
}));

// Demo relations
export const demosRelations = relations(demos, ({ one, many }) => ({
  workspace: one(workspaces, { fields: [demos.workspaceId], references: [workspaces.id] }),
  createdBy: one(profiles, { fields: [demos.createdById], references: [profiles.id], relationName: 'createdBy' }),
  screens: many(demoScreens),
  steps: many(demoSteps),
  events: many(demoAnalyticsEvents),
  revisions: many(demoRevisions),
}));

export const demoScreensRelations = relations(demoScreens, ({ one, many }) => ({
  demo: one(demos, { fields: [demoScreens.demoId], references: [demos.id] }),
  hotspots: many(demoHotspots, { relationName: 'hotspotsOnScreen' }),
  hotspotsTargeting: many(demoHotspots, { relationName: 'hotspotsTargetingScreen' }),
  steps: many(demoSteps),
}));

export const demoHotspotsRelations = relations(demoHotspots, ({ one }) => ({
  screen: one(demoScreens, { fields: [demoHotspots.screenId], references: [demoScreens.id], relationName: 'hotspotsOnScreen' }),
  targetScreen: one(demoScreens, { fields: [demoHotspots.targetScreenId], references: [demoScreens.id], relationName: 'hotspotsTargetingScreen' }),
}));

export const demoStepsRelations = relations(demoSteps, ({ one }) => ({
  demo: one(demos, { fields: [demoSteps.demoId], references: [demos.id] }),
  screen: one(demoScreens, { fields: [demoSteps.screenId], references: [demoScreens.id] }),
  hotspot: one(demoHotspots, { fields: [demoSteps.hotspotId], references: [demoHotspots.id] }),
}));

export const demoRevisionsRelations = relations(demoRevisions, ({ one }) => ({
  demo: one(demos, { fields: [demoRevisions.demoId], references: [demos.id] }),
}));

export const demoAnalyticsEventsRelations = relations(demoAnalyticsEvents, ({ one }) => ({
  demo: one(demos, { fields: [demoAnalyticsEvents.demoId], references: [demos.id] }),
}));

export const demoAnalyticsDailyRelations = relations(demoAnalyticsDaily, ({ one }) => ({
  demo: one(demos, { fields: [demoAnalyticsDaily.demoId], references: [demos.id] }),
}));
