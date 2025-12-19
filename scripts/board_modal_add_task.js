/**
 * @fileoverview Board Modal Controller
 * @description Manages the Add Task modal functionality on the Board page
 * @module Board/ModalAddTask
 */

/** @type {HTMLElement|null} */
let overlay = null;

/** @type {HTMLFormElement|null} */
let form = null;

/** @type {HTMLElement[]} */
let priorityButtons = [];

/** @type {string} Pre-selected status for new tasks */
let preSelectedStatus = "todo";

/**
 * Initializes the modal when the page loads.
 */
async function initModal() {
  cacheElements();
  bindEvents();
  initColumnPlusButtons();
  await loadModalContactsForDropdown();
}

/**
 * Caches all required DOM elements.
 */
function cacheElements() {
  overlay = document.getElementById("addTaskModalOverlay");
  form = document.getElementById("addTaskForm");
  priorityButtons = Array.from(document.querySelectorAll(".priority-btn"));
}

/**
 * Binds all event listeners for the modal.
 */
function bindEvents() {
  bindOpenButton();
  bindCloseButtons();
  bindOverlayClick();
  bindEscapeKey();
  bindPriorityButtons();
  bindFormSubmit();
  bindModalValidation();
}

/**
 * Binds the click event to the "Add Task" button.
 */
function bindOpenButton() {
  const openBtn = document.getElementById("addTaskBtn");
  if (openBtn) openBtn.addEventListener("click", handleOpenClick);
}

/**
 * Handles the click on the open button.
 * @param {Event} e
 */
function handleOpenClick(e) {
  e.preventDefault();
  if (window.innerWidth < 970) {
    window.location.href = "html/add_task.html";
  } else {
    openModal();
  }
}

/**
 * Binds click events to the close buttons.
 */
function bindCloseButtons() {
  const closeBtn = document.getElementById("closeAddTaskBtn");
  const cancelBtn = document.getElementById("cancelAddTask");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
}

/**
 * Binds the click event to the overlay.
 */
function bindOverlayClick() {
  if (overlay) overlay.addEventListener("click", handleOverlayClick);
}

/**
 * Handles clicks on the overlay.
 * @param {Event} e
 */
function handleOverlayClick(e) {
  if (e.target === overlay) closeModal();
}

/**
 * Binds the escape key listener.
 */
function bindEscapeKey() {
  document.addEventListener("keydown", handleEscapeKey);
}

/**
 * Handles escape key press.
 * @param {Event} e
 */
function handleEscapeKey(e) {
  if (e.key === "Escape" && isModalOpen()) closeModal();
}

/**
 * Binds click events to all priority buttons.
 */
function bindPriorityButtons() {
  priorityButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectPriority(btn));
  });
}

/**
 * Binds the submit event to the form.
 */
function bindFormSubmit() {
  if (form) form.addEventListener("submit", handleSubmit);
}

/**
 * Opens the modal.
 * @param {string} [status="todo"] - The pre-selected status for the new task
 */
function openModal(status = "todo") {
  preSelectedStatus = status;
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  focusFirstInput();
  renderModalAssigneeDropdown();
  updateModalCreateTaskButtonState();
}

/**
 * Closes the modal.
 */
function closeModal() {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  resetPriority();
  resetModalAssignees();
  resetModalCategory();
  resetModalSubtasks();
}

/**
 * Checks if the modal is open.
 * @returns {boolean}
 */
function isModalOpen() {
  return overlay?.classList.contains("open");
}

/**
 * Focuses the first input field.
 */
function focusFirstInput() {
  const firstInput = document.getElementById("taskTitle");
  setTimeout(() => firstInput?.focus(), 50);
}

/**
 * Selects a priority button.
 * @param {HTMLElement} selectedBtn
 */
function selectPriority(selectedBtn) {
  priorityButtons.forEach((btn) => btn.classList.remove("active"));
  selectedBtn.classList.add("active");
}

/**
 * Resets the priority to "Medium".
 */
