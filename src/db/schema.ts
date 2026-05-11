import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

function cuid() {
  return text("id")
    .$defaultFn(() => createId())
    .primaryKey();
}

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
};

// ─────────────────────────────────────────────────────────
// Auth.js / NextAuth tables
// ─────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: cuid(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("image"),
  hashedPassword: text("hashed_password"),
  ...timestamps,
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
);

// ─────────────────────────────────────────────────────────
// Application tables
// ─────────────────────────────────────────────────────────

export const cigaretteBrands = pgTable("cigarette_brands", {
  id: cuid(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  defaultPriceMinor: integer("default_price_minor").notNull(),
  currency: text("currency").notNull().default("BDT"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  ...timestamps,
});

export const smokeEntries = pgTable(
  "smoke_entries",
  {
    id: cuid(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    brandId: text("brand_id")
      .notNull()
      .references(() => cigaretteBrands.id),
    smokedAt: timestamp("smoked_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    priceMinor: integer("price_minor").notNull(),
    currency: text("currency").notNull().default("BDT"),
    note: text("note"),
    ...timestamps,
  },
  (t) => [
    index("smoke_user_time_idx").on(t.userId, t.smokedAt),
    index("smoke_user_brand_idx").on(t.userId, t.brandId),
  ]
);

export const packetPurchases = pgTable(
  "packet_purchases",
  {
    id: cuid(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    brandId: text("brand_id")
      .notNull()
      .references(() => cigaretteBrands.id),
    packetCount: integer("packet_count").notNull().default(1),
    costMinor: integer("cost_minor").notNull(),
    currency: text("currency").notNull().default("BDT"),
    purchasedAt: timestamp("purchased_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    ...timestamps,
  },
  (t) => [index("packet_user_time_idx").on(t.userId, t.purchasedAt)]
);

export const userSettings = pgTable("user_settings", {
  id: cuid(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  currency: text("currency").notNull().default("BDT"),
  dailyGoal: integer("daily_goal"),
  timezone: text("timezone").notNull().default("UTC"),
  reductionTargetPct: integer("reduction_target_pct"),
  ...timestamps,
});

// ─────────────────────────────────────────────────────────
// Relations
// ─────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  smokeEntries: many(smokeEntries),
  packetPurchases: many(packetPurchases),
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const cigaretteBrandsRelations = relations(
  cigaretteBrands,
  ({ many }) => ({
    smokeEntries: many(smokeEntries),
    packetPurchases: many(packetPurchases),
  })
);

export const smokeEntriesRelations = relations(smokeEntries, ({ one }) => ({
  user: one(users, { fields: [smokeEntries.userId], references: [users.id] }),
  brand: one(cigaretteBrands, {
    fields: [smokeEntries.brandId],
    references: [cigaretteBrands.id],
  }),
}));

export const packetPurchasesRelations = relations(
  packetPurchases,
  ({ one }) => ({
    user: one(users, {
      fields: [packetPurchases.userId],
      references: [users.id],
    }),
    brand: one(cigaretteBrands, {
      fields: [packetPurchases.brandId],
      references: [cigaretteBrands.id],
    }),
  })
);

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type CigaretteBrand = typeof cigaretteBrands.$inferSelect;
export type SmokeEntry = typeof smokeEntries.$inferSelect;
export type PacketPurchase = typeof packetPurchases.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;

export type NewSmokeEntry = typeof smokeEntries.$inferInsert;
export type NewPacketPurchase = typeof packetPurchases.$inferInsert;
export type NewUser = typeof users.$inferInsert;
