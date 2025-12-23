/**
 * @fileoverview Shared Utility Functions
 * @description Common utility functions used across multiple modules.
 * @module Utils
 */

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
 * Escapes HTML characters for security.
 * Prevents XSS attacks by converting special characters to HTML entities.
 * @param {string} text - The text to escape
 * @returns {string} The escaped text
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Validates if a name contains only letters and spaces.
 * Supports German umlauts (äöüÄÖÜß).
 * @param {string} name - The name to validate
 * @returns {boolean} True if valid
 */
function validateNameFormat(name) {
  const nameRegex = /^[a-zA-ZäöüÄÖÜß\s]+$/;
  return nameRegex.test(name);
}

/**
 * Key for reading the current user from localStorage.
 * @constant {string}
 */
const STORAGE_KEY = "currentUser";

/**
 * Reads the stored currentUser object from localStorage.
 * Returns null if no entry is present or JSON is invalid.
 * @returns {Object|null} The current user object or null
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

// Export functions globally for use in other scripts
window.getInitials = getInitials;
window.escapeHtml = escapeHtml;
window.validateNameFormat = validateNameFormat;
window.readUserFromStorage = readUserFromStorage;
