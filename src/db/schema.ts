import { pgTable, text, integer, timestamp, boolean, pgEnum, index } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ─── Better Auth tables ────────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
})

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
)

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
)

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
)

// ─── App tables ────────────────────────────────────────────────────────────

export const collectionTypeEnum = pgEnum("collection_type", ["bin", "dumpster"])

export const locations = pgTable("locations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  address: text("address"),
  collectionType: collectionTypeEnum("collection_type").notNull(),
  createdById: text("created_by_id").notNull().references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const routes = pgTable("routes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  driverId: text("driver_id").notNull().references(() => user.id),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  notes: text("notes"),
})

export const routeStops = pgTable("route_stops", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  routeId: text("route_id").notNull().references(() => routes.id, { onDelete: "cascade" }),
  locationId: text("location_id").notNull().references(() => locations.id),
  fullnessPercent: integer("fullness_percent").notNull(),
  collectedAt: timestamp("collected_at").defaultNow().notNull(),
  vanCapacityAfter: integer("van_capacity_after").notNull(),
})

// ─── Relations ─────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  routes: many(routes),
  locations: many(locations),
}))

export const routesRelations = relations(routes, ({ one, many }) => ({
  driver: one(user, { fields: [routes.driverId], references: [user.id] }),
  stops: many(routeStops),
}))

export const routeStopsRelations = relations(routeStops, ({ one }) => ({
  route: one(routes, { fields: [routeStops.routeId], references: [routes.id] }),
  location: one(locations, { fields: [routeStops.locationId], references: [locations.id] }),
}))

export const locationsRelations = relations(locations, ({ one }) => ({
  createdBy: one(user, { fields: [locations.createdById], references: [user.id] }),
}))
