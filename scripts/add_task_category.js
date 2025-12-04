/**
 * @fileoverview Category Dropdown Controller für Add Task Page
 * @description Verwaltet das Category-Dropdown auf der Add Task-Seite
 */

// ==========================================================================
// CATEGORY DROPDOWN (Add Task Page)
// ==========================================================================

/** @type {string} */
let selectedPageCategoryValue = "";

/**
 * Öffnet/Schließt das Category-Dropdown auf der Add Task-Seite.
 */
function togglePageCategoryDropdown() {
  const list = document.getElementById("pageCategoryList");
  const arrow = document.getElementById("categoryDropdownArrowPage");

  list.classList.toggle("open");
  arrow.classList.toggle("open");
}

/**
 * Schließt das Category-Dropdown auf der Add Task-Seite.
 */
function closePageCategoryDropdown() {
  const list = document.getElementById("pageCategoryList");
  const arrow = document.getElementById("categoryDropdownArrowPage");

  if (list?.classList.contains("open")) {
    list.classList.remove("open");
    arrow?.classList.remove("open");
  }
}

/**
 * Wählt eine Kategorie auf der Add Task-Seite aus.
 * @param {string} value - Der Wert der Kategorie
 * @param {string} label - Der Anzeigetext der Kategorie
 */
function selectPageCategory(value, label) {
  const selectedText = document.getElementById("pageCategorySelected");
  const hiddenInput = document.getElementById("taskCategoryPage");
  const items = document.querySelectorAll("#pageCategoryList .category-option");

  items.forEach((item) => item.classList.remove("selected"));

  const selectedItem = document.querySelector(
    `#pageCategoryList .category-option[data-value="${value}"]`
  );
  if (selectedItem) {
    selectedItem.classList.add("selected");
  }

  selectedText.textContent = label;
  selectedText.classList.add("has-value");
  hiddenInput.value = value;
  selectedPageCategoryValue = value;

  closePageCategoryDropdown();
}

/**
 * Setzt das Category-Dropdown auf der Add Task-Seite zurück.
 */
function resetPageCategory() {
  const selectedText = document.getElementById("pageCategorySelected");
  const hiddenInput = document.getElementById("taskCategoryPage");
  const items = document.querySelectorAll("#pageCategoryList .category-option");

  if (items) items.forEach((item) => item.classList.remove("selected"));
  if (selectedText) {
    selectedText.textContent = "Select task category";
    selectedText.classList.remove("has-value");
  }
  if (hiddenInput) hiddenInput.value = "";
  selectedPageCategoryValue = "";
}

/**
 * Schließt das Category-Dropdown bei Klick außerhalb.
 */
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("categoryDropdownPage");
  if (dropdown && !dropdown.contains(event.target)) {
    closePageCategoryDropdown();
  }
});
