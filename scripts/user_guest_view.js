window.addEventListener("resize", renderLayout);
window.addEventListener("DOMContentLoaded", renderLayout);

function checkUserOrGuest() {
  if (localStorage.getItem("currentUser")) {
    return true;
  }
  return false;
}

function setDisplay(el, value) {
  if (!el) return;
  el.style.display = value;
}


const ui = {
  menuBar: document.querySelector(".menu-bar-btn-container"),
  logInBtn: document.querySelector(".menu-bar-btn-logIn"),
  headerProfile: document.querySelector(".header-profile-container"),
  bottomNavUser: document.querySelector(".bottom-nav"),
  bottomNavGuest: document.querySelector(".bottom-nav-guest"),
};

function renderDesktop(isUser) {
  setDisplay(ui.bottomNavUser, "none");
  setDisplay(ui.bottomNavGuest, "none");

  setDisplay(ui.logInBtn, isUser ? "none" : "flex");
  setDisplay(ui.headerProfile, isUser ? "flex" : "none");
  setDisplay(ui.menuBar, isUser ? "flex" : "none");
}


function renderMobileUser() {
  setDisplay(ui.menuBar, "flex");
  setDisplay(ui.logInBtn, "none");
  setDisplay(ui.headerProfile, "flex");

  setDisplay(ui.bottomNavUser, "flex");
  setDisplay(ui.bottomNavGuest, "none");
}


function renderMobileGuest() {
  setDisplay(ui.menuBar, "none");
  setDisplay(ui.logInBtn, "flex");
  setDisplay(ui.headerProfile, "none");

  setDisplay(ui.bottomNavUser, "none");
  setDisplay(ui.bottomNavGuest, "flex");
}


function renderLayout() {
  const isMobile = window.innerWidth < 870;
  const isUser = checkUserOrGuest();

  if (!isMobile) {
    renderDesktop(isUser);
    return;
  }

  isUser ? renderMobileUser() : renderMobileGuest();
}
