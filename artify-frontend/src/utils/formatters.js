/**
 * Formats a number as Indian Rupee currency (₹15,000.00).
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (amount == null || isNaN(Number(amount))) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(Number(amount));
}

/**
 * Formats a date string to 'Jan 15, 2025' format.
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Formats a date string to 'Jan 15, 2025, 10:00 AM' format.
 * @param {string} dateString
 * @returns {string}
 */
export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Truncates text to a maximum length and appends '...' if exceeded.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Returns a CSS badge class name based on a status string.
 * @param {string} status
 * @returns {string}
 */
export function getStatusBadgeClass(status) {
  const statusMap = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    SHIPPED: 'primary',
    DELIVERED: 'success',
    CANCELLED: 'danger',
    COMPLETED: 'success',
    FAILED: 'danger',
    ACTIVE: 'success',
    SOLD: 'secondary',
    DRAFT: 'warning',
    REFUNDED: 'info',
  };
  return statusMap[status] || 'secondary';
}

/**
 * Returns the uppercase initials from a name (first letter of first and last word).
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}
