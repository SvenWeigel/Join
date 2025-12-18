/**
 * @fileoverview Sign Up Page Controller
 * @description Handles user registration functionality including form validation and account creation.
 */

/**
 * Element ID names for the signup form.
 */
const SELECTORS = {
  form: "signup-form",
  name: "signup-name",
  email: "signup-email",
  password: "signup-password",
  confirm: "signup-confirm-password",
  privacyCheck: "check-privacy",
  signupBtn: "signup-btn",
};

const MESSAGES = {
  passwordsMismatch: "Passwords do not match.",
  emailExists: "Email already exists.",
  saved: "Registration successful.",
  fetchUsersError: "Error fetching user data.",
  saveError: "Error saving to the database.",
};

/**
 * Gets all signup form field elements.
 *
 * @returns {Object} Object containing all form field elements
 */
function getSignupFormFields() {
  return {
    name: document.getElementById(SELECTORS.name),
    email: document.getElementById(SELECTORS.email),
    password: document.getElementById(SELECTORS.password),
    confirm: document.getElementById(SELECTORS.confirm),
    privacy: document.getElementById(SELECTORS.privacyCheck),
  };
}

/**
 * Validates individual signup form fields.
 *
 * @param {Object} fields - The form field elements
 * @returns {Object} Object with validation results for each field
 */
function validateSignupFields(fields) {
  const { name, email, password, confirm, privacy } = fields;
  return {
    nameValid: name && name.value.trim().length >= 2,
    emailValid: email && email.value.trim() !== "" && email.validity.valid,
    passwordValid: password && password.value.length >= 8,
    confirmValid:
      confirm && confirm.value !== "" && confirm.value === password?.value,
    privacyChecked: privacy && privacy.checked,
  };
}

/**
 * Checks if all required signup form fields are valid.
 *
 * @returns {boolean} True if all fields are valid
 */
function areAllFieldsValid() {
  const fields = getSignupFormFields();
  const { nameValid, emailValid, passwordValid, confirmValid, privacyChecked } =
    validateSignupFields(fields);
  return (
    nameValid && emailValid && passwordValid && confirmValid && privacyChecked
  );
}

/**
 * Updates the signup button state based on the validation of all fields.
 */
function updateSignupButtonState() {
  const button = document.getElementById(SELECTORS.signupBtn);
  if (!button) return;
  button.disabled = !areAllFieldsValid();
}

/**
 * Attaches input listeners to text fields for validation.
 */
function wireTextFieldValidation() {
  const fieldIds = [
    SELECTORS.name,
    SELECTORS.email,
    SELECTORS.password,
    SELECTORS.confirm,
  ];
  fieldIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", updateSignupButtonState);
  });
}

/**
 * Links all form fields with the button state update.
 */
function wireFormValidation() {
  wireTextFieldValidation();
  const checkbox = document.getElementById(SELECTORS.privacyCheck);
  if (checkbox) checkbox.addEventListener("change", updateSignupButtonState);
  updateSignupButtonState();
}

/**
 * Creates a password match validator function.
 *
 * @param {HTMLElement} pwd - Password input element
 * @param {HTMLElement} conf - Confirm password input element
 * @returns {Function} Validator function
 */
function createPasswordValidator(pwd, conf) {
  return () => {
    const message = conf.value !== pwd.value ? MESSAGES.passwordsMismatch : "";
    conf.setCustomValidity(message);
  };
}

/**
 * Links password and confirmation fields for live validation.
 *
 * @param {string} passwordId - ID of the password input
 * @param {string} confirmId - ID of the confirm input
 */
function wirePasswordConfirmValidation(passwordId, confirmId) {
  const pwd = document.getElementById(passwordId);
  const conf = document.getElementById(confirmId);
  if (!pwd || !conf) return;
  const validate = createPasswordValidator(pwd, conf);
  pwd.addEventListener("input", validate);
  conf.addEventListener("input", validate);
  validate();
}

/**
 * Fetches all user records from the server.
 *
 * @param {string} baseUrl - Base URL of the API
 * @returns {Promise<Array>} Array of user objects
 */
async function fetchAllUsers(baseUrl) {
  const res = await fetch(`${baseUrl}/users.json`);
  if (!res.ok) throw new Error(MESSAGES.fetchUsersError);
  const data = await res.json();
  return data ? Object.values(data) : [];
}

/**
 * Creates a new user record on the server.
 *
 * @param {string} baseUrl - Base URL of the API
 * @param {Object} user - User object to be posted
 * @returns {Promise<Object>} Created user with ID
 */
