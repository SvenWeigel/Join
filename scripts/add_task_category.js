/**
 * @fileoverview Category Dropdown Controller for Add Task Page
 * @description Manages the category dropdown on the Add Task page
 * @module AddTask/Category
 */

/** @type {string} */
let selectedPageCategoryValue = "";

/**
 * Opens/closes the category dropdown on the Add Task page.
 */
function togglePageCategoryDropdown() {
  const list = document.getElementById("pageCategoryList");
  const arrow = document.getElementById("categoryDropdownArrowPage");

  list.classList.toggle("open");
  arrow.classList.toggle("open");
}

/**
 * Closes the category dropdown on the Add Task page.
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
 * Selects a category on the Add Task page.
 * @param {string} value - The value of the category
 * @param {string} label - The display text of the category
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
  if (typeof updateCreateTaskButtonState === "function") {
    updateCreateTaskButtonState();
  }
}

/**
 * Resets the category dropdown on the Add Task page.
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
 * Closes the category dropdown when clicking outside.
 */
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("categoryDropdownPage");
  if (dropdown && !dropdown.contains(event.target)) {
    closePageCategoryDropdown();
  }
});
