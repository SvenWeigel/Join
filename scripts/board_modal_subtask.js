/**
 * @fileoverview Subtask Controller für Board Modal
 * @description Verwaltet die Subtasks im Add Task Modal auf der Board-Seite
 */

// ==========================================================================
// SUBTASKS (Board Modal)
// ==========================================================================

/** @type {Object[]} Array der Modal-Subtasks */
let modalSubtasks = [];

/** @type {number|null} Timeout für verzögertes Ausblenden */
let modalHideActionsTimeout = null;

/**
 * Zeigt die Subtask-Aktionsbuttons im Modal an.
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
 * Versteckt die Subtask-Aktionsbuttons im Modal verzögert.
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
 * Bricht die Subtask-Eingabe im Modal ab.
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
 * Bestätigt die Subtask-Eingabe im Modal und fügt sie zur Liste hinzu.
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
 * Behandelt Tastatureingaben im Subtask-Input des Modals.
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
 * Löscht einen Subtask im Modal.
 * @param {number} index
 * @param {Event} event
 */
function deleteModalSubtask(index, event) {
  event.stopPropagation();
  modalSubtasks.splice(index, 1);
  renderModalSubtasks();
}

/**
 * Öffnet den Bearbeitungsmodus für einen Subtask im Modal.
 * @param {number} index
 */
function editModalSubtask(index) {
  const list = document.getElementById("modalSubtaskList");
  if (!list) return;

  const subtask = modalSubtasks[index];
  const items = list.querySelectorAll(".subtask-item");
  const item = items[index];

  if (!item) return;

  item.innerHTML = getModalSubtaskEditTemplate(subtask.title, index);
  item.classList.remove("subtask-item");
  item.style.padding = "0";

  const editInput = document.getElementById(`modalSubtaskEditInput${index}`);
  if (editInput) {
    editInput.focus();
    editInput.setSelectionRange(editInput.value.length, editInput.value.length);
  }
}

/**
 * Behandelt Tastatureingaben im Subtask-Edit-Input des Modals.
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
 * Bestätigt die Bearbeitung eines Subtasks im Modal.
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
 * Setzt die Modal-Subtasks zurück.
 */
function resetModalSubtasks() {
  modalSubtasks = [];
  renderModalSubtasks();
}
