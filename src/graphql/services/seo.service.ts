import { db } from "../../config/database"
import {
    globalSeoSettings,
    seoPages,
    schemaSettings,
    seoImages,
    type GlobalSeoSettings,
    type NewGlobalSeoSettings,
    type SeoPage,
    type NewSeoPage,
    type SchemaSettings,
    type NewSchemaSettings,
    type SeoImage,
    type NewSeoImage,
} from "../../database/schema/index"
import { eq, or } from "drizzle-orm"

export class SeoService {
    // Global SEO Settings
    async getGlobalSeoSettings(): Promise<GlobalSeoSettings | null> {
        try {
            const settings = await db.select().from(globalSeoSettings).limit(1)
            return settings[0] || null
        } catch (error) {
            console.error("Error fetching global SEO settings:", error)
            throw new Error("Failed to fetch global SEO settings")
        }
    }

    async updateGlobalSeoSettings(input: NewGlobalSeoSettings): Promise<GlobalSeoSettings> {
        try {
            // Check if settings exist
            const existing = await this.getGlobalSeoSettings()

            if (existing) {
                // Update existing settings
                const updated = await db
                    .update(globalSeoSettings)
                    .set({ ...input, updatedAt: new Date() })
                    .where(eq(globalSeoSettings.id, existing.id))
                    .returning()
                return updated[0]
            } else {
                // Create new settings
                const created = await db.insert(globalSeoSettings).values(input).returning()
                return created[0]
            }
        } catch (error) {
            console.error("Error updating global SEO settings:", error)
            throw new Error("Failed to update global SEO settings")
        }
    }

    // SEO Pages
    async getSeoPages(status?: string): Promise<SeoPage[]> {
        try {
            if (status) {
                return await db.select().from(seoPages).where(eq(seoPages.status, status)).orderBy(seoPages.createdAt)
            }
            return await db.select().from(seoPages).orderBy(seoPages.createdAt)
        } catch (error) {
            console.error("Error fetching SEO pages:", error)
            throw new Error("Failed to fetch SEO pages")
        }
    }

    async getSeoPageByUrl(url: string): Promise<SeoPage | null> {
        try {
            const pages = await db.select().from(seoPages).where(eq(seoPages.url, url)).limit(1)
            return pages[0] || null
        } catch (error) {
            console.error("Error fetching SEO page by URL:", error)
            throw new Error("Failed to fetch SEO page")
        }
    }

    async getSeoPageById(id: number): Promise<SeoPage | null> {
        try {
            const pages = await db.select().from(seoPages).where(eq(seoPages.id, id)).limit(1)
            return pages[0] || null
        } catch (error) {
            console.error("Error fetching SEO page by ID:", error)
            throw new Error("Failed to fetch SEO page")
        }
    }

    async getHomePageSeo(): Promise<SeoPage | null> {
        try {
            const pages = await db
                .select()
                .from(seoPages)
                .where(or(eq(seoPages.url, "/"), eq(seoPages.url, "/home")))
                .limit(1)
            console.log(pages)
            return pages[0] || null
        } catch (error) {
            console.error("Error fetching home page SEO:", error)
            throw new Error("Failed to fetch home page SEO")
        }
    }

    async createSeoPage(input: NewSeoPage): Promise<SeoPage> {
        try {
            const created = await db.insert(seoPages).values(input).returning()
            return created[0]
        } catch (error) {
            console.error("Error creating SEO page:", error)
            if (error instanceof Error && error.message.includes("unique")) {
                throw new Error("A page with this URL already exists")
            }
            throw new Error("Failed to create SEO page")
        }
    }

    async updateSeoPage(id: number, input: Partial<NewSeoPage>): Promise<SeoPage> {
        try {
            const updated = await db
                .update(seoPages)
                .set({ ...input, updatedAt: new Date() })
                .where(eq(seoPages.id, id))
                .returning()

            if (updated.length === 0) {
                throw new Error("SEO page not found")
            }

            return updated[0]
        } catch (error) {
            console.error("Error updating SEO page:", error)
            if (error instanceof Error && error.message.includes("unique")) {
                throw new Error("A page with this URL already exists")
            }
            throw new Error("Failed to update SEO page")
        }
    }

    async deleteSeoPage(id: number): Promise<boolean> {
        try {
            const deleted = await db.delete(seoPages).where(eq(seoPages.id, id)).returning()
            return deleted.length > 0
        } catch (error) {
            console.error("Error deleting SEO page:", error)
            throw new Error("Failed to delete SEO page")
        }
    }

    async publishSeoPage(id: number): Promise<SeoPage> {
        return this.updateSeoPage(id, { status: "active" })
    }

    async unpublishSeoPage(id: number): Promise<SeoPage> {
        return this.updateSeoPage(id, { status: "inactive" })
    }

    async enableSeoPage(id: number): Promise<SeoPage> {
        return this.updateSeoPage(id, { status: "active" })
    }

    async disableSeoPage(id: number): Promise<SeoPage> {
        return this.updateSeoPage(id, { status: "inactive" })
    }

    async setHomePageSeo(input: NewSeoPage): Promise<SeoPage> {
        try {
            // Check if home page SEO already exists
            const existing = await this.getHomePageSeo()

            if (existing) {
                // Update existing home page SEO
                return this.updateSeoPage(existing.id, input)
            } else {
                // Create new home page SEO with URL "/"
                const homePageInput = { ...input, url: "/", page: "Home Page" }
                return this.createSeoPage(homePageInput)
            }
        } catch (error) {
            console.error("Error setting home page SEO:", error)
            throw new Error("Failed to set home page SEO")
        }
    }

