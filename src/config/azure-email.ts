export interface AzureEmailConfiguration {
    connectionString: string
    fromAddress: string
    fromDisplayName: string
    enableDeliveryReports: boolean
    enableClickTracking: boolean
    enableOpenTracking: boolean
    maxRetryAttempts: number
    retryDelayMs: number
    batchSize: number
    rateLimitPerMinute: number
}

export const azureEmailConfig: AzureEmailConfiguration = {
    connectionString: process.env.AZURE_COMMUNICATION_CONNECTION_STRING || "",
    fromAddress: process.env.AZURE_EMAIL_FROM_ADDRESS || "noreply@yourdomain.com",
    fromDisplayName: process.env.AZURE_EMAIL_FROM_NAME || "2bigha Admin",
    enableDeliveryReports: process.env.AZURE_EMAIL_DELIVERY_REPORTS === "true",
    enableClickTracking: process.env.AZURE_EMAIL_CLICK_TRACKING === "true",
    enableOpenTracking: process.env.AZURE_EMAIL_OPEN_TRACKING === "true",
    maxRetryAttempts: Number.parseInt(process.env.AZURE_EMAIL_MAX_RETRIES || "3"),
    retryDelayMs: Number.parseInt(process.env.AZURE_EMAIL_RETRY_DELAY || "1000"),
    batchSize: Number.parseInt(process.env.AZURE_EMAIL_BATCH_SIZE || "10"),
    rateLimitPerMinute: Number.parseInt(process.env.AZURE_EMAIL_RATE_LIMIT || "100"),
}

// Validate configuration
export function validateAzureEmailConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!azureEmailConfig.connectionString) {
        errors.push("AZURE_COMMUNICATION_CONNECTION_STRING is required")
    }

    if (!azureEmailConfig.fromAddress) {
        errors.push("AZURE_EMAIL_FROM_ADDRESS is required")
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (azureEmailConfig.fromAddress && !emailRegex.test(azureEmailConfig.fromAddress)) {
        errors.push("AZURE_EMAIL_FROM_ADDRESS must be a valid email address")
    }

    if (azureEmailConfig.maxRetryAttempts < 0 || azureEmailConfig.maxRetryAttempts > 10) {
        errors.push("AZURE_EMAIL_MAX_RETRIES must be between 0 and 10")
    }

    if (azureEmailConfig.batchSize < 1 || azureEmailConfig.batchSize > 100) {
        errors.push("AZURE_EMAIL_BATCH_SIZE must be between 1 and 100")
    }

    return {
        valid: errors.length === 0,
        errors,
    }
}

// Environment variables documentation
export const requiredEnvironmentVariables = [
    {
        name: "AZURE_COMMUNICATION_CONNECTION_STRING",
        description: "Connection string for Azure Communication Services",
        example: "endpoint=https://your-resource.communication.azure.com/;accesskey=your-access-key",
        required: true,
    },
    {
        name: "AZURE_EMAIL_FROM_ADDRESS",
        description: "Verified sender email address in Azure Communication Services",
        example: "noreply@yourdomain.com",
        required: true,
    },
    {
        name: "AZURE_EMAIL_FROM_NAME",
        description: "Display name for the sender",
        example: "2bigha Admin",
        required: false,
    },
    {
        name: "AZURE_EMAIL_DELIVERY_REPORTS",
        description: "Enable delivery reports (true/false)",
        example: "true",
        required: false,
    },
    {
        name: "AZURE_EMAIL_CLICK_TRACKING",
        description: "Enable click tracking (true/false)",
        example: "true",
        required: false,
    },
    {
        name: "AZURE_EMAIL_OPEN_TRACKING",
        description: "Enable open tracking (true/false)",
        example: "true",
        required: false,
    },
    {
        name: "TEST_EMAIL",
        description: "Email address for testing purposes",
        example: "test@yourdomain.com",
        required: false,
    },
]
