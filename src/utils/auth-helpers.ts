import { GraphQLError } from "graphql"
import jwt from "jsonwebtoken"
import { db } from "../config/database"
import { adminUsers, platformUsers } from "../database/schema/index"
import { eq } from "drizzle-orm"

// Custom error classes for better error handling
export class AuthenticationError extends GraphQLError {
    constructor(message = "Authentication required") {
        super(message, {
            extensions: {
                code: "UNAUTHENTICATED",
                statusCode: 401,
            },
        })
    }
}

export class AuthorizationError extends GraphQLError {
    constructor(message = "Insufficient permissions") {
        super(message, {
            extensions: {
                code: "FORBIDDEN",
                statusCode: 403,
            },
        })
    }
}

// Authentication helper functions
export const requireAuth = (context: any) => {
    if (!context.user && !context.admin) {
        throw new AuthenticationError("You must be logged in to perform this action")
    }
    return context.user || context.admin
}

export const requireAdmin = (context: any) => {
    if (!context.admin) {
        throw new AuthenticationError("Admin access required")
    }
    return context.admin
}

export const requirePlatformUser = (context: any) => {
    if (!context.user) {
        throw new AuthenticationError("Platform user access required")
    }
    return context.user
}

// Permission-based authentication
export const requirePermission = (context: any, permission: string) => {
    if (!context.admin) {
        throw new AuthenticationError("Admin access required")
    }

    if (!context.admin.permissions?.includes(permission)) {
        throw new AuthorizationError(`Permission '${permission}' required`)
    }

    return context.admin
}

// JWT token verification
export const verifyToken = async (token: string): Promise<any> => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

        if (decoded.type === "admin") {
            const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, decoded.userId))

            if (!admin || !admin.isActive) {
                throw new AuthenticationError("Invalid or inactive admin account")
            }

            return { admin, type: "admin" }
        } else {
            const [user] = await db.select().from(platformUsers).where(eq(platformUsers.id, decoded.userId))

            if (!user || !user.isActive) {
                throw new AuthenticationError("Invalid or inactive user account")
            }

            return { user, type: "user" }
        }
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AuthenticationError("Invalid token")
        }
        if (error instanceof jwt.TokenExpiredError) {
            throw new AuthenticationError("Token expired")
        }
        throw error
    }
}
