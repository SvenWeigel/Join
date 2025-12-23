/**
 * @fileoverview Guest Login Handler
 * @description Handles guest login for the Join application.
 *              The guest user can access all global data like a logged-in user.
 * @module Authentication/GuestLogin
 */

/**
 * Creates a temporary guest user, saves it and redirects.
 * The guest user has access to all global tasks and contacts.
 *
 * @param {Event} e - The click event
 */
function handleGuestLogin(e) {
  e.preventDefault();
  const guestUser = { name: "Guest", email: "guest@guest.local", guest: true };
  localStorage.setItem("currentUser", JSON.stringify(guestUser));
  window.location.replace("html/summary.html");
}

window.handleGuestLogin = handleGuestLogin;
