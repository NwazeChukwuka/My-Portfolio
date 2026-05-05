/**
 * Error Logging Service
 * Centralized error logging with multiple output options
 */

class ErrorLogger {
  constructor() {
    this.isDev = import.meta.env.DEV;
    this.logLevel = this.getLogLevel();
    this.errorQueue = [];
    this.maxQueueSize = 50;
    this.flushInterval = 30000; // 30 seconds
    this.initFlushTimer();
  }

  getLogLevel() {
    const levels = ['error', 'warn', 'info', 'debug'];
    const configLevel = import.meta.env.VITE_LOG_LEVEL || 'error';
    return levels.indexOf(configLevel) >= 0 ? configLevel : 'error';
  }

  shouldLog(level) {
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  /**
   * Log an error with context
   * @param {Error|string} error - The error to log
   * @param {object} context - Additional context information
   * @param {string} level - Log level (error, warn, info, debug)
   */
  log(error, context = {}, level = 'error') {
    if (!this.shouldLog(level)) return;

    const errorEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level,
      message: typeof error === 'string' ? error : error?.message || 'Unknown error',
      stack: typeof error === 'object' ? error?.stack : null,
      context: this.sanitizeContext(context),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId()
    };

    // Add to queue
    this.errorQueue.push(errorEntry);
    
    // Trim queue if too large
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }

    // Log to console in development
    if (this.isDev) {
      this.logToConsole(errorEntry);
    }

    // Log to external services in production
    if (!this.isDev && level === 'error') {
      this.logToExternalService(errorEntry);
    }

    // Store in localStorage for debugging
    this.storeInLocalStorage(errorEntry);
  }

  /**
   * Log error specifically
   */
  error(error, context = {}) {
    this.log(error, context, 'error');
  }

  /**
   * Log warning specifically
   */
  warn(message, context = {}) {
    this.log(message, context, 'warn');
  }

  /**
   * Log info specifically
   */
  info(message, context = {}) {
    this.log(message, context, 'info');
  }

  /**
   * Log debug specifically
   */
  debug(message, context = {}) {
    this.log(message, context, 'debug');
  }

  /**
   * Log API errors with retry information
   */
  logApiError(error, apiCall, retryCount = 0) {
    this.log(error, {
      type: 'api_error',
      apiCall,
      retryCount,
      endpoint: apiCall?.url || apiCall?.endpoint,
      method: apiCall?.method,
      timestamp: new Date().toISOString()
    }, 'error');
  }

  /**
   * Log user interaction errors
   */
  logUserActionError(error, action, element) {
    this.log(error, {
      type: 'user_action_error',
      action,
      elementType: element?.tagName,
      elementId: element?.id,
      elementClass: element?.className,
      timestamp: new Date().toISOString()
    }, 'error');
  }

  /**
   * Generate unique error ID
   */
  generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current user ID (if available)
   */
  getCurrentUserId() {
    // Try to get from auth context or localStorage
    try {
      return localStorage.getItem('userId') || 'anonymous';
    } catch {
      return 'anonymous';
    }
  }

  /**
   * Get session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  /**
   * Sanitize context to remove sensitive information
   */
  sanitizeContext(context) {
    const sanitized = { ...context };
    const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth'];
    
    sensitiveKeys.forEach(key => {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Log to console with formatting
   */
  logToConsole(errorEntry) {
    const style = {
      error: 'color: #ff4444; font-weight: bold;',
      warn: 'color: #ffaa00; font-weight: bold;',
      info: 'color: #4488ff; font-weight: bold;',
      debug: 'color: #888888; font-weight: bold;'
    };

    console.group(`%c${errorEntry.level.toUpperCase()}: ${errorEntry.message}`, style[errorEntry.level]);
    console.log('ID:', errorEntry.id);
    console.log('Timestamp:', errorEntry.timestamp);
    console.log('Context:', errorEntry.context);
    if (errorEntry.stack) {
      console.log('Stack:', errorEntry.stack);
    }
    console.groupEnd();
  }

  /**
   * Log to external service (placeholder for future integration)
   */
  async logToExternalService(errorEntry) {
    // Placeholder for services like Sentry, LogRocket, etc.
    // For now, we'll just store in localStorage
    try {
      // Example: await fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorEntry) });
      // Or integrate with Sentry: Sentry.captureException(error, { extra: errorEntry.context });
    } catch (e) {
      console.warn('Failed to log to external service:', e);
    }
  }

  /**
   * Store error in localStorage
   */
  storeInLocalStorage(errorEntry) {
    try {
      const recentErrors = JSON.parse(localStorage.getItem('errorLog') || '[]');
      recentErrors.unshift(errorEntry);
      // Keep only last 100 errors
      const trimmedErrors = recentErrors.slice(0, 100);
      localStorage.setItem('errorLog', JSON.stringify(trimmedErrors));
    } catch (e) {
      console.warn('Failed to store error in localStorage:', e);
    }
  }

  /**
   * Initialize flush timer for batch processing
   */
  initFlushTimer() {
    setInterval(() => {
      this.flushQueue();
    }, this.flushInterval);
  }

  /**
   * Flush error queue to external service
   */
  async flushQueue() {
    if (this.errorQueue.length === 0 || this.isDev) return;

    const errorsToFlush = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // Batch send errors to external service
      await this.sendBatchToExternal(errorsToFlush);
    } catch (e) {
      // Re-add failed errors to queue
      this.errorQueue.unshift(...errorsToFlush);
      console.warn('Failed to flush error queue:', e);
    }
  }

  /**
   * Send batch of errors to external service
   */
  async sendBatchToExternal(errors) {
    // Placeholder for batch error reporting
    // Example: await fetch('/api/errors/batch', { 
    //   method: 'POST', 
    //   body: JSON.stringify({ errors }) 
    // });
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(limit = 10) {
    try {
      const errors = JSON.parse(localStorage.getItem('errorLog') || '[]');
      return errors.slice(0, limit);
    } catch {
      return [];
    }
  }

  /**
   * Clear error history
   */
  clearErrorHistory() {
    try {
      localStorage.removeItem('errorLog');
      this.errorQueue = [];
    } catch (e) {
      console.warn('Failed to clear error history:', e);
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    try {
      const errors = JSON.parse(localStorage.getItem('errorLog') || '[]');
      const stats = {
        total: errors.length,
        byLevel: {},
        byType: {},
        recent: errors.filter(e => {
          const errorTime = new Date(e.timestamp);
          const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
          return errorTime > hourAgo;
        }).length
      };

      errors.forEach(error => {
        stats.byLevel[error.level] = (stats.byLevel[error.level] || 0) + 1;
        const type = error.context?.type || 'unknown';
        stats.byType[type] = (stats.byType[type] || 0) + 1;
      });

      return stats;
    } catch {
      return { total: 0, byLevel: {}, byType: {}, recent: 0 };
    }
  }
}

// Create singleton instance
export const errorLogger = new ErrorLogger();

// Export convenience functions
export const logError = (error, context) => errorLogger.error(error, context);
export const logWarning = (message, context) => errorLogger.warn(message, context);
export const logInfo = (message, context) => errorLogger.info(message, context);
export const logDebug = (message, context) => errorLogger.debug(message, context);
export const logApiError = (error, apiCall, retryCount) => errorLogger.logApiError(error, apiCall, retryCount);
export const logUserActionError = (error, action, element) => errorLogger.logUserActionError(error, action, element);

export default errorLogger;
