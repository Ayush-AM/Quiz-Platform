/**
 * Utility functions for standardized error handling across the application
 */

/**
 * Process API error responses and extract meaningful error messages
 * @param {Error|Response} error - The error object or response
 * @returns {string} A user-friendly error message
 */
export const processApiError = async (error) => {
  // If it's a Response object
  if (error instanceof Response) {
    try {
      const data = await error.json();
      return data.message || `Error: ${error.status} ${error.statusText}`;
    } catch (e) {
      return `Error: ${error.status} ${error.statusText}`;
    }
  }
  
  // If it's a network error
  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    return 'Network error: Unable to connect to the server. Please check your internet connection.';
  }
  
  // If it's a standard Error object
  return error.message || 'An unknown error occurred';
};

/**
 * Handle form validation errors
 * @param {Object} formData - The form data to validate
 * @param {Object} validationRules - Rules for validation
 * @returns {Object} Object with isValid flag and errors object
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];
    
    // Required field validation
    if (rules.required && (!value || value.trim() === '')) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      isValid = false;
    }
    
    // Email validation
    if (rules.isEmail && value && !/\S+@\S+\.\S+/.test(value)) {
      errors[field] = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Minimum length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rules.minLength} characters`;
      isValid = false;
    }
    
    // Maximum length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} cannot exceed ${rules.maxLength} characters`;
      isValid = false;
    }
    
    // Pattern validation
    if (rules.pattern && value && !rules.pattern.test(value)) {
      errors[field] = rules.patternMessage || `Invalid ${field} format`;
      isValid = false;
    }
    
    // Match validation (e.g., password confirmation)
    if (rules.match && formData[rules.match] !== value) {
      errors[field] = rules.matchMessage || `${field.charAt(0).toUpperCase() + field.slice(1)} does not match`;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};

/**
 * Log errors to console with additional context
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @param {Object} additionalData - Any additional data to log
 */
export const logError = (error, context, additionalData = {}) => {
  console.error(`Error in ${context}:`, error, additionalData);
  
  // Here you could also send errors to a monitoring service
  // like Sentry, LogRocket, etc.
};

/**
 * Create a standardized error object for API responses
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} details - Additional error details
 * @returns {Object} Standardized error object
 */
export const createErrorResponse = (message, statusCode = 500, details = {}) => {
  return {
    error: true,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    details
  };
};