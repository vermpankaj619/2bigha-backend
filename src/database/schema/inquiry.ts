import { pgEnum, pgTable, serial, text, timestamp, boolean, jsonb, uuid, integer } from "drizzle-orm/pg-core"
import { platformUsers } from "./platform-user"
import { properties } from "./property"

// Inquiry enums
export const inquiryStatusEnum = pgEnum("inquiry_statuss", ["OPEN", "IN_PROGRESS", "CLOSED"])
export const inquiryPriorityEnum = pgEnum("is", ["LOW", "MEDIUM", "HIGH"])

// Property inquiries table
export const propertyInquiries = pgTable("property_inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  uuid: text("uuid").notNull().default("uuid_generate_v4()"),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  inquirerId: uuid("inquirer_id").references(() => platformUsers.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  status: inquiryStatusEnum("status").notNull().default("OPEN"),
  priority: inquiryPriorityEnum("priority").notNull().default("MEDIUM"),
  isRead: boolean("is_read").notNull().default(false),
  isStarred: boolean("is_starred").notNull().default(false),
  isFlagged: boolean("is_flagged").notNull().default(false),
  responseCount: integer("response_count").notNull().default(0),
  lastResponseAt: timestamp("last_response_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Inquiry responses table
export const inquiryResponses = pgTable("inquiry_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  inquiryId: uuid("inquiry_id")
    .notNull()
    .references(() => propertyInquiries.id, { onDelete: "cascade" }),
  responderId: uuid("responder_id")
    .notNull()
    .references(() => platformUsers.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  isInternal: boolean("is_internal").notNull().default(false),
  emailSent: boolean("email_sent").notNull().default(false),
  emailSentAt: timestamp("email_sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Inquiry relations
export const inquiryRelations = {
  propertyInquiries: {
    property: {
      relation: "one",
      table: properties,
      fields: [propertyInquiries.propertyId],
      references: [properties.id],
    },
    inquirer: {
      relation: "one",
      table: platformUsers,
      fields: [propertyInquiries.inquirerId],
      references: [platformUsers.id],
    },
    responses: {
      relation: "many",
      table: inquiryResponses,
      fields: [propertyInquiries.id],
      references: [inquiryResponses.inquiryId],
    },
  },
  inquiryResponses: {
    inquiry: {
      relation: "one",
      table: propertyInquiries,
      fields: [inquiryResponses.inquiryId],
      references: [propertyInquiries.id],
    },
    responder: {
      relation: "one",
      table: platformUsers,
      fields: [inquiryResponses.responderId],
      references: [platformUsers.id],
    },
  },
}
