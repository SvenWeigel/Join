/**
 * @fileoverview Login Page Controller
 * @description Handles user authentication including form validation, credential verification, and session management.
 * @module Authentication/Login
 */

/**
 * Login-specific selectors and messages.
 * The functions in this module handle: reading form input,
 * searching for users via REST API, validation, and storing
 * the logged-in user in `localStorage`.
 */
const LOGIN_SELECTORS = {
  formSelector: ".login_container form",
  email: "login-email-input",
  password: "login-password-input",
  guestBtnSelector: ".login-form-btn-guestlogin",
};

/**
 * User-friendly message texts used in alerts and validation.
 */
const LOGIN_MESSAGES = {
  emailNotFound: "Email not found.",
  wrongPassword: "Incorrect password.",
  loginSuccess: "Successfully logged in.",
  fetchError: "Error loading user data.",
  emailRequired: "Please enter your email.",
  passwordRequired: "Please enter your password.",
};

/**
 * Normalizes an email address (trim + toLowerCase).
 *
 * @param {string} email - The email to normalize
 * @returns {string} The normalized email
 */
function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

/**
 * Builds the Firebase query URL for email lookup.
 *
 * @param {string} normalizedEmail - Already lowercased email
 * @returns {string} The query URL
 */
function buildEmailQueryUrl(normalizedEmail) {
  const orderBy = encodeURIComponent('"email"');
  const equalTo = encodeURIComponent(JSON.stringify(normalizedEmail));
  return `${BASE_URL}/users.json?orderBy=${orderBy}&equalTo=${equalTo}`;
}

/**
 * Extracts the first user from query response data.
 *
 * @param {Object|null} data - The response data
 * @returns {Object|null} User object with id or null
 */
function extractFirstUser(data) {
  if (!data) return null;
  const entries = Object.entries(data);
  if (entries.length === 0) return null;
  const [id, user] = entries[0];
  return { id, ...user };
}

/**
 * Attempts to find a user via Firebase query.
 *
 * @param {string} normalizedEmail - Already lowercased email
 * @returns {Promise<Object|null>} User object or null
 */
async function queryUserByEmail(normalizedEmail) {
  try {
    const url = buildEmailQueryUrl(normalizedEmail);
    const res = await fetch(url);
    if (!res.ok) throw new Error(LOGIN_MESSAGES.fetchError);
    return extractFirstUser(await res.json());
  } catch (err) {
    console.error("Query by email failed", err);
    return null;
  }
}

/**
 * Searches user entries for matching email.
 *
 * @param {Array} entries - Array of [id, user] entries
 * @param {string} normalizedEmail - Already lowercased email
 * @returns {Object|null} User object with id or null
 */
function findUserInEntries(entries, normalizedEmail) {
  for (const [id, user] of entries) {
    if ((user.email || "").toLowerCase() === normalizedEmail) {
      return { id, ...user };
    }
  }
  return null;
}

/**
 * Fallback: loads all users and searches for the email.
 *
 * @param {string} normalizedEmail - Already lowercased email
 * @returns {Promise<Object|null>} User object or null
 */
async function fetchAllUsersAndFind(normalizedEmail) {
  try {
    const res = await fetch(`${BASE_URL}/users.json`);
    if (!res.ok) throw new Error(LOGIN_MESSAGES.fetchError);
    const data = await res.json();
    if (!data) return null;
    return findUserInEntries(Object.entries(data), normalizedEmail);
  } catch (err) {
    console.error("Fallback fetch failed", err);
    return null;
  }
}

/**
 * Searches for a user: first via query, then via fallback.
 *
 * @param {string} normalizedEmail - Already lowercased email
 * @returns {Promise<Object|null>} User object or null
 */
async function findUserByEmail(normalizedEmail) {
  const byQuery = await queryUserByEmail(normalizedEmail);
  if (byQuery) return byQuery;
  return await fetchAllUsersAndFind(normalizedEmail);
}

/**
 * Reads email and password from the login form.
 *
 * @returns {{email: string, password: string}} Form values
 */
