// Login logic (clean, small functions ≤14 lines)
const LOGIN_SELECTORS = {
  formSelector: ".login_container form",
  email: "login-email-input",
  password: "login-password-input",
  guestBtnSelector: ".login-form-btn-guestlogin",
};

const LOGIN_MESSAGES = {
  emailNotFound: "Email not found.",
  wrongPassword: "Incorrect password.",
  loginSuccess: "Successfully logged in.",
  fetchError: "Error loading user data.",
  emailRequired: "Please enter your email.",
  passwordRequired: "Please enter your password.",
};

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

async function queryUserByEmail(normalizedEmail) {
  try {
    const orderBy = encodeURIComponent('"email"');
    const equalTo = encodeURIComponent(JSON.stringify(normalizedEmail));
    const url = `${BASE_URL}/users.json?orderBy=${orderBy}&equalTo=${equalTo}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(LOGIN_MESSAGES.fetchError);
    const data = await res.json();
    const users = data ? Object.values(data) : [];
    return users.length ? users[0] : null;
  } catch (err) {
    console.error("Query by email failed", err);
    return null;
  }
}

async function fetchAllUsersAndFind(normalizedEmail) {
  try {
    const res = await fetch(`${BASE_URL}/users.json`);
    if (!res.ok) throw new Error(LOGIN_MESSAGES.fetchError);
    const data = await res.json();
    if (!data) return null;
    const users = Object.values(data);
    return (
      users.find((u) => (u.email || "").toLowerCase() === normalizedEmail) ||
      null
    );
  } catch (err) {
    console.error("Fallback fetch failed", err);
    return null;
  }
}

async function findUserByEmail(normalizedEmail) {
  const byQuery = await queryUserByEmail(normalizedEmail);
  if (byQuery) return byQuery;
  return await fetchAllUsersAndFind(normalizedEmail);
}

function readLoginFormValues() {
  return {
    email: document.getElementById(LOGIN_SELECTORS.email).value,
    password: document.getElementById(LOGIN_SELECTORS.password).value,
  };
}

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

function validateForm(form) {
  if (!form) return true;
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}

async function performLogin(email, password) {
  const normalized = normalizeEmail(email);
  const user = await findUserByEmail(normalized);
  if (!user) throw new Error(LOGIN_MESSAGES.emailNotFound);
  if (user.password !== password) throw new Error(LOGIN_MESSAGES.wrongPassword);
  localStorage.setItem("currentUser", JSON.stringify(user));
  return user;
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const form = document.querySelector(LOGIN_SELECTORS.formSelector);
  if (!validateForm(form)) return;
  const { email, password } = readLoginFormValues();
  try {
    await performLogin(email, password);
    alert(LOGIN_MESSAGES.loginSuccess);
    window.location.replace("html/board.html");
  } catch (err) {
    console.error(err);
    alert(err.message || "Login error");
  }
}

function handleGuestLogin(e) {
  e.preventDefault();
  const guestUser = { name: "Guest", email: "guest@guest.local", guest: true };
  localStorage.setItem("currentUser", JSON.stringify(guestUser));
  window.location.replace("html/board.html");
}

function attachValidation(el, requiredMessage) {
  if (!el) return;
  el.addEventListener("invalid", (e) => {
    e.preventDefault();
    if (el.validity.valueMissing) el.setCustomValidity(requiredMessage);
    else el.setCustomValidity("");
  });
  el.addEventListener("input", () => el.setCustomValidity(""));
}

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

function initLogin() {
  const form = document.querySelector(LOGIN_SELECTORS.formSelector);
  if (form) form.addEventListener("submit", handleLoginSubmit);
  const guestBtn = document.querySelector(LOGIN_SELECTORS.guestBtnSelector);
  if (guestBtn) guestBtn.addEventListener("click", handleGuestLogin);
  wireLoginValidationMessages();
}

document.addEventListener("DOMContentLoaded", initLogin);
window.preFillLoginForm = preFillLoginForm;
