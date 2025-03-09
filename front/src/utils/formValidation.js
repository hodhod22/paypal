/**
 * Form validation utility functions
 * These functions are used to validate form inputs across the application
 */

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates an IBAN (International Bank Account Number)
 * This is a basic validation that checks format, not actual validity
 * @param {string} iban - The IBAN to validate
 * @returns {boolean} - Whether the IBAN format is valid
 */
export const isValidIBAN = (iban) => {
  // Remove spaces and convert to uppercase
  const cleanedIBAN = iban.replace(/\s/g, "").toUpperCase();

  // Basic IBAN format check (length between 15-34 characters, alphanumeric)
  const ibanRegex = /^[A-Z0-9]{15,34}$/;
  return ibanRegex.test(cleanedIBAN);
};

/**
 * Validates a card number using Luhn algorithm
 * @param {string} cardNumber - The card number to validate
 * @returns {boolean} - Whether the card number is valid
 */
export const isValidCardNumber = (cardNumber) => {
  // Remove spaces and dashes
  const cleanedCardNumber = cardNumber.replace(/[\s-]/g, "");

  // Check if it contains only digits and has a valid length (13-19 digits)
  if (!/^\d{13,19}$/.test(cleanedCardNumber)) {
    return false;
  }

  // Luhn algorithm validation
  let sum = 0;
  let shouldDouble = false;

  // Loop through the card number from right to left
  for (let i = cleanedCardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedCardNumber.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

/**
 * Validates a monetary amount
 * @param {string|number} amount - The amount to validate
 * @param {number} minAmount - The minimum allowed amount (default: 0)
 * @returns {boolean} - Whether the amount is valid
 */
export const isValidAmount = (amount, minAmount = 0) => {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && numAmount > minAmount;
};

/**
 * Validates a name (first name, last name, full name)
 * @param {string} name - The name to validate
 * @param {number} minLength - The minimum allowed length (default: 2)
 * @returns {boolean} - Whether the name is valid
 */
export const isValidName = (name, minLength = 2) => {
  return name && name.trim().length >= minLength;
};

/**
 * Formats a card number with spaces for display
 * @param {string} cardNumber - The card number to format
 * @returns {string} - The formatted card number
 */
export const formatCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, "");
  const chunks = [];

  for (let i = 0; i < cleaned.length; i += 4) {
    chunks.push(cleaned.substring(i, i + 4));
  }

  return chunks.join(" ");
};

/**
 * Formats an IBAN with spaces for display
 * @param {string} iban - The IBAN to format
 * @returns {string} - The formatted IBAN
 */
export const formatIBAN = (iban) => {
  const cleaned = iban.replace(/\s/g, "").toUpperCase();
  const chunks = [];

  for (let i = 0; i < cleaned.length; i += 4) {
    chunks.push(cleaned.substring(i, i + 4));
  }

  return chunks.join(" ");
};
