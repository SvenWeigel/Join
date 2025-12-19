/**
 * @fileoverview Contact Form Validation
 * @description Validates contact form fields.
 * @module Validation/Contact
 */

/**
 * Validates contact form (add or edit).
 *
 * @param {Event} event - Form submit event
 * @param {string} prefix - Prefix for input IDs ('contact' or 'editContact')
 * @returns {boolean} True if form is valid
 */
function validateContactForm(event, prefix = "contact") {
  const nameValid = validateContactName(prefix);
  const emailValid = validateContactEmail(prefix);
  const phoneValid = validateContactPhone(prefix);
  const isValid = nameValid && emailValid && phoneValid;
  if (!isValid && event) event.preventDefault();
  return isValid;
}

/**
 * Validates contact name.
 *
 * @param {string} prefix - Prefix for input ID
 * @returns {boolean} True if valid
 */
function validateContactName(prefix) {
  const nameInput = document.getElementById(`${prefix}Name`);
  return validateField(nameInput, "Name is required");
}

/**
 * Validates contact email.
 *
 * @param {string} prefix - Prefix for input ID
 * @returns {boolean} True if valid
 */
function validateContactEmail(prefix) {
  const emailInput = document.getElementById(`${prefix}Email`);
  if (!validateRequired(emailInput.value)) {
    showError(emailInput, "Email is required");
    return false;
  }
  if (!validateEmail(emailInput.value)) {
    showError(emailInput, "Please enter a valid email address");
    return false;
  }
  removeError(emailInput);
  return true;
}

/**
 * Validates contact phone.
 *
 * @param {string} prefix - Prefix for input ID
 * @returns {boolean} True if valid
 */
function validateContactPhone(prefix) {
  const phoneInput = document.getElementById(`${prefix}Phone`);
  if (phoneInput.value && !validatePhone(phoneInput.value)) {
    showError(phoneInput, "Please enter a valid phone number");
    return false;
  }
  removeError(phoneInput);
  return true;
}
