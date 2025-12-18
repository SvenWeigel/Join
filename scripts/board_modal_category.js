/**
 * @fileoverview Board Modal Category Controller
 * @description Manages the Category dropdown functionality in the Add Task modal
 */

/** @type {string} */
let selectedCategoryValue = "";

/**
 * Opens/closes the category dropdown.
 */
function toggleModalCategoryDropdown() {
  const dropdown = document.getElementById("modalCategoryDropdown");
  const list = document.getElementById("modalCategoryList");
  const arrow = document.getElementById("categoryDropdownArrow");

  list.classList.toggle("open");
  arrow.classList.toggle("open");
}

/**
 * Closes the category dropdown.
 */
function closeModalCategoryDropdown() {
  const list = document.getElementById("modalCategoryList");
  const arrow = document.getElementById("categoryDropdownArrow");

  if (list?.classList.contains("open")) {
    list.classList.remove("open");
    arrow?.classList.remove("open");
  }
}

/**
 * Removes the selected class from all category items.
 */
function clearCategorySelection() {
  const items = document.querySelectorAll(
    "#modalCategoryList .category-option"
  );
  items.forEach((item) => item.classList.remove("selected"));
}

/**
 * Highlights the selected category item.
 *
 * @param {string} value - The category value
 */
function highlightCategoryItem(value) {
  const selectedItem = document.querySelector(
    `#modalCategoryList .category-option[data-value="${value}"]`
  );
  if (selectedItem) {
    selectedItem.classList.add("selected");
  }
}

/**
 * Updates the category display text and hidden input.
 *
 * @param {string} value - The category value
 * @param {string} label - The display text
 */
function updateCategoryDisplay(value, label) {
  const selectedText = document.getElementById("modalCategorySelected");
  const hiddenInput = document.getElementById("taskCategory");

  selectedText.textContent = label;
  selectedText.classList.add("has-value");
  hiddenInput.value = value;
  selectedCategoryValue = value;
}

/**
 * Selects a category.
 *
 * @param {string} value - The category value (e.g. 'technical', 'userstory')
 * @param {string} label - The display text of the category
 */
function selectModalCategory(value, label) {
  clearCategorySelection();
  highlightCategoryItem(value);
  updateCategoryDisplay(value, label);
  closeModalCategoryDropdown();
}

/**
 * Resets the category dropdown.
 */
function resetModalCategory() {
  clearCategorySelection();
  const selectedText = document.getElementById("modalCategorySelected");
  const hiddenInput = document.getElementById("taskCategory");

  selectedText.textContent = "Select task category";
  selectedText.classList.remove("has-value");
  hiddenInput.value = "";
  selectedCategoryValue = "";
}

/**
 * Gets the currently selected category value.
 *
 * @returns {string} The selected category value
 */
function getSelectedCategory() {
  return selectedCategoryValue;
}

document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("modalCategoryDropdown");
  if (dropdown && !dropdown.contains(event.target)) {
    closeModalCategoryDropdown();
  }
});
