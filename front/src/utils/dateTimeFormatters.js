/**
 * Date and time formatting utilities with internationalization support
 */
import { format, formatDistance, formatRelative, isDate } from "date-fns";
import enUS from "date-fns/locale/en-US";
import sv from "date-fns/locale/sv";
import ar from "date-fns/locale/ar";
import tr from "date-fns/locale/tr";
import persianLocale from "./persianLocale";
import i18next from "i18next";

/**
 * Map of language codes to date-fns locales
 */
const localeMap = {
  en: enUS,
  sv: sv,
  ar: ar,
  tr: tr,
  fa: persianLocale,
};

/**
 * Get the current locale for date-fns based on the i18next language
 * @returns {Object} - The date-fns locale object
 */
export const getCurrentLocale = () => {
  const language = i18next.language || "en";
  const languageCode = language.split("-")[0];
  return localeMap[languageCode] || enUS;
};

/**
 * Format a date using date-fns with the current locale
 * @param {Date|string|number} date - The date to format
 * @param {string} formatString - The format string (date-fns format)
 * @param {Object} options - Additional options
 * @returns {string} - The formatted date
 */
export const formatDate = (date, formatString = "PP", options = {}) => {
  if (!date) return "";

  try {
    const dateObj = isDate(date) ? date : new Date(date);
    const locale = getCurrentLocale();

    return format(dateObj, formatString, {
      locale,
      ...options,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

/**
 * Format a date relative to the current date (e.g., "2 days ago")
 * @param {Date|string|number} date - The date to format
 * @param {Date|string|number} baseDate - The base date to compare to (defaults to now)
 * @param {Object} options - Additional options
 * @returns {string} - The formatted relative date
 */
export const formatRelativeDate = (
  date,
  baseDate = new Date(),
  options = {}
) => {
  if (!date) return "";

  try {
    const dateObj = isDate(date) ? date : new Date(date);
    const baseDateObj = isDate(baseDate) ? baseDate : new Date(baseDate);
    const locale = getCurrentLocale();

    return formatRelative(dateObj, baseDateObj, {
      locale,
      ...options,
    });
  } catch (error) {
    console.error("Error formatting relative date:", error);
    return "";
  }
};

/**
 * Format the distance between two dates (e.g., "2 days")
 * @param {Date|string|number} date - The date to format
 * @param {Date|string|number} baseDate - The base date to compare to (defaults to now)
 * @param {Object} options - Additional options
 * @returns {string} - The formatted distance
 */
export const formatDistanceDate = (
  date,
  baseDate = new Date(),
  options = {}
) => {
  if (!date) return "";

  try {
    const dateObj = isDate(date) ? date : new Date(date);
    const baseDateObj = isDate(baseDate) ? baseDate : new Date(baseDate);
    const locale = getCurrentLocale();

    return formatDistance(dateObj, baseDateObj, {
      locale,
      addSuffix: true,
      ...options,
    });
  } catch (error) {
    console.error("Error formatting distance date:", error);
    return "";
  }
};

/**
 * Format a date using the browser's Intl.DateTimeFormat API
 * @param {Date|string|number} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - The formatted date
 */
export const formatDateIntl = (date, options = {}) => {
  if (!date) return "";

  try {
    const dateObj = isDate(date) ? date : new Date(date);
    const language = i18next.language || "en";

    return new Intl.DateTimeFormat(language, options).format(dateObj);
  } catch (error) {
    console.error("Error formatting date with Intl:", error);
    return "";
  }
};

/**
 * Format a time using the browser's Intl.DateTimeFormat API
 * @param {Date|string|number} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - The formatted time
 */
export const formatTimeIntl = (date, options = {}) => {
  if (!date) return "";

  try {
    const dateObj = isDate(date) ? date : new Date(date);
    const language = i18next.language || "en";

    return new Intl.DateTimeFormat(language, {
      hour: "numeric",
      minute: "numeric",
      ...options,
    }).format(dateObj);
  } catch (error) {
    console.error("Error formatting time with Intl:", error);
    return "";
  }
};

/**
 * Format a date and time using the browser's Intl.DateTimeFormat API
 * @param {Date|string|number} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - The formatted date and time
 */
export const formatDateTimeIntl = (date, options = {}) => {
  if (!date) return "";

  try {
    const dateObj = isDate(date) ? date : new Date(date);
    const language = i18next.language || "en";

    return new Intl.DateTimeFormat(language, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      ...options,
    }).format(dateObj);
  } catch (error) {
    console.error("Error formatting date and time with Intl:", error);
    return "";
  }
};

/**
 * Get localized month names
 * @param {string} format - The format of the month names ('long', 'short', or 'narrow')
 * @returns {string[]} - Array of month names
 */
export const getMonthNames = (format = "long") => {
  const language = i18next.language || "en";
  const months = [];

  for (let month = 0; month < 12; month++) {
    const date = new Date(2000, month, 1);
    months.push(
      new Intl.DateTimeFormat(language, { month: format }).format(date)
    );
  }

  return months;
};

/**
 * Get localized day names
 * @param {string} format - The format of the day names ('long', 'short', or 'narrow')
 * @returns {string[]} - Array of day names
 */
export const getDayNames = (format = "long") => {
  const language = i18next.language || "en";
  const days = [];

  // Start with Sunday (0) and get all 7 days
  for (let day = 0; day < 7; day++) {
    const date = new Date(2000, 0, 2 + day); // Jan 2, 2000 was a Sunday
    days.push(
      new Intl.DateTimeFormat(language, { weekday: format }).format(date)
    );
  }

  return days;
};

/**
 * Check if a date is in the past
 * @param {Date|string|number} date - The date to check
 * @returns {boolean} - Whether the date is in the past
 */
export const isDateInPast = (date) => {
  if (!date) return false;

  try {
    const dateObj = isDate(date) ? date : new Date(date);
    return dateObj < new Date();
  } catch (error) {
    console.error("Error checking if date is in past:", error);
    return false;
  }
};

/**
 * Check if a date is in the future
 * @param {Date|string|number} date - The date to check
 * @returns {boolean} - Whether the date is in the future
 */
export const isDateInFuture = (date) => {
  if (!date) return false;

  try {
    const dateObj = isDate(date) ? date : new Date(date);
    return dateObj > new Date();
  } catch (error) {
    console.error("Error checking if date is in future:", error);
    return false;
  }
};

/**
 * Check if a date is today
 * @param {Date|string|number} date - The date to check
 * @returns {boolean} - Whether the date is today
 */
export const isDateToday = (date) => {
  if (!date) return false;

  try {
    const dateObj = isDate(date) ? date : new Date(date);
    const today = new Date();

    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    console.error("Error checking if date is today:", error);
    return false;
  }
};
