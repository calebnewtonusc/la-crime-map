/**
 * Error Logger Utility
 * Centralized error logging for debugging and monitoring
 */

export interface ErrorLog {
  timestamp: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userAgent?: string;
  url?: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: ErrorLog[] = [];
  private maxLogs: number = 100;
  private storageKey: string = 'la-crime-map-error-logs';

  private constructor() {
    this.loadLogs();
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * Load logs from localStorage
   */
  private loadLogs(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load error logs from storage:', error);
    }
  }

  /**
   * Save logs to localStorage
   */
  private saveLogs(): void {
    try {
      // Keep only the most recent logs
      const logsToSave = this.logs.slice(-this.maxLogs);
      localStorage.setItem(this.storageKey, JSON.stringify(logsToSave));
      this.logs = logsToSave;
    } catch (error) {
      console.warn('Failed to save error logs to storage:', error);
    }
  }

  /**
   * Log an error
   */
  log(
    error: Error | string,
    context?: Record<string, any>,
    severity: ErrorLog['severity'] = 'medium'
  ): void {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      message: typeof error === 'string' ? error : error.message,
      stack: error instanceof Error ? error.stack : undefined,
      context,
      severity,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.logs.push(errorLog);
    this.saveLogs();

    // Console output with appropriate level
    const consoleMethod = severity === 'critical' ? 'error' : severity === 'high' ? 'error' : 'warn';
    console[consoleMethod]('[ErrorLogger]', errorLog);

    // In production, you could send this to an external logging service
    // Example: this.sendToLoggingService(errorLog);
  }

  /**
   * Log a low severity error
   */
  logLow(error: Error | string, context?: Record<string, any>): void {
    this.log(error, context, 'low');
  }

  /**
   * Log a medium severity error
   */
  logMedium(error: Error | string, context?: Record<string, any>): void {
    this.log(error, context, 'medium');
  }

  /**
   * Log a high severity error
   */
  logHigh(error: Error | string, context?: Record<string, any>): void {
    this.log(error, context, 'high');
  }

  /**
   * Log a critical error
   */
  logCritical(error: Error | string, context?: Record<string, any>): void {
    this.log(error, context, 'critical');
  }

  /**
   * Get all logs
   */
  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by severity
   */
  getLogsBySeverity(severity: ErrorLog['severity']): ErrorLog[] {
    return this.logs.filter(log => log.severity === severity);
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 10): ErrorLog[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear error logs from storage:', error);
    }
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Download logs as a file
   */
  downloadLogs(): void {
    const dataStr = this.exportLogs();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Get error statistics
   */
  getStats(): {
    total: number;
    bySeverity: Record<ErrorLog['severity'], number>;
    last24Hours: number;
    mostCommon: { message: string; count: number }[];
  } {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const bySeverity: Record<ErrorLog['severity'], number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };

    const messageCount: Record<string, number> = {};

    let last24Hours = 0;

    this.logs.forEach(log => {
      bySeverity[log.severity]++;

      const logTime = new Date(log.timestamp).getTime();
      if (logTime >= oneDayAgo) {
        last24Hours++;
      }

      messageCount[log.message] = (messageCount[log.message] || 0) + 1;
    });

    const mostCommon = Object.entries(messageCount)
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total: this.logs.length,
      bySeverity,
      last24Hours,
      mostCommon
    };
  }

  /**
   * Send logs to external service (placeholder)
   */
  private async sendToLoggingService(errorLog: ErrorLog): Promise<void> {
    // In production, implement this to send to Sentry, LogRocket, etc.
    // Example:
    // try {
    //   await fetch('https://your-logging-service.com/api/logs', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(errorLog)
    //   });
    // } catch (error) {
    //   console.error('Failed to send log to external service:', error);
    // }
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance();

// Convenience functions
export const logError = (
  error: Error | string,
  context?: Record<string, any>,
  severity?: ErrorLog['severity']
): void => {
  errorLogger.log(error, context, severity);
};

export const logLowError = (error: Error | string, context?: Record<string, any>): void => {
  errorLogger.logLow(error, context);
};

export const logMediumError = (error: Error | string, context?: Record<string, any>): void => {
  errorLogger.logMedium(error, context);
};

export const logHighError = (error: Error | string, context?: Record<string, any>): void => {
  errorLogger.logHigh(error, context);
};

export const logCriticalError = (error: Error | string, context?: Record<string, any>): void => {
  errorLogger.logCritical(error, context);
};

export default errorLogger;
