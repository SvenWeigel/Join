/**
 * @fileoverview Edit Modal Subtask Functions
 * @description Functions for managing subtasks in the edit modal.
 * @module Board/ModalEditSubtasks
 */

/**
 * Renders the subtasks list in the edit modal.
 * Delegates to the render function in render_board_cards.js
 */
function renderEditSubtasks() {
  renderEditSubtasksList();
}

/**
 * Adds a new subtask in the edit modal.
 */
function addEditSubtask() {
  const input = document.getElementById("editViewSubtaskInput");
  if (!input) return;

  const title = input.value.trim();
  if (title === "") return;

  editSubtasks.push({ title, completed: false });
  input.value = "";
  renderEditSubtasks();
}

/**
 * Gets the subtask item element by index.
 *
 * @param {number} index - The index of the subtask
 * @returns {HTMLElement|null} The subtask item element or null
 */
function getSubtaskItemElement(index) {
  const container = document.getElementById("subtasksListEditView");
  if (!container || index < 0 || index >= editSubtasks.length) return null;
  return container.querySelector(`[data-index="${index}"]`);
}

/**
 * Sets up the inline edit input field with event listeners.
 *
 * @param {number} index - The index of the subtask
 */
function setupInlineEditInput(index) {
  const inputField = document.getElementById(`editSubtaskInput${index}`);
  if (!inputField) return;

  inputField.focus();
  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") confirmEditSubtask(index);
    if (e.key === "Escape") renderEditSubtasks();
  });
}

/**
 * Edits a subtask in the edit modal.
 *
 * @param {number} index - The index of the subtask
 */
function editEditSubtask(index) {
  const item = getSubtaskItemElement(index);
  if (!item) return;

  const currentTitle = editSubtasks[index].title;
  item.innerHTML = getEditSubtaskInlineEditTemplate(
    index,
    escapeHtml(currentTitle)
  );
  setupInlineEditInput(index);
}

/**
 * Confirms the editing of a subtask.
 *
 * @param {number} index - The index of the subtask
 */
function confirmEditSubtask(index) {
  const input = document.getElementById(`editSubtaskInput${index}`);
  if (!input) return;

  const newTitle = input.value.trim();
  if (newTitle === "") {
    deleteEditSubtask(index);
    return;
  }

  editSubtasks[index].title = newTitle;
  renderEditSubtasks();
}

/**
 * Deletes a subtask in the edit modal.
 *
 * @param {number} index - The index of the subtask
 */
function deleteEditSubtask(index) {
  if (index < 0 || index >= editSubtasks.length) return;
  editSubtasks.splice(index, 1);
  renderEditSubtasks();
}

/**
 * Shows the subtask actions in the edit modal.
 */
function showEditSubtaskActions() {
  const actions = document.getElementById("editSubtaskActions");
  if (actions) {
    actions.classList.add("show");
  }
}

/**
 * Checks if subtask actions should be hidden.
 *
 * @returns {boolean} True if actions should be hidden
 */
function shouldHideSubtaskActions() {
  const input = document.getElementById("editViewSubtaskInput");
  return input && document.activeElement !== input && input.value.trim() === "";
}

/**
 * Hides the subtask actions in the edit modal with delay.
 */
function hideEditSubtaskActionsDelayed() {
  setTimeout(() => {
    const actions = document.getElementById("editSubtaskActions");
    if (actions && shouldHideSubtaskActions()) {
      actions.classList.remove("show");
    }
  }, 150);
}

/**
 * Handles keydown events in the subtask input of the edit modal.
 *
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleEditSubtaskKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    confirmEditSubtaskInput();
  } else if (event.key === "Escape") {
    cancelEditSubtaskInput();
  }
}

/**
 * Confirms the input of a new subtask in the edit modal.
 */
function confirmEditSubtaskInput() {
  const input = document.getElementById("editViewSubtaskInput");
  if (!input) return;

  const title = input.value.trim();
  if (title === "") return;

  editSubtasks.push({ title, completed: false });
  input.value = "";
  renderEditSubtasks();

  input.focus();
}

/**
 * Cancels the input and clears the input field.
 */
function cancelEditSubtaskInput() {
  const input = document.getElementById("editViewSubtaskInput");
  const actions = document.getElementById("editSubtaskActions");

  if (input) {
    input.value = "";
    input.blur();
  }
  if (actions) {
    actions.classList.remove("show");
  }
}

/**
 * Initializes event listeners for the subtask input in the edit modal.
 */
function initEditSubtaskInput() {
  const input = document.getElementById("editViewSubtaskInput");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        confirmEditSubtaskInput();
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", initEditSubtaskInput);
