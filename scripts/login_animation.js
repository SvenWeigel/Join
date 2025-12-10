/**
 * Initialisiert die Splash-/Login-Animation nach dem Laden der Seite.
 * Warte kurz (400ms) und starte dann die Animation (falls vorhanden).
 */
document.addEventListener("DOMContentLoaded", () => {
  initSplash();
});

/**
 * Sammelt benötigte DOM-Elemente und ruft `startAnimation` verzögert auf.
 */
function initSplash() {
  const img = document.querySelector(".center_img");
  const centerContainer = document.querySelector(".center_img_container");
  const loginContainer = document.querySelector(".login_container");
  const headerContainer = document.querySelector(".login-site-header");
  const footerContainer = document.querySelector(".login-site-footer");
  const logoContainer = document.querySelector(".login-site-logo-container");

  setTimeout(
    () =>
      startAnimation(
        img,
        centerContainer,
        loginContainer,
        headerContainer,
        footerContainer,
        logoContainer
      ),
    400
  );
}

/**
 * Startet die Splash-Animation: wenn kein Bild vorhanden ist oder die
 * Animation bereits gelaufen ist, sorgt die Funktion dafür, dass die
 * Login-Elemente sichtbar und die Splash-Container verborgen sind.
 *
 * @param {Element|null} img - Das zu animierende Bild-Element.
 * @param {Element|null} centerContainer - Container der Splash/center image.
 * @param {Element|null} loginContainer - Container des Login-Formulars.
 * @param {Element|null} headerContainer - Header-Element der Login-Seite.
 * @param {Element|null} footerContainer - Footer-Element.
 * @param {Element|null} logoContainer - Logo-Container.
 */
function startAnimation(
  img,
  centerContainer,
  loginContainer,
  headerContainer,
  footerContainer,
  logoContainer
) {
  // Prüfe, ob Animation übersprungen werden soll (z.B. nach Logout)
  if (sessionStorage.getItem("skipAnimation")) {
    sessionStorage.removeItem("skipAnimation");
    if (centerContainer) centerContainer.classList.add("hidden");
    if (loginContainer) loginContainer.classList.remove("hidden");
    if (headerContainer) headerContainer.classList.remove("hidden");
    if (footerContainer) footerContainer.classList.remove("hidden");
    if (logoContainer) logoContainer.classList.remove("hidden");
    return;
  }

  if (!img) {
    // Kein Bild vorhanden: direkt umschalten
    if (centerContainer) centerContainer.classList.add("hidden");
    if (loginContainer) loginContainer.classList.remove("hidden");
    if (headerContainer) headerContainer.classList.remove("hidden");
    if (footerContainer) footerContainer.classList.remove("hidden");
    if (logoContainer) logoContainer.classList.remove("hidden");
    return;
  }
  if (img.classList.contains("moved")) {
    // Bereits animiert: Zustände sicherstellen
    if (centerContainer) centerContainer.classList.add("hidden");
    if (loginContainer) loginContainer.classList.remove("hidden");
    if (headerContainer) headerContainer.classList.remove("hidden");
    if (footerContainer) footerContainer.classList.remove("hidden");
    if (logoContainer) logoContainer.classList.remove("hidden");
    return;
  }

  // Animation starten und nach Ende die UI umschalten
  img.classList.add("moved");
  img.addEventListener(
    "transitionend",
    () => {
      if (centerContainer) centerContainer.classList.add("hidden");
      if (loginContainer) loginContainer.classList.remove("hidden");
      if (headerContainer) headerContainer.classList.remove("hidden");
      if (footerContainer) footerContainer.classList.remove("hidden");
      if (logoContainer) logoContainer.classList.remove("hidden");
    },
    { once: true }
  );
}