function resetPriority() {
  priorityButtons.forEach((btn) => btn.classList.remove("active"));
  const defaultBtn = document.querySelector(
    '.priority-btn[data-priority="medium"]'
  );
  if (defaultBtn) defaultBtn.classList.add("active");
}

/**
 * Gets the selected priority.
 * @returns {string}
 */
function getSelectedPriority() {
  return (
    document.querySelector(".priority-btn.active")?.dataset?.priority ||
    "medium"
  );
}

/**
 * Collects all form data.
 * @returns {Object}
 */
function getFormData() {
  return {
    title: form.title.value,
    description: form.description.value,
    due: form.due.value,
    priority: getSelectedPriority(),
    category: form.category.value,
    subtasks: form.subtasks.value,
  };
}

/**
 * Creates the task object for Firebase.
 * @param {Object} formData
 * @param {string} email
 * @returns {Object}
 */
function buildTaskData(formData, email) {
  return {
    title: formData.title,
    description: formData.description || "",
    dueDate: formData.due,
    priority: formData.priority,
    assignees: getModalAssigneesWithData(modalSelectedAssignees),
    category: formData.category,
    status: preSelectedStatus,
    subtasks: [...modalSubtasks],
    createdBy: email,
  };
}

/**
 * Handles form submission.
 * @param {Event} e
 */
async function handleSubmit(e) {
  e.preventDefault();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  await submitTask(currentUser);
}

/**
 * Saves the task and updates the board.
 * @param {Object} currentUser
 */
async function submitTask(currentUser) {
  try {
    const email = currentUser?.email || "guest@guest.local";
    const taskData = buildTaskData(getFormData(), email);
    await createTask(taskData);
    resetFormAndClose();
    if (typeof renderAllTasks === "function") await renderAllTasks();
  } catch (error) {
    console.error("Error creating task:", error);
    alert("Task could not be created. Please try again.");
  }
}

/**
 * Resets the form and closes the modal.
 */
function resetFormAndClose() {
  closeModal();
  form.reset();
  resetPriority();
  resetModalAssignees();
  resetModalCategory();
  resetModalSubtasks();
}

/**
 * Status mapping for board columns.
 * @type {string[]}
 */
const COLUMN_STATUS_MAP = ["todo", "inprogress", "awaitfeedback"];

/**
 * Initializes click handlers for plus buttons in columns.
 * The "Done" column has no plus button.
 */
function initColumnPlusButtons() {
  const columnHeaders = document.querySelectorAll(".column-header");

  columnHeaders.forEach((header, index) => {
    const plusIcon = header.querySelector("img");
    if (plusIcon && COLUMN_STATUS_MAP[index]) {
      plusIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        handleColumnPlusClick(COLUMN_STATUS_MAP[index]);
      });
    }
  });
}

/**
 * Handles the click on a plus button in a column.
 * @param {string} status - The status for the new task
 */
function handleColumnPlusClick(status) {
  if (window.innerWidth < 970) {
    window.location.href = `html/add_task.html?status=${status}`;
  } else {
    openModal(status);
  }
}

/**
 * Checks if all required modal task fields are filled.
 * @returns {boolean} True if all required fields are valid
 */
function areModalTaskFieldsValid() {
  const title = document.getElementById("taskTitle");
  const dueDate = document.getElementById("taskDueDate");
  const category = form?.category;
  return (
    title?.value.trim() !== "" &&
    dueDate?.value.trim() !== "" &&
    category?.value !== ""
  );
}

/**
 * Updates the create task modal button state based on form validation.
 */
function updateModalCreateTaskButtonState() {
  const button = document.getElementById("createTaskModalBtn");
  if (!button) return;
  button.disabled = !areModalTaskFieldsValid();
}

/**
 * Binds input listeners to required fields for validation.
 */
function bindModalValidation() {
  const title = document.getElementById("taskTitle");
  const dueDate = document.getElementById("taskDueDate");
  if (title) title.addEventListener("input", updateModalCreateTaskButtonState);
  if (dueDate)
    dueDate.addEventListener("input", updateModalCreateTaskButtonState);
}

document.addEventListener("DOMContentLoaded", initModal);
