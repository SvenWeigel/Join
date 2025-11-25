/**
 * Login-spezifische Selektoren und Meldungen.
 * Die Funktionen in diesem Modul kümmern sich um: Formular-Input lesen,
 * Benutzer per REST-API suchen, Validierung und das lokale Speichern
 * des angemeldeten Benutzers in `localStorage`.
 */
const LOGIN_SELECTORS = {
  formSelector: ".login_container form",
  email: "login-email-input",
  password: "login-password-input",
  guestBtnSelector: ".login-form-btn-guestlogin",
};

/**
 * Benutzerfreundliche Meldungstexte, die in Alerts/Validation verwendet werden.
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
 * Normalisiert eine E‑Mail (trim + toLowerCase).
 * @param {string} email
 * @returns {string}
 */
function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

/**
 * Versucht, einen Benutzer per Firebase-Query (`orderBy=email&equaTo=...`) zu finden.
 * Gibt das erste gefundene Benutzer-Objekt oder `null` zurück.
 * @param {string} normalizedEmail - bereits lowercased
 * @returns {Promise<Object|null>}
 */
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

/**
 * Fallback: lädt alle Benutzer und sucht case-insensitive nach der E‑Mail.
 * Diese Methode ist ineffizient bei vielen Benutzern, steht aber als Fallback bereit.
 */
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

/**
 * Sucht einen Benutzer: zuerst per Query, dann per Full-Fetch als Fallback.
 * @returns {Promise<Object|null>}
 */
async function findUserByEmail(normalizedEmail) {
  const byQuery = await queryUserByEmail(normalizedEmail);
  if (byQuery) return byQuery;
  return await fetchAllUsersAndFind(normalizedEmail);
}

/**
 * Liest Email und Passwort aus dem Login-Formular.
 * @returns {{email:string,password:string}}
 */
function readLoginFormValues() {
  return {
    email: document.getElementById(LOGIN_SELECTORS.email).value,
    password: document.getElementById(LOGIN_SELECTORS.password).value,
  };
}

/**
 * Prefill: Trägt ggf. die gespeicherte E‑Mail aus `localStorage.currentUser` ins Form ein.
 * Wird global als `window.preFillLoginForm` exponiert, da HTML ein `onclick`-Attribut verwendet.
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
 * Führt Browser-Form-Validation aus und zeigt Fehlermeldungen an.
 * @param {HTMLFormElement|null} form
 * @returns {boolean} true wenn gültig oder kein Formular vorhanden.
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
 * Führt die Login-Logik aus: lookup, Passwort-Check und Speichern im `localStorage`.
 * @throws {Error} mit passenden Login-Meldungen bei Fehlschlag.
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
 * Submit-Handler für das Login-Formular: validieren, einloggen, redirect.
 * @param {Event} e
 */
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

/**
 * Erzeugt einen temporären Gast-Benutzer, speichert ihn und leitet weiter.
 * @param {Event} e
 */
function handleGuestLogin(e) {
  e.preventDefault();
  const guestUser = { name: "Guest", email: "guest@guest.local", guest: true };
  localStorage.setItem("currentUser", JSON.stringify(guestUser));
  window.location.replace("html/board.html");
}

/**
 * Helfer: hängt benutzerdefinierte Validations-Messages an ein Input-Element.
 * @param {HTMLElement|null} el
 * @param {string} requiredMessage
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
 * Verkettet Standard-Validationstexte für Email- und Passwort-Felder.
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
 * Initialisiert Login-Event-Handler und Validation beim Laden der Seite.
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
