/**
 * User-Friendly Error Messages
 * Provides human-readable error messages for different error types
 */

/**
 * Error message mappings for different error types
 */
const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: {
    title: 'Connection Problem',
    message: 'Unable to connect to our servers. Please check your internet connection and try again.',
    action: 'Retry'
  },
  
  TIMEOUT_ERROR: {
    title: 'Request Timeout',
    message: 'The request took too long to complete. Please try again.',
    action: 'Try Again'
  },
  
  // Supabase specific errors
  SUPABASE_NOT_CONFIGURED: {
    title: 'Service Unavailable',
    message: 'The contact service is currently unavailable. Please try again later or contact us directly via email.',
    action: 'Try Again Later'
  },
  
  SUPABASE_CONNECTION_ERROR: {
    title: 'Database Connection Error',
    message: 'Unable to connect to our database. Please try again in a few moments.',
    action: 'Retry'
  },
  
  SUPABASE_PERMISSION_ERROR: {
    title: 'Permission Denied',
    message: 'You don\'t have permission to perform this action.',
    action: 'Contact Support'
  },
  
  SUPABASE_VALIDATION_ERROR: {
    title: 'Invalid Data',
    message: 'The information provided is not valid. Please check your input and try again.',
    action: 'Check Input'
  },
  
  // Contact form specific errors
  CONTACT_RATE_LIMIT: {
    title: 'Too Many Attempts',
    message: 'You\'ve made too many contact requests. Please wait a few minutes before trying again.',
    action: 'Wait and Retry'
  },
  
  CONTACT_VALIDATION_ERROR: {
    title: 'Invalid Contact Information',
    message: 'Please check that all required fields are filled correctly.',
    action: 'Check Form'
  },
  
  // Generic errors
  UNKNOWN_ERROR: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
    action: 'Try Again'
  },
  
  VALIDATION_ERROR: {
    title: 'Validation Error',
    message: 'Please check your input and try again.',
    action: 'Check Input'
  },
  
  AUTHENTICATION_ERROR: {
    title: 'Authentication Required',
    message: 'You need to be logged in to perform this action.',
    action: 'Sign In'
  },
  
  AUTHORIZATION_ERROR: {
    title: 'Access Denied',
    message: 'You don\'t have permission to access this resource.',
    action: 'Contact Admin'
  },
  
  NOT_FOUND_ERROR: {
    title: 'Resource Not Found',
    message: 'The requested resource could not be found.',
    action: 'Go Home'
  },
  
  SERVER_ERROR: {
    title: 'Server Error',
    message: 'Our servers are experiencing issues. Please try again later.',
    action: 'Try Again Later'
  }
};

/**
 * Get user-friendly error message based on error
 * @param {Error|string} error - The error to analyze
 * @param {object} context - Additional context for error analysis
 * @returns {object} User-friendly error information
 */
export const getUserFriendlyError = (error, context = {}) => {
  const errorMessage = typeof error === 'string' ? error : error?.message || '';
  const errorCode = error?.code;
  const statusCode = error?.response?.status;
  const errorType = context?.type;
  
  // Analyze error and return appropriate message
  let errorKey = 'UNKNOWN_ERROR';
  
  // Network errors
  if (!navigator.onLine) {
    errorKey = 'NETWORK_ERROR';
  } else if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
    errorKey = 'NETWORK_ERROR';
  } else if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
    errorKey = 'TIMEOUT_ERROR';
  }
  
  // Supabase specific errors
  else if (errorMessage.includes('Supabase is not configured')) {
    errorKey = 'SUPABASE_NOT_CONFIGURED';
  } else if (errorMessage.includes('connection') || errorMessage.includes('connect')) {
    errorKey = 'SUPABASE_CONNECTION_ERROR';
  } else if (errorCode === 'PGRST301' || statusCode === 401) {
    errorKey = 'AUTHENTICATION_ERROR';
  } else if (errorCode === 'PGRST302' || statusCode === 403) {
    errorKey = 'SUPABASE_PERMISSION_ERROR';
  } else if (errorCode === 'PGRST116' || statusCode === 404) {
    errorKey = 'NOT_FOUND_ERROR';
  } else if (errorMessage.includes('validation') || statusCode === 400) {
    errorKey = 'SUPABASE_VALIDATION_ERROR';
  }
  
  // Contact form specific errors
  else if (errorType === 'contact_form' && errorMessage.includes('rate limit')) {
    errorKey = 'CONTACT_RATE_LIMIT';
  } else if (errorType === 'contact_form' && errorMessage.includes('validation')) {
    errorKey = 'CONTACT_VALIDATION_ERROR';
  }
  
  // HTTP status codes
  else if (statusCode >= 500) {
    errorKey = 'SERVER_ERROR';
  } else if (statusCode === 429) {
    errorKey = 'CONTACT_RATE_LIMIT';
  } else if (statusCode === 408) {
    errorKey = 'TIMEOUT_ERROR';
  } else if (statusCode === 401) {
    errorKey = 'AUTHENTICATION_ERROR';
  } else if (statusCode === 403) {
    errorKey = 'AUTHORIZATION_ERROR';
  } else if (statusCode === 404) {
    errorKey = 'NOT_FOUND_ERROR';
  } else if (statusCode >= 400) {
    errorKey = 'VALIDATION_ERROR';
  }
  
  // Get the error message template
  const errorTemplate = ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.UNKNOWN_ERROR;
  
  return {
    ...errorTemplate,
    key: errorKey,
    originalError: errorMessage,
    context,
    timestamp: new Date().toISOString()
  };
};

