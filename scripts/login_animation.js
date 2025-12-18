/**
 * @fileoverview Login Animation Controller
 * @description Manages the splash screen and login page animations on application startup.
 */

/**
 * Initializes the splash/login animation after page load.
 */
document.addEventListener("DOMContentLoaded", () => {
  initSplash();
});

/**
 * Collects required DOM elements and calls startAnimation with delay.
 */
function initSplash() {
  const elements = getSplashElements();
  setTimeout(() => startAnimation(elements), 400);
}

/**
 * Gets all DOM elements needed for the splash animation.
 *
 * @returns {Object} Object containing all splash elements
 */
function getSplashElements() {
  return {
    img: document.querySelector(".center_img"),
    centerContainer: document.querySelector(".center_img_container"),
    loginContainer: document.querySelector(".login_container"),
    headerContainer: document.querySelector(".login-site-header"),
    footerContainer: document.querySelector(".login-site-footer"),
    logoContainer: document.querySelector(".login-site-logo-container"),
  };
}

/**
 * Shows the login UI elements and hides the splash container.
 *
 * @param {Object} elements - The splash elements object
 */
function showLoginUI(elements) {
  if (elements.centerContainer)
    elements.centerContainer.classList.add("hidden");
  if (elements.loginContainer)
    elements.loginContainer.classList.remove("hidden");
  if (elements.headerContainer)
    elements.headerContainer.classList.remove("hidden");
  if (elements.footerContainer)
    elements.footerContainer.classList.remove("hidden");
  if (elements.logoContainer) elements.logoContainer.classList.remove("hidden");
}

/**
 * Checks if animation should be skipped.
 *
 * @returns {boolean} True if animation should be skipped
 */
function shouldSkipAnimation() {
  if (sessionStorage.getItem("skipAnimation")) {
    sessionStorage.removeItem("skipAnimation");
    return true;
  }
  return false;
}

/**
 * Starts the splash animation or shows login UI directly.
 *
 * @param {Object} elements - The splash elements object
 */
function startAnimation(elements) {
  if (
    shouldSkipAnimation() ||
    !elements.img ||
    elements.img.classList.contains("moved")
  ) {
    showLoginUI(elements);
    return;
  }

  elements.img.classList.add("moved");
  elements.img.addEventListener("transitionend", () => showLoginUI(elements), {
    once: true,
  });
}
