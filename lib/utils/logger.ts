// Production-safe logging utility
// In production, logs are sent to monitoring; in development, logs to console

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

const isDevelopment = process.env.NODE_ENV === 'development'

function log(level: LogLevel, message: string, data?: any) {
  if (!isDevelopment && level === 'debug') {
    return // Skip debug logs in production
  }

  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`

  // In development, use console
  if (isDevelopment) {
    const logFn = console[level] || console.log
    if (data) {
      logFn(logMessage, data)
    } else {
      logFn(logMessage)
    }
  } else {
    // In production, send to monitoring service (Sentry, DataDog, etc.)
    // For now, only log errors to console in production
    if (level === 'error') {
      console.error(logMessage, data)
    }
    // TODO: Send to monitoring service
  }
}

export const logger = {
  info: (message: string, data?: any) => log('info', message, data),
  warn: (message: string, data?: any) => log('warn', message, data),
  error: (message: string, data?: any) => log('error', message, data),
  debug: (message: string, data?: any) => log('debug', message, data),
}
