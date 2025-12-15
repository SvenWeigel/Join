/**
 * @fileoverview Task Edit Modal Logic
 * @description Funktionen für das Bearbeiten von Tasks im Edit-Modal.
 *              Ermöglicht das Öffnen, Befüllen, Speichern und Schließen des Edit-Modals
 *              sowie das Löschen von Tasks.
 */

// ============================================================================
// EDIT MODAL STATE
// ============================================================================

/**
 * Temporäre Liste der ausgewählten Assignees im Edit-Modal.
 */
let editSelectedAssignees = [];

/**
 * Temporäre Liste der Subtasks im Edit-Modal.
 */
let editSubtasks = [];

// ============================================================================
// EDIT MODAL ÖFFNEN/SCHLIESSEN
// ============================================================================

/**
 * Öffnet das Edit-Modal für den aktuellen Task.
 * Schließt zuerst das View-Modal.
 */
async function openEditModal() {
  // View-Modal schließen
  closeTaskViewModal();

  if (!currentTaskId) {
    console.error("No task selected for editing");
    return;
  }

  try {
    // Task-Daten laden (falls nicht mehr aktuell)
    const tasks = await fetchTasks();
    const task = tasks.find((t) => t.id === currentTaskId);

    if (!task) {
      console.error("Task not found:", currentTaskId);
      return;
    }

    currentTaskData = task;
    populateEditModal(task);
    document
      .getElementById("modalEditViewTaskOverlay")
      .classList.remove("d-none");
  } catch (error) {
    console.error("Error opening edit modal:", error);
  }
}

/**
 * Schließt das Edit-Modal und setzt den State zurück.
 */
function closeEditModal() {
  document.getElementById("modalEditViewTaskOverlay").classList.add("d-none");
  currentTaskId = null;
  currentTaskData = null;
  editSelectedAssignees = [];
  editSubtasks = [];
}

// ============================================================================
// EDIT MODAL BEFÜLLEN
// ============================================================================

/**
 * Befüllt das Edit-Modal mit den Task-Daten.
 *
 * @param {Object} task - Das Task-Objekt mit allen Daten
 */
async function populateEditModal(task) {
  // Title
  const titleInput = document.querySelector(".title-input-div input");
  if (titleInput) titleInput.value = task.title || "";

  // Description
  const descTextarea = document.querySelector(
    ".description-input-div textarea"
  );
  if (descTextarea) descTextarea.value = task.description || "";

  // Due Date
  const dueDateInput = document.querySelector(".due-date-input-div input");
  if (dueDateInput) dueDateInput.value = task.dueDate || "";

  // Priority
  populateEditPriority(task.priority);

  // Kontakte laden für ID-Zuordnung
  await loadEditContactsForDropdown();

  // Assignees - IDs zuordnen basierend auf Namen
  const rawAssignees = normalizeAssignees(task.assignees);
  editSelectedAssignees = rawAssignees.map((assignee) => {
    // Versuche die ID aus den geladenen Kontakten zu finden
    const contact = editAvailableContacts.find((c) => c.name === assignee.name);
    return {
      id: contact?.id || assignee.id || assignee.name, // Fallback auf Name wenn keine ID
      name: assignee.name,
      color: assignee.color || contact?.color || "#2A3647",
    };
  });
  populateEditAssignees();

  // Subtasks
  editSubtasks = task.subtasks
    ? Array.isArray(task.subtasks)
      ? [...task.subtasks]
      : Object.values(task.subtasks)
    : [];
  renderEditSubtasks();
}

/**
 * Setzt den aktiven Priority-Button im Edit-Modal.
 *
 * @param {string} priority - Die Priorität (urgent, medium, low)
 */
function populateEditPriority(priority) {
  const buttons = document.querySelectorAll(".priority-btn-edit-view");

  buttons.forEach((btn) => {
    btn.classList.remove("active");
    const btnPriority = btn.dataset.priority;

    if (btnPriority === priority) {
      btn.classList.add("active");
    }
  });
}

/**
 * Behandelt den Klick auf einen Priority-Button im Edit-Modal.
 *
 * @param {string} priority - Die gewählte Priorität
 */
function selectEditPriority(priority) {
  populateEditPriority(priority);
}

// ============================================================================
// EDIT MODAL ASSIGNEES
// ============================================================================

/**
 * Temporäre Liste der verfügbaren Kontakte für das Edit-Modal.
 */
let editAvailableContacts = [];

/**
 * Lädt Kontakte für das Edit-Modal (global für alle User inkl. Gäste).
 */
async function loadEditContactsForDropdown() {
  try {
    editAvailableContacts = await fetchContacts();
  } catch (error) {
    console.error("Error loading contacts for edit modal:", error);
    editAvailableContacts = [];
  }
}

