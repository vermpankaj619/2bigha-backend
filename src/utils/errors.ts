export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403)
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409)
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500)
  }
}

// Error handler for GraphQL
export const handleGraphQLError = (error: any) => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      extensions: {
        code: getErrorCode(error.statusCode),
        statusCode: error.statusCode,
      },
    }
  }

  // Log unexpected errors
  console.error("Unexpected error:", error)

  return {
    message: "An unexpected error occurred",
    extensions: {
      code: "INTERNAL_ERROR",
      statusCode: 500,
    },
  }
}

const getErrorCode = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return "BAD_REQUEST"
    case 401:
      return "UNAUTHENTICATED"
    case 403:
      return "FORBIDDEN"
    case 404:
      return "NOT_FOUND"
    case 409:
      return "CONFLICT"
    case 500:
      return "INTERNAL_ERROR"
    default:
      return "UNKNOWN_ERROR"
  }
}
