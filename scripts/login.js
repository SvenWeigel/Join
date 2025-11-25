// Login-Logik, ähnlich zu sign_up.js aufgebaut
const LOGIN_SELECTORS = {
  formSelector: ".login_container form",
  email: "login-email-input",
  password: "login-password-input",
  loginBtnSelector: ".login-form-btn-login",
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

// Fetch all users from Firebase (same shape as sign_up.js expects)
async function fetchAllUsersForLogin(baseUrl) {
  const res = await fetch(`${baseUrl}/users.json`);
  if (!res.ok) throw new Error(LOGIN_MESSAGES.fetchError);
  const data = await res.json();
  return data ? Object.values(data) : [];
}

// Find user by normalized email
async function findUserByEmail(normalizedEmail) {
  const users = await fetchAllUsersForLogin(BASE_URL);
  return (
    users.find((u) => (u.email || "").toLowerCase() === normalizedEmail) || null
  );
}

// Read form values
function readLoginFormValues() {
  return {
    email: document.getElementById(LOGIN_SELECTORS.email).value.trim(),
    password: document.getElementById(LOGIN_SELECTORS.password).value,
  };
}

// Pre-fill the email field if a previous user exists in localStorage
function preFillLoginForm() {
  try {
    const stored = localStorage.getItem("currentUser");
    if (!stored) return;
    const user = JSON.parse(stored);
    if (user && user.email) {
      const el = document.getElementById(LOGIN_SELECTORS.email);
      if (el && !el.value) el.value = user.email;
    }
  } catch (err) {
    // ignore JSON errors
  }
}

// Handle login submit
async function handleLoginSubmit(e) {
  e.preventDefault();
  const form = document.querySelector(LOGIN_SELECTORS.formSelector);
  if (form && !form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const { email, password } = readLoginFormValues();
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      alert(LOGIN_MESSAGES.emailNotFound);
      return;
    }

    if (user.password !== password) {
      alert(LOGIN_MESSAGES.wrongPassword);
      return;
    }

    // success: store user in localStorage (or any app-specific state) and redirect
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert(LOGIN_MESSAGES.loginSuccess);
    window.location.replace("html/board.html");
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
}

// Wire up event handlers on DOMContentLoaded
function initLogin() {
  const form = document.querySelector(LOGIN_SELECTORS.formSelector);
  if (form) form.addEventListener("submit", handleLoginSubmit);

  const guestBtn = document.querySelector(LOGIN_SELECTORS.guestBtnSelector);
  if (guestBtn) guestBtn.addEventListener("click", handleGuestLogin);

  wireLoginValidationMessages();
}

document.addEventListener("DOMContentLoaded", initLogin);

// expose preFillLoginForm globally because index.html uses onclick attribute
window.preFillLoginForm = preFillLoginForm;

// Handle guest-login behavior: create a lightweight guest user and redirect
function handleGuestLogin(e) {
  e.preventDefault();
  const guestUser = { name: "Guest", email: "guest@guest.local", guest: true };
  localStorage.setItem("currentUser", JSON.stringify(guestUser));
  window.location.replace("html/board.html");
}

// Wire custom validation messages for login inputs
function wireLoginValidationMessages() {
  const email = document.getElementById(LOGIN_SELECTORS.email);
  const pwd = document.getElementById(LOGIN_SELECTORS.password);
  if (email) {
    email.addEventListener("invalid", (e) => {
      e.preventDefault();
      if (email.validity.valueMissing)
        email.setCustomValidity(LOGIN_MESSAGES.emailRequired);
      else email.setCustomValidity("");
    });
    email.addEventListener("input", () => email.setCustomValidity(""));
  }
  if (pwd) {
    pwd.addEventListener("invalid", (e) => {
      e.preventDefault();
      if (pwd.validity.valueMissing)
        pwd.setCustomValidity(LOGIN_MESSAGES.passwordRequired);
      else pwd.setCustomValidity("");
    });
    pwd.addEventListener("input", () => pwd.setCustomValidity(""));
  }
}
