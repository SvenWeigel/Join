/**
 * @fileoverview Board Templates
 * @description Reine Template-Funktionen - geben nur HTML zurück, keine Logik!
 *              Logik befindet sich in /scripts/render.js
 */

// ============================================================================
// KONFIGURATION - Mapping von Daten zu HTML/CSS
// ============================================================================

/**
 * Mapping von Task-Status zu Spalten-Index im Board
 * Index entspricht der Reihenfolge der .column-content Elemente im HTML
 */
const STATUS_COLUMNS = {
  todo: 0, // Erste Spalte: "To do"
  inprogress: 1, // Zweite Spalte: "In progress"
  awaitfeedback: 2, // Dritte Spalte: "Await feedback"
  done: 3, // Vierte Spalte: "Done"
};

/**
 * Mapping von Kategorie zu CSS-Klasse und Anzeige-Label
 */
const CATEGORY_CONFIG = {
  technical: { class: "technical", label: "Technical Task" },
  userstory: { class: "user-story", label: "User Story" },
};

/**
 * Mapping von Priorität zu Icon-Pfaden
 */
const PRIORITY_ICONS = {
  urgent: "/assets/icons/urgent_icon.svg",
  medium: "/assets/icons/medium_icon_orange.svg",
  low: "/assets/icons/low_icon.svg",
};

/**
 * Labels für leere Spalten
 */
const COLUMN_LABELS = ["To do", "In progress", "Await feedback", "Done"];

// ============================================================================
// TEMPLATE FUNKTIONEN - Geben nur HTML zurück, keine Logik!
// ============================================================================

/**
 * Generiert die HTML für eine einzelne Task-Card.
 * Struktur entspricht exakt der hardcoded Card im HTML.
 *
 * @param {Object} task - Das Task-Objekt
 * @param {string} task.id - Die Firebase-ID
 * @param {string} task.title - Der Titel (bereits escaped)
 * @param {string} task.description - Die Beschreibung (bereits escaped/gekürzt)
 * @param {string} task.categoryLabel - Anzeige-Label für Kategorie (z.B. "User Story")
 * @param {string} task.categoryClass - CSS-Klasse für Kategorie-Styling
 * @param {string} task.priorityIcon - Pfad zum Priority-Icon
 * @param {string} task.priority - Priority-Name für alt-Text
 * @param {string} task.subtasksHtml - Fertig gerendertes Subtasks-HTML
 * @param {string} task.assigneesHtml - Fertig gerendertes Assignees-HTML
 * @returns {string} HTML-String der Task-Card
 */
function getTaskCardTemplate(task) {
  return `
      <div class="task-card" data-task-id="${task.id}" draggable="true">
        <span class="task-category ${task.categoryClass}">${task.categoryLabel}</span>
        <h4 class="task-title">${task.title}</h4>
        <p class="task-description">
          ${task.description}
        </p>
        ${task.subtasksHtml}
        <div class="task-footer">
          <div class="task-assignees">
            ${task.assigneesHtml}
          </div>
          <img class="task-priority-icon" src="${task.priorityIcon}" alt="${task.priority}" />
        </div>
      </div>
  `;
}

/**
 * Generiert die HTML für die Subtasks-Fortschrittsanzeige.
 * Struktur entspricht exakt der hardcoded Card im HTML.
 *
 * @param {number} completed - Anzahl erledigter Subtasks
 * @param {number} total - Gesamtanzahl Subtasks
 * @returns {string} HTML-String der Fortschrittsanzeige
 */
function getSubtasksProgressTemplate(completed, total) {
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;
  return `
        <div class="task-progress">
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${progressPercent}%"></div>
          </div>
          <span class="subtasks-text">${completed}/${total} Subtasks</span>
        </div>
  `;
}

/**
 * Generiert die HTML für einen einzelnen Assignee-Badge.
 *
 * @param {string} initials - Die Initialen (z.B. "MM")
 * @param {string} [color] - Optionale Hintergrundfarbe
 * @returns {string} HTML-String des Badges
 */
function getAssigneeBadgeTemplate(initials, color) {
  const style = color ? `style="background-color: ${color}"` : "";
  return `<div class="badge" ${style}>${initials}</div>`;
}

/**
 * Generiert die HTML für das Overflow-Badge (+X).
 *
 * @param {number} count - Anzahl der weiteren Assignees
 * @returns {string} HTML-String des Overflow-Badges
 */
