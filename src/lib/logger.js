/**
 * Development Logger Utility
 * Replaces console statements with proper logging
 */

/**
 * Logger class for development-time debugging
 */
class Logger {
  constructor() {
    this.isDev = import.meta.env.DEV;
    this.logLevel = this.getLogLevel();
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

  formatMessage(level, ...args) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (level === 'error') {
      console.group(`🚨 ${prefix}`);
      console.error(...args);
      console.groupEnd();
    } else if (level === 'warn') {
      console.group(`⚠️ ${prefix}`);
      console.warn(...args);
      console.groupEnd();
    } else if (level === 'info') {
      console.log(`ℹ️ ${prefix}`, ...args);
    } else if (level === 'debug') {
      console.log(`🐛 ${prefix}`, ...args);
    }
  }

  error(...args) {
    if (this.isDev && this.shouldLog('error')) {
      this.formatMessage('error', ...args);
    }
  }

  warn(...args) {
    if (this.isDev && this.shouldLog('warn')) {
      this.formatMessage('warn', ...args);
    }
  }

  info(...args) {
    if (this.isDev && this.shouldLog('info')) {
      this.formatMessage('info', ...args);
    }
  }

  debug(...args) {
    if (this.isDev && this.shouldLog('debug')) {
      this.formatMessage('debug', ...args);
    }
  }

  // Group related logs
  group(label, callback) {
    if (this.isDev) {
      console.group(`📁 ${label}`);
      callback();
      console.groupEnd();
    }
  }

  // Time operations
  time(label) {
    if (this.isDev) {
      console.time(label);
    }
  }

  timeEnd(label) {
    if (this.isDev) {
      console.timeEnd(label);
    }
  }

  // Table display for objects
  table(data, columns) {
    if (this.isDev && this.shouldLog('info')) {
      console.table(data, columns);
    }
  }

  // Component lifecycle logging
  componentMount(componentName, props = {}) {
    if (this.isDev && this.shouldLog('info')) {
      this.info(`🔄 Component mounted: ${componentName}`, props);
    }
  }

  componentUnmount(componentName) {
    if (this.isDev && this.shouldLog('info')) {
      this.info(`🔄 Component unmounted: ${componentName}`);
    }
  }

  componentUpdate(componentName, prevProps, nextProps) {
    if (this.isDev && this.shouldLog('debug')) {
      this.debug(`🔄 Component updated: ${componentName}`, {
        prevProps,
        nextProps,
        changed: Object.keys(nextProps).filter(key => nextProps[key] !== prevProps[key])
      });
    }
  }

  // API call logging
  apiCall(method, url, status, duration = null) {
    if (this.isDev && this.shouldLog('info')) {
      const message = duration 
        ? `🌐 ${method} ${url} - ${status} (${duration}ms)`
        : `🌐 ${method} ${url} - ${status}`;
      this.info(message);
    }
  }

  // Form validation logging
  formValidation(formName, errors = {}) {
    if (this.isDev && this.shouldLog('warn')) {
      this.warn(`📝 Form validation failed: ${formName}`, errors);
    }
  }

  // Performance logging
  performance(operation, duration) {
    if (this.isDev && this.shouldLog('info')) {
      this.info(`⚡ Performance: ${operation} took ${duration}ms`);
    }
  }

  // Route logging
  routeChange(from, to) {
    if (this.isDev && this.shouldLog('info')) {
      this.info(`🛣️ Route changed: ${from} → ${to}`);
    }
  }

  // Event logging
  event(eventType, details = {}) {
    if (this.isDev && this.shouldLog('debug')) {
      this.debug(`📢 Event: ${eventType}`, details);
    }
  }

  // State logging
  stateChange(component, state, changes) {
    if (this.isDev && this.shouldLog('debug')) {
      this.debug(`🔄 State change in ${component}`, { state, changes });
    }
  }

  // Error boundary logging
  errorBoundary(error, errorInfo, componentStack) {
    if (this.isDev && this.shouldLog('error')) {
      this.error('🚨 Error Boundary caught error:', {
        error: error.message,
        stack: error.stack,
        componentStack,
        errorInfo
      });
    }
  }

  // Development assertion
  assert(condition, message) {
    if (this.isDev && !condition) {
      this.error(`❌ Assertion failed: ${message}`);
      throw new Error(message);
    }
  }

  // Clear console
  clear() {
    if (this.isDev) {
      console.clear();
      this.info('🧹 Console cleared');
    }
  }
}

// Create singleton instance
export const logger = new Logger();

// Export convenience functions
export const logError = (...args) => logger.error(...args);
export const logWarn = (...args) => logger.warn(...args);
export const logInfo = (...args) => logger.info(...args);
export const logDebug = (...args) => logger.debug(...args);

// Export specialized logging functions
export const logComponentMount = (name, props) => logger.componentMount(name, props);
export const logComponentUnmount = (name) => logger.componentUnmount(name);
export const logComponentUpdate = (name, prevProps, nextProps) => logger.componentUpdate(name, prevProps, nextProps);
export const logApiCall = (method, url, status, duration) => logger.apiCall(method, url, status, duration);
export const logFormValidation = (name, errors) => logger.formValidation(name, errors);
export const logPerformance = (operation, duration) => logger.performance(operation, duration);
export const logRouteChange = (from, to) => logger.routeChange(from, to);
export const logEvent = (type, details) => logger.event(type, details);
export const logStateChange = (component, state, changes) => logger.stateChange(component, state, changes);
export const logErrorBoundary = (error, errorInfo, componentStack) => logger.errorBoundary(error, errorInfo, componentStack);

export default logger;
