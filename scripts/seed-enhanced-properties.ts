//@ts-nocheck
import { db, sql, testConnection } from "../src/database/connection"
import * as schema from "../src/database/schema/index"
import { randomUUID } from "crypto"

async function seedPropertiesWithApproval() {
    console.log("🌱 Seeding properties with approval system (UUID)...")

    try {
        // Test connection
        const connected = await testConnection()
        if (!connected) {
            throw new Error("Database connection failed")
        }

        // Clear existing data (be careful in production!)
        console.log("🧹 Clearing existing property data...")
        await db.delete(schema.propertyApprovalNotifications)
        await db.delete(schema.propertyApprovalHistory)
        await db.delete(schema.propertyPriceHistory)
        await db.delete(schema.propertyAmenityMappings)
        await db.delete(schema.propertyImages)
        await db.delete(schema.propertyViews)
        await db.delete(schema.properties)
        await db.delete(schema.propertyAmenities)

        // Get existing users and admins
        const platformUsers = await db.select().from(schema.platformUsers).limit(10)


        if (platformUsers.length === 0 || adminUsers.length === 0) {
            throw new Error("Please seed platform users and admin users first!")
        }

        // Seed property amenities first
        console.log("🏠 Seeding property amenities...")
        const amenities = await db
            .insert(schema.propertyAmenities)
            .values([
                // Security Amenities
                {
                    id: randomUUID(),
                    name: "24/7 Security",
                    category: "security",
                    icon: "shield",
                    description: "Round-the-clock security service",
                },
                {
                    id: randomUUID(),
                    name: "CCTV Surveillance",
                    category: "security",
                    icon: "camera",
                    description: "Comprehensive CCTV monitoring",
                },
                {
                    id: randomUUID(),
                    name: "Gated Community",
                    category: "security",
                    icon: "gate",
                    description: "Secure gated residential area",
                },
                {
                    id: randomUUID(),
                    name: "Security Guard",
                    category: "security",
                    icon: "guard",
                    description: "Professional security personnel",
                },

                // Recreation Amenities
                {
                    id: randomUUID(),
                    name: "Swimming Pool",
                    category: "recreation",
                    icon: "pool",
                    description: "Community swimming pool",
                },
                {
                    id: randomUUID(),
                    name: "Gymnasium",
                    category: "recreation",
                    icon: "dumbbell",
                    description: "Fully equipped fitness center",
                },
                {
                    id: randomUUID(),
                    name: "Children's Play Area",
                    category: "recreation",
                    icon: "playground",
                    description: "Safe play area for children",
                },
                {
                    id: randomUUID(),
                    name: "Clubhouse",
                    category: "recreation",
                    icon: "building",
                    description: "Community clubhouse facility",
                },
                {
                    id: randomUUID(),
                    name: "Garden/Landscaping",
                    category: "recreation",
                    icon: "tree",
                    description: "Beautiful landscaped gardens",
                },
                {
                    id: randomUUID(),
                    name: "Jogging Track",
                    category: "recreation",
                    icon: "running",
                    description: "Dedicated jogging/walking track",
                },

                // Utilities
                {
                    id: randomUUID(),
                    name: "Power Backup",
                    category: "utilities",
                    icon: "battery",
                    description: "Backup power supply",
                },
                {
                    id: randomUUID(),
                    name: "Water Supply",
                    category: "utilities",
                    icon: "droplet",
                    description: "24/7 water supply",
                },
                {
                    id: randomUUID(),
                    name: "Waste Management",
                    category: "utilities",
                    icon: "trash",
                    description: "Efficient waste disposal system",
                },
                {
                    id: randomUUID(),
                    name: "Internet/WiFi",
                    category: "utilities",
                    icon: "wifi",
                    description: "High-speed internet connectivity",
                },
                {
                    id: randomUUID(),
                    name: "Elevator",
                    category: "utilities",
                    icon: "elevator",
                    description: "Modern elevator facilities",
                },

                // Parking & Transportation
                {
                    id: randomUUID(),
                    name: "Covered Parking",
                    category: "parking",
                    icon: "car",
                    description: "Covered vehicle parking",
                },
                {
                    id: randomUUID(),
                    name: "Visitor Parking",
                    category: "parking",
                    icon: "parking",
                    description: "Dedicated visitor parking",
                },
                {
                    id: randomUUID(),
                    name: "Two Wheeler Parking",
                    category: "parking",
                    icon: "bike",
                    description: "Separate two-wheeler parking",
                },

                // Convenience
                {
                    id: randomUUID(),
                    name: "Shopping Complex",
                    category: "convenience",
                    icon: "shopping-bag",
                    description: "On-site shopping facilities",
                },
                {
                    id: randomUUID(),
                    name: "ATM",
                    category: "convenience",
                    icon: "credit-card",
                    description: "ATM facility within premises",
                },
                {
                    id: randomUUID(),
                    name: "Medical Center",
                    category: "convenience",
                    icon: "heart",
                    description: "On-site medical facilities",
                },
            ])
            .returning()

        // Seed properties with UUID
        console.log("🏘️ Seeding properties with UUID...")
        const properties = await db
            .insert(schema.properties)
            .values([
                {
                    id: randomUUID(),
                    uuid: randomUUID(),
                    title: "Luxury 4BHK Villa in Gurgaon",
                    description: `Stunning 4-bedroom villa in the heart of Gurgaon's premium sector. This magnificent property offers modern amenities, spacious rooms, and excellent connectivity. Perfect for families looking for luxury living with all modern conveniences.

Features:
- Spacious living and dining areas
- Modern modular kitchen
- Master bedroom with walk-in closet
- Private garden and terrace
- Premium fixtures and fittings
- 24/7 security and power backup`,
                    propertyType: "villa",
                    listingType: "sale",
                    status: "approved",
                    price: 12500000, // 1.25 Crores
                    pricePerUnit: 2777.78, // per sqft
                    area: 4500,
                    areaUnit: "sqft",
                    khasraNumber: "KH-123/45",
                    murabbaNumber: "MB-67",
                    khewatNumber: "KW-890",
                    address: "Sector 57, DLF Phase 4",
                    city: "Gurgaon",
                    district: "Gurgaon",
                    state: "Haryana",
                    country: "India",
                    pinCode: "122002",
                    latitude: 28.4595,
                    longitude: 77.0266,
                    listingAs: "real_estate_agent",
                    ownerName: "Rajesh Kumar",
                    ownerPhone: "+91-9876543210",
                    ownerWhatsapp: "+91-9876543210",
                    slug: "luxury-4bhk-villa-gurgaon-sector-57",
                    seoTitle: "4BHK Luxury Villa for Sale in Gurgaon Sector 57 | DLF Phase 4",
                    seoDescription:
                        "Premium 4BHK villa for sale in Gurgaon Sector 57. Modern amenities, spacious rooms, excellent connectivity. Price: ₹1.25 Cr. Contact now!",
                    seoKeywords: "villa for sale gurgaon, 4bhk villa, luxury villa, dlf phase 4, gurgaon property",
                    isFeatured: true,
                    isVerified: true,
                    isActive: true,
                    viewCount: 245,
                    inquiryCount: 12,
                    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                    agentId: platformUsers[0]?.id,
                    ownerId: platformUsers[1]?.id,
                    approvalStatus: "approved",
                    approvalMessage: "Excellent property listing with all required documents verified.",
                    approvedBy: adminUsers[0]?.id,
                    approvedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                    verificationStatus: "verified",
                    verificationMessage: "Property documents and ownership verified successfully.",
                    verifiedBy: adminUsers[0]?.id,
                    verifiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                },
                {
                    id: randomUUID(),
                    uuid: randomUUID(),
                    title: "Modern 3BHK Apartment in Noida",
                    description: `Beautiful 3-bedroom apartment in a premium residential complex in Noida. This property offers modern living with excellent amenities and great connectivity to Delhi and other NCR areas.

Key Features:
- Spacious bedrooms with attached bathrooms
- Modern kitchen with chimney and hob
- Balconies with city view
- Covered parking space
- Swimming pool and gym access
- 24/7 security and maintenance`,
                    propertyType: "apartment",
                    listingType: "rent",
                    status: "approved",
                    price: 35000, // Monthly rent
                    pricePerUnit: 23.33, // per sqft
                    area: 1500,
                    areaUnit: "sqft",
                    address: "Sector 62, Noida",
                    city: "Noida",
                    district: "Gautam Buddha Nagar",
                    state: "Uttar Pradesh",
                    country: "India",
                    pinCode: "201309",
                    latitude: 28.6139,
                    longitude: 77.391,
                    listingAs: "property_owner",
                    ownerName: "Priya Sharma",
                    ownerPhone: "+91-9876543211",
                    slug: "modern-3bhk-apartment-noida-sector-62",
                    seoTitle: "3BHK Apartment for Rent in Noida Sector 62 | Modern Amenities",
                    seoDescription:
                        "Spacious 3BHK apartment for rent in Noida Sector 62. Modern amenities, great connectivity. Rent: ₹35,000/month. Contact now!",
                    seoKeywords: "apartment for rent noida, 3bhk apartment, noida sector 62, rental property",
                    isFeatured: true,
                    isVerified: true,
                    isActive: true,
                    viewCount: 189,
                    inquiryCount: 8,
                    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                    agentId: platformUsers[0]?.id,
                    ownerId: platformUsers[1]?.id,
                    approvalStatus: "approved",
                    approvalMessage: "Well-maintained property with good amenities.",
                    approvedBy: adminUsers[1]?.id,
                    approvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                    verificationStatus: "verified",
                    verificationMessage: "Property and rental agreement verified.",
                    verifiedBy: adminUsers[1]?.id,
                    verifiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                },
                {
                    id: randomUUID(),
                    uuid: randomUUID(),
                    title: "Commercial Office Space in Cyber City",
                    description: `Premium commercial office space in the heart of Gurgaon's Cyber City. Perfect for IT companies, startups, and corporate offices. Excellent connectivity and modern infrastructure.

Office Features:
- Open floor plan with flexible seating
- Conference rooms and meeting spaces
- High-speed internet connectivity
- 24/7 power backup
- Ample parking space
- Food court and cafeteria nearby`,
                    propertyType: "office",
                    listingType: "lease",
                    status: "pending",
                    price: 125000, // Monthly lease
                    pricePerUnit: 62.5, // per sqft
                    area: 2000,
                    areaUnit: "sqft",
                    address: "DLF Cyber City, Phase 2",
                    city: "Gurgaon",
                    district: "Gurgaon",
                    state: "Haryana",
                    country: "India",
                    pinCode: "122002",
                    latitude: 28.4949,
                    longitude: 77.0869,
                    listingAs: "property_dealer",
                    ownerName: "Amit Singh",
                    ownerPhone: "+91-9876543212",
                    slug: "commercial-office-space-cyber-city-gurgaon",
                    seoTitle: "Commercial Office Space for Lease in Cyber City Gurgaon",
                    seoDescription:
                        "Premium office space for lease in Gurgaon Cyber City. Modern amenities, excellent connectivity. Lease: ₹1.25L/month. Contact now!",
                    seoKeywords: "office space gurgaon, cyber city office, commercial lease, gurgaon office rent",
                    isFeatured: false,
                    isVerified: false,
                    isActive: true,
                    viewCount: 67,
                    inquiryCount: 3,
                    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    agentId: platformUsers[2]?.id,
                    ownerId: platformUsers[2]?.id,
                    approvalStatus: "pending",
                    verificationStatus: "unverified",
                },
                {
                    id: randomUUID(),
                    uuid: randomUUID(),
                    title: "Agricultural Land in Faridabad",
                    description: `Fertile agricultural land perfect for farming or investment. Located in a developing area with good road connectivity and water supply.

Land Features:
- Fertile soil suitable for multiple crops
- Bore well with adequate water supply
- Road connectivity from main highway
- Clear title documents
- Suitable for organic farming
- Investment potential due to location`,
                    propertyType: "agricultural",
                    listingType: "sale",
                    status: "approved",
                    price: 2500000, // 25 Lakhs
                    pricePerUnit: 625000, // per acre
                    area: 4,
                    areaUnit: "acre",
                    khasraNumber: "KH-456/78",
                    murabbaNumber: "MB-123",
                    khewatNumber: "KW-456",
                    address: "Village Ballabgarh",
                    city: "Faridabad",
                    district: "Faridabad",
                    state: "Haryana",
                    country: "India",
                    pinCode: "121004",
                    latitude: 28.367,
                    longitude: 77.3155,
                    listingAs: "property_owner",
                    ownerName: "Ramesh Chand",
                    ownerPhone: "+91-9876543213",
                    slug: "agricultural-land-faridabad-ballabgarh",
                    seoTitle: "4 Acre Agricultural Land for Sale in Faridabad | Fertile Farm Land",
                    seoDescription:
                        "4 acre fertile agricultural land for sale in Faridabad. Good water supply, road connectivity. Price: ₹25 Lakhs. Contact now!",
                    seoKeywords: "agricultural land faridabad, farm land for sale, faridabad property, investment land",
                    isFeatured: false,
                    isVerified: true,
                    isActive: true,
                    viewCount: 134,
                    inquiryCount: 6,
                    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                    agentId: platformUsers[0]?.id,
                    ownerId: platformUsers[1]?.id,
                    approvalStatus: "approved",
                    approvalMessage: "Agricultural land with proper documentation.",
                    approvedBy: adminUsers[0]?.id,
                    approvedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
                    verificationStatus: "verified",
                    verificationMessage: "Land records and ownership verified.",
                    verifiedBy: adminUsers[0]?.id,
                    verifiedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                },
                {
                    id: randomUUID(),
                    uuid: randomUUID(),
                    title: "Industrial Warehouse in Manesar",
                    description: `Large industrial warehouse suitable for manufacturing, storage, and logistics operations. Located in Manesar industrial area with excellent connectivity.

Warehouse Features:
- High ceiling with proper ventilation
- Loading docks for trucks
- Office space included
- 24/7 security
- Power backup facility
- Easy highway access`,
                    propertyType: "warehouse",
                    listingType: "lease",
                    status: "flagged",
                    price: 200000, // Monthly lease
                    pricePerUnit: 20, // per sqft
                    area: 10000,
                    areaUnit: "sqft",
                    address: "IMT Manesar, Sector 8",
                    city: "Manesar",
                    district: "Gurgaon",
                    state: "Haryana",
                    country: "India",
                    pinCode: "122051",
                    latitude: 28.3587,
                    longitude: 76.9339,
                    listingAs: "builder",
                    ownerName: "Industrial Properties Ltd",
                    ownerPhone: "+91-9876543214",
                    slug: "industrial-warehouse-manesar-imt",
                    seoTitle: "Industrial Warehouse for Lease in Manesar IMT | 10000 Sqft",
                    seoDescription:
                        "Large industrial warehouse for lease in Manesar IMT. Perfect for manufacturing and logistics. Lease: ₹2L/month. Contact now!",
                    seoKeywords: "warehouse manesar, industrial lease, manesar imt, warehouse for rent",
                    isFeatured: false,
                    isVerified: false,
                    isActive: false,
                    viewCount: 89,
                    inquiryCount: 4,
                    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    agentId: platformUsers[2]?.id,
                    ownerId: platformUsers[2]?.id,
                    approvalStatus: "flagged",
                    approvalMessage: "Property flagged for document verification issues.",
                    rejectedBy: adminUsers[1]?.id,
                    rejectedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    rejectionReason: "Incomplete industrial clearance documents",
                    verificationStatus: "unverified",
                },
            ])
            .returning()

        // Seed property approval history
        console.log("📋 Seeding property approval history...")
        const approvalHistory: Array<{
            id: string
            propertyId: string
            adminId: string
            action: string
            previousStatus: string
            newStatus: string
            message: string
            adminNotes: string
            reason: string
            ipAddress: string
            userAgent: string
            isSystemAction: boolean
            createdAt: Date
        }> = []

        for (const property of properties) {
            // Add initial submission
            approvalHistory.push({
                id: randomUUID(),
                propertyId: property.id,
                adminId: adminUsers[0]?.id,
                action: "submitted",
                previousStatus: "draft",
                newStatus: "pending",
                message: "Property submitted for review",
                adminNotes: "Initial property submission",
                reason: "New property listing",
                ipAddress: "192.168.1.100",
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                isSystemAction: false,
                createdAt: new Date(property.createdAt!.getTime() + 1000 * 60 * 5), // 5 minutes after creation
            })

            // Add approval/rejection based on status
            if (property.approvalStatus === "approved") {
                approvalHistory.push({
                    id: randomUUID(),
                    propertyId: property.id,
                    adminId: property.approvedBy!,
                    action: "approve",
                    previousStatus: "pending",
                    newStatus: "approved",
                    message: property.approvalMessage!,
                    adminNotes: "All documents verified and property meets platform standards",
                    reason: "Complete documentation and quality listing",
                    ipAddress: "10.0.0.50",
                    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                    isSystemAction: false,
                    createdAt: property.approvedAt!,
                })
            } else if (property.approvalStatus === "flagged") {
                approvalHistory.push({
                    id: randomUUID(),
                    propertyId: property.id,
                    adminId: property.rejectedBy!,
                    action: "flag",
                    previousStatus: "pending",
                    newStatus: "flagged",
                    message: property.approvalMessage!,
                    adminNotes: "Property flagged for document verification issues",
                    reason: property.rejectionReason!,
                    ipAddress: "10.0.0.51",
                    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    isSystemAction: false,
                    createdAt: property.rejectedAt!,
                })
            }

            // Add verification history for verified properties
            if (property.verificationStatus === "verified") {
                approvalHistory.push({
                    id: randomUUID(),
                    propertyId: property.id,
                    adminId: property.verifiedBy!,
                    action: "verify",
                    previousStatus: "unverified",
                    newStatus: "verified",
                    message: property.verificationMessage!,
                    adminNotes: property.verificationNotes || "Property verification completed successfully",
                    reason: "Document verification and site inspection completed",
                    ipAddress: "10.0.0.52",
                    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15",
                    isSystemAction: false,
                    createdAt: property.verifiedAt!,
                })
            }
        }

        await db.insert(schema.propertyApprovalHistory).values(approvalHistory)

        // Seed property approval notifications
        console.log("🔔 Seeding property approval notifications...")
        const notifications = []

        for (const property of properties) {
            // Notification for property submission
            notifications.push({
                id: randomUUID(),
                propertyId: property.id,
                userId: property.ownerId!,
                adminId: adminUsers[0]?.id,
                type: "submission_received",
                title: "Property Submission Received",
                message: `Your property "${property.title}" has been submitted for review. Our team will review it within 24-48 hours.`,
                isRead: true,
                readAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                priority: "normal",
                category: "property_approval",
                createdAt: new Date(property.createdAt!.getTime() + 1000 * 60 * 10), // 10 minutes after creation
            })

            // Notification based on approval status
            if (property.approvalStatus === "approved") {
                notifications.push({
                    id: randomUUID(),
                    propertyId: property.id,
                    userId: property.ownerId!,
                    adminId: property.approvedBy!,
                    type: "approval",
                    title: "🎉 Property Approved!",
                    message: `Congratulations! Your property "${property.title}" has been approved and is now live on our platform. ${property.approvalMessage}`,
                    isRead: false,
                    priority: "high",
                    category: "property_approval",
                    createdAt: property.approvedAt!,
                })

                // Verification notification
                if (property.verificationStatus === "verified") {
                    notifications.push({
                        id: randomUUID(),
                        propertyId: property.id,
                        userId: property.ownerId!,
                        adminId: property.verifiedBy!,
                        type: "verification",
                        title: "✅ Property Verified",
                        message: `Your property "${property.title}" has been verified. ${property.verificationMessage} This increases your property's credibility and visibility.`,
                        isRead: Math.random() > 0.5,
                        readAt: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) : null,
                        priority: "normal",
                        category: "property_approval",
                        createdAt: property.verifiedAt!,
                    })
                }
            } else if (property.approvalStatus === "flagged") {
                notifications.push({
                    id: randomUUID(),
                    propertyId: property.id,
                    userId: property.ownerId!,
                    adminId: property.rejectedBy!,
                    type: "rejection",
                    title: "⚠️ Property Flagged",
                    message: `Your property "${property.title}" has been flagged. ${property.approvalMessage} Please address the issues and resubmit. Reason: ${property.rejectionReason}`,
                    isRead: false,
                    priority: "urgent",
                    category: "property_approval",
                    createdAt: property.rejectedAt!,
                })
            } else if (property.approvalStatus === "pending") {
                notifications.push({
                    id: randomUUID(),
                    propertyId: property.id,
                    userId: property.ownerId!,
                    type: "under_review",
                    title: "🔍 Property Under Review",
                    message: `Your property "${property.title}" is currently under review. We'll notify you once the review is complete.`,
                    isRead: Math.random() > 0.3,
                    readAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) : null,
                    priority: "normal",
                    category: "property_approval",
                    createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
                })
            }
        }

        await db.insert(schema.propertyApprovalNotifications).values(notifications)

        // Seed property images
        console.log("📸 Seeding property images...")
        const propertyImages = []
        for (let i = 0; i < properties.length; i++) {
            const property = properties[i]
            const imageCount = Math.floor(Math.random() * 8) + 3 // 3-10 images per property

            for (let j = 0; j < imageCount; j++) {
                propertyImages.push({
                    id: randomUUID(),
                    propertyId: property.id,
                    imageUrl: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(property.title + " image " + (j + 1))}`,
                    imageType: j === 0 ? "main" : j <= 2 ? "exterior" : j <= 5 ? "interior" : "other",
                    caption: `${property.title} - Image ${j + 1}`,
                    altText: `${property.title} property image ${j + 1}`,
                    sortOrder: j,
                    isMain: j === 0,
                })
            }
        }

        await db.insert(schema.propertyImages).values(propertyImages)

        // Seed property amenity mappings
        console.log("🏠 Mapping property amenities...")
        const amenityMappings: Array<{ id: string; propertyId: string; amenityId: string }> = []
        for (const property of properties) {
            // Randomly assign 5-12 amenities to each property
            const amenityCount = Math.floor(Math.random() * 8) + 5
            const selectedAmenities = amenities.sort(() => 0.5 - Math.random()).slice(0, amenityCount)

            for (const amenity of selectedAmenities) {
                amenityMappings.push({
                    id: randomUUID(),
                    propertyId: property.id,
                    amenityId: amenity.id,
                })
            }
        }

        await db.insert(schema.propertyAmenityMappings).values(amenityMappings)

        // Seed property views
        console.log("👀 Seeding property views...")
        const propertyViews = []
        for (const property of properties) {
            const viewCount = property.viewCount || 0
            for (let i = 0; i < viewCount; i++) {
                propertyViews.push({
                    id: randomUUID(),
                    propertyId: property.id,
                    userId: Math.random() > 0.5 ? platformUsers[Math.floor(Math.random() * platformUsers.length)]?.id : null,
                    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
                    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    referrer: Math.random() > 0.5 ? "https://google.com" : "https://facebook.com",
                    sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
                    viewDuration: randomUUID(), // This should be integer, but schema shows UUID - keeping as is
                    viewedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
                })
            }
        }

        await db.insert(schema.propertyViews).values(propertyViews)

        // Seed property price history
        console.log("💰 Seeding property price history...")
        const priceHistory = []
        for (const property of properties) {
            // Add 1-3 price changes for each property
            const priceChanges = Math.floor(Math.random() * 3) + 1
            let currentPrice = property.price

            for (let i = 0; i < priceChanges; i++) {
                const oldPrice = currentPrice
                const changePercent = (Math.random() - 0.5) * 0.2 // ±10% change
                const newPrice = Math.round(currentPrice * (1 + changePercent))

                priceHistory.push({
                    id: randomUUID(),
                    propertyId: property.id,
                    oldPrice: oldPrice,
                    newPrice: newPrice,
                    changeReason: Math.random() > 0.5 ? "market_adjustment" : "negotiation",
                    changedBy: platformUsers[Math.floor(Math.random() * platformUsers.length)]?.id,
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000),
                })

                currentPrice = newPrice
            }
        }

        await db.insert(schema.propertyPriceHistory).values(priceHistory)

        console.log("✅ Properties with approval system seeded successfully!")
        console.log(`
📊 Seeded data summary:
- Properties: ${properties.length}
- Property Images: ${propertyImages.length}
- Property Amenities: ${amenities.length}
- Amenity Mappings: ${amenityMappings.length}
- Property Views: ${propertyViews.length}
- Price History Records: ${priceHistory.length}
- Approval History Records: ${approvalHistory.length}
- Approval Notifications: ${notifications.length}

🏠 Property Approval Status:
- Approved: ${properties.filter((p) => p.approvalStatus === "approved").length}
- Pending: ${properties.filter((p) => p.approvalStatus === "pending").length}
- Flagged: ${properties.filter((p) => p.approvalStatus === "flagged").length}

🔔 Notification Types:
- Submission Received: ${notifications.filter((n) => n.type === "submission_received").length}
- Approvals: ${notifications.filter((n) => n.type === "approval").length}
- Rejections: ${notifications.filter((n) => n.type === "rejection").length}
- Verifications: ${notifications.filter((n) => n.type === "verification").length}
- Under Review: ${notifications.filter((n) => n.type === "under_review").length}

💰 Price Range:
- Sale: ₹25L - ₹1.25Cr
- Rent: ₹35K/month
- Lease: ₹1.25L - ₹2L/month

📍 Locations:
- Gurgaon (Haryana)
- Noida (UP)
- Faridabad (Haryana)
- Manesar (Haryana)
    `)
    } catch (error) {
        console.error("❌ Property seeding with approval system failed:", error)
        process.exit(1)
    } finally {
        await sql.end()
    }
}

seedPropertiesWithApproval()
