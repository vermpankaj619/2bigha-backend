// @ts-nocheck
import { GraphQLClient } from "graphql-request"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Validate admin token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxODYyOWRlOS01YjJjLTRhZmYtOTUxZC1iMTgzNjk3ZWM2YjIiLCJlbWFpbCI6InN1cGVyYWRtaW5AMmJpZ2hhLmFpIiwicm9sZSI6InN1cGVyX2FkbWluIiwic2Vzc2lvbklkIjoiMWU3NmVkMDktYTI5Yi00MGRiLWE0NjctYWU2NjQ4MGMyYTk4IiwiaWF0IjoxNzUzNDYxOTIwLCJleHAiOjg2NDAwMDAwMDAxNzUzNDYwMDAwfQ.yZaeB19NeavipSPfpnMsXJfUqMUdDkgfcyJy6_PgGH4"
if (!token) {
    throw new Error("❌ Missing ADMIN_TOKEN in .env file")
}

// Set up GraphQL client
const client = new GraphQLClient("http://localhost:5002/graphql", {
    headers: {
        authorization: `Bearer ${token}`,
    },
})

async function testAdminDashboardAPIs() {
    console.log("📊 Testing Admin Dashboard APIs...\n")

    try {
        // Test 1: Get dashboard stats
        console.log("1. Testing adminDashboardStats query...")
        const dashboardStatsQuery = `
            query GetAdminDashboardStats {
                adminDashboardStats {
                    totalProperties {
                        value
                        change
                        changeType
                        previousValue
                    }
                    pendingApprovals {
                        value
                        change
                        changeType
                        previousValue
                    }
                    activeListings {
                        value
                        change
                        changeType
                        previousValue
                    }
                    todayActivity {
                        views
                        inquiries
                        responseRate
                        newListings
                        approvals
                        rejections
                    }
                    recentActivities {
                        id
                        type
                        title
                        description
                        timestamp
                        user
                        status
                    }
                    propertyStatusDistribution {
                        status
                        count
                        percentage
                        change
                    }
                    monthlyTrends {
                        month
                        year
                        properties
                        inquiries
                        approvals
                        revenue
                    }
                    topCities {
                        city
                        state
                        totalProperties
                        averagePrice
                        growth
                        inquiries
                    }
                    agentPerformance {
                        agentId
                        agentName
                        company
                        totalListings
                        approvedListings
                        pendingListings
                        totalInquiries
                        responseRate
                        averageResponseTime
                        rating
                        revenue
                    }
                }
            }
        `

        const dashboardResult = await client.request(dashboardStatsQuery)

        if (!dashboardResult?.adminDashboardStats) {
            throw new Error("adminDashboardStats not found in response")
        }

        const stats = dashboardResult.adminDashboardStats

        console.log("✅ Dashboard Statistics:")
        console.log(
            `   📈 Total Properties: ${stats.totalProperties.value} (${stats.totalProperties.change > 0 ? "+" : ""}${stats.totalProperties.change}%)`
        )
        console.log(
            `   ⏳ Pending Approvals: ${stats.pendingApprovals.value} (${stats.pendingApprovals.change > 0 ? "+" : ""}${stats.pendingApprovals.change}%)`
        )
        console.log(
            `   🏠 Active Listings: ${stats.activeListings.value} (${stats.activeListings.change > 0 ? "+" : ""}${stats.activeListings.change}%)`
        )

        console.log("\n   📊 Today's Activity:")
        console.log(`      👀 Views: ${stats.todayActivity.views}`)
        console.log(`      💬 Inquiries: ${stats.todayActivity.inquiries}`)
        console.log(`      📞 Response Rate: ${stats.todayActivity.responseRate}%`)
        console.log(`      🆕 New Listings: ${stats.todayActivity.newListings}`)
        console.log(`      ✅ Approvals: ${stats.todayActivity.approvals}`)
        console.log(`      ❌ Rejections: ${stats.todayActivity.rejections}`)

        console.log(`\n   📋 Recent Activities: ${stats.recentActivities.length} items`)
        console.log(`   🏙️ Top Cities: ${stats.topCities.length} cities`)
        console.log(`   👥 Agent Performance: ${stats.agentPerformance.length} agents`)

        // Test 2: Real-time metrics
        console.log("\n2. Testing realTimeDashboardMetrics query...")
        const realTimeQuery = `
            query GetRealTimeDashboardMetrics {
                realTimeDashboardMetrics {
                    totalProperties {
                        value
                        change
                        changeType
                    }
                    pendingApprovals {
                        value
                        change
                        changeType
                    }
                    activeListings {
                        value
                        change
                        changeType
                    }
                    todayActivity {
                        views
                        inquiries
                        responseRate
                    }
                }
            }
        `
        const realTimeResult = await client.request(realTimeQuery)
        console.log("✅ Real-time metrics fetched successfully")

        // Test 3: Activity feed
        console.log("\n3. Testing adminActivityFeed query...")
        const activityFeedQuery = `
            query GetAdminActivityFeed {
                adminActivityFeed(limit: 10) {
                    id
                    type
                    title
                    description
                    timestamp
                    user
                    status
                }
            }
        `
        const activityResult = await client.request(activityFeedQuery)
        console.log(`✅ Activity feed: ${activityResult?.adminActivityFeed?.length} activities`)

        // Test 4: Agent performance analytics
        console.log("\n4. Testing agentPerformanceAnalytics query...")
        const agentPerformanceQuery = `
            query GetAgentPerformanceAnalytics {
                agentPerformanceAnalytics(limit: 5) {
                    agentId
                    agentName
                    company
                    totalListings
                    approvedListings
                    responseRate
                    revenue
                }
            }
        `
        const agentResult = await client.request(agentPerformanceQuery)
        console.log(`✅ Agent performance: ${agentResult.agentPerformanceAnalytics.length} agents`)

        // Test 5: Property analytics
        console.log("\n5. Testing propertyAnalytics query...")
        const propertyAnalyticsQuery = `
            query GetPropertyAnalytics {
                propertyAnalytics {
                    totalViews
                    uniqueVisitors
                    conversionRate
                    averageTimeOnSite
                    topPerformingProperties {
                        propertyId
                        title
                        views
                        inquiries
                        conversionRate
                    }
                    geographicDistribution {
                        region
                        properties
                        inquiries
                        averagePrice
                        growth
                    }
                }
            }
        `
        const analyticsResult = await client.request(propertyAnalyticsQuery)
        const analytics = analyticsResult.propertyAnalytics

        console.log("✅ Property Analytics:")
        console.log(`   👀 Total Views: ${analytics.totalViews}`)
        console.log(`   👤 Unique Visitors: ${analytics.uniqueVisitors}`)
        console.log(`   📈 Conversion Rate: ${analytics.conversionRate.toFixed(2)}%`)
        console.log(`   ⏱️ Avg Time on Site: ${Math.round(analytics.averageTimeOnSite)}s`)
        console.log(`   🏆 Top Properties: ${analytics.topPerformingProperties.length}`)
        console.log(`   🌍 Geographic Data: ${analytics.geographicDistribution.length} regions`)

        console.log("\n🎉 All Admin Dashboard API tests completed successfully!")

        // Optional: summary format
        console.log("\n📋 Sample Dashboard Data Format:")
        console.log("=====================================")
        console.log(`Total Properties: ${stats.totalProperties.value}+ (+${stats.totalProperties.change}% from last month)`)
        console.log(
            `Pending Approvals: ${stats.pendingApprovals.value} (+${stats.pendingApprovals.change}% from last month)`
        )
        console.log(`Active Listings: ${stats.activeListings.value} (+${stats.activeListings.change}% from last month)`)
        console.log("\nToday's Activity:")
        console.log(`Today's Views: ${stats.todayActivity.views}`)
        console.log(`New Inquiries: ${stats.todayActivity.inquiries}`)
        console.log(`Response Rate: ${stats.todayActivity.responseRate}%`)
    } catch (error: any) {
        console.error("❌ Test failed:", error.message || error)

        if (error?.response?.errors) {
            console.error("GraphQL Errors:", error.response.errors)
        }

        if (error.message?.includes("UNAUTHENTICATED")) {
            console.log("\n💡 Note: Replace ADMIN_TOKEN with a valid admin authentication token in your .env file.")
        }
    }
}

// Run tests
testAdminDashboardAPIs()
