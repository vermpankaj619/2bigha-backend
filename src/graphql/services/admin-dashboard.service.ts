import { eq, and, sql, desc, between, inArray } from "drizzle-orm"
import { db } from "../../database/connection"
import * as schema from "../../database/schema/index"

const { properties, platformUsers, propertyInquiries, propertyViews, adminUsers, propertyImages } = schema

export interface DateRange {
    startDate: Date
    endDate: Date
}

export interface AdminDashboardFilters {
    dateRange?: DateRange
    cities?: string[]
    states?: string[]
    propertyTypes?: string[]
    agentIds?: string[]
}

export class AdminDashboardService {
    // Get comprehensive dashboard statistics
    static async getDashboardStats(filters?: AdminDashboardFilters) {
        const now = new Date()
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        // Build base conditions
        const baseConditions = this.buildBaseConditions(filters)
        const lastMonthConditions = this.buildBaseConditions({
            ...filters,
            dateRange: { startDate: lastMonth, endDate: now },
        })

        // Get total properties
        const totalProperties = await this.getTotalPropertiesMetric(baseConditions, lastMonthConditions)

        // Get pending approvals
        const pendingApprovals = await this.getPendingApprovalsMetric(baseConditions, lastMonthConditions)

        // Get active listings
        const activeListings = await this.getActiveListingsMetric(baseConditions, lastMonthConditions)

        // Get today's activity
        const todayActivity = await this.getTodayActivity(today)

        // Get recent activities
        const recentActivities = await this.getRecentActivities(20)

        // Get property status distribution
        const propertyStatusDistribution = await this.getPropertyStatusDistribution(baseConditions)

        // Get monthly trends
        const monthlyTrends = await this.getMonthlyTrends(6) // Last 6 months

        // Get top cities
        const topCities = await this.getTopCities(baseConditions, 10)

        // Get agent performance
        const agentPerformance = await this.getAgentPerformance(filters, 10)

        return {
            totalProperties,
            pendingApprovals,
            activeListings,
            todayActivity,
            recentActivities,
            propertyStatusDistribution,
            monthlyTrends,
            topCities,
            agentPerformance,
        }
    }

    // Get total properties metric with change
    private static async getTotalPropertiesMetric(currentConditions: any, lastMonthConditions: any) {
        const [current] = await db.select({ count: sql<number>`count(*)` }).from(properties).where(currentConditions)

        const [lastMonth] = await db.select({ count: sql<number>`count(*)` }).from(properties).where(lastMonthConditions)

        const currentValue = current.count
        const previousValue = lastMonth.count
        const change = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0

        return {
            value: currentValue,
            change: Math.round(change * 100) / 100,
            changeType: change > 0 ? "INCREASE" : change < 0 ? "DECREASE" : "NEUTRAL",
            previousValue,
        }
    }

    // Get pending approvals metric
    private static async getPendingApprovalsMetric(currentConditions: any, lastMonthConditions: any) {
        const pendingCondition = eq(properties.approvalStatus, "PENDING")

        const [current] = await db
            .select({ count: sql<number>`count(*)` })
            .from(properties)
            .where(and(currentConditions, pendingCondition))

        const [lastMonth] = await db
            .select({ count: sql<number>`count(*)` })
            .from(properties)
            .where(and(lastMonthConditions, pendingCondition))

        const currentValue = current.count
        const previousValue = lastMonth.count
        const change = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0

        return {
            value: currentValue,
            change: Math.round(change * 100) / 100,
            changeType: change > 0 ? "INCREASE" : change < 0 ? "DECREASE" : "NEUTRAL",
            previousValue,
        }
    }

    // Get active listings metric
    private static async getActiveListingsMetric(currentConditions: any, lastMonthConditions: any) {
        const activeCondition = and(eq(properties.approvalStatus, "APPROVED"), eq(properties.isActive, true))

        const [current] = await db
            .select({ count: sql<number>`count(*)` })
            .from(properties)
            .where(and(currentConditions, activeCondition))

        const [lastMonth] = await db
            .select({ count: sql<number>`count(*)` })
            .from(properties)
            .where(and(lastMonthConditions, activeCondition))

        const currentValue = current.count
        const previousValue = lastMonth.count
        const change = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0

        return {
            value: currentValue,
            change: Math.round(change * 100) / 100,
            changeType: change > 0 ? "INCREASE" : change < 0 ? "DECREASE" : "NEUTRAL",
            previousValue,
        }
    }

