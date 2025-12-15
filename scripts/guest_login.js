/**
 * @fileoverview Guest Login Handler
 * @description Verwaltet den Gast-Login für die Join-Anwendung.
 * Der Guest-User kann wie ein angemeldeter User auf alle globalen Daten zugreifen.
 */

/**
 * Erzeugt einen temporären Gast-Benutzer, speichert ihn und leitet weiter.
 * Der Guest-User hat Zugriff auf alle globalen Tasks und Contacts.
 * @param {Event} e - Das Click-Event
 */
function handleGuestLogin(e) {
  e.preventDefault();
  const guestUser = { name: "Guest", email: "guest@guest.local", guest: true };
  localStorage.setItem("currentUser", JSON.stringify(guestUser));
  window.location.replace("html/summary.html");
}

/**
 * Prüft ob der aktuelle User ein Gast ist (nur für UI-Zwecke wie Begrüßung).
 * @returns {boolean} True wenn der User als Gast markiert ist
 */
function isGuestLoggedIn() {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser && currentUser.guest === true;
  } catch {
    return false;
  }
}

// Global verfügbar machen
window.handleGuestLogin = handleGuestLogin;
window.isGuestLoggedIn = isGuestLoggedIn;