/**
 * Get error message with retry suggestion
 * @param {Error|string} error - The error to analyze
 * @param {number} retryCount - Current retry attempt
 * @param {object} context - Additional context
 * @returns {object} Error message with retry information
 */
export const getRetryErrorMessage = (error, retryCount = 0, context = {}) => {
  const baseError = getUserFriendlyError(error, context);
  
  if (retryCount > 0) {
    return {
      ...baseError,
      title: `${baseError.title} (Attempt ${retryCount + 1})`,
      message: `${baseError.message} This is attempt ${retryCount + 1} of 3.`,
      canRetry: retryCount < 3
    };
  }
  
  return {
    ...baseError,
    canRetry: true
  };
};

/**
 * Format error for display in UI
 * @param {object} errorInfo - Error information from getUserFriendlyError
 * @returns {object} Formatted error for UI display
 */
export const formatErrorForDisplay = (errorInfo) => {
  return {
    title: errorInfo.title,
    message: errorInfo.message,
    action: errorInfo.action,
    canRetry: errorInfo.canRetry,
    errorId: errorInfo.context?.errorId || null,
    timestamp: errorInfo.timestamp
  };
};

/**
 * Get success message for operations
 * @param {string} operation - Type of operation
 * @param {object} context - Additional context
 * @returns {object} Success message information
 */
export const getSuccessMessage = (operation, context = {}) => {
  const successMessages = {
    contact_form: {
      title: 'Message Sent Successfully',
      message: 'Thank you for your message! I\'ll get back to you as soon as possible.',
      action: 'Send Another'
    },
    
    project_created: {
      title: 'Project Created',
      message: 'Your project has been successfully created.',
      action: 'View Project'
    },
    
    project_updated: {
      title: 'Project Updated',
      message: 'Your project has been successfully updated.',
      action: 'View Project'
    },
    
    blog_post_created: {
      title: 'Blog Post Created',
      message: 'Your blog post has been successfully published.',
      action: 'View Post'
    },
    
    blog_post_updated: {
      title: 'Blog Post Updated',
      message: 'Your blog post has been successfully updated.',
      action: 'View Post'
    },
    
    settings_updated: {
      title: 'Settings Updated',
      message: 'Your settings have been successfully saved.',
      action: 'Continue'
    }
  };
  
  const defaultMessage = {
    title: 'Success',
    message: 'The operation was completed successfully.',
    action: 'Continue'
  };
  
  return successMessages[operation] || defaultMessage;
};

/**
 * Create toast notification object
 * @param {object} errorInfo - Error information
 * @param {string} type - Type of notification (error, success, warning, info)
 * @returns {object} Toast notification object
 */
export const createToastNotification = (errorInfo, type = 'error') => {
  return {
    id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title: errorInfo.title,
    message: errorInfo.message,
    action: errorInfo.action,
    duration: type === 'error' ? 8000 : 5000,
    canDismiss: true,
    timestamp: new Date().toISOString()
  };
};

export default {
  getUserFriendlyError,
  getRetryErrorMessage,
  formatErrorForDisplay,
  getSuccessMessage,
  createToastNotification,
  ERROR_MESSAGES
};
