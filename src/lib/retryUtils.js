/**
 * Retry Utilities
 * Provides retry logic for API calls with exponential backoff
 */

import { logApiError } from './errorLogger';

/**
 * Retry configuration options
 * @typedef {Object} RetryOptions
 * @property {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @property {number} initialDelay - Initial delay in milliseconds (default: 1000)
 * @property {number} maxDelay - Maximum delay in milliseconds (default: 10000)
 * @property {number} backoffFactor - Multiplier for delay (default: 2)
 * @property {Function} shouldRetry - Function to determine if should retry (default: retry on network errors)
 * @property {Function} onRetry - Callback called before each retry
 */

/**
 * Default retry configuration
 */
const defaultRetryOptions = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  shouldRetry: (error) => {
    // Retry on network errors, 5xx errors, and specific Supabase errors
    if (!error.response) {
      // Network error (no response received)
      return true;
    }
    
    const status = error.response?.status;
    const code = error.code;
    
    // Retry on 5xx server errors
    if (status >= 500 && status < 600) {
      return true;
    }
    
    // Retry on 429 (Too Many Requests)
    if (status === 429) {
      return true;
    }
    
    // Retry on 408 (Request Timeout)
    if (status === 408) {
      return true;
    }
    
    // Retry on specific Supabase errors
    if (code === 'PGRST116' || code === 'PGRST301') {
      return true;
    }
    
    // Don't retry on 4xx client errors (except 429, 408)
    if (status >= 400 && status < 500 && status !== 429 && status !== 408) {
      return false;
    }
    
    return true;
  },
  onRetry: (attempt, delay, error) => {
    console.log(`Retrying attempt ${attempt} after ${delay}ms due to:`, error.message);
  }
};

/**
 * Calculate delay with exponential backoff
 * @param {number} attempt - Current attempt number (0-based)
 * @param {RetryOptions} options - Retry options
 * @returns {number} Delay in milliseconds
 */
const calculateDelay = (attempt, options) => {
  const delay = options.initialDelay * Math.pow(options.backoffFactor, attempt);
  const jitter = Math.random() * 0.1 * delay; // Add 10% jitter to prevent thundering herd
  return Math.min(delay + jitter, options.maxDelay);
};

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after specified time
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {RetryOptions} options - Retry options
 * @returns {Promise} Promise that resolves with the function result
 */
export const withRetry = async (fn, options = {}) => {
  const config = { ...defaultRetryOptions, ...options };
  let lastError;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const result = await fn();
      
      // Log successful retry if not first attempt
      if (attempt > 0) {
        console.log(`Operation succeeded on attempt ${attempt + 1}`);
      }
      
      return result;
    } catch (error) {
      lastError = error;
      
      // Log the error
      logApiError(error, { attempt, maxRetries: config.maxRetries }, attempt);
      
      // Don't retry if this is the last attempt or if error shouldn't be retried
      if (attempt === config.maxRetries || !config.shouldRetry(error)) {
        break;
      }
      
      // Calculate delay and wait
      const delay = calculateDelay(attempt, config);
      
      // Call onRetry callback
      if (config.onRetry) {
        config.onRetry(attempt + 1, delay, error);
      }
      
      // Wait before retrying
      await sleep(delay);
    }
  }
  
  // All retries failed, throw the last error
  throw lastError;
};

/**
 * Create a retryable wrapper for Supabase operations
 * @param {Function} supabaseOperation - Supabase operation function
 * @param {RetryOptions} options - Retry options
 * @returns {Function} Retryable function
 */
export const createRetryableSupabaseOperation = (supabaseOperation, options = {}) => {
  return async (...args) => {
    return withRetry(async () => {
      const result = await supabaseOperation(...args);
      
      // Check for Supabase errors in the result
      if (result.error) {
        throw new Error(result.error.message || 'Supabase operation failed');
      }
      
      return result.data;
    }, options);
  };
};

/**
 * Retryable fetch wrapper
 * @param {string} url - URL to fetch
 * @param {RequestInit} options - Fetch options
 * @param {RetryOptions} retryOptions - Retry options
 * @returns {Promise} Promise that resolves with fetch response
 */
export const retryableFetch = async (url, options = {}, retryOptions = {}) => {
  return withRetry(async () => {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.response = response;
      throw error;
    }
    
    return response;
  }, retryOptions);
};

/**
 * Circuit breaker pattern for preventing cascading failures
 */
export class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000; // 1 minute
    this.monitoringPeriod = options.monitoringPeriod || 10000; // 10 seconds
    
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.successCount = 0;
    this.nextAttempt = null;
  }

  async execute(fn, options = {}) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      } else {
        this.state = 'HALF_OPEN';
      }
    }

    try {
      const result = await fn(options);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.successCount++;
    
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
    }
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      nextAttempt: this.nextAttempt
    };
  }

  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    this.nextAttempt = null;
  }
}

/**
 * Create a circuit breaker instance
 * @param {Object} options - Circuit breaker options
 * @returns {CircuitBreaker} Circuit breaker instance
 */
export const createCircuitBreaker = (options = {}) => {
  return new CircuitBreaker(options);
};

/**
 * Combine retry logic with circuit breaker
 * @param {Function} fn - Function to execute
 * @param {RetryOptions} retryOptions - Retry options
 * @param {Object} circuitBreakerOptions - Circuit breaker options
 * @returns {Promise} Promise that resolves with function result
 */
export const withRetryAndCircuitBreaker = async (fn, retryOptions = {}, circuitBreakerOptions = {}) => {
  const circuitBreaker = createCircuitBreaker(circuitBreakerOptions);
  
  return circuitBreaker.execute(async () => {
    return withRetry(fn, retryOptions);
  });
};

export default {
  withRetry,
  createRetryableSupabaseOperation,
  retryableFetch,
  CircuitBreaker,
  createCircuitBreaker,
  withRetryAndCircuitBreaker
};
