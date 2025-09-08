
import { eq } from "drizzle-orm";
import { db } from "../../database/connection";
import { propertySeo } from "../../database/schema/index";

export class SeoGenerator {
    static generateSlug(text: string): string {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    }

    static async generateUniqueSlug(baseText: string,propertyId : string): Promise<string> {
        const baseSlug = this.generateSlug(baseText);
        return `${baseSlug}-${propertyId}`;
    }

    private static async slugExists(slug: string): Promise<boolean> {
        const existing = await db
            .select({ slug: propertySeo.slug })
            .from(propertySeo)
            .where(eq(propertySeo.slug, slug));

        return existing.length > 0;
    }

    static async generateSEOFields(
        propertyId : string,
        propertyType: string,
        city?: string,
        district?: string,
    ) {
        const title = `${propertyType} ${city ? `in ${city}` : ""}${district ? `, ${district}` : ""}`.trim();
        const slug = await this.generateUniqueSlug(title,propertyId);

        return {
            title,
            slug,
            seoTitle: `${title} | 2bhiga`,
            seoDescription: `${propertyType} property for sale in ${city}, ${district}. Contact directly on 2bhiga.`,
            seoKeywords: [
                propertyType?.toLowerCase(),
                city?.toLowerCase(),
                district?.toLowerCase(),
                "property for sale",
                "2bhiga",
            ]
                .filter(Boolean)
                .join(", "),
        };
    }
}
