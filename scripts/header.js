/**
 * @fileoverview Header Component Controller
 * @description Manages the application header including user initials display and dropdown menu functionality.
 */

/**
 * Key for reading the current user from `localStorage`.
 * Expects a JSON object with (at least) a `name` property.
 */
const STORAGE_KEY = "currentUser";

/**
 * Determines up to two initials from a full name.
 * Example: "Max Mustermann" -> "MM"; "Alice" -> "A".
 * @param {string} name - Full name of the user.
 * @returns {string} 0-2 uppercase characters.
 */
function getInitials(name) {
  if (!name || typeof name !== "string") return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ? parts[0].charAt(0).toUpperCase() : "";
  const second = parts[1] ? parts[1].charAt(0).toUpperCase() : "";
  return (first + second).slice(0, 2);
}

/**
 * Reads the stored `currentUser` object from `localStorage`.
 * Returns `null` if no entry is present or JSON is invalid.
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

  const isInHtmlFolder = window.location.pathname.includes("html/");
  const redirectPath = isInHtmlFolder ? "../index.html" : "index.html";
  window.location.replace(redirectPath);
}

window.logout = logout;
