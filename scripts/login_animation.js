document.addEventListener("DOMContentLoaded", () => {
  initSplash();
});

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

function startAnimation(
  img,
  centerContainer,
  loginContainer,
  headerContainer,
  footerContainer,
  logoContainer
) {
  if (!img) {
    // No image to animate; ensure splash is hidden before showing login
    if (centerContainer) centerContainer.classList.add("hidden");
    if (loginContainer) loginContainer.classList.remove("hidden");
    if (headerContainer) headerContainer.classList.remove("hidden");
    if (footerContainer) footerContainer.classList.remove("hidden");
    if (logoContainer) logoContainer.classList.remove("hidden");
    return;
  }
  if (img.classList.contains("moved")) {
    // Animation already done; ensure correct containers are shown/hidden
    if (centerContainer) centerContainer.classList.add("hidden");
    if (loginContainer) loginContainer.classList.remove("hidden");
    if (headerContainer) headerContainer.classList.remove("hidden");
    if (footerContainer) footerContainer.classList.remove("hidden");
    if (logoContainer) logoContainer.classList.remove("hidden");
    return;
  }

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
