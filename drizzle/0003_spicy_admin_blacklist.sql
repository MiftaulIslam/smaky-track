ALTER TABLE "users" ADD COLUMN "is_blacklisted" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "blacklisted_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "blacklist_reason" text;
