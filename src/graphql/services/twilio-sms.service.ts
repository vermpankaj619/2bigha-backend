import { logError, logInfo } from "../../utils/logger"

import twilio from "twilio"

import dotenv from 'dotenv'
dotenv.config()
interface TwilioSMSConfig {
    accountSid: string
    authToken: string
    fromPhoneNumber: string
}

export class TwilioSMSService {
    private twilioClient: twilio.Twilio
    private fromPhoneNumber: string

    constructor() {
        const config: TwilioSMSConfig = {
            accountSid: process.env.TWILIO_ACCOUNT_SID || "",
            authToken: process.env.TWILIO_AUTH_TOKEN || "",
            fromPhoneNumber: process.env.TWILIO_FROM_NUMBER || "",
        }

        if (!config.accountSid) {
            throw new Error("TWILIO_ACCOUNT_SID is required")
        }

        if (!config.authToken) {
            throw new Error("TWILIO_AUTH_TOKEN is required")
        }

        if (!config.fromPhoneNumber) {
            throw new Error("TWILIO_FROM_NUMBER is required")
        }

        this.twilioClient = twilio(config.accountSid, config.authToken)
        this.fromPhoneNumber = config.fromPhoneNumber
    }

    // Send OTP SMS
    async sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
        try {
            const message = `Your verification code is: ${otp}. This code expires in 10 minutes. Do not share this code with anyone.`

            const messageInstance = await this.twilioClient.messages.create({
                body: message,
                from: this.fromPhoneNumber,
                to: phoneNumber,
            })

            if (messageInstance.sid) {
                logInfo("SMS OTP sent successfully", {
                    phoneNumber,
                    messageSid: messageInstance.sid,
                    status: messageInstance.status,
                })
                return true
            } else {
                logError("Failed to send SMS OTP", new Error("No message SID returned"), {
                    phoneNumber,
                })
                return false
            }
        } catch (error) {
            logError("Twilio SMS service error", error as Error, { phoneNumber })
            return false
        }
    }

    // Send welcome SMS
    async sendWelcomeSMS(phoneNumber: string, firstName: string): Promise<boolean> {
        try {
            const message = `Welcome to 2bigha, ${firstName}! Your account has been created successfully. Start exploring properties and connect with agents.`

            const messageInstance = await this.twilioClient.messages.create({
                body: message,
                from: this.fromPhoneNumber,
                to: phoneNumber,
            })

            if (messageInstance.sid) {
                logInfo("Welcome SMS sent successfully", {
                    phoneNumber,
                    messageSid: messageInstance.sid,
                    status: messageInstance.status,
                })
                return true
            } else {
                logError("Failed to send welcome SMS", new Error("No message SID returned"), {
                    phoneNumber,
                })
                return false
            }
        } catch (error) {
            logError("Welcome SMS service error", error as Error, { phoneNumber })
            return false
        }
    }

    // Send password reset SMS
    async sendPasswordResetSMS(phoneNumber: string, resetCode: string): Promise<boolean> {
        try {
            const message = `Your password reset code is: ${resetCode}. This code expires in 15 minutes. If you didn't request this, please ignore this message.`

            const messageInstance = await this.twilioClient.messages.create({
                body: message,
                from: this.fromPhoneNumber,
                to: phoneNumber,
            })

            if (messageInstance.sid) {
                logInfo("Password reset SMS sent successfully", {
                    phoneNumber,
                    messageSid: messageInstance.sid,
                    status: messageInstance.status,
                })
                return true
            } else {
                logError("Failed to send password reset SMS", new Error("No message SID returned"), {
                    phoneNumber,
                })
                return false
            }
        } catch (error) {
            logError("Password reset SMS service error", error as Error, { phoneNumber })
            return false
        }
    }

    // Send security alert SMS
    async sendSecurityAlertSMS(phoneNumber: string, alertMessage: string): Promise<boolean> {
        try {
            const message = `Security Alert: ${alertMessage}. If this wasn't you, please contact support immediately.`

            const messageInstance = await this.twilioClient.messages.create({
                body: message,
                from: this.fromPhoneNumber,
                to: phoneNumber,
            })

            if (messageInstance.sid) {
                logInfo("Security alert SMS sent successfully", {
                    phoneNumber,
                    messageSid: messageInstance.sid,
                    status: messageInstance.status,
                })
                return true
            } else {
                logError("Failed to send security alert SMS", new Error("No message SID returned"), {
                    phoneNumber,
                })
                return false
            }
        } catch (error) {
            logError("Security alert SMS service error", error as Error, { phoneNumber })
            return false
        }
    }

    // Test SMS service
    async testSMSService(testPhoneNumber: string): Promise<boolean> {
        try {
            const testMessage =
                "This is a test message from Twilio SMS service. Your 2bigha Platform is working correctly!"

            const messageInstance = await this.twilioClient.messages.create({
                body: testMessage,
                from: this.fromPhoneNumber,
                to: testPhoneNumber,
            })

            if (messageInstance.sid) {
                logInfo("SMS service test successful", {
                    testPhoneNumber,
                    messageSid: messageInstance.sid,
                    status: messageInstance.status,
                })
                return true
            } else {
                logError("SMS service test failed", new Error("No message SID returned"), {
                    testPhoneNumber,
                })
                return false
            }
        } catch (error) {
            logError("SMS service test error", error as Error, { testPhoneNumber })
            return false
        }
    }

    // Get message status
    async getMessageStatus(messageSid: string) {
        try {
            const message = await this.twilioClient.messages(messageSid).fetch()

            logInfo("Message status retrieved", {
                messageSid,
                status: message.status,
                errorCode: message.errorCode,
                errorMessage: message.errorMessage,
            })

            return {
                sid: message.sid,
                status: message.status,
                errorCode: message.errorCode,
                errorMessage: message.errorMessage,
                dateCreated: message.dateCreated,
                dateSent: message.dateSent,
                dateUpdated: message.dateUpdated,
            }
        } catch (error) {
            logError("Failed to get message status", error as Error, { messageSid })
            return null
        }
    }

    // Send bulk SMS (for notifications)
    async sendBulkSMS(
        phoneNumbers: string[],
        message: string,
    ): Promise<{ success: number; failed: number; results: any[] }> {
        const results = []
        let successCount = 0
        let failedCount = 0

        for (const phoneNumber of phoneNumbers) {
            try {
                const messageInstance = await this.twilioClient.messages.create({
                    body: message,
                    from: this.fromPhoneNumber,
                    to: phoneNumber,
                })

                if (messageInstance.sid) {
                    successCount++
                    results.push({
                        phoneNumber,
                        success: true,
                        messageSid: messageInstance.sid,
                        status: messageInstance.status,
                    })
                } else {
                    failedCount++
                    results.push({
                        phoneNumber,
                        success: false,
                        error: "No message SID returned",
                    })
                }
            } catch (error) {
                failedCount++
                results.push({
                    phoneNumber,
                    success: false,
                    error: (error as Error).message,
                })
                logError("Bulk SMS failed for phone number", error as Error, { phoneNumber })
            }

            // Add small delay to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 100))
        }

        logInfo("Bulk SMS completed", {
            total: phoneNumbers.length,
            success: successCount,
            failed: failedCount,
        })

        return {
            success: successCount,
            failed: failedCount,
            results,
        }
    }

    // Generic send SMS method
    async sendSMS({
        to,
        body,
    }: {
        to: string
        body: string
    }): Promise<boolean> {
        try {
            const messageInstance = await this.twilioClient.messages.create({
                body,
                from: this.fromPhoneNumber,
                to,
            })

            if (messageInstance.sid) {
                logInfo("Generic SMS sent successfully", {
                    to,
                    messageSid: messageInstance.sid,
                    status: messageInstance.status,
                })
                return true
            } else {
                logError("Failed to send generic SMS", new Error("No message SID returned"), {
                    to,
                })
                return false
            }
        } catch (error) {
            logError("Generic SMS service error", error as Error, { to })
            return false
        }
    }
}

// Export singleton instance
export const twilioSMSService = new TwilioSMSService()