function getOverflowBadgeTemplate(count) {
  return `<div class="badge badge-overflow">+${count}</div>`;
}

/**
 * Generiert die HTML für eine leere Spalte (Drag & Drop Platzhalter).
 *
 * @param {string} columnLabel - Das Label der Spalte (z.B. "To do")
 * @returns {string} HTML-String des Placeholders
 */
function getEmptyColumnTemplate(columnLabel) {
  return `
      <div class="drop-placeholder">
        <span>No tasks ${columnLabel}</span>
      </div>
  `;
}

// ============================================================================
// MODAL ASSIGNEE DROPDOWN TEMPLATES
// ============================================================================

/**
 * Generiert das HTML für ein Dropdown-Item.
 * @param {string} id
 * @param {string} name
 * @param {string} initials
 * @param {string} color
 * @param {boolean} isSelected
 * @returns {string}
 */
function getModalDropdownItemTemplate(id, name, initials, color, isSelected) {
  const selectedClass = isSelected ? "selected" : "";
  return `
    <div class="dropdown-item ${selectedClass}" data-id="${id}" onclick="toggleModalAssignee(event, '${id}')">
      <div class="dropdown-item-left">
        <div class="dropdown-avatar" style="background-color: ${color}">${initials}</div>
        <span>${name}</span>
      </div>
      <div class="dropdown-checkbox">
        <img src="/assets/icons/check.svg" alt="Selected">
      </div>
    </div>
  `;
}

/**
 * Generiert das HTML für ein Kontakt-Badge.
 * @param {string} name
 * @param {string} initials
 * @param {string} color
 * @returns {string}
 */
function getModalContactBadgeTemplate(name, initials, color) {
  return `<div class="contact-badge" style="background-color: ${color}" title="${name}">${initials}</div>`;
}

// ============================================================================
// MODAL SUBTASK TEMPLATES
// ============================================================================

/**
 * Generiert das HTML-Template für ein Subtask-Item im Modal.
 * @param {string} title - Der Titel des Subtasks
 * @param {number} index - Der Index des Subtasks
 * @returns {string} HTML-String für das Subtask-Item
 */
function getModalSubtaskItemTemplate(title, index) {
  return `
    <li class="subtask-item" ondblclick="editModalSubtask(${index})">
      <span class="subtask-item-text">${escapeHtml(title)}</span>
      <div class="subtask-item-actions">
        <img
          src="/assets/icons/edit_subtask.svg"
          alt="Edit"
          class="subtask-edit-icon"
          onclick="editModalSubtask(${index}); event.stopPropagation();"
        />
        <div class="subtask-action-divider"></div>
        <img
          src="/assets/icons/delete_subtask.svg"
          alt="Delete"
          class="subtask-delete-icon"
          onclick="deleteModalSubtask(${index}, event)"
        />
      </div>
    </li>
  `;
}

/**
 * Generiert das HTML-Template für den Subtask-Edit-Modus im Modal.
 * @param {string} title - Der aktuelle Titel des Subtasks
 * @param {number} index - Der Index des Subtasks
 * @returns {string} HTML-String für den Edit-Modus
 */
function getModalSubtaskEditTemplate(title, index) {
  return `
    <div class="subtask-edit-wrapper">
      <input
        type="text"
        class="subtask-edit-input"
        value="${escapeHtml(title)}"
        onkeydown="handleModalSubtaskEditKeydown(event, ${index})"
        id="modalSubtaskEditInput${index}"
      />
      <div class="subtask-edit-actions">
        <img
          src="/assets/icons/delete_subtask.svg"
          alt="Delete"
          class="subtask-edit-icon"
          onclick="deleteModalSubtask(${index}, event)"
        />
        <div class="subtask-action-divider"></div>
        <img
          src="/assets/icons/check_subtask.svg"
          alt="Confirm"
          class="subtask-edit-icon"
          onclick="confirmModalSubtaskEdit(${index})"
        />
      </div>
    </div>
  `;
}

// ============================================================================
// VIEW MODAL TEMPLATES
// ============================================================================

/**
 * Generiert das HTML für einen Assignee im View-Modal.
 * @param {string} initials - Die Initialen des Assignees
 * @param {string} color - Die Hintergrundfarbe
 * @param {string} name - Der vollständige Name
 * @returns {string} HTML-String für den Assignee
 */
