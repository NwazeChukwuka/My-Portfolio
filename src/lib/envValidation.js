/**
 * Environment Variable Validation
 * Validates all required environment variables on app startup
 */

import { logger } from './logger';

/**
 * Validates required environment variables
 * @returns {boolean} True if validation passed, false otherwise
 */
export const validateEnvironment = () => {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const optionalVars = [
    'VITE_APP_NAME',
    'VITE_APP_DESCRIPTION',
    'VITE_CONTACT_EMAIL'
  ];

  const missing = requiredVars.filter(varName => {
    const value = import.meta.env[varName];
    return !value || value.trim() === '';
  });

  if (missing.length > 0) {
    const errorMessage = `❌ Missing required environment variables:\n${missing.map(varName => `   - ${varName}`).join('\n')}\n\nPlease check your .env file and restart the application.`;
    
    // In development, show warning but don't crash the app
    if (import.meta.env.DEV) {
      logger.warn(errorMessage);
      logger.warn('⚠️  App will run in development mode with limited functionality.');
      return false; // Validation failed but don't throw
    }
    
    // In production, show user-friendly message
    throw new Error('Application configuration error. Please contact support.');
  }

  // Log warnings for missing optional variables
  const missingOptional = optionalVars.filter(varName => {
    const value = import.meta.env[varName];
    return !value || value.trim() === '';
  });

  if (missingOptional.length > 0 && import.meta.env.DEV) {
    logger.warn(`⚠️  Optional environment variables not set:\n${missingOptional.map(varName => `   - ${varName}`).join('\n')}`);
  }

  // Validate Supabase URL format
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
    logger.warn('⚠️  VITE_SUPABASE_URL should start with https://');
  }

  // Log success in development
  if (import.meta.env.DEV) {
    logger.info('✅ Environment variables validated successfully');
  }
};

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets environment info for debugging
 * @returns {object} Environment information
 */
export const getEnvironmentInfo = () => {
  return {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
    baseUrl: import.meta.env.BASE_URL,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'
  };
};
