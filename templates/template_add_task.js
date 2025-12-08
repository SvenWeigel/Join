/**
 * @fileoverview Template-Funktionen für die Add Task-Seite
 * @description Enthält alle HTML-Template-Funktionen für das Assignee-Dropdown
 */

/**
 * Generiert das HTML-Template für ein Dropdown-Item.
 * @param {string} id - Die ID des Kontakts
 * @param {string} name - Der Name des Kontakts
 * @param {string} initials - Die Initialen des Kontakts
 * @param {string} color - Die Hintergrundfarbe des Avatars
 * @param {boolean} isSelected - Ob der Kontakt ausgewählt ist
 * @returns {string} HTML-String für das Dropdown-Item
 */
function getDropdownItemTemplate(id, name, initials, color, isSelected) {
  const selectedClass = isSelected ? "selected" : "";
  return `
    <div class="dropdown-item ${selectedClass}" data-id="${id}" onclick="toggleAssignee(event, '${id}')">
      <div class="dropdown-item-left">
        <div class="dropdown-avatar" style="background-color: ${color}">${initials}</div>
        <span>${name}</span>
      </div>
      <div class="dropdown-checkbox">
        <img src="assets/icons/check.svg" alt="Selected">
      </div>
    </div>
  `;
}

/**
 * Generiert das HTML-Template für ein Kontakt-Badge.
 * @param {string} name - Der Name des Kontakts (für title-Attribut)
 * @param {string} initials - Die Initialen des Kontakts
 * @param {string} color - Die Hintergrundfarbe des Badges
 * @returns {string} HTML-String für das Badge
 */
function getContactBadgeTemplate(name, initials, color) {
  return `<div class="contact-badge" style="background-color: ${color}" title="${name}">${initials}</div>`;
}

// ==========================================================================
// SUBTASK TEMPLATES
// ==========================================================================

/**
 * Generiert das HTML-Template für ein Subtask-Item.
 * @param {string} title - Der Titel des Subtasks
 * @param {number} index - Der Index des Subtasks
 * @returns {string} HTML-String für das Subtask-Item
 */
function getSubtaskItemTemplate(title, index) {
  return `
    <li class="subtask-item" ondblclick="editPageSubtask(${index})">
      <span class="subtask-item-text">${escapeHtml(title)}</span>
      <div class="subtask-item-actions">
        <img
          src="assets/icons/edit_subtask.svg"
          alt="Edit"
          class="subtask-edit-icon"
          onclick="editPageSubtask(${index}); event.stopPropagation();"
        />
        <div class="subtask-action-divider"></div>
        <img
          src="assets/icons/delete_subtask.svg"
          alt="Delete"
          class="subtask-delete-icon"
          onclick="deletePageSubtask(${index}, event)"
        />
      </div>
    </li>
  `;
}

/**
 * Generiert das HTML-Template für den Subtask-Edit-Modus.
 * @param {string} title - Der aktuelle Titel des Subtasks
 * @param {number} index - Der Index des Subtasks
 * @returns {string} HTML-String für den Edit-Modus
 */
function getSubtaskEditTemplate(title, index) {
  return `
    <div class="subtask-edit-wrapper">
      <input
        type="text"
        class="subtask-edit-input"
        value="${escapeHtml(title)}"
        onkeydown="handleSubtaskEditKeydown(event, ${index})"
        id="subtaskEditInput${index}"
      />
      <div class="subtask-edit-actions">
        <img
          src="assets/icons/delete_subtask.svg"
          alt="Delete"
          class="subtask-edit-icon"
          onclick="deletePageSubtask(${index}, event)"
        />
        <div class="subtask-action-divider"></div>
        <img
          src="assets/icons/check_subtask.svg"
          alt="Confirm"
          class="subtask-edit-icon"
          onclick="confirmPageSubtaskEdit(${index})"
        />
      </div>
    </div>
  `;
}
