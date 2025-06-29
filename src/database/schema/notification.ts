import { pgEnum, pgTable, serial, text, timestamp, boolean, jsonb, uuid } from "drizzle-orm/pg-core"
import { platformUsers } from "./platform-user"

// Notification enums
export const notificationTypeEnum = pgEnum("notification_types", [
  "PROPERTY_INQUIRY",
  "PROPERTY_APPROVED",
  "PROPERTY_REJECTED",
  "INQUIRY_RESPONSE",
  "SYSTEM_ALERT",
  "MARKETING",
])

export const notificationChannelEnum = pgEnum("notification_channels", ["EMAIL", "SMS", "PUSH", "IN_APP"])

// Notifications table - for platform users
export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => platformUsers.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  channel: notificationChannelEnum("channel").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: jsonb("data"), // Additional data for the notification
  isRead: boolean("is_read").notNull().default(false),
  isDelivered: boolean("is_delivered").notNull().default(false),
  deliveredAt: timestamp("delivered_at"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Notification preferences table - for platform users
export const notificationPreferences = pgTable("notification_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => platformUsers.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  emailEnabled: boolean("email_enabled").notNull().default(true),
  smsEnabled: boolean("sms_enabled").notNull().default(false),
  pushEnabled: boolean("push_enabled").notNull().default(true),
  inAppEnabled: boolean("in_app_enabled").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// Notification relations
export const notificationRelations = {
  notifications: {
    user: {
      relation: "one",
      table: platformUsers,
      fields: [notifications.userId],
      references: [platformUsers.id],
    },
  },
  notificationPreferences: {
    user: {
      relation: "one",
      table: platformUsers,
      fields: [notificationPreferences.userId],
      references: [platformUsers.id],
    },
  },
}
