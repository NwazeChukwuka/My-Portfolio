/**
 * Input Sanitization Utilities
 * Provides secure input validation and sanitization functions
 */

/**
 * Sanitizes text input to prevent XSS attacks
 * @param {string} input - Raw input string
 * @param {object} options - Sanitization options
 * @returns {string} Sanitized string
 */
export const sanitizeText = (input, options = {}) => {
  if (typeof input !== 'string') {
    return '';
  }

  const {
    maxLength = 1000,
    allowLineBreaks = true,
    trim = true
  } = options;

  let sanitized = input;

  // Trim whitespace if requested
  if (trim) {
    sanitized = sanitized.trim();
  }

  // Remove potentially dangerous characters
  sanitized = sanitized
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Control characters
    .replace(/[\uFEFF]/g, '') // BOM
    .replace(/[\u200B-\u200D\uFEFF]/g, ''); // Zero-width characters

  // Handle HTML entities (escape them)
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // Handle line breaks
  if (!allowLineBreaks) {
    sanitized = sanitized.replace(/[\r\n]/g, ' ');
  } else {
    // Convert line breaks to <br> for display (stored as \n)
    sanitized = sanitized.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }

  // Enforce maximum length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
    // Add ellipsis if truncated
    if (maxLength > 3) {
      sanitized = sanitized.substring(0, maxLength - 3) + '...';
    }
  }

  return sanitized;
};

/**
 * Validates and sanitizes email addresses
 * @param {string} email - Email address to validate
 * @returns {object} Validation result with sanitized email
 */
export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') {
    return { valid: false, sanitized: '', error: 'Email must be a string' };
  }

  const trimmed = email.trim().toLowerCase();
  
  // Basic email format validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmed)) {
    return { valid: false, sanitized: '', error: 'Invalid email format' };
  }

  // Additional security checks
  if (trimmed.length > 254) {
    return { valid: false, sanitized: '', error: 'Email too long' };
  }

  // Sanitize the email
  const sanitized = sanitizeText(trimmed, { 
    maxLength: 254, 
    allowLineBreaks: false, 
    trim: false 
  });

  return { valid: true, sanitized, error: null };
};

/**
 * Validates and sanitizes phone numbers
 * @param {string} phone - Phone number to validate
 * @returns {object} Validation result with sanitized phone
 */
export const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') {
    return { valid: false, sanitized: '', error: 'Phone must be a string' };
  }

  // Remove all non-digit characters except +, -, (, ), and space
  const cleaned = phone.replace(/[^\d+\-\(\)\s]/g, '').trim();
  
  // Basic phone validation (allow international formats)
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  
  if (!phoneRegex.test(cleaned) || cleaned.length > 20) {
    return { valid: false, sanitized: '', error: 'Invalid phone format' };
  }

  return { valid: true, sanitized: cleaned, error: null };
};

/**
 * Validates and sanitizes form subjects
 * @param {string} subject - Subject to validate
 * @returns {object} Validation result with sanitized subject
 */
export const sanitizeSubject = (subject) => {
  if (typeof subject !== 'string') {
    return { valid: false, sanitized: '', error: 'Subject must be a string' };
  }

  const trimmed = subject.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, sanitized: '', error: 'Subject is required' };
  }

  if (trimmed.length > 100) {
    return { valid: false, sanitized: '', error: 'Subject too long (max 100 characters)' };
  }

  const sanitized = sanitizeText(trimmed, { 
    maxLength: 100, 
    allowLineBreaks: false 
  });

  return { valid: true, sanitized, error: null };
};

/**
 * Validates and sanitizes message content
 * @param {string} message - Message to validate
 * @returns {object} Validation result with sanitized message
 */
export const sanitizeMessage = (message) => {
  if (typeof message !== 'string') {
    return { valid: false, sanitized: '', error: 'Message must be a string' };
  }

  const trimmed = message.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, sanitized: '', error: 'Message is required' };
  }

  if (trimmed.length > 2000) {
    return { valid: false, sanitized: '', error: 'Message too long (max 2000 characters)' };
  }

  const sanitized = sanitizeText(trimmed, { 
    maxLength: 2000, 
    allowLineBreaks: true 
  });

  return { valid: true, sanitized, error: null };
};

/**
 * Validates and sanitizes names
 * @param {string} name - Name to validate
 * @returns {object} Validation result with sanitized name
 */
export const sanitizeName = (name) => {
  if (typeof name !== 'string') {
    return { valid: false, sanitized: '', error: 'Name must be a string' };
  }

  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, sanitized: '', error: 'Name is required' };
  }

  if (trimmed.length > 50) {
    return { valid: false, sanitized: '', error: 'Name too long (max 50 characters)' };
  }

  // Allow letters, spaces, hyphens, apostrophes, and periods
  const nameRegex = /^[a-zA-Z\s\-\.'\u00C0-\u017F]+$/;
  
  if (!nameRegex.test(trimmed)) {
    return { valid: false, sanitized: '', error: 'Name contains invalid characters' };
  }

  const sanitized = sanitizeText(trimmed, { 
    maxLength: 50, 
    allowLineBreaks: false 
  });

  return { valid: true, sanitized, error: null };
};

/**
 * Comprehensive contact form validation
 * @param {object} formData - Form data object
 * @returns {object} Validation result
 */
export const validateContactForm = (formData) => {
  const errors = {};
  const sanitized = {};

  // Validate name
  const nameResult = sanitizeName(formData.name);
  if (!nameResult.valid) {
    errors.name = nameResult.error;
  } else {
    sanitized.name = nameResult.sanitized;
  }

  // Validate email (optional but if provided, must be valid)
  if (formData.email && formData.email.trim()) {
    const emailResult = sanitizeEmail(formData.email);
    if (!emailResult.valid) {
      errors.email = emailResult.error;
    } else {
      sanitized.email = emailResult.sanitized;
    }
  }

  // Validate phone (optional but if provided, must be valid)
  if (formData.phone && formData.phone.trim()) {
    const phoneResult = sanitizePhone(formData.phone);
    if (!phoneResult.valid) {
      errors.phone = phoneResult.error;
    } else {
      sanitized.phone = phoneResult.sanitized;
    }
  }

  // Check that at least one contact method is provided
  if (!sanitized.email && !sanitized.phone) {
    errors.contact = 'Please provide at least one contact method: email or phone';
  }

  // Validate subject
  const subjectResult = sanitizeSubject(formData.subject);
  if (!subjectResult.valid) {
    errors.subject = subjectResult.error;
  } else {
    sanitized.subject = subjectResult.sanitized;
  }

  // Validate message
  const messageResult = sanitizeMessage(formData.message);
  if (!messageResult.valid) {
    errors.message = messageResult.error;
  } else {
    sanitized.message = messageResult.sanitized;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
    hasEmail: Boolean(sanitized.email),
    hasPhone: Boolean(sanitized.phone)
  };
};
