import { pgTable, serial, varchar, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core"
import { properties } from "./property"
import { adminUsers } from "./admin-user"

export const propertyApprovalHistory = pgTable("property_approval_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => adminUsers.id),

  // Action details
  action: varchar("action", { length: 20 }).notNull(), // approve, reject, verify, unverify, flag
  previousStatus: varchar("previous_status", { length: 20 }),
  newStatus: varchar("new_status", { length: 20 }).notNull(),

  // Messages and notes
  message: text("message"), // Public message to property owner
  adminNotes: text("admin_notes"), // Private admin notes
  reason: text("reason"), // Reason for action

  // Metadata
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  isSystemAction: boolean("is_system_action").default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const propertyApprovalNotifications = pgTable("property_approval_notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(), // Property owner/agent
  adminId: uuid("admin_id").references(() => adminUsers.id),

  // Notification details
  type: varchar("type", { length: 30 }).notNull(), // approval, rejection, verification, etc.
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),

  // Status
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),

  // Metadata
  priority: varchar("priority", { length: 10 }).default("normal"), // low, normal, high, urgent
  category: varchar("category", { length: 30 }).default("property_approval"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
})
