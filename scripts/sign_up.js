// ID-Namen der Elemente
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
  fillAll: "Bitte alle Felder ausfüllen.",
  passwordsMismatch: "Passwörter stimmen nicht überein.",
  emailExists: "E-Mail existiert bereits.",
  saved: "Registrierung erfolgreich.",
  fetchUsersError: "Fehler beim Abrufen der Benutzerdaten",
  saveError: "Fehler beim Speichern in der Datenbank",
};

// Schaltet den Signup-Button an/aus je nach Checkbox
function setSignupButtonState(checkbox, button) {
  if (!checkbox || !button) return;
  button.disabled = !checkbox.checked;
}

// Verknüpft die Datenschutz-Checkbox mit dem Button (initial + bei Änderung)
function wirePrivacyToggle(checkboxId, buttonId) {
  const checkbox = document.getElementById(checkboxId);
  const button = document.getElementById(buttonId);
  if (!checkbox || !button) return;
  setSignupButtonState(checkbox, button);
  checkbox.addEventListener("change", () =>
    setSignupButtonState(checkbox, button)
  );
}

// Prüft, ob Felder ausgefüllt sind und die Passwörter gleich sind
function validateFormValues({ name, email, password, confirm }) {
  if (!name || !email || !password) {
    return { ok: false, message: MESSAGES.fillAll };
  }
  if (password !== confirm) {
    return { ok: false, message: MESSAGES.passwordsMismatch };
  }
  return { ok: true };
}

// Holt alle Benutzer vom Server (JSON erwartet)
async function fetchAllUsers(baseUrl) {
  const res = await fetch(`${baseUrl}/users.json`);
  if (!res.ok) throw new Error(MESSAGES.fetchUsersError);
  const data = await res.json();
  return data ? Object.values(data) : [];
}

// Sendet neuen Benutzer zum Server (POST)
async function createUserRecord(baseUrl, user) {
  const res = await fetch(`${baseUrl}/users.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error(MESSAGES.saveError);
  return res.json();
}

// Behandelt Formular-Absendung: prüfen, speichern, weiterleiten
// Lese Formularwerte aus
function readFormValues() {
  return {
    name: document.getElementById(SELECTORS.name).value.trim(),
    email: document.getElementById(SELECTORS.email).value.trim(),
    password: document.getElementById(SELECTORS.password).value,
    confirm: document.getElementById(SELECTORS.confirm).value,
  };
}

// Prüfe, ob E-Mail bereits existiert
async function isEmailTaken(normalizedEmail) {
  const users = await fetchAllUsers(BASE_URL);
  return users.some((u) => (u.email || "").toLowerCase() === normalizedEmail);
}

// Erstelle Benutzer-Datensatz und leite weiter
async function registerAndRedirect({ name, email, password }) {
  const user = { name, email, password, createdAt: new Date().toISOString() };
  await createUserRecord(BASE_URL, user);
  alert(MESSAGES.saved);
  window.location.replace("/index.html");
}

// Haupt-Handler für Formular-Submit (koordiniert die Teilfunktionen)
async function handleSignupSubmit(e) {
  e.preventDefault();

  const { name, email, password, confirm } = readFormValues();

  const validation = validateFormValues({ name, email, password, confirm });
  if (!validation.ok) {
    alert(validation.message);
    return;
  }

  const normalizedEmail = email.toLowerCase();

  try {
    if (await isEmailTaken(normalizedEmail)) {
      alert(MESSAGES.emailExists);
      return;
    }

    await registerAndRedirect({ name, email, password });
  } catch (err) {
    console.error(err);
    alert("Fehler: " + err.message);
  }
}

// Setup beim Laden: Checkbox-Button verbinden und Formular-Handler setzen
function init() {
  wirePrivacyToggle(SELECTORS.privacyCheck, SELECTORS.signupBtn);

  const form = document.getElementById(SELECTORS.form);
  if (form) form.addEventListener("submit", handleSignupSubmit);
}

document.addEventListener("DOMContentLoaded", init);