/**
 * Befüllt die Assignees-Anzeige im Edit-Modal.
 * Delegiert an die Render-Funktion in render_board_cards.js
 */
function populateEditAssignees() {
  renderEditAssigneesBadges();
}

/**
 * Öffnet das Assignee-Dropdown im Edit-Modal.
 */
async function openEditViewAssigneeDropdown() {
  const dropdown = document.getElementById("assignedDropdownList");
  const arrow = document.getElementById("assignedArrow");
  const badges = document.getElementById("editSelectedAssigneesBadges");

  if (dropdown && arrow) {
    const isOpen = dropdown.classList.contains("open");
    dropdown.classList.toggle("open");
    arrow.classList.toggle("open");

    // Badges verstecken wenn Dropdown offen, anzeigen wenn geschlossen
    if (badges) {
      badges.classList.toggle("hidden", !isOpen);
    }

    if (!isOpen) {
      await loadEditContactsForDropdown();
      renderEditAssigneeDropdown();
    }
  }
}

/**
 * Rendert die Assignee-Dropdown-Liste im Edit-Modal.
 * Delegiert an die Render-Funktion in render_board_cards.js
 *
 * @param {string} filter - Optionaler Suchfilter
 */
function renderEditAssigneeDropdown(filter = "") {
  renderEditAssigneeDropdownList(filter);
}

/**
 * Toggelt die Auswahl eines Assignees im Edit-Modal.
 *
 * @param {Event} event - Das Click-Event
 * @param {string} contactId - Die ID des Kontakts
 */
function toggleEditAssignee(event, contactId) {
  event.stopPropagation();

  const index = editSelectedAssignees.findIndex((a) => a.id === contactId);

  if (index >= 0) {
    editSelectedAssignees.splice(index, 1);
  } else {
    const contact = editAvailableContacts.find((c) => c.id === contactId);
    if (contact) {
      editSelectedAssignees.push({
        id: contact.id,
        name: contact.name,
        color: contact.color || "#2A3647",
      });
    }
  }

  // Dropdown-Ansicht aktualisieren
  const searchInput = document.getElementById("editViewAssigneeSearch");
  renderEditAssigneeDropdown(searchInput?.value || "");
  populateEditAssignees();
}

/**
 * Filtert die Assignee-Liste im Edit-Modal.
 */
function filterEditViewAssigneeList() {
  const searchInput = document.getElementById("editViewAssigneeSearch");
  const searchTerm = searchInput?.value || "";

  // Dropdown öffnen falls noch nicht offen
  const dropdown = document.getElementById("assignedDropdownList");
  const arrow = document.getElementById("assignedArrow");
  if (dropdown && !dropdown.classList.contains("open")) {
    dropdown.classList.add("open");
    arrow?.classList.add("open");
  }

  renderEditAssigneeDropdown(searchTerm);
}

/**
 * Schließt das Edit-Modal Assignee Dropdown.
 */
function closeEditAssigneeDropdown() {
  const dropdown = document.getElementById("assignedDropdownList");
  const arrow = document.getElementById("assignedArrow");
  const badges = document.getElementById("editSelectedAssigneesBadges");

  if (dropdown?.classList.contains("open")) {
    dropdown.classList.remove("open");
    arrow?.classList.remove("open");
    badges?.classList.remove("hidden");
  }
}

// ============================================================================
// EDIT MODAL SUBTASKS
// ============================================================================

/**
 * Rendert die Subtasks-Liste im Edit-Modal.
 * Delegiert an die Render-Funktion in render_board_cards.js
 */
function renderEditSubtasks() {
  renderEditSubtasksList();
}

/**
 * Fügt einen neuen Subtask im Edit-Modal hinzu.
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
 * Bearbeitet einen Subtask im Edit-Modal.
 *
 * @param {number} index - Der Index des Subtasks
 */
function editEditSubtask(index) {
  const container = document.getElementById("subtasksListEditView");
  if (!container || index < 0 || index >= editSubtasks.length) return;

  const item = container.querySelector(`[data-index="${index}"]`);
  if (!item) return;

  const currentTitle = editSubtasks[index].title;

  item.innerHTML = getEditSubtaskInlineEditTemplate(
    index,
    escapeHtml(currentTitle)
  );

  const inputField = document.getElementById(`editSubtaskInput${index}`);
  if (inputField) {
    inputField.focus();
    inputField.addEventListener("keydown", (e) => {
      if (e.key === "Enter") confirmEditSubtask(index);
      if (e.key === "Escape") renderEditSubtasks();
    });
  }
}

/**
 * Bestätigt die Bearbeitung eines Subtasks.
 *
 * @param {number} index - Der Index des Subtasks
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
 * Löscht einen Subtask im Edit-Modal.
 *
 * @param {number} index - Der Index des Subtasks
 */
