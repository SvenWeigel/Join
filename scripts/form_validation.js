/**
 * @fileoverview Form Validation Main Module
 * @description Initializes all form validations. Requires validation helper modules.
 * @module Validation/FormValidation
 */

/**
 * Validates login form.
 *
 * @param {Event} event - Form submit event
 * @returns {boolean} True if form is valid
 */
function validateLoginForm(event) {
  const emailInput = document.getElementById("login-email-input");
  const passwordInput = document.getElementById("login-password-input");
  const emailValid = validateField(emailInput, "Email is required");
  const passwordValid = validateField(passwordInput, "Password is required");
  const isValid = emailValid && passwordValid;
  if (!isValid && event) event.preventDefault();
  return isValid;
}

/**
 * Initializes form validation for all forms.
 */
function initFormValidation() {
  initLoginFormValidation();
  initSignUpFormValidation();
  initContactFormsValidation();
  initTaskFormsValidation();
}

/**
 * Initializes login form validation.
 */
function initLoginFormValidation() {
  const loginForm = document.querySelector(".login_container form");
  if (loginForm) loginForm.addEventListener("submit", validateLoginForm, true);
}

/**
 * Initializes sign up form validation.
 */
function initSignUpFormValidation() {
  const signUpForm = document.querySelector(".sign-up-form-container form") || document.getElementById("signup-form");
  if (signUpForm) signUpForm.addEventListener("submit", validateSignUpForm, true);
}

/**
 * Initializes contact forms validation.
 */
function initContactFormsValidation() {
  const addContactForm = document.getElementById("addContactForm");
  if (addContactForm) {
    addContactForm.addEventListener("submit", (event) => validateContactForm(event, "contact"), true);
  }
  const editContactForm = document.getElementById("editContactForm");
  if (editContactForm) {
    editContactForm.addEventListener("submit", (event) => validateContactForm(event, "editContact"), true);
  }
}

/**
 * Initializes task forms validation.
 */
function initTaskFormsValidation() {
  const addTaskForm = document.getElementById("addTaskForm");
  if (addTaskForm) {
    addTaskForm.addEventListener("submit", (event) => validateAddTaskForm(event, "addTaskForm"), true);
  }
  const addTaskFormPage = document.getElementById("addTaskFormPage");
  if (addTaskFormPage) {
    addTaskFormPage.addEventListener("submit", (event) => validateAddTaskForm(event, "addTaskFormPage"), true);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFormValidation);
} else {
  initFormValidation();
}
