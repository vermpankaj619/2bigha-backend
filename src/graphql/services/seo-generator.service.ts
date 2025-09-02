
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

    static async generateUniqueSlug(baseText: string): Promise<string> {
        const baseSlug = this.generateSlug(baseText);
        let slug = baseSlug;
        let count = 1;

        while (await this.slugExists(slug)) {
            slug = `${baseSlug}-${count}`;
            count++;
        }

        return slug;
    }

    private static async slugExists(slug: string): Promise<boolean> {
        const existing = await db
            .select({ slug: propertySeo.slug })
            .from(propertySeo)
            .where(eq(propertySeo.slug, slug));

        return existing.length > 0;
    }

    static async generateSEOFields(
        propertyType: string,
        city?: string,
        district?: string
    ) {
        const title = `${propertyType} ${city ? `in ${city}` : ""}${district ? `, ${district}` : ""}`.trim();
        const slug = await this.generateUniqueSlug(title);

        return {
            title,
            slug,
            seoTitle: `${title} | 2bigha`,
            seoDescription: `${propertyType} property for sale in ${city}, ${district}. Contact directly on 2bigha.`,
            seoKeywords: [
                propertyType?.toLowerCase(),
                city?.toLowerCase(),
                district?.toLowerCase(),
                "property for sale",
                "2bigha",
            ]
                .filter(Boolean)
                .join(", "),
        };
    }
}
