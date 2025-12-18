/**
 * @fileoverview Subtask Controller for Board Modal
 * @description Manages subtasks in the Add Task modal on the Board page
 */

/** @type {Object[]} Array of modal subtasks */
let modalSubtasks = [];

/** @type {number|null} Timeout for delayed hiding */
let modalHideActionsTimeout = null;

/**
 * Shows the subtask action buttons in the modal.
 */
function showModalSubtaskActions() {
  if (modalHideActionsTimeout) {
    clearTimeout(modalHideActionsTimeout);
    modalHideActionsTimeout = null;
  }
  const actions = document.getElementById("modalSubtaskActions");
  if (actions) actions.classList.add("visible");
}

/**
 * Hides the subtask action buttons in the modal with delay.
 */
function hideModalSubtaskActionsDelayed() {
  modalHideActionsTimeout = setTimeout(() => {
    const input = document.getElementById("taskSubtasks");
    if (input && input.value.trim() === "") {
      const actions = document.getElementById("modalSubtaskActions");
      if (actions) actions.classList.remove("visible");
    }
  }, 200);
}

/**
 * Cancels the subtask input in the modal.
 */
function cancelModalSubtaskInput() {
  const input = document.getElementById("taskSubtasks");
  if (input) {
    input.value = "";
    input.blur();
  }
  const actions = document.getElementById("modalSubtaskActions");
  if (actions) actions.classList.remove("visible");
}

/**
 * Confirms the subtask input in the modal and adds it to the list.
 */
function confirmModalSubtaskInput() {
  const input = document.getElementById("taskSubtasks");
  if (!input || input.value.trim() === "") return;

  const subtaskText = input.value.trim();
  modalSubtasks.push({ title: subtaskText, completed: false });
  input.value = "";

  const actions = document.getElementById("modalSubtaskActions");
  if (actions) actions.classList.remove("visible");

  renderModalSubtasks();
}

/**
 * Handles keyboard input in the modal's subtask input.
 * @param {KeyboardEvent} event
 */
function handleModalSubtaskKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    confirmModalSubtaskInput();
  } else if (event.key === "Escape") {
    cancelModalSubtaskInput();
  }
}

/**
 * Deletes a subtask in the modal.
 * @param {number} index
 * @param {Event} event
 */
function deleteModalSubtask(index, event) {
  event.stopPropagation();
  modalSubtasks.splice(index, 1);
  renderModalSubtasks();
}

/**
 * Gets the subtask item element from the list.
 *
 * @param {number} index - The index of the subtask
 * @returns {HTMLElement|null} The subtask item element or null
 */
function getModalSubtaskItem(index) {
  const list = document.getElementById("modalSubtaskList");
  if (!list) return null;
  const items = list.querySelectorAll(".subtask-item");
  return items[index] || null;
}

/**
 * Transforms a subtask item into edit mode.
 *
 * @param {HTMLElement} item - The subtask item element
 * @param {string} title - The current subtask title
 * @param {number} index - The subtask index
 */
function transformToEditMode(item, title, index) {
  item.innerHTML = getModalSubtaskEditTemplate(title, index);
  item.classList.remove("subtask-item");
  item.style.padding = "0";
}

/**
 * Focuses the edit input and sets cursor to end.
 *
 * @param {number} index - The subtask index
 */
function focusEditInput(index) {
  const editInput = document.getElementById(`modalSubtaskEditInput${index}`);
  if (editInput) {
    editInput.focus();
    editInput.setSelectionRange(editInput.value.length, editInput.value.length);
  }
}

/**
 * Opens edit mode for a subtask in the modal.
 *
 * @param {number} index - The index of the subtask
 */
function editModalSubtask(index) {
  const item = getModalSubtaskItem(index);
  if (!item) return;

  transformToEditMode(item, modalSubtasks[index].title, index);
  focusEditInput(index);
}

/**
 * Handles keyboard input in the modal's subtask edit input.
 * @param {KeyboardEvent} event
 * @param {number} index
 */
function handleModalSubtaskEditKeydown(event, index) {
  if (event.key === "Enter") {
    event.preventDefault();
    confirmModalSubtaskEdit(index);
  } else if (event.key === "Escape") {
    renderModalSubtasks();
  }
}

/**
 * Confirms the edit of a subtask in the modal.
 * @param {number} index
 */
function confirmModalSubtaskEdit(index) {
  const editInput = document.getElementById(`modalSubtaskEditInput${index}`);
  if (!editInput) return;

  const newText = editInput.value.trim();
  if (newText === "") {
    modalSubtasks.splice(index, 1);
  } else {
    modalSubtasks[index].title = newText;
  }

  renderModalSubtasks();
}

/**
 * Resets the modal subtasks.
 */
function resetModalSubtasks() {
  modalSubtasks = [];
  renderModalSubtasks();
}
