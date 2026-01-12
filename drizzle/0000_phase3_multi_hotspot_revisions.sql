CREATE TABLE "analytics_daily" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"landing_id" uuid NOT NULL,
	"date" date NOT NULL,
	"page_views" integer DEFAULT 0,
	"unique_visitors" integer DEFAULT 0,
	"leads_count" integer DEFAULT 0,
	"revenue_cents" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "demo_analytics_daily" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"demo_id" uuid NOT NULL,
	"date" date NOT NULL,
	"views" integer DEFAULT 0,
	"unique_viewers" integer DEFAULT 0,
	"completions" integer DEFAULT 0,
	"avg_time_seconds" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "demo_analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"demo_id" uuid NOT NULL,
	"viewer_id" varchar(64) NOT NULL,
	"session_id" varchar(64) NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"screen_id" uuid,
	"step_index" integer,
	"hotspot_id" uuid,
	"referrer" text,
	"user_agent" text,
	"ts" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demo_chapters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"demo_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demo_hotspots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"screen_id" uuid NOT NULL,
	"type" varchar(20) DEFAULT 'navigate',
	"target_screen_id" uuid,
	"x" real NOT NULL,
	"y" real NOT NULL,
	"w" real NOT NULL,
	"h" real NOT NULL,
	"label" varchar(255),
	"tooltip_text" text,
	"html_content" text,
	"background_color" varchar(9) DEFAULT '#7C3AED',
	"text_color" varchar(9) DEFAULT '#FFFFFF',
	"hotspot_color" varchar(9) DEFAULT '#7C3AED',
	"font_family" varchar(50) DEFAULT 'Inter',
	"font_size" varchar(10) DEFAULT 'md',
	"border_radius" integer DEFAULT 8,
	"backdrop_enabled" boolean DEFAULT true,
	"backdrop_opacity" real DEFAULT 0.6,
	"backdrop_color" varchar(9) DEFAULT '#000000',
	"spotlight_enabled" boolean DEFAULT false,
	"spotlight_color" varchar(9) DEFAULT '#7C3AED',
	"spotlight_padding" integer DEFAULT 8,
	"primary_cta_enabled" boolean DEFAULT true,
	"primary_cta_text" varchar(100) DEFAULT 'Next',
	"primary_cta_action" varchar(20) DEFAULT 'next',
	"primary_cta_url" text,
	"secondary_cta_enabled" boolean DEFAULT false,
	"secondary_cta_text" varchar(100),
	"secondary_cta_url" text,
	"arrow_position" varchar(20) DEFAULT 'top-left',
	"offset_x" real DEFAULT 0,
	"offset_y" real DEFAULT 0,
	"show_step_number" boolean DEFAULT true,
	"show_previous_button" boolean DEFAULT false,
	"hide_on_mouse_out" boolean DEFAULT false,
	"auto_advance_enabled" boolean DEFAULT false,
	"auto_advance_delay" integer DEFAULT 5,
	"order_in_screen" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demo_lead_forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"demo_id" uuid NOT NULL,
	"enabled" boolean DEFAULT false,
	"trigger" varchar(20) DEFAULT 'on_open',
	"trigger_delay" integer,
	"trigger_step_index" integer,
	"fields" jsonb,
	"title" varchar(255) DEFAULT 'Get a personalized demo',
	"subtitle" text,
	"button_text" varchar(100) DEFAULT 'Continue',
	"background_color" varchar(9),
	"button_color" varchar(9),
	"webhook_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "demo_lead_forms_demo_id_unique" UNIQUE("demo_id")
);
--> statement-breakpoint
CREATE TABLE "demo_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"demo_id" uuid NOT NULL,
	"revision_number" integer NOT NULL,
	"content" jsonb NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"published_by" varchar(36)
);
--> statement-breakpoint
CREATE TABLE "demo_screens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"demo_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"image_url" text NOT NULL,
	"width" integer,
	"height" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demo_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"demo_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"screen_id" uuid NOT NULL,
	"hotspot_id" uuid,
	"title" varchar(255),
	"body" text,
	"placement" varchar(20) DEFAULT 'bottom',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demo_themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"is_default" boolean DEFAULT false,
	"background_color" varchar(9) DEFAULT '#7C3AED',
	"text_color" varchar(9) DEFAULT '#FFFFFF',
	"hotspot_color" varchar(9) DEFAULT '#7C3AED',
	"font_family" varchar(50) DEFAULT 'Inter',
	"border_radius" integer DEFAULT 8,
	"backdrop_color" varchar(9) DEFAULT '#000000',
	"backdrop_opacity" real DEFAULT 0.6,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"created_by_id" varchar,
	"name" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'draft',
	"public_id" varchar(21) NOT NULL,
	"show_branding" boolean DEFAULT true,
	"password" varchar(255),
	"allowed_domains" text,
	"thumbnail_url" text,
	"current_revision_id" uuid,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "demos_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "landings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid,
	"created_by_id" varchar,
	"user_id" varchar,
	"name" varchar(255) NOT NULL,
	"subdomain" varchar(63) NOT NULL,
	"custom_domain" varchar(255),
	"design_json" jsonb NOT NULL,
	"template_id" varchar(50),
	"integrations" jsonb DEFAULT '{}'::jsonb,
	"seo_title" varchar(60),
	"seo_description" varchar(160),
	"og_image_url" text,
	"status" varchar(20) DEFAULT 'draft',
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "landings_subdomain_unique" UNIQUE("subdomain"),
	CONSTRAINT "landings_custom_domain_unique" UNIQUE("custom_domain")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"landing_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"metadata" jsonb,
	"contacted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" varchar PRIMARY KEY NOT NULL,
	"full_name" varchar(255),
	"avatar_url" text,
	"subscription_tier" varchar(20) DEFAULT 'free',
	"stripe_customer_id" varchar(100),
	"cal_com_username" varchar(255),
	"storylane_id" varchar(255),
	"ai_generations_used" integer DEFAULT 0 NOT NULL,
	"ai_generations_reset_at" timestamp DEFAULT now() NOT NULL,
	"onboarding_status" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"user_id" varchar NOT NULL,
	"role" varchar(20) DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_members_workspace_id_user_id_unique" UNIQUE("workspace_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(63) NOT NULL,
	"plan" varchar(20) DEFAULT 'free',
	"stripe_customer_id" varchar(100),
	"stripe_subscription_id" varchar(100),
	"logo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "analytics_daily" ADD CONSTRAINT "analytics_daily_landing_id_landings_id_fk" FOREIGN KEY ("landing_id") REFERENCES "public"."landings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_analytics_daily" ADD CONSTRAINT "demo_analytics_daily_demo_id_demos_id_fk" FOREIGN KEY ("demo_id") REFERENCES "public"."demos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_analytics_events" ADD CONSTRAINT "demo_analytics_events_demo_id_demos_id_fk" FOREIGN KEY ("demo_id") REFERENCES "public"."demos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_chapters" ADD CONSTRAINT "demo_chapters_demo_id_demos_id_fk" FOREIGN KEY ("demo_id") REFERENCES "public"."demos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_hotspots" ADD CONSTRAINT "demo_hotspots_screen_id_demo_screens_id_fk" FOREIGN KEY ("screen_id") REFERENCES "public"."demo_screens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_hotspots" ADD CONSTRAINT "demo_hotspots_target_screen_id_demo_screens_id_fk" FOREIGN KEY ("target_screen_id") REFERENCES "public"."demo_screens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_lead_forms" ADD CONSTRAINT "demo_lead_forms_demo_id_demos_id_fk" FOREIGN KEY ("demo_id") REFERENCES "public"."demos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_revisions" ADD CONSTRAINT "demo_revisions_demo_id_demos_id_fk" FOREIGN KEY ("demo_id") REFERENCES "public"."demos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_screens" ADD CONSTRAINT "demo_screens_demo_id_demos_id_fk" FOREIGN KEY ("demo_id") REFERENCES "public"."demos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_steps" ADD CONSTRAINT "demo_steps_demo_id_demos_id_fk" FOREIGN KEY ("demo_id") REFERENCES "public"."demos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_steps" ADD CONSTRAINT "demo_steps_screen_id_demo_screens_id_fk" FOREIGN KEY ("screen_id") REFERENCES "public"."demo_screens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_steps" ADD CONSTRAINT "demo_steps_hotspot_id_demo_hotspots_id_fk" FOREIGN KEY ("hotspot_id") REFERENCES "public"."demo_hotspots"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_themes" ADD CONSTRAINT "demo_themes_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demos" ADD CONSTRAINT "demos_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demos" ADD CONSTRAINT "demos_created_by_id_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landings" ADD CONSTRAINT "landings_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landings" ADD CONSTRAINT "landings_created_by_id_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landings" ADD CONSTRAINT "landings_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_landing_id_landings_id_fk" FOREIGN KEY ("landing_id") REFERENCES "public"."landings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;