    // Get today's activity
    private static async getTodayActivity(today: Date) {
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        // Today's views
        const [viewsResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(propertyViews)
            .where(between(propertyViews.viewedAt, today, tomorrow))

        // Today's inquiries
        const [inquiriesResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(propertyInquiries)
            .where(between(propertyInquiries.createdAt, today, tomorrow))

        // Today's new listings
        const [newListingsResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(properties)
            .where(between(properties.createdAt, today, tomorrow))

        // Today's approvals
        const [approvalsResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(properties)
            .where(and(eq(properties.approvalStatus, "APPROVED"), between(properties.updatedAt, today, tomorrow)))

        // Today's rejections
        const [rejectionsResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(properties)
            .where(and(eq(properties.approvalStatus, "REJECTED"), between(properties.updatedAt, today, tomorrow)))

        // Calculate response rate (simplified)
        const totalInquiries = inquiriesResult.count
        const responseRate = totalInquiries > 0 ? 94 : 0 // Mock response rate

        return {
            views: viewsResult.count,
            inquiries: totalInquiries,
            responseRate,
            newListings: newListingsResult.count,
            approvals: approvalsResult.count,
            rejections: rejectionsResult.count,
        }
    }

    // Get recent activities
    private static async getRecentActivities(limit: number) {
        // Get recent property creations
        const recentProperties = await db
            .select({
                id: properties.id,
                title: properties.title,
                createdAt: properties.createdAt,
                status: properties.approvalStatus,
                agentId: properties.createdByUserId,
                ownerName: properties.ownerName,
            })
            .from(properties)
            .orderBy(desc(properties.createdAt))
            .limit(limit / 2)

        // Get recent inquiries
        const recentInquiries = await db
            .select({
                id: propertyInquiries.id,
                propertyId: propertyInquiries.propertyId,
                name: propertyInquiries.name,
                email: propertyInquiries.email,
                createdAt: propertyInquiries.createdAt,
                status: propertyInquiries.status,
            })
            .from(propertyInquiries)
            .orderBy(desc(propertyInquiries.createdAt))
            .limit(limit / 2)

        // Combine and format activities
        const activities = []

        // Add property activities
        for (const property of recentProperties) {
            activities.push({
                id: `prop-${property.id}`,
                type: "PROPERTY_CREATED",
                title: "New Property Listed",
                description: `${property.title} was listed`,
                timestamp: property.createdAt.toISOString(),
                user: property.ownerName || "Agent",
                propertyId: property.id.toString(),
                status: property.status,
            })
        }

        // Add inquiry activities
        for (const inquiry of recentInquiries) {
            activities.push({
                id: `inq-${inquiry.id}`,
                type: "INQUIRY_RECEIVED",
                title: "New Inquiry Received",
                description: `Inquiry from ${inquiry.name}`,
                timestamp: inquiry.createdAt.toISOString(),
                user: inquiry.name,
                propertyId: inquiry.propertyId.toString(),
                status: inquiry.status,
            })
        }

        // Sort by timestamp and return
        return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit)
    }

    // Get property status distribution
    private static async getPropertyStatusDistribution(baseConditions: any) {
        const statusCounts = await db
            .select({
                status: properties.approvalStatus,
                count: sql<number>`count(*)`,
            })
            .from(properties)
            .where(baseConditions)
            .groupBy(properties.approvalStatus)

        const total = statusCounts.reduce((sum, item) => sum + item.count, 0)

        return statusCounts.map((item) => ({
            status: item.status.toUpperCase(),
            count: item.count,
            percentage: total > 0 ? (item.count / total) * 100 : 0,
            change: 0, // Mock change for now
        }))
    }

    // Get monthly trends
    private static async getMonthlyTrends(months: number) {
        const trends = []
        const now = new Date()

        for (let i = months - 1; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

            // Get properties count for the month
            const [propertiesCount] = await db
                .select({ count: sql<number>`count(*)` })
                .from(properties)
                .where(between(properties.createdAt, monthStart, monthEnd))

            // Get inquiries count for the month
            const [inquiriesCount] = await db
                .select({ count: sql<number>`count(*)` })
                .from(propertyInquiries)
                .where(between(propertyInquiries.createdAt, monthStart, monthEnd))

            // Get approvals count for the month
            const [approvalsCount] = await db
                .select({ count: sql<number>`count(*)` })
                .from(properties)
                .where(and(eq(properties.approvalStatus, "APPROVED"), between(properties.updatedAt, monthStart, monthEnd)))

            // Calculate revenue (mock calculation)
            const [revenueResult] = await db
                .select({ revenue: sql<number>`COALESCE(SUM(price * 0.02), 0)` }) // 2% commission
                .from(properties)
                .where(and(eq(properties.approvalStatus, "APPROVED"), between(properties.updatedAt, monthStart, monthEnd)))

            trends.push({
                month: monthStart.toLocaleString("default", { month: "long" }),
                year: monthStart.getFullYear(),
                properties: propertiesCount.count,
                inquiries: inquiriesCount.count,
                approvals: approvalsCount.count,
                revenue: revenueResult.revenue || 0,
            })
        }

        return trends
    }

    // Get top cities
    private static async getTopCities(baseConditions: any, limit: number) {
        const cityStats = await db
            .select({
                city: properties.city,
                state: properties.state,
                totalProperties: sql<number>`count(*)`,
                averagePrice: sql<number>`AVG(price)`,
            })
            .from(properties)
            .where(baseConditions)
            .groupBy(properties.city, properties.state)
            .orderBy(desc(sql`count(*)`))
            .limit(limit)

        // Get inquiries count for each city
        const cityInquiries = await db
            .select({
                city: properties.city,
                inquiries: sql<number>`count(${propertyInquiries.id})`,
            })
            .from(properties)
            .leftJoin(propertyInquiries, eq(properties.id, propertyInquiries.propertyId))
            .where(baseConditions)
            .groupBy(properties.city)

        return cityStats.map((city) => {
            const inquiryData = cityInquiries.find((inq) => inq.city === city.city)
            return {
                city: city.city,
                state: city.state,
                totalProperties: city.totalProperties,
                averagePrice: city.averagePrice || 0,
                growth: Math.random() * 20 - 10, // Mock growth percentage
                inquiries: inquiryData?.inquiries || 0,
            }
        })
    }

    // Get agent performance
    public static async getAgentPerformance(filters?: AdminDashboardFilters, limit = 10) {
        const baseConditions = this.buildBaseConditions(filters)

        const agentStats = await db
            .select({
                agentId: properties.createdByUserId,
                totalListings: sql<number>`count(*)`,
                approvedListings: sql<number>`SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END)`,
                pendingListings: sql<number>`SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)`,
                revenue: sql<number>`COALESCE(SUM(CASE WHEN status = 'approved' THEN price * 0.02 ELSE 0 END), 0)`,
            })
            .from(properties)
            .where(and(baseConditions, sql`${properties.createdByUserId} IS NOT NULL`))
            .groupBy(properties.createdByUserId)
            .orderBy(desc(sql`count(*)`))
            .limit(limit)

        // Get agent details
        const agentIds = agentStats.map((stat) => stat.agentId!).filter(Boolean)
        const agents =
            agentIds.length > 0
                ? await db
                    .select({
                        id: platformUsers.id,
                        firstName: platformUsers.firstName,
                        lastName: platformUsers.lastName,

                    })
                    .from(platformUsers)
                    .where(inArray(platformUsers.id, agentIds))
                : []

        // Get inquiry stats for agents
        const agentInquiries = await db
            .select({
                agentId: properties.createdByUserId,
                totalInquiries: sql<number>`count(${propertyInquiries.id})`,
            })
            .from(properties)
            .leftJoin(propertyInquiries, eq(properties.id, propertyInquiries.propertyId))
            .where(and(baseConditions, sql`${properties.createdByUserId} IS NOT NULL`))
            .groupBy(properties.createdByUserId)

        return agentStats.map((stat) => {
            const agent = agents.find((a) => a.id === stat.agentId)
            const inquiryData = agentInquiries.find((inq) => inq.agentId === stat.agentId)
            const agentName = agent ? `${agent.firstName || ""} ${agent.lastName || ""}`.trim() : "Unknown Agent"

            return {
                agentId: stat.agentId?.toString() || "",
                agentName,

                totalListings: stat.totalListings,
                approvedListings: stat.approvedListings,
                pendingListings: stat.pendingListings,
                totalInquiries: inquiryData?.totalInquiries || 0,
                responseRate: 85 + Math.random() * 15, // Mock response rate 85-100%
                averageResponseTime: 2 + Math.random() * 6, // Mock 2-8 hours
                rating: 4 + Math.random(), // Mock rating 4-5
                revenue: stat.revenue,
            }
        })
    }

    // Build base conditions for filtering
    private static buildBaseConditions(filters?: AdminDashboardFilters) {
        const conditions = []

        if (filters?.dateRange) {
            conditions.push(between(properties.createdAt, filters.dateRange.startDate, filters.dateRange.endDate))
        }

        if (filters?.cities?.length) {
            conditions.push(inArray(properties.city, filters.cities))
        }

        if (filters?.states?.length) {
            conditions.push(inArray(properties.state, filters.states))
        }

        if (filters?.propertyTypes?.length) {
            conditions.push(inArray(properties.propertyType, filters.propertyTypes))
        }

        if (filters?.agentIds?.length) {
            const agentIdNumbers = filters.agentIds.map((id) => id).filter(Boolean)
            if (agentIdNumbers.length > 0) {
                conditions.push(inArray(properties.createdByUserId, agentIdNumbers))
            }
        }

        return conditions.length > 0 ? and(...conditions) : undefined
    }

    // Get real-time metrics (simplified version)
    static async getRealTimeMetrics() {
        return this.getDashboardStats()
    }

    // Get activity feed
    static async getActivityFeed(limit = 50, offset = 0, activityTypes?: string[], dateRange?: DateRange) {
        return this.getRecentActivities(limit)
    }

    // Get property analytics
    static async getPropertyAnalytics(filters?: AdminDashboardFilters) {
        const baseConditions = this.buildBaseConditions(filters)

        // Get total views
        const [totalViewsResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(propertyViews)
            .leftJoin(properties, eq(propertyViews.propertyId, properties.id))
            .where(baseConditions)

        // Get unique visitors (simplified)
        const [uniqueVisitorsResult] = await db
            .select({ count: sql<number>`count(DISTINCT ${propertyViews.ipAddress})` })
            .from(propertyViews)
            .leftJoin(properties, eq(propertyViews.propertyId, properties.id))
            .where(baseConditions)

        // Get top performing properties
        const topPerformingProperties = await db
            .select({
                propertyId: properties.id,
                title: properties.title,
                views: sql<number>`count(${propertyViews.id})`,
                inquiries: sql<number>`count(${propertyInquiries.id})`,
                revenue: sql<number>`COALESCE(${properties.price} * 0.02, 0)`,
            })
            .from(properties)
            .leftJoin(propertyViews, eq(properties.id, propertyViews.propertyId))
            .leftJoin(propertyInquiries, eq(properties.id, propertyInquiries.propertyId))
            .where(baseConditions)
            .groupBy(properties.id, properties.title, properties.price)
            .orderBy(desc(sql`count(${propertyViews.id})`))
            .limit(10)

        // Get geographic distribution
        const geographicDistribution = await db
            .select({
                region: properties.city,
                properties: sql<number>`count(*)`,
                inquiries: sql<number>`count(${propertyInquiries.id})`,
                averagePrice: sql<number>`AVG(${properties.price})`,
            })
            .from(properties)
            .leftJoin(propertyInquiries, eq(properties.id, propertyInquiries.propertyId))
            .where(baseConditions)
            .groupBy(properties.city)
            .orderBy(desc(sql`count(*)`))
            .limit(15)

        const totalViews = totalViewsResult.count
        const uniqueVisitors = uniqueVisitorsResult.count
        const conversionRate = totalViews > 0 ? (uniqueVisitors / totalViews) * 100 : 0

        return {
            totalViews,
            uniqueVisitors,
            conversionRate,
            averageTimeOnSite: 180 + Math.random() * 120, // Mock 3-5 minutes
            topPerformingProperties: topPerformingProperties.map((prop) => ({
                propertyId: prop.propertyId.toString(),
                title: prop.title,
                views: prop.views,
                inquiries: prop.inquiries,
                conversionRate: prop.views > 0 ? (prop.inquiries / prop.views) * 100 : 0,
                revenue: prop.revenue,
            })),
            geographicDistribution: geographicDistribution.map((geo) => ({
                region: geo.region,
                properties: geo.properties,
                inquiries: geo.inquiries,
                averagePrice: geo.averagePrice || 0,
                growth: Math.random() * 30 - 15, // Mock growth -15% to +15%
            })),
        }
    }
}
