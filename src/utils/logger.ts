import { createLogger, format, transports } from "winston"

const { combine, timestamp, errors, json, colorize, simple } = format

// Create logger instance
export const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), errors({ stack: true }), json()),
  defaultMeta: { service: "real-estate-api" },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new transports.File({ filename: "logs/error.log", level: "error" }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new transports.File({ filename: "logs/combined.log" }),
  ],
})

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(colorize(), simple()),
    }),
  )
}

// Helper functions for different log levels
export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta)
}

export const logError = (message: string, error?: Error, meta?: any) => {
  logger.error(message, { error: error?.stack, ...meta })
}

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta)
}

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta)
}

// Request logging middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now()

  res.on("finish", () => {
    const duration = Date.now() - start
    logInfo("HTTP Request", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get("User-Agent"),
      ip: req.ip,
    })
  })

  next()
}
