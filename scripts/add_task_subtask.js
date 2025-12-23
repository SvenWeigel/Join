/**
 * @fileoverview Subtask Controller for Add Task Page
 * @description Manages subtasks on the Add Task page
 * @module AddTask/Subtasks
 */

/** @type {Object[]} Array of subtasks */
let pageSubtasks = [];

/** @type {number|null} Timeout for delayed hiding */
let hideActionsTimeout = null;

/**
 * Shows the subtask action buttons.
 */
function showSubtaskActions() {
  if (hideActionsTimeout) {
    clearTimeout(hideActionsTimeout);
    hideActionsTimeout = null;
  }
  const actions = document.getElementById("subtaskActions");
  if (actions) actions.classList.add("visible");
}

/**
 * Hides the subtask action buttons with a delay.
 */
function hideSubtaskActionsDelayed() {
  hideActionsTimeout = setTimeout(() => {
    const input = document.getElementById("taskSubtasksPage");
    if (input && input.value.trim() === "") {
      const actions = document.getElementById("subtaskActions");
      if (actions) actions.classList.remove("visible");
    }
  }, 200);
}

/**
 * Cancels the subtask input.
 */
function cancelSubtaskInput() {
  const input = document.getElementById("taskSubtasksPage");
  if (input) {
    input.value = "";
    input.blur();
  }
  const actions = document.getElementById("subtaskActions");
  if (actions) actions.classList.remove("visible");
}

/**
 * Confirms the subtask input and adds it to the list.
 */
function confirmSubtaskInput() {
  const input = document.getElementById("taskSubtasksPage");
  if (!input || input.value.trim() === "") return;

  const subtaskText = input.value.trim();
  pageSubtasks.push({ title: subtaskText, completed: false });
  input.value = "";

  const actions = document.getElementById("subtaskActions");
  if (actions) actions.classList.remove("visible");

  renderPageSubtasks();
}

/**
 * Handles keyboard input in the subtask input field.
 * @param {KeyboardEvent} event
 */
function handleSubtaskKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    confirmSubtaskInput();
  } else if (event.key === "Escape") {
    cancelSubtaskInput();
  }
}

/**
 * Deletes a subtask.
 * @param {number} index
 * @param {Event} event
 */
function deletePageSubtask(index, event) {
  event.stopPropagation();
  pageSubtasks.splice(index, 1);
  renderPageSubtasks();
}

/**
 * Opens edit mode for a subtask.
 * @param {number} index
 */
function editPageSubtask(index) {
  const list = document.getElementById("subtaskList");
  if (!list) return;

  const subtask = pageSubtasks[index];
  const items = list.querySelectorAll(".subtask-item");
  const item = items[index];

  if (!item) return;

  item.innerHTML = getSubtaskEditTemplate(subtask.title, index);
  item.classList.remove("subtask-item");
  item.style.padding = "0";

  const editInput = document.getElementById(`subtaskEditInput${index}`);
  if (editInput) {
    editInput.focus();
    editInput.setSelectionRange(editInput.value.length, editInput.value.length);
  }
}

/**
 * Handles keyboard input in the subtask edit input field.
 * @param {KeyboardEvent} event
 * @param {number} index
 */
function handleSubtaskEditKeydown(event, index) {
  if (event.key === "Enter") {
    event.preventDefault();
    confirmPageSubtaskEdit(index);
  } else if (event.key === "Escape") {
    renderPageSubtasks();
  }
}

/**
 * Confirms the edit of a subtask.
 * @param {number} index
 */
function confirmPageSubtaskEdit(index) {
  const editInput = document.getElementById(`subtaskEditInput${index}`);
  if (!editInput) return;

  const newText = editInput.value.trim();
  if (newText === "") {
    pageSubtasks.splice(index, 1);
  } else {
    pageSubtasks[index].title = newText;
  }

  renderPageSubtasks();
}

/**
 * Resets the subtasks.
 */
function resetPageSubtasks() {
  pageSubtasks = [];
  renderPageSubtasks();
}
