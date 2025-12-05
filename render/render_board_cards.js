/**
 * Befüllt das View-Modal mit den Task-Daten.
 *
 * @param {Object} task - Das Task-Objekt mit allen Daten
 */
function populateViewModal(task) {
  // Kategorie-Badge mit dynamischer Farbe
  const categoryBadge = document.querySelector(".task-view-header span");
  const categoryConfig =
    CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.technical;
  categoryBadge.textContent = categoryConfig.label;
  categoryBadge.className =
    task.category === "userstory" ? "user-story" : "technical";

  // Titel
  document.querySelector(".task-view-title span").textContent =
    task.title || "";

  // Beschreibung
  document.querySelector(".task-view-description span").textContent =
    task.description || "";

  // Due Date
  const dueDateSpans = document.querySelectorAll(".task-view-due-date span");
  if (dueDateSpans.length >= 2) {
    dueDateSpans[1].textContent = formatDate(task.dueDate) || "";
  }

  // Priorität
  populateViewPriority(task.priority);

  // Assignees
  populateViewAssignees(task.assignees);

  // Subtasks
  populateViewSubtasks(task.subtasks);
}

/**
 * Formatiert ein Datum von YYYY-MM-DD zu DD/MM/YYYY.
 *
 * @param {string} dateString - Datum im Format YYYY-MM-DD
 * @returns {string} Datum im Format DD/MM/YYYY
 */
function formatDate(dateString) {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Befüllt die Prioritäts-Anzeige im View-Modal.
 *
 * @param {string} priority - Die Priorität (urgent, medium, low)
 */
function populateViewPriority(priority) {
  const priorityContainer = document.querySelector(".priority-view-container");
  const prioritySpan = priorityContainer.querySelector(".priority-span");
  const priorityIcon = priorityContainer.querySelector("img");

  const priorityLabels = {
    urgent: "Urgent",
    medium: "Medium",
    low: "Low",
  };

  prioritySpan.textContent = priorityLabels[priority] || "Medium";
  priorityIcon.src = PRIORITY_ICONS[priority] || PRIORITY_ICONS.medium;
  priorityIcon.alt = `Priority ${priorityLabels[priority] || "Medium"} Icon`;
}

/**
 * Befüllt die Assignees-Liste im View-Modal.
 *
 * @param {Array} assignees - Array von Assignee-Objekten [{name, color}, ...]
 */
function populateViewAssignees(assignees) {
  const container = document.querySelector(".task-view-assigned-to-container");
  const listContainer = container.querySelector(
    ".assigned-avatars-container-list"
  );

  // Bestehenden Inhalt entfernen (außer dem Label)
  if (!listContainer) return;

  // Container leeren und neu befüllen
  const assigneesArray = normalizeAssignees(assignees);

  if (assigneesArray.length === 0) {
    listContainer.innerHTML = '<span class="no-assignees">No assignees</span>';
    return;
  }

  let html = "";
  assigneesArray.forEach((assignee) => {
    const initials = getInitials(assignee.name);
    const color = assignee.color || "#2A3647";
    html += getViewAssigneeTemplate(initials, color, assignee.name);
  });

  // Das ursprüngliche Label beibehalten, Container ersetzen
  const parentContainer =
    container.querySelector(".assigned-avatars-container-list")
      ?.parentElement || container;
  const existingLists = container.querySelectorAll(
    ".assigned-avatars-container-list"
  );
  existingLists.forEach((el) => el.remove());

  // Neuen HTML einfügen
  container.insertAdjacentHTML("beforeend", html);
}

/**
 * Normalisiert Assignees zu einem Array.
 * Firebase kann Arrays als Objekte speichern.
 *
 * @param {Array|Object} assignees - Assignees als Array oder Objekt
 * @returns {Array} Normalisiertes Array von Assignee-Objekten
 */
function normalizeAssignees(assignees) {
  if (!assignees) return [];
  if (Array.isArray(assignees)) return assignees;
  return Object.values(assignees);
}

/**
 * Befüllt die Subtasks-Liste im View-Modal mit Checkboxen.
 *
 * @param {Array} subtasks - Array von Subtask-Objekten [{title, completed}, ...]
 */
function populateViewSubtasks(subtasks) {
  const container = document.querySelector(".subtasks-list-container");
  if (!container) return;

  const subtasksArray = subtasks
    ? Array.isArray(subtasks)
      ? subtasks
      : Object.values(subtasks)
    : [];

  if (subtasksArray.length === 0) {
    container.innerHTML = '<span class="no-subtasks">No subtasks</span>';
    return;
  }

  let html = "";
  subtasksArray.forEach((subtask, index) => {
    html += getViewSubtaskTemplate(
      index,
      escapeHtml(subtask.title),
      subtask.completed
    );
  });

  container.innerHTML = html;
}

// ============================================================================
// EDIT MODAL RENDER FUNKTIONEN
// ============================================================================

/**
 * Befüllt die Assignees-Anzeige im Edit-Modal.
 */
function renderEditAssigneesBadges() {
  const badgesContainer = document.getElementById(
    "editSelectedAssigneesBadges"
  );

  if (badgesContainer) {
    if (editSelectedAssignees.length === 0) {
      badgesContainer.innerHTML = "";
      return;
    }

    let html = "";
    editSelectedAssignees.forEach((assignee) => {
      const initials = getInitials(assignee.name);
      html += getEditAssigneeBadgeTemplate(
        initials,
        assignee.color || "#2A3647",
        assignee.name
      );
    });
    badgesContainer.innerHTML = html;
  }
}

/**
 * Rendert die Assignee-Dropdown-Liste im Edit-Modal.
 *
 * @param {string} filter - Optionaler Suchfilter
 */
function renderEditAssigneeDropdownList(filter = "") {
  const dropdown = document.getElementById("assignedDropdownList");
  if (!dropdown) return;

  const filteredContacts = editAvailableContacts.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredContacts.length === 0) {
    dropdown.innerHTML =
      '<div class="assigned-dropdown-item no-hover">No contacts available</div>';
    return;
  }

  let html = "";
  filteredContacts.forEach((contact) => {
    const isSelected = editSelectedAssignees.some((a) => a.id === contact.id);
    const initials = getInitials(contact.name);
    html += getEditAssigneeDropdownItemTemplate(
      contact.id,
      escapeHtml(contact.name),
      initials,
      contact.color || "#2A3647",
      isSelected
    );
  });

  dropdown.innerHTML = html;
}

/**
 * Rendert die Subtasks-Liste im Edit-Modal.
 */
function renderEditSubtasksList() {
  const container = document.getElementById("subtasksListEditView");
  if (!container) return;

  if (editSubtasks.length === 0) {
    container.innerHTML = "";
    return;
  }

  let html = "";
  editSubtasks.forEach((subtask, index) => {
    html += getEditSubtaskItemTemplate(index, escapeHtml(subtask.title));
  });

  container.innerHTML = html;
}
