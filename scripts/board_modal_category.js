/**
 * @fileoverview Board Modal Category Controller
 * @description Verwaltet die Category Dropdown-Funktionalität im Add Task Modal
 */

/** @type {string} */
let selectedCategoryValue = "";

// ==========================================================================
// DROPDOWN STEUERUNG
// ==========================================================================

/**
 * Öffnet/Schließt das Category-Dropdown.
 */
function toggleModalCategoryDropdown() {
  const dropdown = document.getElementById("modalCategoryDropdown");
  const list = document.getElementById("modalCategoryList");
  const arrow = document.getElementById("categoryDropdownArrow");

  list.classList.toggle("open");
  arrow.classList.toggle("open");
}

/**
 * Schließt das Category-Dropdown.
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
 * Wählt eine Kategorie aus.
 * @param {string} value - Der Wert der Kategorie (z.B. 'technical', 'userstory')
 * @param {string} label - Der Anzeigetext der Kategorie
 */
function selectModalCategory(value, label) {
  const selectedText = document.getElementById("modalCategorySelected");
  const hiddenInput = document.getElementById("taskCategory");
  const items = document.querySelectorAll(
    "#modalCategoryList .category-option"
  );

  // Vorherige Auswahl entfernen
  items.forEach((item) => item.classList.remove("selected"));

  // Neue Auswahl setzen
  const selectedItem = document.querySelector(
    `#modalCategoryList .category-option[data-value="${value}"]`
  );
  if (selectedItem) {
    selectedItem.classList.add("selected");
  }

  // Text und Wert aktualisieren
  selectedText.textContent = label;
  selectedText.classList.add("has-value");
  hiddenInput.value = value;
  selectedCategoryValue = value;

  // Dropdown schließen
  closeModalCategoryDropdown();
}

/**
 * Setzt das Category-Dropdown zurück.
 */
function resetModalCategory() {
  const selectedText = document.getElementById("modalCategorySelected");
  const hiddenInput = document.getElementById("taskCategory");
  const items = document.querySelectorAll(
    "#modalCategoryList .category-option"
  );

  items.forEach((item) => item.classList.remove("selected"));
  selectedText.textContent = "Select task category";
  selectedText.classList.remove("has-value");
  hiddenInput.value = "";
  selectedCategoryValue = "";
}

/**
 * Holt den aktuell ausgewählten Kategorie-Wert.
 * @returns {string}
 */
function getSelectedCategory() {
  return selectedCategoryValue;
}

// ==========================================================================
// EVENT LISTENER
// ==========================================================================

/**
 * Schließt das Dropdown bei Klick außerhalb.
 */
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("modalCategoryDropdown");
  if (dropdown && !dropdown.contains(event.target)) {
    closeModalCategoryDropdown();
  }
});
