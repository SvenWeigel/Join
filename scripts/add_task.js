/**
 * @fileoverview Add Task Page Controller
 * @description Manages task creation on the add task page
 * @module AddTask/Main
 */

/** @type {HTMLFormElement|null} The form element */
let addTaskForm = null;

/** @type {HTMLElement[]} Array of priority button elements */
let addTaskPriorityButtons = [];

/**
 * Initializes the add task page on load.
 * Caches DOM elements and binds all event listeners.
 */
async function initAddTaskPage() {
  cacheAddTaskElements();
  bindAddTaskEvents();
  await loadContactsForDropdown();
}

/**
 * Caches all required DOM elements into variables.
 */
function cacheAddTaskElements() {
  addTaskForm = document.getElementById("addTaskFormPage");
  addTaskPriorityButtons = Array.from(
    document.querySelectorAll(".priority-btn")
  );
}

/**
 * Binds all event listeners for the add task page.
 */
function bindAddTaskEvents() {
  bindAddTaskPriorityButtons();
  bindAddTaskFormSubmit();
  bindClearButton();
}

/**
 * Binds click event listeners to all priority buttons.
 */
function bindAddTaskPriorityButtons() {
  addTaskPriorityButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectAddTaskPriority(btn));
  });
}

/**
 * Binds the submit event listener to the form.
 */
function bindAddTaskFormSubmit() {
  if (addTaskForm) {
    addTaskForm.addEventListener("submit", handleAddTaskSubmit);
  }
}

/**
 * Binds the click event listener to the clear button.
 */
function bindClearButton() {
  const clearBtn = document.getElementById("clearTaskBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearAddTaskForm);
  }
}

/**
 * Selects a priority button and marks it as active.
 * @param {HTMLElement} selectedBtn - The selected priority button
 */
function selectAddTaskPriority(selectedBtn) {
  addTaskPriorityButtons.forEach((btn) => btn.classList.remove("active"));
  selectedBtn.classList.add("active");
}

/**
 * Determines the currently selected priority.
 * @returns {string} The selected priority ("urgent", "medium" or "low")
 */
function getAddTaskSelectedPriority() {
  return (
    document.querySelector(".priority-btn.active")?.dataset?.priority ||
    "medium"
  );
}

/**
 * Collects all form data and returns it as an object.
 * @returns {Object} Object with all task data
 */
function getAddTaskFormData() {
  return {
    title: addTaskForm.title.value,
    description: addTaskForm.description.value,
    due: addTaskForm.due.value,
    priority: getAddTaskSelectedPriority(),
    assignees: [...selectedAssignees],
    category: addTaskForm.category.value,
    subtasks: [...pageSubtasks],
  };
}

/**
 * Resets the priority selection to the default value "Medium".
 */
function resetAddTaskPriority() {
  addTaskPriorityButtons.forEach((btn) => btn.classList.remove("active"));
  const defaultBtn = document.querySelector(
    '.priority-btn[data-priority="medium"]'
  );
  if (defaultBtn) defaultBtn.classList.add("active");
}

/**
 * Clears the form and resets the priority.
 */
function clearAddTaskForm() {
  if (addTaskForm) {
    addTaskForm.reset();
    resetAddTaskPriority();
    resetPageCategory();
    resetPageSubtasks();
    selectedAssignees = [];
    renderAssigneeDropdown();
    renderSelectedContactsBadges();
    const searchInput = document.getElementById("assigneeSearch");
    if (searchInput) searchInput.value = "";
  }
}

/**
 * Gets the current user from localStorage.
 * @returns {Object|null} The current user or null
 */
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

/**
 * Reads the status from the URL parameter.
 * @returns {string} The status from the URL or "todo" as default
 */
function getStatusFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const validStatuses = ["todo", "inprogress", "awaitfeedback", "done"];
  return validStatuses.includes(status) ? status : "todo";
}

/**
 * Creates a task object from the form data.
 * @param {Object} formData - The collected form data
 * @param {string} creatorEmail - Email of the creator
 * @returns {Object} The task object for Firebase
 */
function buildTaskData(formData, creatorEmail) {
  return {
    title: formData.title,
    description: formData.description || "",
    dueDate: formData.due,
    priority: formData.priority,
    assignees: getAssigneesWithData(formData.assignees),
    category: formData.category,
    status: getStatusFromUrl(),
    subtasks: formData.subtasks || [],
    createdBy: creatorEmail,
  };
}

/**
 * Converts assignee IDs into complete assignee objects.
 * @param {string[]} assigneeIds - Array of selected contact IDs
 * @returns {Object[]} Array of objects with name and color
 */
function getAssigneesWithData(assigneeIds) {
  if (!assigneeIds || assigneeIds.length === 0) return [];

  const result = [];
  const currentUser = getCurrentUser();

  for (const id of assigneeIds) {
    if (id === "currentUser" && currentUser) {
      const userName = currentUser.name || currentUser.email.split("@")[0];
      result.push({ name: userName, color: "#29abe2" });
    } else {
      const contact = availableContacts.find((c) => c.id === id);
      if (contact) {
        result.push({ name: contact.name, color: contact.color });
      }
    }
  }

  return result;
}

/**
 * Displays a success message.
 */
function showSuccessMessage() {
  const successMsg = document.getElementById("taskSuccessMessage");
  if (successMsg) {
    successMsg.classList.add("show");
    setTimeout(() => successMsg.classList.remove("show"), 2000);
  }
}

/**
 * Redirects to the board page after a delay.
 */
function redirectToBoard() {
  setTimeout(() => {
    window.location.href = "html/board.html";
  }, 1500);
}

/**
 * Handles errors during task creation.
 *
 * @param {Error} error - The error object
 */
function handleTaskCreationError(error) {
  console.error("Error creating task:", error);
  alert("Task could not be created. Please try again.");
}

/**
 * Handles the form submission.
 *
 * @param {Event} e - The submit event
 */
async function handleAddTaskSubmit(e) {
  e.preventDefault();
  const currentUser = getCurrentUser();
  const creatorEmail = currentUser?.email || "guest@guest.local";
  try {
    const formData = getAddTaskFormData();
    await createTask(buildTaskData(formData, creatorEmail));
    clearAddTaskForm();
    showSuccessMessage();
    redirectToBoard();
  } catch (error) {
    handleTaskCreationError(error);
  }
}

document.addEventListener("DOMContentLoaded", initAddTaskPage);
