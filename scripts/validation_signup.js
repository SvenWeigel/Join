/**
 * @fileoverview Sign Up Form Validation
 * @description Validates sign up form fields.
 * @module Validation/SignUp
 */

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
    showError(nameInput, "Name is required");
    return false;
  }
  if (!validateMinLength(nameInput.value, 2)) {
    showError(nameInput, "Name must be at least 2 characters");
    return false;
  }
  removeError(nameInput);
  return true;
}

/**
 * Validates email in sign up form.
 *
 * @returns {boolean} True if valid
 */
function validateSignUpEmail() {
  const emailInput = document.getElementById("signup-email");
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
 * Validates password in sign up form.
 *
 * @returns {boolean} True if valid
 */
function validateSignUpPassword() {
  const passwordInput = document.getElementById("signup-password");
  if (!validateRequired(passwordInput.value)) {
    showError(passwordInput, "Password is required");
    return false;
  }
  if (!validateMinLength(passwordInput.value, 8)) {
    showError(passwordInput, "Password must be at least 8 characters");
    return false;
  }
  removeError(passwordInput);
  return true;
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
    showError(confirmPasswordInput, "Please confirm your password");
    return false;
  }
  if (passwordInput.value !== confirmPasswordInput.value) {
    showError(confirmPasswordInput, "Passwords do not match");
    return false;
  }
  removeError(confirmPasswordInput);
  return true;
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
