import { pgTable, uuid, integer, timestamp, boolean, text, index } from "drizzle-orm/pg-core"
import { platformUsers } from "./platform-user"
import { properties } from "./property"

// Saved properties table - User bookmarks/favorites
export const savedProperties = pgTable(
    "saved_properties",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: uuid("user_id")
            .notNull()
            .references(() => platformUsers.id, { onDelete: "cascade" }),
        propertyId: uuid("property_id")
            .notNull()
            .references(() => properties.id, { onDelete: "cascade" }),

        category: text("category").default("general"),
        notes: text("notes"),

        isActive: boolean("is_active").notNull().default(true),
        savedAt: timestamp("saved_at").notNull().defaultNow(),
        lastViewedAt: timestamp("last_viewed_at"),

        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
    },
    (table) => ({
        userIdIdx: index("saved_properties_user_id_idx").on(table.userId),
        propertyIdIdx: index("saved_properties_property_id_idx").on(table.propertyId),
        userPropertyIdx: index("saved_properties_user_property_idx").on(table.userId, table.propertyId),
        savedAtIdx: index("saved_properties_saved_at_idx").on(table.savedAt),
        categoryIdx: index("saved_properties_category_idx").on(table.category),
    }),
)

// Saved property collections
export const savedPropertyCollections = pgTable(
    "saved_property_collections",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: uuid("user_id")
            .notNull()
            .references(() => platformUsers.id, { onDelete: "cascade" }),

        name: text("name").notNull(),
        description: text("description"),
        color: text("color").default("#3B82F6"),
        icon: text("icon").default("bookmark"),

        isDefault: boolean("is_default").notNull().default(false),
        isPublic: boolean("is_public").notNull().default(false),
        sortOrder: integer("sort_order").default(0),

        propertyCount: integer("property_count").notNull().default(0),
        isActive: boolean("is_active").notNull().default(true),

        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
    },
    (table) => ({
        userIdIdx: index("saved_collections_user_id_idx").on(table.userId),
        nameIdx: index("saved_collections_name_idx").on(table.name),
        isPublicIdx: index("saved_collections_is_public_idx").on(table.isPublic),
    }),
)

// Collection-property junction table
export const savedPropertyCollectionItems = pgTable(
    "saved_property_collection_items",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        collectionId: uuid("collection_id")
            .notNull()
            .references(() => savedPropertyCollections.id, { onDelete: "cascade" }),
        savedPropertyId: uuid("saved_property_id")
            .notNull()
            .references(() => savedProperties.id, { onDelete: "cascade" }),

        sortOrder: integer("sort_order").default(0),
        addedAt: timestamp("added_at").notNull().defaultNow(),
    },
    (table) => ({
        collectionIdIdx: index("collection_items_collection_id_idx").on(table.collectionId),
        savedPropertyIdIdx: index("collection_items_saved_property_id_idx").on(table.savedPropertyId),
        collectionPropertyIdx: index("collection_items_collection_property_idx").on(
            table.collectionId,
            table.savedPropertyId,
        ),
    }),
)
