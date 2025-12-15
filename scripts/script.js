/**
 * Prüft ob ein Benutzer eingeloggt ist.
 * Falls nicht, wird zur Login-Seite weitergeleitet.
 * @returns {boolean} true wenn eingeloggt, false wenn nicht
 */
function checkAuth() {
  const user = localStorage.getItem("currentUser");
  if (!user) {
    const isInHtmlFolder = window.location.pathname.includes("html/");
    const redirectPath = isInHtmlFolder ? "../index.html" : "index.html";
    window.location.replace(redirectPath);
    return false;
  }
  return true;
}

window.checkAuth = checkAuth;

/**
 * Prüft ob ein Benutzer bereits eingeloggt ist und leitet zur Summary weiter.
 * Wird auf der Login-Seite verwendet.
 */
function redirectIfLoggedIn() {
  const user = localStorage.getItem("currentUser");
  if (user) {
    window.location.replace("html/summary.html");
    return true;
  }
  return false;
}

window.redirectIfLoggedIn = redirectIfLoggedIn;

/**
 * This script is used to add the disabled-link class to the active page in the menu bar.
 */
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const fileName = currentPath.split("/").pop();
  const pageMapping = {
    "summary.html": "summary-btn",
    "add_task.html": "add-task-btn",
    "board.html": "board-btn",
    "contacts.html": "contacts-btn",
    "privacy_policy.html": "privacy-btn",
    "legal_notice.html": "legal-link",
  };
  const activeClass = pageMapping[fileName];
  if (activeClass) {
    const element = document.querySelector(`.${activeClass}`);
    if (element) element.classList.add("disabled-link");
  }
});