    async updateHomePageSeo(input: Partial<NewSeoPage>): Promise<SeoPage> {
        try {
            const existing = await this.getHomePageSeo()

            if (!existing) {
                throw new Error("Home page SEO not found. Please create it first.")
            }

            return this.updateSeoPage(existing.id, input)
        } catch (error) {
            console.error("Error updating home page SEO:", error)
            throw new Error("Failed to update home page SEO")
        }
    }

    // Schema Settings
    async getSchemaSettings(type?: string): Promise<SchemaSettings[]> {
        try {
            if (type) {
                return await db
                    .select()
                    .from(schemaSettings)
                    .where(eq(schemaSettings.type, type))
                    .orderBy(schemaSettings.createdAt)
            }
            return await db.select().from(schemaSettings).orderBy(schemaSettings.createdAt)
        } catch (error) {
            console.error("Error fetching schema settings:", error)
            throw new Error("Failed to fetch schema settings")
        }
    }

    async getActiveSchemaSettings(): Promise<SchemaSettings[]> {
        try {
            return await db
                .select()
                .from(schemaSettings)
                .where(eq(schemaSettings.isActive, true))
                .orderBy(schemaSettings.createdAt)
        } catch (error) {
            console.error("Error fetching active schema settings:", error)
            throw new Error("Failed to fetch active schema settings")
        }
    }

    async getSchemaSettingById(id: number): Promise<SchemaSettings | null> {
        try {
            const settings = await db.select().from(schemaSettings).where(eq(schemaSettings.id, id)).limit(1)
            return settings[0] || null
        } catch (error) {
            console.error("Error fetching schema setting by ID:", error)
            throw new Error("Failed to fetch schema setting")
        }
    }

    async createSchemaSettings(input: NewSchemaSettings): Promise<SchemaSettings> {
        try {
            const created = await db.insert(schemaSettings).values(input).returning()
            return created[0]
        } catch (error) {
            console.error("Error creating schema settings:", error)
            throw new Error("Failed to create schema settings")
        }
    }

    async updateSchemaSettings(id: number, input: Partial<NewSchemaSettings>): Promise<SchemaSettings> {
        try {
            const updated = await db
                .update(schemaSettings)
                .set({ ...input, updatedAt: new Date() })
                .where(eq(schemaSettings.id, id))
                .returning()

            if (updated.length === 0) {
                throw new Error("Schema settings not found")
            }

            return updated[0]
        } catch (error) {
            console.error("Error updating schema settings:", error)
            throw new Error("Failed to update schema settings")
        }
    }

    async deleteSchemaSettings(id: number): Promise<boolean> {
        try {
            const deleted = await db.delete(schemaSettings).where(eq(schemaSettings.id, id)).returning()
            return deleted.length > 0
        } catch (error) {
            console.error("Error deleting schema settings:", error)
            throw new Error("Failed to delete schema settings")
        }
    }

    async toggleSchemaSettings(id: number): Promise<SchemaSettings> {
        try {
            const current = await this.getSchemaSettingById(id)
            if (!current) {
                throw new Error("Schema settings not found")
            }

            return this.updateSchemaSettings(id, { isActive: !current.isActive })
        } catch (error) {
            console.error("Error toggling schema settings:", error)
            throw new Error("Failed to toggle schema settings")
        }
    }

    async enableSchemaSettings(id: number): Promise<SchemaSettings> {
        return this.updateSchemaSettings(id, { isActive: true })
    }

    async disableSchemaSettings(id: number): Promise<SchemaSettings> {
        return this.updateSchemaSettings(id, { isActive: false })
    }

    // SEO Images
    async getSeoImages(): Promise<SeoImage[]> {
        try {
            return await db.select().from(seoImages).orderBy(seoImages.createdAt)
        } catch (error) {
            console.error("Error fetching SEO images:", error)
            throw new Error("Failed to fetch SEO images")
        }
    }

    async getSeoImageById(id: number): Promise<SeoImage | null> {
        try {
            const images = await db.select().from(seoImages).where(eq(seoImages.id, id)).limit(1)
            return images[0] || null
        } catch (error) {
            console.error("Error fetching SEO image by ID:", error)
            throw new Error("Failed to fetch SEO image")
        }
    }

    async uploadSeoImage(input: NewSeoImage): Promise<SeoImage> {
        try {
            const created = await db.insert(seoImages).values(input).returning()
            return created[0]
        } catch (error) {
            console.error("Error uploading SEO image:", error)
            throw new Error("Failed to upload SEO image")
        }
    }

    async updateSeoImageAlt(id: number, altText: string): Promise<SeoImage> {
        try {
            const updated = await db.update(seoImages).set({ altText }).where(eq(seoImages.id, id)).returning()

            if (updated.length === 0) {
                throw new Error("SEO image not found")
            }

            return updated[0]
        } catch (error) {
            console.error("Error updating SEO image alt text:", error)
            throw new Error("Failed to update SEO image alt text")
        }
    }

    async deleteSeoImage(id: number): Promise<boolean> {
        try {
            const deleted = await db.delete(seoImages).where(eq(seoImages.id, id)).returning()
            return deleted.length > 0
        } catch (error) {
            console.error("Error deleting SEO image:", error)
            throw new Error("Failed to delete SEO image")
        }
    }
}

export const seoService = new SeoService()
