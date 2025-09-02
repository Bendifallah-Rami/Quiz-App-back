/**
 * Validates an email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format, false otherwise
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result with isValid and message
 */
const validatePassword = (password, options = {}) => {
  const defaultOptions = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  };

  const opts = { ...defaultOptions, ...options };
  const errors = [];

  if (!password || password.length < opts.minLength) {
    errors.push(`Password must be at least ${opts.minLength} characters long`);
  }

  if (opts.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (opts.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (opts.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (opts.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    message: errors.join(', ')
  };
};

/**
 * Sanitizes user input to prevent XSS and other injection attacks
 * @param {string} input - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeInput = (input) => {
  if (!input) return input;
  
  // Replace potentially dangerous characters
  return String(input)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

module.exports = {
  isValidEmail,
  validatePassword,
  sanitizeInput
};
