import { db } from "../src/config/database"
import { schemaSettings, seoImages, seoPages } from "../src/database/schema/index"


async function seedSeoData() {
    console.log("🌱 Starting SEO data seeding...")

    try {
        // Seed additional SEO pages
        const seoPageData = [
            {
                page: "Properties Listing",
                url: "/properties",
                title: "Properties for Sale and Rent - Real Estate Platform",
                description:
                    "Browse our extensive collection of properties for sale and rent. Find apartments, houses, condos, and commercial properties.",
                keywords: "properties for sale, properties for rent, real estate listings, apartments, houses",
                status: "active" as const,
                schemaType: "CollectionPage",
                schemaDescription: "Property listings page with search and filter functionality",
            },
            {
                page: "Property Details",
                url: "/property/[id]",
                title: "Property Details - Real Estate Platform",
                description:
                    "View detailed information about this property including photos, features, pricing, and neighborhood details.",
                keywords: "property details, real estate, property information, photos, features",
                status: "active" as const,
                schemaType: "ItemPage",
                schemaDescription: "Individual property details page",
            },
            {
                page: "About Us",
                url: "/about",
                title: "About Us - Real Estate Platform",
                description:
                    "Learn about our mission to help you find the perfect property. Meet our team of experienced real estate professionals.",
                keywords: "about us, real estate company, team, mission, experience",
                status: "active" as const,
                schemaType: "AboutPage",
                schemaDescription: "Company information and team details",
            },
            {
                page: "Contact",
                url: "/contact",
                title: "Contact Us - Real Estate Platform",
                description:
                    "Get in touch with our real estate experts. We're here to help you buy, sell, or rent your next property.",
                keywords: "contact us, real estate agents, help, support, get in touch",
                status: "active" as const,
                schemaType: "ContactPage",
                schemaDescription: "Contact information and inquiry form",
            },
            {
                page: "Blog",
                url: "/blog",
                title: "Real Estate Blog - Tips, News & Market Insights",
                description:
                    "Stay updated with the latest real estate news, market trends, buying tips, and property investment advice.",
                keywords: "real estate blog, property news, market trends, buying tips, investment advice",
                status: "active" as const,
                schemaType: "Blog",
                schemaDescription: "Real estate blog with articles and insights",
            },
            {
                page: "Search Results",
                url: "/search",
                title: "Property Search Results - Real Estate Platform",
                description:
                    "Search results for properties matching your criteria. Refine your search to find the perfect property.",
                keywords: "property search, search results, find properties, real estate search",
                status: "active" as const,
                schemaType: "SearchResultsPage",
                schemaDescription: "Property search results with filtering options",
            },
        ]

        console.log("📄 Inserting SEO pages...")
        for (const pageData of seoPageData) {
            try {
                await db.insert(seoPages).values(pageData).onConflictDoNothing()
                console.log(`✅ Added SEO page: ${pageData.page}`)
            } catch (error) {
                console.log(`⚠️  SEO page already exists: ${pageData.page}`)
            }
        }

        // Seed additional schema settings
        const schemaData = [
            {
                type: "breadcrumb",
                data: {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        {
                            "@type": "ListItem",
                            position: 1,
                            name: "Home",
                            item: "https://realestate-platform.com",
                        },
                    ],
                },
                isActive: true,
            },
            {
                type: "product",
                data: {
                    "@context": "https://schema.org",
                    "@type": "Product",
                    name: "Property Listing Service",
                    description: "Professional property listing and real estate services",
                    brand: {
                        "@type": "Brand",
                        name: "Real Estate Platform",
                    },
                    offers: {
                        "@type": "Offer",
                        availability: "https://schema.org/InStock",
                        priceCurrency: "USD",
                    },
                },
                isActive: true,
            },
            {
                type: "localbusiness",
                data: {
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    name: "Real Estate Platform",
                    image: "/images/business-logo.jpg",
                    telephone: "+1-555-123-4567",
                    address: {
                        "@type": "PostalAddress",
                        streetAddress: "123 Real Estate Ave",
                        addressLocality: "Property City",
                        addressRegion: "PC",
                        postalCode: "12345",
                        addressCountry: "US",
                    },
                    geo: {
                        "@type": "GeoCoordinates",
                        latitude: 40.7128,
                        longitude: -74.006,
                    },
                    openingHoursSpecification: {
                        "@type": "OpeningHoursSpecification",
                        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                        opens: "09:00",
                        closes: "18:00",
                    },
                },
                isActive: true,
            },
        ]

        console.log("🏗️  Inserting schema settings...")
        for (const schema of schemaData) {
            try {
                await db.insert(schemaSettings).values(schema)
                console.log(`✅ Added schema: ${schema.type}`)
            } catch (error) {
                console.log(`⚠️  Schema already exists: ${schema.type}`)
            }
        }

        // Seed sample SEO images
        const imageData = [
            {
                filename: "og-home.jpg",
                originalName: "home-og-image.jpg",
                mimeType: "image/jpeg",
                size: "1200x630",
                url: "/images/og-home.jpg",
                altText: "Real Estate Platform - Find Your Dream Property",
            },
            {
                filename: "og-properties.jpg",
                originalName: "properties-og-image.jpg",
                mimeType: "image/jpeg",
                size: "1200x630",
                url: "/images/og-properties.jpg",
                altText: "Browse Properties - Real Estate Platform",
            },
            {
                filename: "og-blog.jpg",
                originalName: "blog-og-image.jpg",
                mimeType: "image/jpeg",
                size: "1200x630",
                url: "/images/og-blog.jpg",
                altText: "Real Estate Blog - Tips and Market Insights",
            },
            {
                filename: "logo-schema.png",
                originalName: "company-logo.png",
                mimeType: "image/png",
                size: "400x400",
                url: "/images/logo-schema.png",
                altText: "Real Estate Platform Logo",
            },
        ]

        console.log("🖼️  Inserting SEO images...")
        for (const image of imageData) {
            try {
                await db.insert(seoImages).values(image)
                console.log(`✅ Added SEO image: ${image.filename}`)
            } catch (error) {
                console.log(`⚠️  SEO image already exists: ${image.filename}`)
            }
        }

        console.log("✅ SEO data seeding completed successfully!")
    } catch (error) {
        console.error("❌ Error seeding SEO data:", error)
        throw error
    }
}

// Run the seeding function
seedSeoData()
    .then(() => {
        console.log("🎉 SEO seeding process finished!")
        process.exit(0)
    })
    .catch((error) => {
        console.error("💥 SEO seeding failed:", error)
        process.exit(1)
    })
