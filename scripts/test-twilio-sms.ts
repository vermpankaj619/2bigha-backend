import { twilioSMSService } from "../src/graphql/services/twilio-sms.service"
import { logError } from "../src/utils/logger"
import dotenv from 'dotenv'
dotenv.config()
async function testTwilioSMSService() {
    console.log("🧪 Testing Twilio SMS Service...")

    try {
        // Test SMS service connection
        console.log("\n1. Testing SMS Service Connection...")
        const testPhone = process.env.TEST_PHONE || "+917000379913"

        const connectionTest = await twilioSMSService.testSMSService(testPhone)

        if (connectionTest) {
            console.log("✅ SMS service connection successful")
        } else {
            console.log("❌ SMS service connection failed")
            return
        }

        // Test phone number validation
        console.log("\n2. Testing Phone Number Validation...")
        const validationResult = await twilioSMSService.validatePhoneNumber(testPhone)

        if (validationResult.valid) {
            console.log("✅ Phone number validation successful")
            console.log(`   Formatted: ${validationResult.formatted}`)
            console.log(`   Country Code: ${validationResult.countryCode}`)
        } else {
            console.log("❌ Phone number validation failed")
        }

        // Test OTP SMS
        console.log("\n3. Testing OTP SMS...")
        const otpResult = await twilioSMSService.sendOTP(testPhone, "+917000379913")

        if (otpResult) {
            console.log("✅ OTP SMS sent successfully")
        } else {
            console.log("❌ Failed to send OTP SMS")
        }

        // Test Welcome SMS
        console.log("\n4. Testing Welcome SMS...")
        const welcomeResult = await twilioSMSService.sendWelcomeSMS(testPhone, "John")

        if (welcomeResult) {
            console.log("✅ Welcome SMS sent successfully")
        } else {
            console.log("❌ Failed to send welcome SMS")
        }

        // Test Password Reset SMS
        console.log("\n5. Testing Password Reset SMS...")
        const resetResult = await twilioSMSService.sendPasswordResetSMS(testPhone, "RESET123")

        if (resetResult) {
            console.log("✅ Password reset SMS sent successfully")
        } else {
            console.log("❌ Failed to send password reset SMS")
        }

        // Test Security Alert SMS
        console.log("\n6. Testing Security Alert SMS...")
        const alertResult = await twilioSMSService.sendSecurityAlertSMS(testPhone, "New login from unknown device")

        if (alertResult) {
            console.log("✅ Security alert SMS sent successfully")
        } else {
            console.log("❌ Failed to send security alert SMS")
        }

        // Test Bulk SMS
        console.log("\n7. Testing Bulk SMS...")
        const bulkPhones = [testPhone] // Add more test numbers if needed
        const bulkResult = await twilioSMSService.sendBulkSMS(bulkPhones, "This is a bulk SMS test message")

        console.log(`✅ Bulk SMS completed: ${bulkResult.success} successful, ${bulkResult.failed} failed`)

        console.log("\n🎉 Twilio SMS Service tests completed!")
    } catch (error) {
        logError("Twilio SMS service test failed", error as Error)
        console.error("❌ SMS service test failed:", (error as Error).message)
    }
}

// Run the test
testTwilioSMSService()
