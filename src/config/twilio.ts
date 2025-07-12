export interface TwilioConfig {
    accountSid: string
    authToken: string
    fromPhoneNumber: string
    webhookUrl?: string
    statusCallbackUrl?: string
}

export const twilioConfig: TwilioConfig = {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    fromPhoneNumber: process.env.TWILIO_FROM_NUMBER || "",
    webhookUrl: process.env.TWILIO_WEBHOOK_URL,
    statusCallbackUrl: process.env.TWILIO_STATUS_CALLBACK_URL,
}

// Validate Twilio configuration
export function validateTwilioConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!twilioConfig.accountSid) {
        errors.push("TWILIO_ACCOUNT_SID is required")
    }

    if (!twilioConfig.authToken) {
        errors.push("TWILIO_AUTH_TOKEN is required")
    }

    if (!twilioConfig.fromPhoneNumber) {
        errors.push("TWILIO_FROM_NUMBER is required")
    }

    // Validate phone number format
    if (twilioConfig.fromPhoneNumber && !twilioConfig.fromPhoneNumber.startsWith("+")) {
        errors.push("TWILIO_FROM_NUMBER must be in E.164 format (e.g., +1234567890)")
    }

    return {
        valid: errors.length === 0,
        errors,
    }
}

// SMS message templates
export const smsTemplates = {
    otp: (otp: string) =>
        `Your verification code is: ${otp}. This code expires in 10 minutes. Do not share this code with anyone.`,

    welcome: (firstName: string) =>
        `Welcome to 2bigha Platform, ${firstName}! Your account has been created successfully. Start exploring properties and connect with agents.`,

    passwordReset: (resetCode: string) =>
        `Your password reset code is: ${resetCode}. This code expires in 15 minutes. If you didn't request this, please ignore this message.`,

    securityAlert: (alertMessage: string) =>
        `Security Alert: ${alertMessage}. If this wasn't you, please contact support immediately.`,

    propertyAlert: (propertyTitle: string, price: string) =>
        `New property match: ${propertyTitle} - ${price}. View details in the app.`,

    inquiryReceived: (propertyTitle: string) =>
        `You received a new inquiry for "${propertyTitle}". Check your dashboard to respond.`,

    appointmentReminder: (date: string, time: string, propertyTitle: string) =>
        `Reminder: Property viewing for "${propertyTitle}" scheduled for ${date} at ${time}.`,
}

// Rate limiting configuration for SMS
export const smsRateLimits = {
    otp: {
        maxAttempts: 5,
        windowMinutes: 60,
        cooldownMinutes: 5,
    },
    general: {
        maxAttempts: 10,
        windowMinutes: 60,
    },
    bulk: {
        maxRecipients: 100,
        batchSize: 10,
        delayMs: 100,
    },
}
