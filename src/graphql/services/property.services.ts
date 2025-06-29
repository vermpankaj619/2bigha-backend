import { eq, and, gte, lte, like, desc, asc, sql } from "drizzle-orm"
import { db } from "../../database/connection"
import { v4 as uuidv4 } from "uuid";
import { properties, propertyImages, propertySeo, propertyVerification } from "../../database/schema/index"
import { azureStorage, FileUpload } from "../../../src/utils/azure-storage";



interface PropertyImageData {
    imageUrl: string
    imageType?: string
    caption?: string
    altText?: string
    sortOrder?: number
    isMain?: boolean
    variants: Record<string, string>
}
type PolygonCoordinate = { lat: number; lng: number };
type RawPolygonInput = {
    boundaries: {
        type: "polygon";
        shapeId: number;
        coordinates: PolygonCoordinate[];
        area: number;
    }[];
    coordinates: PolygonCoordinate[];
    location: {
        name: string;
        address: string;
        placeId: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
};
export function parsePropertyPolygon(data: RawPolygonInput) {
    const { location, boundaries } = data;
    const boundaryData = boundaries[0];

    return {
        location: location,
        centerPoint: `SRID=4326;POINT(${location.coordinates.lng} ${location.coordinates.lat})`,
        boundary: `SRID=4326;${toWktPolygon(boundaryData.coordinates)}`,
        calculatedArea: boundaryData.area,
        geoJson: boundaryData,
    };
}


function toWktPolygon(coords: PolygonCoordinate[]): string {
    const lngLatPairs = coords.map(pt => `${pt.lng} ${pt.lat}`);
    // Close the polygon if not closed
    if (lngLatPairs[0] !== lngLatPairs[lngLatPairs.length - 1]) {
        lngLatPairs.push(lngLatPairs[0]);
    }
    return `POLYGON((${lngLatPairs.join(", ")}))`;
}


export class PropertyService {

    // Process and upload images
    static async processPropertyImages(images: FileUpload[], metadata: any[] = []): Promise<PropertyImageData[]> {
        if (!images || images.length === 0) {
            return []
        }

        console.log(`🖼️ Processing ${images.length} property images...`)

        try {
            // Upload images to Azure Storage
            const bulkUploadResult = await azureStorage.uploadBulkFiles(images, "properties")

            if (!bulkUploadResult.success) {
                throw new Error(`Image upload failed: ${bulkUploadResult.errors.join(", ")}`)
            }

            // Group results by original filename and create image data
            const imageDataArray: PropertyImageData[] = []
            const processedFiles = new Set<string>()

            console.log(bulkUploadResult, "sd")

            for (const result of bulkUploadResult.results) {

                if (!processedFiles.has(result.originalName)) {
                    processedFiles.add(result.originalName)

                    // Find metadata for this image
                    const imageIndex = images.findIndex((img) => img.file.filename === result.originalName)



                    const imageMetadata = metadata[imageIndex] || {}

                    // Get all variant URLs for this image
                    const variants = azureStorage.getAllVariantUrls(result.filename, "properties")


                    // Use the large variant as the main URL
                    const mainImageUrl = variants.large || variants.original

                    const imageData: PropertyImageData = {
                        imageUrl: mainImageUrl,
                        imageType: imageMetadata.imageType || "general",
                        caption: imageMetadata.caption || "",
                        altText: imageMetadata.altText || "",
                        sortOrder: imageMetadata.sortOrder || 0,
                        isMain: imageMetadata.isMain || false,
                        variants,
                    }

                    imageDataArray.push(imageData)
                }
            }

            console.log(`✅ Successfully processed ${imageDataArray.length} images`)
            return imageDataArray
        } catch (error) {
            console.error("❌ Failed to process property images:", error)
            throw new Error(`Image processing failed: ${error}`)
        }
    }
    // Get properties with filters and pagination
    static async getProperties() {
        // Fetch properties with all images grouped as an array per property


        const query = db
            .select({
                property: properties,
                seo: propertySeo,
                verification: propertyVerification,
                images: sql`
      COALESCE(json_agg(${propertyImages}.*) 
      FILTER (WHERE ${propertyImages}.id IS NOT NULL), '[]')
    `.as("images"),
            })
            .from(properties)
            .innerJoin(propertyVerification, eq(properties.id, propertyVerification.propertyId))
            .innerJoin(propertySeo, eq(properties.id, propertySeo.propertyId))
            .leftJoin(propertyImages, eq(properties.id, propertyImages.propertyId))
            .groupBy(
                properties.id,
                propertySeo.id,
                propertyVerification.id
            )
            .orderBy(desc(properties.createdAt))


        // Log images for each property in the result
        const results = await query;
        // for (const row of results) {
        //     console.log("Property ID:", row.property.id);
        //     console.log("Images:", row.images);
        // }
        return query
    }

    // Get single property by ID or UUID
    // static async getPropertyById(id: number) {
    //     const [property] = await db.select().from(properties).where(eq(properties.id, id))
    //     return property
    // }

    // static async getPropertyByUuid(uuid: string) {
    //     const [property] = await db.select().from(properties).where(eq(properties.uuid, uuid))
    //     return property
    // }

    // Get featured properties
    // static async getFeaturedProperties(limit = 6) {
    //     return await db
    //         .select()
    //         .from(properties)
    //         .where(and(eq(properties.isFeatured, true), eq(properties.status, "approved")))
    //         .limit(limit)
    //         .orderBy(desc(properties.createdAt))
    // }

    // // Spatial queries
    // static async getPropertiesInBounds(minLat: number, maxLat: number, minLng: number, maxLng: number, limit = 50) {
    //     return await db
    //         .select()
    //         .from(properties)
    //         .where(
    //             and(
    //                 sql`latitude BETWEEN ${minLat} AND ${maxLat}`,
    //                 sql`longitude BETWEEN ${minLng} AND ${maxLng}`,
    //                 eq(properties.status, "approved"),
    //             ),
    //         )
    //         .limit(limit)
    // }

    // static async getPropertiesNearPoint(lat: number, lng: number, radiusKm: number, limit = 20) {
    //     return await db
    //         .select()
    //         .from(properties)
    //         .where(
    //             and(
    //                 sql`ST_DWithin(
    //         location,
    //         ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
    //         ${radiusKm * 1000}
    //       )`,
    //                 eq(properties.status, "approved"),
    //             ),
    //         )
    //         .limit(limit)
    // }

    // Create property
    static async createProperty(propertyData: any, userID: string, status: "draft" | "published") {


        const propertyId = uuidv4();

        const images = propertyData.images

        const parse = await parsePropertyPolygon(propertyData?.map)




        let processedImages: PropertyImageData[] = []
        if (images && images.length > 0) {
            processedImages = await this.processPropertyImages(images)
        }



        await db.transaction(async (tx) => {
            await tx.insert(properties).values({
                id: propertyId,
                title: propertyData.seo.seoTitle,
                description: propertyData.seo.metaDescription,
                propertyType: propertyData.propertyDetailsSchema.propertyType.toUpperCase(),
                status: "PUBLISHED",
                price: parseFloat(propertyData.propertyDetailsSchema.totalPrice),
                area: parseFloat(propertyData.propertyDetailsSchema.area),
                areaUnit: propertyData.propertyDetailsSchema.areaUnit.toUpperCase(),
                khasraNumber: propertyData.propertyDetailsSchema.khasraNumber,
                murabbaNumber: propertyData.propertyDetailsSchema.murabbaNumber,
                khewatNumber: propertyData.propertyDetailsSchema.khewatNumber,
                address: propertyData.location.address,
                city: propertyData.location.city,
                district: propertyData.location.district,
                state: propertyData.location.state,
                pinCode: propertyData.location.pincode,
                ...parse,
                ownerName: propertyData.contactDetails.ownerName,
                ownerPhone: propertyData.contactDetails.phoneNumber,
                ownerWhatsapp: propertyData.contactDetails.whatsappNumber || null,
                isActive: true,
                publishedAt: new Date(),
                createdByType: "ADMIN",
                createdByAdminId: userID
            });

            await tx.insert(propertySeo).values({
                propertyId,
                slug: propertyData.seo.slug,
                seoTitle: propertyData.seo.seoTitle,
                seoDescription: propertyData.seo.metaDescription,
                seoKeywords: propertyData.seo.keywords,
            });
            if (processedImages.length > 0) {
                const imageInserts = processedImages.map((img, index) => ({
                    propertyId,
                    imageUrl: img.imageUrl,
                    imageType: img.imageType || "general",
                    caption: img.caption || "",
                    altText: img.altText || "",
                    sortOrder: img.sortOrder || index,
                    variants: img.variants,
                    isMain: img.isMain || index === 0, // First image is main by default
                }))

                await tx.insert(propertyImages).values(imageInserts)
            }


            await tx.insert(propertyVerification).values({
                propertyId,
                isVerified: true, // Assuming property is verified on creation
                verificationMessage: "Property approved and published",
                verificationNotes: null,
                verifiedBy: userID,
                verifiedAt: new Date(),
            });
        });

        // Fetch the inserted property, seo, and verification records
        const [property] = await db.select().from(properties).where(eq(properties.id, propertyId));
        const [seo] = await db.select().from(propertySeo).where(eq(propertySeo.propertyId, propertyId));
        const [verification] = await db.select().from(propertyVerification).where(eq(propertyVerification.propertyId, propertyId));
        const imagesResult = await db.select().from(propertyImages).where(eq(propertyImages.propertyId, propertyId));
        const result = {
            ...property,
            seo,
            verification,
            images: imagesResult
        };




        return result;


    }


}
