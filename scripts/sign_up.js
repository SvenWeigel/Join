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

/**
 * Prüft, ob alle Pflichtfelder des Signup-Formulars ausgefüllt und gültig sind.
 * Berücksichtigt Name (min. 2 Zeichen), Email (gültiges Format), Passwort (min. 8 Zeichen),
 * Passwortbestätigung (muss übereinstimmen) und die Datenschutz-Checkbox.
 *
 * @returns {boolean} true, wenn alle Felder gültig sind.
 */
function areAllFieldsValid() {
  const name = document.getElementById(SELECTORS.name);
  const email = document.getElementById(SELECTORS.email);
  const password = document.getElementById(SELECTORS.password);
  const confirm = document.getElementById(SELECTORS.confirm);
  const privacy = document.getElementById(SELECTORS.privacyCheck);

  const nameValid = name && name.value.trim().length >= 2;
  const emailValid = email && email.value.trim() !== "" && email.validity.valid;
  const passwordValid = password && password.value.length >= 8;
  const confirmValid =
    confirm && confirm.value !== "" && confirm.value === password?.value;
  const privacyChecked = privacy && privacy.checked;

  return (
    nameValid && emailValid && passwordValid && confirmValid && privacyChecked
  );
}

/**
 * Aktualisiert den Zustand des Signup-Buttons basierend auf der Validierung aller Felder.
 */
function updateSignupButtonState() {
  const button = document.getElementById(SELECTORS.signupBtn);
  if (!button) return;
  button.disabled = !areAllFieldsValid();
}

/**
 * Verknüpft alle Formularfelder mit der Button-Zustandsaktualisierung.
 * Registriert `input`-Listener auf Textfeldern und `change`-Listener auf der Checkbox.
 */
function wireFormValidation() {
  const fieldIds = [
    SELECTORS.name,
    SELECTORS.email,
    SELECTORS.password,
    SELECTORS.confirm,
  ];

  fieldIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", updateSignupButtonState);
    }
  });

  const checkbox = document.getElementById(SELECTORS.privacyCheck);
  if (checkbox) {
    checkbox.addEventListener("change", updateSignupButtonState);
  }

  // Initialen Zustand setzen
  updateSignupButtonState();
}

/**
 * Verkettet die Passwort- und Bestätigungsfelder für Live-Validation.
 * Wenn die beiden Felder nicht übereinstimmen, wird auf dem Confirm-Feld
 * eine erklärende Custom-Validity gesetzt, so dass der Browser eine
 * verständliche Fehlermeldung anzeigt.
 *
 * @param {string} passwordId - ID des Passwort-Inputs.
 * @param {string} confirmId - ID des Confirm-Inputs.
 */
function wirePasswordConfirmValidation(passwordId, confirmId) {
  const pwd = document.getElementById(passwordId);
  const conf = document.getElementById(confirmId);
  if (!pwd || !conf) return;

  const validate = () => {
    if (conf.value !== pwd.value)
      conf.setCustomValidity(MESSAGES.passwordsMismatch);
    else conf.setCustomValidity("");
  };

  pwd.addEventListener("input", validate);
  conf.addEventListener("input", validate);
  validate(); // initial prüfen
}

/**
 * Holt alle Benutzer-Datensätze vom Server.
 * Erwartet eine JSON-Antwort in Form eines Objekts, das in ein Array umgewandelt wird.
 *
 * @param {string} baseUrl - Basis-URL der API/DB (z. B. Firebase REST endpoint).
 * @returns {Promise<Array>} Array mit User-Objekten.
 * @throws {Error} Wenn der Fetch fehlschlägt.
 */
async function fetchAllUsers(baseUrl) {
  const res = await fetch(`${baseUrl}/users.json`);
  if (!res.ok) throw new Error(MESSAGES.fetchUsersError);
  const data = await res.json();
  return data ? Object.values(data) : [];
}

