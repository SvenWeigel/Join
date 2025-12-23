/**
 * @fileoverview Task Form Validation
 * @description Validates task form fields.
 * @module Validation/Task
 */

/**
 * Validates add task form.
 * @param {Event} event - Form submit event
 * @param {string} formId - ID of the form
 * @returns {boolean} True if form is valid
 */
function validateAddTaskForm(event, formId = "addTaskForm") {
  const titleValid = validateTaskTitle(formId);
  const dueDateValid = validateTaskDueDate(formId);
  const categoryValid = validateTaskCategory(formId);
  const descriptionValid = validateTaskDescription(formId);
  const isValid =
    titleValid && dueDateValid && categoryValid && descriptionValid;
  if (!isValid && event) event.preventDefault();
  return isValid;
}

/**
 * Gets validation elements for a field.
 * @param {string} formId - Form ID
 * @param {string} pageId - Page element ID
 * @param {string} modalId - Modal element ID
 * @param {string} spanPageId - Page span ID
 * @param {string} spanModalId - Modal span ID
 * @returns {Object} Validation elements
 */
function getValidationElements(
  formId,
  pageId,
  modalId,
  spanPageId,
  spanModalId
) {
  const isPageForm = formId === "addTaskFormPage";
  return {
    input: document.getElementById(isPageForm ? pageId : modalId),
    span: document.getElementById(isPageForm ? spanPageId : spanModalId),
    inputPage: document.getElementById(pageId),
    inputModal: document.getElementById(modalId),
    spanPage: document.getElementById(spanPageId),
    spanModal: document.getElementById(spanModalId),
  };
}

/**
 * Shows validation error.
 * @param {Object} elements - Validation elements
 */
function showValidationError(elements) {
  if (elements.spanPage) elements.spanPage.style.visibility = "visible";
  if (elements.inputPage) elements.inputPage.classList.add("border-red");
  if (elements.spanModal) elements.spanModal.style.visibility = "visible";
  if (elements.inputModal) elements.inputModal.classList.add("border-red");
}

/**
 * Hides validation error.
 * @param {Object} elements - Validation elements
 */
function hideValidationError(elements) {
  if (elements.spanPage) elements.spanPage.style.visibility = "hidden";
  if (elements.inputPage) elements.inputPage.classList.remove("border-red");
  if (elements.spanModal) elements.spanModal.style.visibility = "hidden";
  if (elements.inputModal) elements.inputModal.classList.remove("border-red");
}

/**
 * Validates task title.
 * @param {string} formId - Form ID
 * @returns {boolean} True if valid
 */
function validateTaskTitle(formId) {
  const elements = getValidationElements(
    formId,
    "taskTitlePage",
    "taskTitle",
    "title-span-page",
    "title-span"
  );
  if (!elements.input || !validateRequired(elements.input.value)) {
    showValidationError(elements);
    return false;
  }
  hideValidationError(elements);
  return true;
}

/**
 * Validates task due date.
 * @param {string} formId - Form ID
 * @returns {boolean} True if valid
 */
function validateTaskDueDate(formId) {
  const elements = getValidationElements(
    formId,
    "taskDueDatePage",
    "taskDueDate",
    "date-span-page",
    "date-span"
  );
  if (!elements.input || !validateRequired(elements.input.value)) {
    showValidationError(elements);
    return false;
  }
  hideValidationError(elements);
  return true;
}

/**
 * Validates task category.
 * @param {string} formId - Form ID
 * @returns {boolean} True if valid
 */
function validateTaskCategory(formId) {
  const elements = getValidationElements(
    formId,
    "taskCategoryPage",
    "taskCategory",
    "category-span-page",
    "category-span"
  );
  elements.dropdownPage = document.getElementById("categoryDropdownPage");
  elements.dropdownModal = document.getElementById("dropdown-header");

  if (!elements.input || !validateRequired(elements.input.value)) {
    showCategoryError(elements);
    return false;
  }
  hideCategoryError(elements);
  return true;
}

/**
 * Shows category validation error.
 * @param {Object} elements - Validation elements
 */
function showCategoryError(elements) {
  if (elements.spanPage) elements.spanPage.style.visibility = "visible";
  if (elements.dropdownPage) elements.dropdownPage.classList.add("border-red");
  if (elements.spanModal) elements.spanModal.style.visibility = "visible";
  if (elements.dropdownModal)
    elements.dropdownModal.classList.add("border-red");
  const categorySection = elements.input?.closest(".category-section");
  const dropdownHeader = categorySection?.querySelector(".dropdown-header");
  if (dropdownHeader) showError(dropdownHeader, "Category is required");
}

/**
 * Hides category validation error.
 * @param {Object} elements - Validation elements
 */
function hideCategoryError(elements) {
  if (elements.spanPage) elements.spanPage.style.visibility = "hidden";
  if (elements.dropdownPage)
    elements.dropdownPage.classList.remove("border-red");
  if (elements.spanModal) elements.spanModal.style.visibility = "hidden";
  if (elements.dropdownModal)
    elements.dropdownModal.classList.remove("border-red");
  const categorySection = elements.input.closest(".category-section");
  const dropdownHeader = categorySection?.querySelector(".dropdown-header");
  if (dropdownHeader) removeError(dropdownHeader);
}

/**
 * Validates task description.
 * @param {string} formId - Form ID
 * @returns {boolean} True if valid
 */
function validateTaskDescription(formId) {
  const isPageForm = formId === "addTaskFormPage";
  const descriptionInput = document.getElementById(
    isPageForm ? "taskDescriptionPage" : null
  );
  if (!descriptionInput) return true;
  if (!validateMaxLength(descriptionInput.value, 440)) {
    showError(descriptionInput, "Description must not exceed 440 characters");
    return false;
  }
  removeError(descriptionInput);
  return true;
}

/**
 * Resets validation error for task title.
 * @param {string} formId - Form ID
 */
function resetTaskTitleError(formId) {
  const elements = getValidationElements(
    formId,
    "taskTitlePage",
    "taskTitle",
    "title-span-page",
    "title-span"
  );
  hideValidationError(elements);
}

/**
 * Resets validation error for task due date.
 * @param {string} formId - Form ID
 */
function resetTaskDueDateError(formId) {
  const elements = getValidationElements(
    formId,
    "taskDueDatePage",
    "taskDueDate",
    "date-span-page",
    "date-span"
  );
  hideValidationError(elements);
}

/**
 * Resets validation error for task category.
 * @param {string} formId - Form ID
 */
function resetTaskCategoryError(formId) {
  const isPageForm = formId === "addTaskFormPage";
  const span = document.getElementById(
    isPageForm ? "category-span-page" : "category-span"
  );
  const dropdown = document.getElementById(
    isPageForm ? "categoryDropdownPage" : "dropdown-header"
  );
  if (span) span.style.visibility = "hidden";
  if (dropdown) {
    dropdown.classList.remove("border-red");
    dropdown.classList.remove("validation-error");
  }
}
