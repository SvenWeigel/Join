/**
 * @fileoverview Form Validation Helper Functions
 * @description Core validation utilities and error handling.
 * @module Validation/Helpers
 */

/**
 * Validates if a field is not empty.
 *
 * @param {string} value - The value to validate
 * @returns {boolean} True if valid
 */
function validateRequired(value) {
  return value.trim() !== "";
}

/**
 * Validates email format.
 *
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates minimum length.
 *
 * @param {string} value - The value to validate
 * @param {number} minLength - Minimum required length
 * @returns {boolean} True if meets minimum length
 */
function validateMinLength(value, minLength) {
  return value.length >= minLength;
}

/**
 * Validates maximum length.
 *
 * @param {string} value - The value to validate
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} True if within maximum length
 */
function validateMaxLength(value, maxLength) {
  return value.length <= maxLength;
}

/**
 * Validates phone number format (optional field).
 *
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if valid phone format or empty
 */
function validatePhone(phone) {
  if (!phone || phone.trim() === "") return true;
  const phoneRegex = /^[0-9+\-\s()]+$/;
  return phoneRegex.test(phone);
}

/**
 * Validates a field for required value.
 *
 * @param {HTMLElement} input - The input element
 * @param {string} errorMsg - Error message
 * @returns {boolean} True if valid
 */
function validateField(input, errorMsg) {
  if (!validateRequired(input.value)) {
    showError(input, errorMsg);
    return false;
  }
  removeError(input);
  return true;
}

/**
 * Displays validation error message.
 *
 * @param {HTMLElement} inputElement - The input element
 * @param {string} message - Error message to display
 */
function showError(inputElement, message) {
  inputElement.classList.add("validation-error");
  inputElement.dataset.originalPlaceholder = inputElement.placeholder || "";
  inputElement.placeholder = message;
  inputElement.value = "";
}

/**
 * Removes validation error message.
 *
 * @param {HTMLElement} inputElement - The input element
 */
function removeError(inputElement) {
  inputElement.classList.remove("validation-error");
  if (inputElement.dataset.originalPlaceholder !== undefined) {
    inputElement.placeholder = inputElement.dataset.originalPlaceholder;
    delete inputElement.dataset.originalPlaceholder;
  }
}
