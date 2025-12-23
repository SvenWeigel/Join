/**
 * @file login_init.js
 * @description Initialization script for the login page. Checks if user is
 * already authenticated and redirects to summary page if needed.
 */

/**
 * Initializes the login page by checking authentication status.
 * Redirects a user to the summary page if they are already authenticated.
 * @returns {void}
 */
function initLoginPage() {
  if (typeof redirectIfLoggedIn === "function") {
    redirectIfLoggedIn();
  }
}

initLoginPage();
