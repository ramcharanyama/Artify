/**
 * Validates an email address format.
 * @param {string} email
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { isValid: false, message: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
}

/**
 * Validates a password for strength requirements.
 * Must be at least 8 characters and contain uppercase, lowercase, number, and special character.
 * @param {string} password
 * @returns {{ isValid: boolean, message: string }}
 */
export function validatePassword(password) {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  return { isValid: true, message: '' };
}

/**
 * Validates an Indian phone number (10 digits starting with 6-9).
 * @param {string} phone
 * @returns {{ isValid: boolean, message: string }}
 */
export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return { isValid: false, message: 'Phone number is required' };
  }
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone.trim())) {
    return { isValid: false, message: 'Please enter a valid 10-digit Indian phone number' };
  }
  return { isValid: true, message: '' };
}

/**
 * Validates that a required field is not empty.
 * @param {string} value
 * @param {string} fieldName
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true, message: '' };
}

/**
 * Validates that a price is a positive number greater than zero.
 * @param {number|string} price
 * @returns {{ isValid: boolean, message: string }}
 */
export function validatePrice(price) {
  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice <= 0) {
    return { isValid: false, message: 'Price must be a positive number greater than 0' };
  }
  return { isValid: true, message: '' };
}

/**
 * Validates that a rating is an integer between 1 and 5.
 * @param {number|string} rating
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateRating(rating) {
  const numRating = Number(rating);
  if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
    return { isValid: false, message: 'Rating must be an integer between 1 and 5' };
  }
  return { isValid: true, message: '' };
}

/**
 * Validates that password and confirm password match.
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  return { isValid: true, message: '' };
}
