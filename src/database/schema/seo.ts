import { pgTable, serial, text, timestamp, boolean, json } from "drizzle-orm/pg-core"

export const globalSeoSettings = pgTable("global_seo_settings", {
    id: serial("id").primaryKey(),
    siteTitle: text("site_title").notNull(),
    metaDescription: text("meta_description"),
    keywords: text("keywords"),
    ogTitle: text("og_title"),
    ogDescription: text("og_description"),
    ogImage: text("og_image"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
})

export const seoPages = pgTable("seo_pages", {
    id: serial("id").primaryKey(),
    page: text("page").notNull(),
    url: text("url").notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    keywords: text("keywords"),
    image: text("image"),
    status: text("status").notNull().default("draft"), // active, inactive, draft
    schemaType: text("schema_type").default("WebPage"),
    schemaDescription: text("schema_description"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
})

export const schemaSettings = pgTable("schema_settings", {
    id: serial("id").primaryKey(),
    type: text("type").notNull(), // organization, product, article, etc.
    data: json("data").notNull(), // JSON object containing schema data
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
})

export const seoImages = pgTable("seo_images", {
    id: serial("id").primaryKey(),
    filename: text("filename").notNull(),
    originalName: text("original_name").notNull(),
    mimeType: text("mime_type").notNull(),
    size: text("size").notNull(),
    url: text("url").notNull(),
    altText: text("alt_text"),
    createdAt: timestamp("created_at").defaultNow(),
})

export type GlobalSeoSettings = typeof globalSeoSettings.$inferSelect
export type NewGlobalSeoSettings = typeof globalSeoSettings.$inferInsert
export type SeoPage = typeof seoPages.$inferSelect
export type NewSeoPage = typeof seoPages.$inferInsert
export type SchemaSettings = typeof schemaSettings.$inferSelect
export type NewSchemaSettings = typeof schemaSettings.$inferInsert
export type SeoImage = typeof seoImages.$inferSelect
export type NewSeoImage = typeof seoImages.$inferInsert