async function createUserRecord(baseUrl, user) {
  const res = await fetch(`${baseUrl}/users.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error(MESSAGES.saveError);
  const data = await res.json();
  return { id: data.name, ...user };
}

/**
 * Reads signup form values from the DOM.
 *
 * @returns {{name: string, email: string, password: string, confirm: string}} Form values
 */
function readFormValues() {
  return {
    name: document.getElementById(SELECTORS.name).value.trim(),
    email: document.getElementById(SELECTORS.email).value.trim(),
    password: document.getElementById(SELECTORS.password).value,
    confirm: document.getElementById(SELECTORS.confirm).value,
  };
}

/**
 * Checks if email already exists in the database.
 *
 * @param {string} normalizedEmail - Email in lowercase
 * @returns {Promise<boolean>} True if email exists
 */
async function isEmailTaken(normalizedEmail) {
  const users = await fetchAllUsers(BASE_URL);
  return users.some((u) => (u.email || "").toLowerCase() === normalizedEmail);
}

/**
 * Creates user object from form data.
 *
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} User object
 */
function createUserObject(name, email, password) {
  return {
    name,
    email: email.toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Creates contact object from user data.
 *
 * @param {string} name - Contact name
 * @param {string} email - Contact email
 * @returns {Object} Contact object
 */
function createContactFromUser(name, email) {
  return {
    name,
    email: email.toLowerCase(),
    phone: "",
    color: getRandomContactColor(),
  };
}

/**
 * Registers new user and creates contact entry.
 *
 * @param {{name: string, email: string, password: string}} data - Form data
 */
async function registerAndRedirect({ name, email, password }) {
  const user = createUserObject(name, email, password);
  await createUserRecord(BASE_URL, user);
  await createContact(createContactFromUser(name, email));
  showSignupSuccessOverlay();
}

/**
 * Available colors for new contacts.
 */
const CONTACT_COLORS = [
  "#FF7A00",
  "#9327FF",
  "#6E52FF",
  "#FC71FF",
  "#FFBB2B",
  "#1FD7C1",
  "#462F8A",
  "#FF4646",
  "#00BEE8",
  "#FF745E",
];

/**
 * Generates a random color for new contacts.
 *
 * @returns {string} A hex color code
 */
function getRandomContactColor() {
  return CONTACT_COLORS[Math.floor(Math.random() * CONTACT_COLORS.length)];
}

/**
 * Validates signup form using browser validation.
 *
 * @returns {boolean} True if form is valid
 */
function validateSignupForm() {
  const form = document.getElementById(SELECTORS.form);
  if (form && !form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}

/**
 * Processes signup after validation passes.
 *
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 */
async function processSignup(name, email, password) {
  const normalizedEmail = email.toLowerCase();
  if (await isEmailTaken(normalizedEmail)) {
    alert(MESSAGES.emailExists);
    return;
  }
  await registerAndRedirect({ name, email, password });
}

/**
 * Handles signup form submission.
 *
 * @param {Event} e - Submit event
 */
async function handleSignupSubmit(e) {
  e.preventDefault();
  if (!validateSignupForm()) return;
  const { name, email, password } = readFormValues();
  try {
    await processSignup(name, email, password);
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
}

/**
 * Initializes the signup form validation and handlers.
 */
function init() {
  wireFormValidation();
  wirePasswordConfirmValidation(SELECTORS.password, SELECTORS.confirm);

  const form = document.getElementById(SELECTORS.form);
  if (form) form.addEventListener("submit", handleSignupSubmit);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

/**
 * Redirects to start page after hiding overlay.
 *
 * @param {HTMLElement} overlay - The overlay element
 */
function redirectAfterDelay(overlay) {
  setTimeout(() => {
    overlay.style.display = "none";
    window.location.replace("index.html");
  }, 2000);
}

/**
 * Shows the signup success overlay and redirects.
 */
function showSignupSuccessOverlay() {
  const overlay = document.getElementById("signup-success-overlay");
  if (!overlay) return;
  overlay.style.display = "flex";
  redirectAfterDelay(overlay);
}

/**
 * Changes password icon based on input value.
 *
 * @param {string} inputId - The password input ID
 * @param {string} iconId - The icon element ID
 */
function changePasswordIcon(inputId, iconId) {
  const icon = document.getElementById(iconId);
  const input = document.getElementById(inputId);
  const hasValue = input.value.length > 0;
  icon.src = hasValue
    ? "assets/icons/visibility_off.svg"
    : "assets/icons/lock.svg";
  icon.classList.toggle("pointer", hasValue);
}

/**
 * Toggles password field visibility.
 *
 * @param {string} inputId - The password input ID
 * @param {string} iconId - The icon element ID
 */
function togglePasswordVisibility(inputId, iconId) {
  const icon = document.getElementById(iconId);
  const input = document.getElementById(inputId);
  if (input.value.length === 0) return;
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  icon.src = isHidden
    ? "assets/icons/visibility.svg"
    : "assets/icons/visibility_off.svg";
}
