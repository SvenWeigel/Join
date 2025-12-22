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
  const spanRefPage = document.getElementById("title-span-page");
  const inputRefPage = document.getElementById("taskTitlePage");
  const spanRef = document.getElementById("title-span");
  const inputRef= document.getElementById("taskTitle");

  if(spanRefPage)
  spanRefPage.style.visibility = "visible";
  if(inputRefPage)
  inputRefPage.classList.add("border-red");
  if(spanRef)
  spanRef.style.visibility = "visible";
  if(inputRef)
  inputRef.classList.add("border-red");

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
  const spanRefPage = document.getElementById("date-span-page");
  const inputRefPage = document.getElementById("taskDueDatePage");
  const spanRef = document.getElementById("date-span");
  const inputRef = document.getElementById("taskDueDate");

  if(spanRefPage)
  spanRefPage.style.visibility = "visible";
  if(inputRefPage)
  inputRefPage.classList.add("border-red");
  if(spanRef)
  spanRef.style.visibility = "visible";
  if(inputRef)
  inputRef.classList.add("border-red");
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
  const spanRefPage = document.getElementById("category-span-page");
  const inputRefPage = document.getElementById("categoryDropdownPage");
  const spanRef = document.getElementById("category-span");
  const inputRef = document.getElementById("dropdown-header");
  if(spanRefPage)
  spanRefPage.style.visibility = "visible";
  if(inputRefPage)
  inputRefPage.classList.add("border-red");
  if(spanRef)
  spanRef.style.visibility = "visible";
  if(inputRef)
  inputRef.classList.add("border-red");


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
