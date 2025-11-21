document.addEventListener("DOMContentLoaded", () => {
  initSplash();
});

function initSplash() {
  const img = document.querySelector(".center_img");
  const centerContainer = document.querySelector(".center_img_container");
  const loginContainer = document.querySelector(".login_container");
  setTimeout(() => startAnimation(img, centerContainer, loginContainer), 400);
}

function startAnimation(img, centerContainer, loginContainer) {
  if (!img) {
    // No image to animate; ensure splash is hidden before showing login
    if (centerContainer) centerContainer.classList.add("hidden");
    if (loginContainer) loginContainer.classList.remove("hidden");
    return;
  }
  if (img.classList.contains("moved")) {
    // Animation already done; ensure correct containers are shown/hidden
    if (centerContainer) centerContainer.classList.add("hidden");
    if (loginContainer) loginContainer.classList.remove("hidden");
    return;
  }

  img.classList.add("moved");
  img.addEventListener(
    "transitionend",
    () => {
      if (centerContainer) centerContainer.classList.add("hidden");
      if (loginContainer) loginContainer.classList.remove("hidden");
    },
    { once: true }
  );
}
