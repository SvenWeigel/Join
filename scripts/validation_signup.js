/**
 * @fileoverview Sign Up Form Validation
 * @description Validates sign up form fields with inline error messages.
 * @module Validation/SignUp
 */

/**
 * Shows inline error message for a signup field.
 *
 * @param {string} fieldId - The ID of the input field
 * @param {string} message - Error message to display
 */
function showSignUpError(fieldId, message) {
  const inputElement = document.getElementById(fieldId);
  const containerElement = document.getElementById(fieldId + "-container");
  const errorElement = document.getElementById(fieldId + "-error");

  if (containerElement) {
    containerElement.classList.add("border-red");
  }
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.visibility="visible";
  }
}

/**
 * Clears inline error message for a signup field.
 *
 * @param {string} fieldId - The ID of the input field
 */
function clearSignUpError(fieldId) {
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
 * Validates sign up form.
 *
 * @param {Event} event - Form submit event
 * @returns {boolean} True if form is valid
 */
function validateSignUpForm(event) {
  const nameValid = validateSignUpName();
  const emailValid = validateSignUpEmail();
  const passwordValid = validateSignUpPassword();
  const confirmValid = validateSignUpConfirmPassword();
  const privacyValid = validateSignUpPrivacy();
  const isValid =
    nameValid && emailValid && passwordValid && confirmValid && privacyValid;
  if (!isValid && event) event.preventDefault();
  return isValid;
}

/**
 * Validates name in sign up form.
 *
 * @returns {boolean} True if valid
 */
function validateSignUpName() {
  const nameInput = document.getElementById("signup-name");
  if (!validateRequired(nameInput.value)) {
    showSignUpError("signup-name", "Name is required");
    return false;
  }
  if (!validateMinLength(nameInput.value, 2)) {
    showSignUpError("signup-name", "Name must be at least 2 characters");
    return false;
  }
  if (!validateNameFormat(nameInput.value)) {
    showSignUpError("signup-name", "Name can only contain letters");
    return false;
  }
  clearSignUpError("signup-name");
  return true;
}

/**
 * Validates name on blur event.
 */
function validateSignUpNameOnBlur() {
  validateSignUpName();
}

/**
 * Validates email in sign up form.
 *
 * @returns {boolean} True if valid
 */
function validateSignUpEmail() {
  const emailInput = document.getElementById("signup-email");
  if (!validateRequired(emailInput.value)) {
    showSignUpError("signup-email", "Email is required");
    return false;
  }
  if (!validateEmail(emailInput.value)) {
    showSignUpError("signup-email", "Please enter a valid email address");
    return false;
  }
  clearSignUpError("signup-email");
  return true;
}

/**
 * Validates email on blur event.
 */
function validateSignUpEmailOnBlur() {
  validateSignUpEmail();
}

/**
 * Validates password in sign up form.
 *
 * @returns {boolean} True if valid
 */
function validateSignUpPassword() {
  const passwordInput = document.getElementById("signup-password");
  if (!validateRequired(passwordInput.value)) {
    showSignUpError("signup-password", "Password is required");
    return false;
  }
  if (!validateMinLength(passwordInput.value, 8)) {
    showSignUpError(
      "signup-password",
      "Password must be at least 8 characters"
    );
    return false;
  }
  clearSignUpError("signup-password");
  return true;
}

/**
 * Validates password on blur event.
 */
function validateSignUpPasswordOnBlur() {
  validateSignUpPassword();
}

/**
 * Validates password confirmation in sign up form.
 *
 * @returns {boolean} True if valid
 */
function validateSignUpConfirmPassword() {
  const passwordInput = document.getElementById("signup-password");
  const confirmPasswordInput = document.getElementById(
    "signup-confirm-password"
  );
  if (!validateRequired(confirmPasswordInput.value)) {
    showSignUpError("signup-confirm-password", "Please confirm your password");
    return false;
  }
  if (passwordInput.value !== confirmPasswordInput.value) {
    showSignUpError(
      "signup-confirm-password",
      "Your passwords don't match. Please try again."
    );
    return false;
  }
  clearSignUpError("signup-confirm-password");
  return true;
}

/**
 * Validates password confirmation on blur event.
 */
function validateSignUpConfirmPasswordOnBlur() {
  validateSignUpConfirmPassword();
}

/**
 * Validates privacy checkbox in sign up form.
 *
 * @returns {boolean} True if valid
 */
function validateSignUpPrivacy() {
  const privacyCheckbox = document.getElementById("check-privacy");
  if (!privacyCheckbox.checked) {
    showError(
      privacyCheckbox.parentElement,
      "You must accept the privacy policy"
    );
    return false;
  }
  removeError(privacyCheckbox.parentElement);
  return true;
}
