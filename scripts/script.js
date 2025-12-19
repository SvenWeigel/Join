/**
 * @fileoverview Main Application Script
 * @description Core utility functions for authentication, navigation, and common application logic.
 */

/**
 * Checks if a user is logged in and redirects to login if not.
 *
 * @returns {boolean} True if logged in, false otherwise
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
 * Redirects to summary page if user is already logged in.
 *
 * @returns {boolean} True if redirected, false otherwise
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
 * Returns mapping of page filenames to their menu button classes.
 *
 * @returns {Object} Page to class mapping
 */
function getPageMapping() {
  return {
    "summary.html": "summary-btn",
    "add_task.html": "add-task-btn",
    "board.html": "board-btn",
    "contacts.html": "contacts-btn",
    "privacy_policy.html": "privacy-btn",
    "legal_notice.html": "legal-link",
  };
}

/**
 * Adds disabled-link class to the active page menu button.
 */
function highlightActiveMenuLink() {
  const fileName = window.location.pathname.split("/").pop();
  const activeClass = getPageMapping()[fileName];
  if (!activeClass) return;
  const element = document.querySelector(`.${activeClass}`);
  if (element) element.classList.add("disabled-link");
}

document.addEventListener("DOMContentLoaded", highlightActiveMenuLink);



function checkUserOrGuest(){
  if (localStorage.getItem("currentUser")) {
    return true;
  }
  return false;
}

function renderGuestView() {
  if (checkUserOrGuest()) return;
  applyGuestView();
}

function applyGuestView(){
  const menuBar = document.querySelector(".menu-bar-btn-container");
  const logInRef = document.querySelector(".menu-bar-btn-logIn");
  const headRef = document.querySelector(".header-profile-container");

  menuBar.style.display = "none";
  headRef.style.display = "none";
  logInRef.style.display = "flex";
  
}