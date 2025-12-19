/**
 * @fileoverview Task Form Validation
 * @description Validates task form fields.
 * @module Validation/Task
 */

/**
 * Validates add task form.
 *
 * @param {Event} event - Form submit event
 * @param {string} formId - ID of the form ('addTaskForm' or 'addTaskFormPage')
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
 * Validates task title.
 *
 * @param {string} formId - Form ID
 * @returns {boolean} True if valid
 */
function validateTaskTitle(formId) {
  const isPageForm = formId === "addTaskFormPage";
  const titleInput = document.getElementById(
    isPageForm ? "taskTitlePage" : "taskTitle"
  );
  return validateField(titleInput, "Title is required");
}

/**
 * Validates task due date.
 *
 * @param {string} formId - Form ID
 * @returns {boolean} True if valid
 */
function validateTaskDueDate(formId) {
  const isPageForm = formId === "addTaskFormPage";
  const dueDateInput = document.getElementById(
    isPageForm ? "taskDueDatePage" : "taskDueDate"
  );
  return validateField(dueDateInput, "Due date is required");
}

/**
 * Validates task category.
 *
 * @param {string} formId - Form ID
 * @returns {boolean} True if valid
 */
function validateTaskCategory(formId) {
  const isPageForm = formId === "addTaskFormPage";
  const categoryInput = document.getElementById(
    isPageForm ? "taskCategoryPage" : "taskCategory"
  );
  if (!validateRequired(categoryInput.value)) {
    const categorySection = categoryInput.closest(".category-section");
    const dropdownHeader = categorySection?.querySelector(".dropdown-header");
    if (dropdownHeader) showError(dropdownHeader, "Category is required");
    return false;
  }
  const categorySection = categoryInput.closest(".category-section");
  const dropdownHeader = categorySection?.querySelector(".dropdown-header");
  if (dropdownHeader) removeError(dropdownHeader);
  return true;
}

/**
 * Validates task description.
 *
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
