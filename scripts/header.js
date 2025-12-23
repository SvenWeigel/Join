/**
 * @fileoverview Header Component Controller
 * @description Manages the application header including user initials display and dropdown menu functionality.
 * @module UI/Header
 */

/**
 * Updates all elements with the class `.user-avatar`.
 * Sets the text to the initials and (if available) the tooltip to the full name.
 * @param {string} initials - The initials to display.
 * @param {string} fullName - Full name for the tooltip.
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
 * Reads the current user, calculates initials, and applies them to the UI.
 * This function runs on load and is globally available as `applyInitials`.
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

/**
 * Shows or hides the profile options dropdown menu.
 */
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

/**
 * Closes the profile options menu when clicking outside of it.
 * @param {Event} event - The click event.
 */
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
 * Logs out the user, clears session data, and redirects to the login page.
 * Sets a flag to skip the splash animation.
 * Uses location.replace() to prevent browser back navigation.
 */
function logout() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.clear();
  sessionStorage.setItem("skipAnimation", "true");
  window.location.replace("index.html");
}

window.logout = logout;