/**
 * Legt einen neuen Benutzer-Datensatz auf dem Server an (POST).
 *
 * @param {string} baseUrl - Basis-URL der API/DB.
 * @param {Object} user - Benutzerobjekt, das gepostet wird.
 * @returns {Promise<Object>} Response-JSON des Servers.
 * @throws {Error} Wenn der POST fehlschlägt.
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
 * Liest die aktuellen Werte des Signup-Formulars aus dem DOM.
 * Trimmt `name` und `email`, gibt `password`/`confirm` unverändert zurück.
 *
 * @returns {{name:string,email:string,password:string,confirm:string}}
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
 * Prüft, ob die angegebene (normalisierte) E‑Mail bereits in der DB existiert.
 *
 * @param {string} normalizedEmail - E‑Mail in Kleinbuchstaben.
 * @returns {Promise<boolean>} true, wenn die E‑Mail schon vorhanden ist.
 */
async function isEmailTaken(normalizedEmail) {
  const users = await fetchAllUsers(BASE_URL);
  return users.some((u) => (u.email || "").toLowerCase() === normalizedEmail);
}

/**
 * Erstellt einen neuen Benutzer-Datensatz (normalisiert Email) und leitet bei Erfolg weiter.
 * Erstellt zusätzlich einen globalen Contact-Eintrag für den neuen User.
 * Zeigt eine Erfolgs-Message und navigiert zurück zur Startseite.
 *
 * @param {{name:string,email:string,password:string}} param0 - Daten aus dem Formular.
 */
async function registerAndRedirect({ name, email, password }) {
  const user = {
    name,
    email: email.toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
  };
  await createUserRecord(BASE_URL, user);

  // User auch als globalen Contact erstellen
  const contact = {
    name,
    email: email.toLowerCase(),
    phone: "",
    color: getRandomContactColor(),
  };
  await createContact(contact);

  showSignupSuccessOverlay();
}

/**
 * Generiert eine zufällige Farbe für neue Kontakte.
 * @returns {string} Ein Hex-Farbcode
 */
function getRandomContactColor() {
  const colors = [
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
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Haupt-Handler für das Signup-Formular.
 * Führt Browser-Validation durch, liest Formwerte, prüft auf Duplikate
 * und erstellt den neuen Benutzer. Fehler werden geloggt und per Alert gezeigt.
 *
 * @param {Event} e - Submit-Event des Formulars.
 */
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

/**
 * Initialisiert das Signup-Skript: Verknüpft alle Formularfelder mit der Validierung,
 * aktiviert Live-Validation für Passwort/Confirm und hängt den
 * Submit-Handler an das Formular.
 */
function init() {
  wireFormValidation();
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

function showSignupSuccessOverlay() {
  const overlay = document.getElementById("signup-success-overlay");
  if (overlay) {
    overlay.style.display = "flex";
    setTimeout(() => {
      overlay.style.display = "none";
      window.location.replace("index.html");
    }, 2000); // 2 Sekunden anzeigen, dann weiterleiten
  }
}

function changePasswordIcon(inputId,iconId) {
  const passwordIcon = document.getElementById(iconId);
  const passwordInput = document.getElementById(inputId);

  if (passwordInput.value.length > 0) {
    passwordIcon.src = "assets/icons/visibility_off.svg";
    passwordIcon.classList.add("pointer");
  } else {
    passwordIcon.src = "assets/icons/lock.svg";
    passwordIcon.classList.remove("pointer");
  }
}

function togglePasswordVisibility(inputId, iconId) {
  const passwordIcon = document.getElementById(iconId);
  const passwordInput = document.getElementById(inputId);

  if (passwordInput.value.length > 0) {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      passwordIcon.src = "assets/icons/visibility.svg";
    } else {
      passwordInput.type = "password";
      passwordIcon.src = "assets/icons/visibility_off.svg";
    }
  }
}

// function preFillSignupForm() {
//   const name = document.getElementsByName("name")[0];
//   const email = document.getElementsByName("email")[0];
//   const password = document.getElementsByName("password")[0];
//   const confirm = document.getElementsByName("confirm_password")[0];
//   if (name) name.value = "Sofia Müller";
//   if (email) email.value = "Sofiam@gmail.com";
//   if (password) password.value = "mypassword123";
//   if (confirm) confirm.value = "mypassword123";
// }
