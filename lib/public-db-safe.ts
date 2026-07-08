import { Prisma } from '@prisma/client'

/**
 * Checks if the error is due to database connection issues.
 */
export function isDatabaseConnectionError(error: any): boolean {
  if (!error) return false

  const message = String(error.message || error)

  // Prisma connection error patterns
  const isPrismaConnError =
    error.name === 'PrismaClientInitializationError' ||
    error.code?.startsWith('P10') || // P1001, P1002, P1003, etc. are connection/credentials errors
    message.includes("Can't reach database server") ||
    message.includes("Can't connect to") ||
    message.includes("database server") ||
    message.includes("DATABASE_URL") ||
    message.includes("connection limit") ||
    message.includes("Connection refused")

  return isPrismaConnError
}

/**
 * Logs database fallbacks safely without flooding console.error or triggering Next.js dev overlays.
 */
export function logPublicDataFallback(context: string, error: any): void {
  const isDev = process.env.NODE_ENV === 'development'
  const isConnError = isDatabaseConnectionError(error)

  if (isConnError) {
    // Database is down/disconnected - show warning instead of error
    if (isDev) {
      console.warn(
        `[Public DB] ${context}: Cơ sở dữ liệu chưa sẵn sàng/không kết nối được. Đang sử dụng dữ liệu tĩnh fallback.`
      )
    }
    // In production, we keep connection error logs completely quiet unless explicitly debugged
  } else {
    // Logic error or other unexpected issues - log as error in dev, warning in prod
    if (isDev) {
      console.error(`[Public DB Error] ${context}:`, error)
    } else {
      console.warn(`[Public DB Error] ${context}: ${error.message || error}`)
    }
  }
}
