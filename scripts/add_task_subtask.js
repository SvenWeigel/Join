/**
 * @fileoverview Subtask Controller für Add Task Page
 * @description Verwaltet die Subtasks auf der Add Task-Seite
 */

// ==========================================================================
// SUBTASKS (Add Task Page)
// ==========================================================================

/** @type {Object[]} Array der Subtasks */
let pageSubtasks = [];

/** @type {number|null} Timeout für verzögertes Ausblenden */
let hideActionsTimeout = null;

/**
 * Zeigt die Subtask-Aktionsbuttons an.
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
 * Versteckt die Subtask-Aktionsbuttons verzögert.
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
 * Bricht die Subtask-Eingabe ab.
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
 * Bestätigt die Subtask-Eingabe und fügt sie zur Liste hinzu.
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
 * Behandelt Tastatureingaben im Subtask-Input.
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
 * Escaped HTML-Zeichen zur Sicherheit.
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Löscht einen Subtask.
 * @param {number} index
 * @param {Event} event
 */
function deletePageSubtask(index, event) {
  event.stopPropagation();
  pageSubtasks.splice(index, 1);
  renderPageSubtasks();
}

/**
 * Öffnet den Bearbeitungsmodus für einen Subtask.
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
 * Behandelt Tastatureingaben im Subtask-Edit-Input.
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
 * Bestätigt die Bearbeitung eines Subtasks.
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
 * Setzt die Subtasks zurück.
 */
function resetPageSubtasks() {
  pageSubtasks = [];
  renderPageSubtasks();
}
