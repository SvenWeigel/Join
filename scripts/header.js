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


function showProfileOptions(){
  const el = document.getElementById("profile-options");
  if (el) {
    el.classList.toggle('d-none');
    if (!el.classList.contains('d-none')) {
      // Menü ist jetzt offen: Klick außerhalb schließt es
      document.addEventListener('click', closeProfileOptionsOnClickOutside);
    }
  }
}
function closeProfileOptionsOnClickOutside(event) {
  const el = document.getElementById("profile-options");
  if (el && !el.classList.contains('d-none')) {
    // Prüfe, ob der Klick außerhalb des Menüs und außerhalb des User-Badge war
    if (!el.contains(event.target) && !event.target.closest('.user-badge')) {
      el.classList.add('d-none');
      document.removeEventListener('click', closeProfileOptionsOnClickOutside);
    }
  }
}