function deleteEditSubtask(index) {
  if (index < 0 || index >= editSubtasks.length) return;
  editSubtasks.splice(index, 1);
  renderEditSubtasks();
}

// ============================================================================
// SPEICHERN UND LÖSCHEN
// ============================================================================

/**
 * Speichert alle Änderungen des Edit-Modals in Firebase.
 */
async function saveTaskChanges() {
  if (!currentTaskId) {
    console.error("No task to save");
    return;
  }

  try {
    // Alle Werte aus dem Formular sammeln
    const title =
      document.querySelector(".title-input-div input")?.value.trim() || "";
    const description =
      document.querySelector(".description-input-div textarea")?.value.trim() ||
      "";
    const dueDate =
      document.querySelector(".due-date-input-div input")?.value || "";
    const priority = getSelectedEditPriority();

    // Validierung
    if (title === "") {
      alert("Title is required");
      return;
    }

    // Update-Daten zusammenstellen
    const updateData = {
      title,
      description,
      dueDate,
      priority,
      assignees: editSelectedAssignees,
      subtasks: editSubtasks,
    };

    // In Firebase speichern
    await updateTask(currentTaskId, updateData);

    // Board neu rendern
    await renderAllTasks();

    // Edit-Modal schließen (ohne State zurückzusetzen)
    document.getElementById("modalEditViewTaskOverlay").classList.add("d-none");

    // Zurück zum View-Modal mit aktualisierten Daten
    await openTaskViewModal(currentTaskId);
  } catch (error) {
    console.error("Error saving task:", error);
    alert("Error saving task. Please try again.");
  }
}

/**
 * Ermittelt die ausgewählte Priorität im Edit-Modal.
 *
 * @returns {string} Die ausgewählte Priorität
 */
function getSelectedEditPriority() {
  const activeBtn = document.querySelector(".priority-btn-edit-view.active");
  return activeBtn?.dataset.priority || "medium";
}

/**
 * Löscht den aktuellen Task nach Bestätigung.
 */
async function deleteCurrentTask() {
  if (!currentTaskId) {
    console.error("No task to delete");
    return;
  }

  const confirmed = confirm("Are you sure you want to delete this task?");
  if (!confirmed) return;

  try {
    await deleteTask(currentTaskId);

    // Modal schließen
    closeTaskViewModal();
    closeEditModal();

    // Board neu rendern
    await renderAllTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Error deleting task. Please try again.");
  }
}

// ============================================================================
// EVENT LISTENER FÜR SUBTASK INPUT
// ============================================================================

/**
 * Zeigt die Subtask-Actions im Edit-Modal.
 */
function showEditSubtaskActions() {
  const actions = document.getElementById("editSubtaskActions");
  if (actions) {
    actions.classList.add("show");
  }
}

/**
 * Versteckt die Subtask-Actions im Edit-Modal mit Verzögerung.
 */
function hideEditSubtaskActionsDelayed() {
  setTimeout(() => {
    const input = document.getElementById("editViewSubtaskInput");
    const actions = document.getElementById("editSubtaskActions");

    // Nur verstecken wenn Input nicht fokussiert und leer ist
    if (
      actions &&
      input &&
      document.activeElement !== input &&
      input.value.trim() === ""
    ) {
      actions.classList.remove("show");
    }
  }, 150);
}

/**
 * Behandelt Keydown-Events im Subtask-Input des Edit-Modals.
 *
 * @param {KeyboardEvent} event - Das Keyboard-Event
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
 * Bestätigt die Eingabe eines neuen Subtasks im Edit-Modal.
 */
function confirmEditSubtaskInput() {
  const input = document.getElementById("editViewSubtaskInput");
  if (!input) return;

  const title = input.value.trim();
  if (title === "") return;

  editSubtasks.push({ title, completed: false });
  input.value = "";
  renderEditSubtasks();

  // Focus behalten für schnelle Eingabe
  input.focus();
}

/**
 * Bricht die Eingabe ab und leert das Input-Feld.
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
 * Initialisiert Event Listener für das Subtask-Input im Edit-Modal.
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

// Event Listener hinzufügen wenn DOM geladen
document.addEventListener("DOMContentLoaded", initEditSubtaskInput);

// Schließt das Assignee-Dropdown bei Klick außerhalb
document.addEventListener("click", function (event) {
  const assignedToDiv = document.querySelector(".assigned-to-div");
  const dropdown = document.getElementById("assignedDropdownList");

  if (assignedToDiv && dropdown?.classList.contains("open")) {
    if (!assignedToDiv.contains(event.target)) {
      closeEditAssigneeDropdown();
    }
  }
});
