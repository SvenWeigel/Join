/**
 * @file animation_skip.js
 * @description Checks whether animations should be skipped (e.g. after logout)
 * and applies a CSS class to disable animations if needed.
 */

/**
 * Checks sessionStorage for animation skip flag and applies CSS class.
 * This script runs immediately when loaded to prevent animation flicker.
 * @returns {void}
 */
(function checkAnimationSkip() {
  if (sessionStorage.getItem("skipAnimation")) {
    document.documentElement.classList.add("skip-animation");
  }
})();
