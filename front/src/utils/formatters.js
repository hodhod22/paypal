import i18next from "i18next";

/**
 * Format a number according to the current language
 * @param {number} value - The number to format
 * @param {object} options - Intl.NumberFormat options
 * @returns {string} Formatted number
 */
export const formatNumber = (value, options = {}) => {
  const language = i18next.language || "en";

  return new Intl.NumberFormat(language, options).format(value);
};

/**
 * Format a currency value according to the current language
 * @param {number} value - The amount to format
 * @param {string} currency - Currency code (USD, EUR, etc.)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (value, currency = "USD") => {
  const language = i18next.language || "en";

  return new Intl.NumberFormat(language, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).format(value);
};

/**
 * Format a date according to the current language
 * @param {Date|string|number} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatDate = (date, options = {}) => {
  const language = i18next.language || "en";
  const dateObj = date instanceof Date ? date : new Date(date);

  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat(language, defaultOptions).format(dateObj);
};

/**
 * Format a relative time (e.g., "2 days ago") according to the current language
 * @param {Date|string|number} date - The date to format
 * @returns {string} Formatted relative time
 */
export const formatRelativeTime = (date) => {
  const language = i18next.language || "en";
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  // Define time units in seconds
  const units = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  // Find the appropriate unit
  let unit;
  let value;

  for (const [unitName, seconds] of Object.entries(units)) {
    if (diffInSeconds >= seconds || unitName === "second") {
      unit = unitName;
      value = Math.floor(diffInSeconds / seconds);
      break;
    }
  }

  // Format using RelativeTimeFormat
  const rtf = new Intl.RelativeTimeFormat(language, { numeric: "auto" });
  return rtf.format(-value, unit);
};

/**
 * Get the appropriate text direction based on the current language
 * @returns {string} 'rtl' or 'ltr'
 */
export const getTextDirection = () => {
  const language = i18next.language || "en";
  return ["ar", "fa"].includes(language) ? "rtl" : "ltr";
};

/**
 * Format a phone number according to the current language
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  const language = i18next.language || "en";

  // Simple formatting for demonstration
  // In a real app, you would use a library like libphonenumber-js
  if (language === "en") {
    // Format for US: (123) 456-7890
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  } else if (language === "sv") {
    // Format for Sweden: 123-456 78 90
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1-$2 $3 $4");
  }

  // Default: just return the number
  return phoneNumber;
};
