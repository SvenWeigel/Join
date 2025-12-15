/**
 * Schlüssel für das Lesen des aktuellen Benutzers aus `localStorage`.
 * Erwartet ein JSON-Objekt mit (mindestens) einer `name`-Eigenschaft.
 */
const STORAGE_KEY = "currentUser";

/**
 * Ermittelt bis zu zwei Initialen aus einem vollen Namen.
 * Beispiel: "Max Mustermann" -> "MM"; "Alice" -> "A".
 * @param {string} name - Voller Name des Benutzers.
 * @returns {string} 0-2 Zeichen mit Großbuchstaben.
 */
function getInitials(name) {
  if (!name || typeof name !== "string") return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ? parts[0].charAt(0).toUpperCase() : "";
  const second = parts[1] ? parts[1].charAt(0).toUpperCase() : "";
  return (first + second).slice(0, 2);
}

/**
 * Liest das gespeicherte `currentUser`-Objekt aus `localStorage`.
 * Gibt `null` zurück, wenn kein Eintrag vorhanden oder JSON ungültig ist.
 * @returns {Object|null}
 */
function readUserFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * Aktualisiert alle Elemente mit der Klasse `.user-avatar`.
 * Setzt den Text auf die Initialen und (falls vorhanden) das Tooltip auf den vollen Namen.
 * @param {string} initials - Die anzuzeigenden Initialen.
 * @param {string} fullName - Voller Name für das Tooltip.
 */
function updateAvatars(initials, fullName) {
  const nodes = document.querySelectorAll(".user-avatar");
  if (!nodes || nodes.length === 0) return;
  nodes.forEach((el) => {
    el.textContent = initials || "?";
    const badge = el.closest(".user-badge");
    if (badge && fullName) badge.setAttribute("title", fullName);
  });
}

/**
 * Lese den aktuellen Benutzer, berechne Initialen und trage sie in die UI ein.
 * Diese Funktion wird beim Laden ausgeführt und ist global als `applyInitials` verfügbar.
 */
function applyInitials() {
  const user = readUserFromStorage();
  const name = user && user.name ? user.name : "";
  const initials = getInitials(name) || "?";
  updateAvatars(initials, name);
}

// Bei Laden der Seite ausführen; außerdem global zugänglich für Tests/manuelle Aufrufe
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyInitials);
} else {
  applyInitials();
}

window.applyInitials = applyInitials;

function showProfileOptions() {
  const el = document.getElementById("profile-options");
  if (el) {
    if (el.classList.contains("d-none")) {
      el.classList.remove("d-none");
      void el.offsetWidth;
      el.classList.add("show");
      document.addEventListener("click", closeProfileOptionsOnClickOutside);
    } else {
      el.classList.remove("show");
      document.removeEventListener("click", closeProfileOptionsOnClickOutside);
      setTimeout(() => {
        el.classList.add("d-none");
      }, 100);
    }
  }
}

function closeProfileOptionsOnClickOutside(event) {
  const el = document.getElementById("profile-options");
  if (el && el.classList.contains("show")) {
    if (!el.contains(event.target) && !event.target.closest(".user-badge")) {
      el.classList.remove("show");
      document.removeEventListener("click", closeProfileOptionsOnClickOutside);
      setTimeout(() => {
        el.classList.add("d-none");
      }, 400);
    }
  }
}

/**
 * Meldet den Benutzer ab, löscht die Session-Daten und leitet zur Login-Seite weiter.
 * Setzt ein Flag, um die Splash-Animation zu überspringen.
 * Verwendet location.replace() um Browser-Zurück-Navigation zu verhindern.
 */
function logout() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.clear();
  sessionStorage.setItem("skipAnimation", "true");

  // Ermittle den korrekten Pfad zur index.html
  const isInHtmlFolder = window.location.pathname.includes("html/");
  const redirectPath = isInHtmlFolder ? "../index.html" : "index.html";
  window.location.replace(redirectPath);
}

window.logout = logout;
