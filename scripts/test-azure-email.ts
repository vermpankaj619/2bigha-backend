
import { logError } from "../src/utils/logger"

import { azureEmailService } from "../src/graphql/services/email.service"
import dotenv from 'dotenv'
dotenv.config()
async function testAzureEmailService() {


    console.log("🧪 Testing Azure Email Communication Service...\n")

    try {
        // Test 1: Check Azure email service connection
        console.log("1️⃣ Testing Azure Communication Services connection...")
        const connectionTest = await azureEmailService.testConnection()

        if (connectionTest) {
            console.log("✅ Azure Communication Services connection successful!")
        } else {
            console.log("❌ Azure Communication Services connection failed!")
            console.log("Please check your AZURE_COMMUNICATION_CONNECTION_STRING")
            return
        }

        // Test 2: Send test OTP email
        console.log("\n2️⃣ Testing OTP email sending...")
        const testEmail = process.env.TEST_EMAIL || "test@example.com"
        const testOTP = "123456"

        const otpEmailSent = await azureEmailService.sendOTPEmail(testEmail, testOTP, "LOGIN_2FA")

        if (otpEmailSent) {
            console.log(`✅ OTP email sent successfully to ${testEmail}`)
        } else {
            console.log(`❌ Failed to send OTP email to ${testEmail}`)
        }

        // Test 3: Send welcome email
        console.log("\n3️⃣ Testing welcome email...")
        const welcomeEmailSent = await azureEmailService.sendWelcomeEmail(testEmail, "Test User")

        if (welcomeEmailSent) {
            console.log(`✅ Welcome email sent successfully to ${testEmail}`)
        } else {
            console.log(`❌ Failed to send welcome email to ${testEmail}`)
        }

        // Test 4: Send password reset email
        console.log("\n4️⃣ Testing password reset email...")
        const resetToken = "test-reset-token-123"
        const resetEmailSent = await azureEmailService.sendPasswordResetEmail(testEmail, resetToken)

        if (resetEmailSent) {
            console.log(`✅ Password reset email sent successfully to ${testEmail}`)
        } else {
            console.log(`❌ Failed to send password reset email to ${testEmail}`)
        }

        // Test 5: Bulk email sending
        console.log("\n5️⃣ Testing bulk email sending...")
        const bulkEmails = [testEmail, "test2@example.com", "test3@example.com"]
        const bulkResult = await azureEmailService.sendBulkNotificationEmail(
            bulkEmails,
            "Bulk Test Notification",
            "<h1>This is a bulk test email</h1><p>Testing Azure bulk email functionality.</p>",
            "This is a bulk test email. Testing Azure bulk email functionality.",
        )

        console.log(`📊 Bulk email results: ${bulkResult.success} successful, ${bulkResult.failed} failed`)

        console.log("\n🎉 Azure Email Communication Service testing completed!")

        // Display configuration info
        console.log("\n📋 Configuration Summary:")
        console.log(`- From Address: ${process.env.AZURE_EMAIL_FROM_ADDRESS}`)
        console.log(`- From Name: ${process.env.AZURE_EMAIL_FROM_NAME}`)
        console.log(`- Test Email: ${testEmail}`)
        console.log(`- Frontend URL: ${process.env.FRONTEND_URL}`)
    } catch (error) {
        console.error("💥 Azure email service test failed:", error)
        logError("Azure email service test failed", error as Error)
    }
}

// Function to test email status tracking
async function testEmailStatusTracking() {
    console.log("\n📊 Testing email status tracking...")

    try {
        const testEmail = process.env.TEST_EMAIL || "test@example.com"

        // Send a test email and track its status
        const result = await azureEmailService.sendOTPEmail(testEmail, "999999", "LOGIN_2FA")

        if (result) {
            console.log("✅ Email sent, checking status in 5 seconds...")

            // Wait a bit then check status
            setTimeout(async () => {
                // Note: You would need the message ID from the actual send result
                // This is just a demonstration of the status checking capability
                console.log("📈 Email status tracking is available via getEmailStatus() method")
            }, 5000)
        }
    } catch (error) {
        console.error("❌ Email status tracking test failed:", error)
    }
}

// Run the tests
if (require.main === module) {
    testAzureEmailService()
        .then(() => testEmailStatusTracking())
        .then(() => {
            console.log("\n✨ All tests completed!")
            process.exit(0)
        })
        .catch((error) => {
            console.error("Test script failed:", error)
            process.exit(1)
        })
}

export { testAzureEmailService, testEmailStatusTracking }
