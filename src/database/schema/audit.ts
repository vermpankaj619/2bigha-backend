import { pgTable, serial, text, timestamp, boolean, jsonb, uuid } from "drizzle-orm/pg-core"
import { adminUsers } from "./admin-user"
import { platformUsers } from "./platform-user"

// General audit logs table - can track both admin and platform user actions
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  // Separate fields for admin vs platform user actions
  adminUserId: uuid("admin_user_id").references(() => adminUsers.id, { onDelete: "set null" }),
  platformUserId: uuid("platform_user_id").references(() => platformUsers.id, { onDelete: "set null" }),
  action: text("action").notNull(), // create, update, delete, login, logout, etc.
  resourceType: text("resource_type").notNull(), // property, inquiry, user, etc.
  resourceId: uuid("resource_id"), // ID of the affected resource
  details: jsonb("details"), // Additional details about the action
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// OTP tokens table - for both admin and platform users
export const otpTokens = pgTable("otp_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  // Separate fields for admin vs platform user OTPs
  adminUserId: uuid("admin_user_id").references(() => adminUsers.id, { onDelete: "cascade" }),
  platformUserId: uuid("platform_user_id").references(() => platformUsers.id, { onDelete: "cascade" }),
  token: text("token").notNull(),
  type: text("type").notNull(), // email_verification, password_reset, two_factor, etc.
  isUsed: boolean("is_used").notNull().default(false),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Platform user session tokens table (separate from admin sessions)
export const platformUserSessions = pgTable("platform_user_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => platformUsers.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  refreshToken: text("refresh_token"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  isActive: boolean("is_active").notNull().default(true),
  expiresAt: timestamp("expires_at").notNull(),
  lastUsedAt: timestamp("last_used_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Audit relations
export const auditRelations = {
  auditLogs: {
    adminUser: {
      relation: "one",
      table: adminUsers,
      fields: [auditLogs.adminUserId],
      references: [adminUsers.id],
    },
    platformUser: {
      relation: "one",
      table: platformUsers,
      fields: [auditLogs.platformUserId],
      references: [platformUsers.id],
    },
  },
  otpTokens: {
    adminUser: {
      relation: "one",
      table: adminUsers,
      fields: [otpTokens.adminUserId],
      references: [adminUsers.id],
    },
    platformUser: {
      relation: "one",
      table: platformUsers,
      fields: [otpTokens.platformUserId],
      references: [platformUsers.id],
    },
  },
  platformUserSessions: {
    user: {
      relation: "one",
      table: platformUsers,
      fields: [platformUserSessions.userId],
      references: [platformUsers.id],
    },
  },
}
