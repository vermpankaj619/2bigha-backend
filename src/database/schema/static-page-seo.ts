import { pgEnum, pgTable, text, timestamp, boolean, jsonb, uuid, integer } from "drizzle-orm/pg-core"
import { adminUsers } from "./admin-user"

// Extended page type enum for different static pages
export const pageTypeEnum = pgEnum("page_types", [
    // Core pages
    "HOME",
    "ABOUT",
    "CONTACT",
    "SERVICES",

    // Legal pages
    "PRIVACY_POLICY",
    "TERMS_OF_SERVICE",
    "COOKIE_POLICY",
    "DISCLAIMER",
    "REFUND_POLICY",

    // Support pages
    "FAQ",
    "HELP",
    "SUPPORT",
    "DOCUMENTATION",
    "TUTORIALS",

    // Listing pages
    "BLOG_LISTING",
    "PROPERTY_LISTING",
    "AGENT_LISTING",
    "DEVELOPER_LISTING",

    // Business pages
    "PRICING",
    "PLANS",
    "CAREERS",
    "PRESS",
    "MEDIA_KIT",
    "INVESTORS",
    "PARTNERSHIPS",

    // Product pages
    "FEATURES",
    "HOW_IT_WORKS",
    "TESTIMONIALS",
    "CASE_STUDIES",
    "SUCCESS_STORIES",

    // Location pages
    "LOCATIONS",
    "CITY_GUIDE",
    "AREA_GUIDE",
    "MARKET_TRENDS",

    // Tools pages
    "EMI_CALCULATOR",
    "PROPERTY_VALUATION",
    "LOAN_CALCULATOR",
    "STAMP_DUTY_CALCULATOR",

    // News & Updates
    "NEWS",
    "UPDATES",
    "ANNOUNCEMENTS",
    "EVENTS",

    // System pages
    "SITEMAP",
    "ROBOTS",
    "404",
    "500",
    "MAINTENANCE",

    // User pages
    "LOGIN",
    "REGISTER",
    "FORGOT_PASSWORD",
    "EMAIL_VERIFICATION",

    // Agent pages
    "BECOME_AGENT",
    "AGENT_BENEFITS",
    "AGENT_TRAINING",

    // Developer pages
    "FOR_DEVELOPERS",
    "DEVELOPER_PORTAL",
    "API_DOCUMENTATION",

    // Other
    "COMING_SOON",
    "UNDER_CONSTRUCTION",
    "THANK_YOU",
    "CONFIRMATION",
])

// Static pages table
export const staticPages = pgTable("static_pages", {
    id: uuid("id").defaultRandom().primaryKey(),

    // Page identification
    pageType: pageTypeEnum("page_type").notNull().unique(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),

    // Content
    content: text("content"), // Main page content
    excerpt: text("excerpt"), // Short description

    // SEO fields
    seoTitle: text("seo_title").notNull(),
    metaDescription: text("meta_description").notNull(),
    metaKeywords: text("meta_keywords"),

    // Open Graph
    ogTitle: text("og_title"),
    ogDescription: text("og_description"),
    ogImage: text("og_image"),
    ogType: text("og_type").default("website"),

    // Twitter Card
    twitterCard: text("twitter_card").default("summary_large_image"),
    twitterTitle: text("twitter_title"),
    twitterDescription: text("twitter_description"),
    twitterImage: text("twitter_image"),

    // Schema.org structured data
    schemaMarkup: jsonb("schema_markup"),

    // Additional SEO settings
    canonicalUrl: text("canonical_url"),
    robotsMeta: text("robots_meta").default("index, follow"),
    hreflangTags: jsonb("hreflang_tags"), // For multi-language support

    // Page settings
    isActive: boolean("is_active").notNull().default(true),
    isIndexable: boolean("is_indexable").notNull().default(true),
    priority: integer("priority").default(5), // 1-10 for sitemap priority
    changeFrequency: text("change_frequency").default("monthly"), // for sitemap

    // Analytics
    viewCount: integer("view_count").notNull().default(0),
    lastViewedAt: timestamp("last_viewed_at"),

    // Management
    createdBy: uuid("created_by").references(() => adminUsers.id),
    updatedBy: uuid("updated_by").references(() => adminUsers.id),
    publishedAt: timestamp("published_at"),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// SEO audit logs for tracking changes
export const seoAuditLogs = pgTable("seo_audit_logs", {
    id: uuid("id").defaultRandom().primaryKey(),
    pageId: uuid("page_id")
        .notNull()
        .references(() => staticPages.id, { onDelete: "cascade" }),
    adminId: uuid("admin_id")
        .notNull()
        .references(() => adminUsers.id),

    // Change tracking
    field: text("field").notNull(), // Which SEO field was changed
    oldValue: text("old_value"),
    newValue: text("new_value").notNull(),
    changeReason: text("change_reason"), // Why the change was made

    // SEO metrics before/after
    previousScore: integer("previous_score"), // SEO score before change
    newScore: integer("new_score"), // SEO score after change

    // Metadata
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
})

// SEO performance tracking
export const seoPerformance = pgTable("seo_performance", {
    id: uuid("id").defaultRandom().primaryKey(),
    pageId: uuid("page_id")
        .notNull()
        .references(() => staticPages.id, { onDelete: "cascade" }),

    // Date tracking
    date: timestamp("date").notNull(),

    // Search engine metrics
    googleRanking: integer("google_ranking"), // Average ranking position
    bingRanking: integer("bing_ranking"),
    impressions: integer("impressions").default(0),
    clicks: integer("clicks").default(0),
    ctr: integer("ctr").default(0), // Click-through rate (percentage * 100)

    // Page metrics
    pageViews: integer("page_views").default(0),
    uniqueVisitors: integer("unique_visitors").default(0),
    bounceRate: integer("bounce_rate").default(0), // Percentage * 100
    avgTimeOnPage: integer("avg_time_on_page").default(0), // Seconds

    // Technical SEO
    pageLoadTime: integer("page_load_time"), // Milliseconds
    mobileScore: integer("mobile_score"), // 1-100
    desktopScore: integer("desktop_score"), // 1-100

    createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Relations
export const staticPageRelations = {
    staticPages: {
        auditLogs: {
            relation: "many",
            table: seoAuditLogs,
            fields: [staticPages.id],
            references: [seoAuditLogs.pageId],
        },
        performance: {
            relation: "many",
            table: seoPerformance,
            fields: [staticPages.id],
            references: [seoPerformance.pageId],
        },
        createdBy: {
            relation: "one",
            table: adminUsers,
            fields: [staticPages.createdBy],
            references: [adminUsers.id],
        },
        updatedBy: {
            relation: "one",
            table: adminUsers,
            fields: [staticPages.updatedBy],
            references: [adminUsers.id],
        },
    },
    seoAuditLogs: {
        page: {
            relation: "one",
            table: staticPages,
            fields: [seoAuditLogs.pageId],
            references: [staticPages.id],
        },
        admin: {
            relation: "one",
            table: adminUsers,
            fields: [seoAuditLogs.adminId],
            references: [adminUsers.id],
        },
    },
    seoPerformance: {
        page: {
            relation: "one",
            table: staticPages,
            fields: [seoPerformance.pageId],
            references: [staticPages.id],
        },
    },
}
