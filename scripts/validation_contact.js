/**
 * @fileoverview Contact Form Validation
 * @description Validates contact form fields with inline error messages.
 * @module Validation/Contact
 */

/**
 * Shows inline error message for a contact field.
 *
 * @param {string} fieldId - The ID of the input field
 * @param {string} message - Error message to display
 */
function showContactError(fieldId, message) {
  const inputElement = document.getElementById(fieldId);
  const containerElement = document.getElementById(fieldId + "-container");
  const errorElement = document.getElementById(fieldId + "-error");

  if (containerElement) {
    containerElement.classList.add("border-red");
  }
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.visibility = "visible";
  }
}

/**
 * Clears inline error message for a contact field.
 *
 * @param {string} fieldId - The ID of the input field
 */
function clearContactError(fieldId) {
  const containerElement = document.getElementById(fieldId + "-container");
  const errorElement = document.getElementById(fieldId + "-error");

  if (containerElement) {
    containerElement.classList.remove("border-red");
  }
  if (errorElement) {
    
    errorElement.style.visibility = "hidden";
  }
}

/**
 * Validates if name contains only letters and spaces.
 *
 * @param {string} name - The name to validate
 * @returns {boolean} True if valid
 */
function validateNameFormat(name) {
  const nameRegex = /^[a-zA-ZäöüÄÖÜß\s]+$/;
  return nameRegex.test(name);
}

/**
 * Checks if an email already exists in the contacts list.
 *
 * @param {string} email - The email to check
 * @param {string} excludeContactId - Optional contact ID to exclude from check (for edit mode)
 * @returns {boolean} True if email already exists
 */
function isEmailAlreadyUsed(email, excludeContactId = null) {
  return contacts.some(
    (contact) =>
      contact.email.toLowerCase() === email.toLowerCase() &&
      contact.id !== excludeContactId
  );
}

/**
 * Validates contact form (add or edit).
 *
 * @param {Event} event - Form submit event
 * @param {string} prefix - Prefix for input IDs ('contact' or 'editContact')
 * @param {boolean} checkDuplicateEmail - Whether to check for duplicate emails
 * @param {string} excludeContactId - Contact ID to exclude from duplicate check
 * @returns {boolean} True if form is valid
 */
function validateContactForm(
  event,
  prefix = "contact",
  checkDuplicateEmail = false,
  excludeContactId = null
) {
  const nameValid = validateContactName(prefix);
  const emailValid = validateContactEmail(
    prefix,
    checkDuplicateEmail,
    excludeContactId
  );
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
  const fieldId = `${prefix}Name`;

  if (!validateRequired(nameInput.value)) {
    showContactError(fieldId, "Name is required");
    return false;
  }
  if (!validateMinLength(nameInput.value, 2)) {
    showContactError(fieldId, "Name must be at least 2 characters");
    return false;
  }
  if (!validateNameFormat(nameInput.value)) {
    showContactError(fieldId, "Name can only contain letters");
    return false;
  }
  clearContactError(fieldId);
  return true;
}

/**
 * Validates contact name on blur event.
 *
 * @param {string} prefix - Prefix for input ID
 */
function validateContactNameOnBlur(prefix) {
  validateContactName(prefix);
}

/**
 * Validates contact email.
 *
 * @param {string} prefix - Prefix for input ID
 * @param {boolean} checkDuplicate - Whether to check for duplicate emails
 * @param {string} excludeContactId - Contact ID to exclude from duplicate check
 * @returns {boolean} True if valid
 */
function validateContactEmail(
  prefix,
  checkDuplicate = false,
  excludeContactId = null
) {
  const emailInput = document.getElementById(`${prefix}Email`);
  const fieldId = `${prefix}Email`;

  if (!validateRequired(emailInput.value)) {
    showContactError(fieldId, "Email is required");
    return false;
  }
  if (!validateEmail(emailInput.value)) {
    showContactError(fieldId, "Please enter a valid email address");
    return false;
  }
  if (
    checkDuplicate &&
    isEmailAlreadyUsed(emailInput.value, excludeContactId)
  ) {
    showContactError(fieldId, "This email address is already in use");
    return false;
  }
  clearContactError(fieldId);
  return true;
}

/**
 * Validates contact email on blur event.
 *
 * @param {string} prefix - Prefix for input ID
 */
function validateContactEmailOnBlur(prefix) {
  validateContactEmail(prefix);
}

/**
 * Validates contact phone.
 *
 * @param {string} prefix - Prefix for input ID
 * @returns {boolean} True if valid
 */
function validateContactPhone(prefix) {
  const phoneInput = document.getElementById(`${prefix}Phone`);
  const fieldId = `${prefix}Phone`;

  if (phoneInput.value && !validatePhone(phoneInput.value)) {
    showContactError(fieldId, "Please enter a valid phone number");
    return false;
  }
  clearContactError(fieldId);
  return true;
}

/**
 * Validates contact phone on blur event.
 *
 * @param {string} prefix - Prefix for input ID
 */
function validateContactPhoneOnBlur(prefix) {
  validateContactPhone(prefix);
}