function getViewAssigneeTemplate(initials, color, name) {
  return `
    <div class="assigned-avatars-container-list">
      <div class="assigned-avatar contact-avatar-task-view" style="background-color: ${color}" title="${name}">${initials}</div>
      <span class="avatar-full-name">${name}</span>
    </div>
  `;
}

/**
 * Generiert das HTML für einen Subtask mit Checkbox im View-Modal.
 * @param {number} index - Der Index des Subtasks
 * @param {string} title - Der Titel des Subtasks (bereits escaped)
 * @param {boolean} completed - Ob der Subtask erledigt ist
 * @returns {string} HTML-String für den Subtask
 */
function getViewSubtaskTemplate(index, title, completed) {
  const checkedAttr = completed ? "checked" : "";
  return `
    <div class="subtask-item">
      <input type="checkbox" id="viewSubtask${index}" name="viewSubtask${index}" ${checkedAttr} onchange="toggleSubtaskComplete(${index})">
      <label for="viewSubtask${index}">${title}</label>
    </div>
  `;
}

// ============================================================================
// EDIT MODAL TEMPLATES
// ============================================================================

/**
 * Generiert das HTML für ein Assignee-Badge im Edit-Modal.
 * @param {string} initials - Die Initialen des Assignees
 * @param {string} color - Die Hintergrundfarbe
 * @param {string} name - Der vollständige Name
 * @returns {string} HTML-String für das Badge
 */
function getEditAssigneeBadgeTemplate(initials, color, name) {
  return `<div class="contact-badge" style="background-color: ${color}" title="${name}">${initials}</div>`;
}

/**
 * Generiert das HTML für ein Dropdown-Item im Edit-Modal Assignee-Dropdown.
 * @param {string} id - Die ID des Kontakts
 * @param {string} name - Der Name des Kontakts (bereits escaped)
 * @param {string} initials - Die Initialen
 * @param {string} color - Die Hintergrundfarbe
 * @param {boolean} isSelected - Ob der Kontakt ausgewählt ist
 * @returns {string} HTML-String für das Dropdown-Item
 */
function getEditAssigneeDropdownItemTemplate(
  id,
  name,
  initials,
  color,
  isSelected
) {
  const selectedClass = isSelected ? "selected" : "";
  return `
    <div class="assigned-dropdown-item ${selectedClass}" data-id="${id}" onclick="toggleEditAssignee(event, '${id}')">
      <div class="assigned-item-left">
        <div class="assigned-avatar" style="background-color: ${color}">${initials}</div>
        <span>${name}</span>
      </div>
      <div class="assigned-checkbox">
        <img src="/assets/icons/check.svg" />
      </div>
    </div>
  `;
}

/**
 * Generiert das HTML für ein Subtask-Item im Edit-Modal.
 * @param {number} index - Der Index des Subtasks
 * @param {string} title - Der Titel des Subtasks (bereits escaped)
 * @returns {string} HTML-String für das Subtask-Item
 */
function getEditSubtaskItemTemplate(index, title) {
  return `
    <div class="subtask-item-edit" data-index="${index}" ondblclick="editEditSubtask(${index})">
      <span class="subtask-text">${title}</span>
      <div class="subtask-actions-edit">
        <img src="/assets/icons/edit_subtask.svg" alt="Edit" onclick="editEditSubtask(${index}); event.stopPropagation();" />
        <div class="subtask-action-divider-edit"></div>
        <img src="/assets/icons/delete_subtask.svg" alt="Delete" onclick="deleteEditSubtask(${index}); event.stopPropagation();" />
      </div>
    </div>
  `;
}

/**
 * Generiert das HTML für den Inline-Edit-Modus eines Subtasks im Edit-Modal.
 * @param {number} index - Der Index des Subtasks
 * @param {string} title - Der aktuelle Titel (bereits escaped)
 * @returns {string} HTML-String für den Inline-Edit-Modus
 */
function getEditSubtaskInlineEditTemplate(index, title) {
  return `
    <input type="text" class="subtask-edit-input-inline" value="${title}" id="editSubtaskInput${index}" />
    <div class="subtask-actions-edit">
      <img src="/assets/icons/delete_subtask.svg" alt="Delete" onclick="deleteEditSubtask(${index})" />
      <img src="/assets/icons/check_subtask.svg" alt="Confirm" onclick="confirmEditSubtask(${index})" />
    </div>
  `;
}
