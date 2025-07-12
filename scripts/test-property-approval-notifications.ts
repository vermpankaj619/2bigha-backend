import { propertyNotificationService } from "../src/graphql/services/property-notification.service"
import dotenv from 'dotenv'
dotenv.config()
async function testPropertyApprovalNotifications() {
    console.log("🧪 Testing Property Approval Notification System...\n")

    // Test data
    const testProperty = {
        id: "TEST-001",
        title: "Premium Agricultural Land in Rajasthan",
        ownerName: "Ramesh Kumar",
        ownerEmail: "vermapankaj619@gmail.com",
        ownerPhone: "+91-7000379913",
        price: 4500000,
        address: "Village Ladiyaka, Tehsil Bali",
        city: "Pali",
        state: "Rajasthan",
    }

    const testActions = [
        {
            action: "APPROVE" as const,
            message: "Congratulations! Your property has been approved and is now live on our platform.",
            adminName: "Admin Test User",
        },
        {
            action: "REJECT" as const,
            message: "Your property submission has been rejected due to incomplete documentation.",
            reason: "Missing land ownership documents",
            adminName: "Admin Test User",
        },
        {
            action: "VERIFY" as const,
            message: "Your property has been verified and marked as authentic.",
            adminName: "Admin Test User",
        },
        {
            action: "FLAG" as const,
            message: "Your property has been flagged for review due to policy concerns.",
            reason: "Pricing seems unusually high for the area",
            adminName: "Admin Test User",
        },
    ]

    // Test individual notifications
    console.log("📧 Testing Individual Notifications...\n")

    for (const testAction of testActions) {
        try {
            console.log(`Testing ${testAction.action} notification...`)

            const result = await propertyNotificationService.sendPropertyStatusNotification({
                property: testProperty,
                action: testAction.action,
                message: testAction.message,
                adminName: testAction.adminName,
                reviewDate: new Date().toLocaleDateString("en-IN"),
                reason: testAction.reason,
            })

            console.log(`✅ ${testAction.action} notification result:`)
            console.log(`   📧 Email sent: ${result.emailSent}`)
            console.log(`   📱 SMS sent: ${result.smsSent}`)
            if (result.errors.length > 0) {
                console.log(`   ❌ Errors: ${result.errors.join(", ")}`)
            }
            console.log("")
        } catch (error) {
            console.error(`❌ Failed to test ${testAction.action} notification:`, error)
        }
    }

    // Test bulk notifications
    console.log("📦 Testing Bulk Notifications...\n")

    const bulkTestProperties = [
        {
            ...testProperty, id: "BULK-001", ownerEmail: "vermapankaj619@gmail.com",
            ownerPhone: "+91-7000379913",
        },
        {
            ...testProperty, id: "BULK-002", ownerEmail: "vermapankaj619@gmail.com",
            ownerPhone: "+91-7000379913",
        },
        {
            ...testProperty, id: "BULK-003", ownerEmail: "vermapankaj619@gmail.com",
            ownerPhone: "+91-7000379913",
        },
    ]

    const bulkNotifications = bulkTestProperties.map((property) => ({
        property,
        action: "APPROVE" as const,
        message: "Your property has been approved in our bulk review process.",
        adminName: "Bulk Review Admin",
        reviewDate: new Date().toLocaleDateString("en-IN"),
    }))

    try {
        console.log("Testing bulk notification sending...")

        const bulkResult = await propertyNotificationService.sendBulkPropertyNotifications(bulkNotifications)

        console.log("✅ Bulk notification results:")
        console.log(`   📊 Total sent: ${bulkResult.totalSent}`)
        console.log(`   📧 Emails sent: ${bulkResult.emailsSent}`)
        console.log(`   📱 SMS sent: ${bulkResult.smsSent}`)
        console.log(`   ❌ Errors: ${bulkResult.errors.length}`)

        if (bulkResult.errors.length > 0) {
            console.log("   Error details:")
            bulkResult.errors.forEach((error, index) => {
                console.log(`     ${index + 1}. ${error}`)
            })
        }
    } catch (error) {
        console.error("❌ Failed to test bulk notifications:", error)
    }

    console.log("\n🎉 Property Approval Notification Testing Complete!")
}

// Run the test
if (require.main === module) {
    testPropertyApprovalNotifications()
        .then(() => {
            console.log("✅ All tests completed successfully")
            process.exit(0)
        })
        .catch((error) => {
            console.error("❌ Test failed:", error)
            process.exit(1)
        })
}

export { testPropertyApprovalNotifications }
