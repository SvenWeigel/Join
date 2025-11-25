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
  passwordsMismatch: "Passwords do not match.",
  emailExists: "Email already exists.",
  saved: "Registration successful.",
  fetchUsersError: "Error fetching user data.",
  saveError: "Error saving to the database.",
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

// Live-Validation: Setzt custom validity auf dem Confirm-Feld, wenn die
// Passwörter nicht übereinstimmen. Sorgt dafür, dass Browser-Validation
// eine verständliche Meldung zeigt.
function wirePasswordConfirmValidation(passwordId, confirmId) {
  const pwd = document.getElementById(passwordId);
  const conf = document.getElementById(confirmId);
  if (!pwd || !conf) return;

  const validate = () => {
    if (conf.value !== pwd.value) {
      conf.setCustomValidity(MESSAGES.passwordsMismatch);
    } else {
      conf.setCustomValidity("");
    }
  };

  pwd.addEventListener("input", validate);
  conf.addEventListener("input", validate);
  // initial
  validate();
}

// Fetch all users from the server (expects JSON)
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
  // store email normalized to lowercase so lookups can query by exact value
  const user = {
    name,
    email: email.toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
  };
  await createUserRecord(BASE_URL, user);
  alert(MESSAGES.saved);
  window.location.replace("/index.html");
}

// Haupt-Handler für Formular-Submit (koordiniert die Teilfunktionen)
async function handleSignupSubmit(e) {
  e.preventDefault();

  const form = document.getElementById(SELECTORS.form);
  if (form && !form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const { name, email, password, confirm } = readFormValues();

  const normalizedEmail = email.toLowerCase();

  try {
    if (await isEmailTaken(normalizedEmail)) {
      alert(MESSAGES.emailExists);
      return;
    }

    await registerAndRedirect({ name, email, password });
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
}

// Setup beim Laden: Checkbox-Button verbinden und Formular-Handler setzen
function init() {
  wirePrivacyToggle(SELECTORS.privacyCheck, SELECTORS.signupBtn);
  // Passwort/Confirm Live-Validation statt Inline-attribute
  wirePasswordConfirmValidation(SELECTORS.password, SELECTORS.confirm);

  const form = document.getElementById(SELECTORS.form);
  if (form) form.addEventListener("submit", handleSignupSubmit);
}

// Sicherstellen, dass `init` ausgeführt wird, auch wenn das Skript
// nach dem `DOMContentLoaded`-Event geladen wurde.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
