import { OAuth2Client } from "google-auth-library"
import { logInfo } from "../../utils/logger"
import { logError } from "../../utils/logger"


interface GoogleUserInfo {
    sub: string
    email: string
    email_verified: boolean
    given_name: string
    family_name: string
    picture: string
    locale: string
}

export class GoogleAuthService {
    private client: OAuth2Client

    constructor() {
        const clientId = process.env.GOOGLE_CLIENT_ID
        if (!clientId) {
            throw new Error("GOOGLE_CLIENT_ID is required")
        }

        this.client = new OAuth2Client(clientId)
    }

    // Verify Google ID token and extract user information
    async verifyToken(token: string): Promise<GoogleUserInfo | null> {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            })

            const payload = ticket.getPayload()

            if (!payload) {
                logError("Invalid Google token payload", new Error("No payload in token"))
                return null
            }

            // Verify email is verified
            if (!payload.email_verified) {
                logError("Google email not verified", new Error("Email not verified"))
                return null
            }

            const userInfo: GoogleUserInfo = {
                sub: payload.sub,
                email: payload.email || "",
                email_verified: payload.email_verified || false,
                given_name: payload.given_name || "",
                family_name: payload.family_name || "",
                picture: payload.picture || "",
                locale: payload.locale || "en",
            }

            logInfo("Google token verified successfully", {
                email: userInfo.email,
                sub: userInfo.sub,
            })

            return userInfo
        } catch (error) {
            logError("Google token verification failed", error as Error)
            return null
        }
    }

    // Get user info from Google API (alternative method)
    async getUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
        try {
            const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)

            if (!response.ok) {
                throw new Error(`Google API error: ${response.status}`)
            }

            const userInfo = await response.json() as GoogleUserInfo

            logInfo("Google user info retrieved", {
                email: userInfo.email,
                id: userInfo.sub,
            })

            return userInfo
        } catch (error) {
            logError("Failed to get Google user info", error as Error)
            return null
        }
    }
}

// Export singleton instance
export const googleAuthService = new GoogleAuthService()