function readLoginFormValues() {
  return {
    email: document.getElementById(LOGIN_SELECTORS.email).value,
    password: document.getElementById(LOGIN_SELECTORS.password).value,
  };
}

/**
 * Fills in stored email from localStorage if available.
 */
function preFillLoginForm() {
  try {
    const stored = localStorage.getItem("currentUser");
    if (!stored) return;
    const user = JSON.parse(stored);
    if (user && user.email) {
      const el = document.getElementById(LOGIN_SELECTORS.email);
      if (el && !el.value) el.value = user.email;
    }
  } catch (err) {}
}

/**
 * Performs browser form validation and displays error messages.
 *
 * @param {HTMLFormElement|null} form - The form to validate
 * @returns {boolean} True if valid or no form present
 */
function validateForm(form) {
  if (!form) return true;
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}

/**
 * Performs login: lookup, password check, and store user.
 *
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} The user object
 */
async function performLogin(email, password) {
  const normalized = normalizeEmail(email);
  const user = await findUserByEmail(normalized);
  if (!user) throw new Error(LOGIN_MESSAGES.emailNotFound);
  if (user.password !== password) throw new Error(LOGIN_MESSAGES.wrongPassword);
  localStorage.setItem("currentUser", JSON.stringify(user));
  return user;
}

/**
 * Handles login form submission: validate, login, redirect.
 *
 * @param {Event} e - The submit event
 */
async function handleLoginSubmit(e) {
  e.preventDefault();
  const form = document.querySelector(LOGIN_SELECTORS.formSelector);
  if (!validateForm(form)) return;
  const { email, password } = readLoginFormValues();
  try {
    await performLogin(email, password);
    alert(LOGIN_MESSAGES.loginSuccess);
    window.location.replace("html/summary.html");
  } catch (err) {
    console.error(err);
    alert(err.message || "Login error");
  }
}

/**
 * Attaches custom validation messages to an input element.
 *
 * @param {HTMLElement|null} el - The input element
 * @param {string} requiredMessage - Message for required validation
 */
function attachValidation(el, requiredMessage) {
  if (!el) return;
  el.addEventListener("invalid", (e) => {
    e.preventDefault();
    if (el.validity.valueMissing) el.setCustomValidity(requiredMessage);
    else el.setCustomValidity("");
  });
  el.addEventListener("input", () => el.setCustomValidity(""));
}

/**
 * Wires validation messages for email and password fields.
 */
function wireLoginValidationMessages() {
  attachValidation(
    document.getElementById(LOGIN_SELECTORS.email),
    LOGIN_MESSAGES.emailRequired
  );
  attachValidation(
    document.getElementById(LOGIN_SELECTORS.password),
    LOGIN_MESSAGES.passwordRequired
  );
}

/**
 * Initializes login event handlers and validation.
 */
function initLogin() {
  const form = document.querySelector(LOGIN_SELECTORS.formSelector);
  if (form) form.addEventListener("submit", handleLoginSubmit);
  const guestBtn = document.querySelector(LOGIN_SELECTORS.guestBtnSelector);
  if (guestBtn) guestBtn.addEventListener("click", handleGuestLogin);
  wireLoginValidationMessages();
}

document.addEventListener("DOMContentLoaded", initLogin);
window.preFillLoginForm = preFillLoginForm;

/**
 * Updates password icon based on input value.
 */
function changePasswordIcon() {
  const passwordIcon = document.getElementById("password-icon");
  const passwordInput = document.getElementById("login-password-input");
  const hasValue = passwordInput.value.length > 0;
  passwordIcon.src = hasValue
    ? "assets/icons/visibility_off.svg"
    : "assets/icons/lock.svg";
  passwordIcon.classList.toggle("pointer", hasValue);
}

/**
 * Toggles password field visibility between text and password.
 */
function togglePasswordVisibility() {
  const passwordIcon = document.getElementById("password-icon");
  const passwordInput = document.getElementById("login-password-input");
  if (passwordInput.value.length === 0) return;
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  passwordIcon.src = isHidden
    ? "assets/icons/visibility.svg"
    : "assets/icons/visibility_off.svg";
}
