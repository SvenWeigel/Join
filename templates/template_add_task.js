/**
 * @fileoverview Template functions for the Add Task page
 * @description Contains all HTML template functions for the assignee dropdown
 * @module Templates/AddTask
 */

/**
 * Generates the HTML template for a dropdown item.
 * @param {string} id - The contact ID
 * @param {string} name - The contact name
 * @param {string} initials - The contact initials
 * @param {string} color - The background color of the avatar
 * @param {boolean} isSelected - Whether the contact is selected
 * @returns {string} HTML string for the dropdown item
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
 * Generates the HTML template for a contact badge.
 * @param {string} name - The contact name (for title attribute)
 * @param {string} initials - The contact initials
 * @param {string} color - The background color of the badge
 * @returns {string} HTML string for the badge
 */
function getContactBadgeTemplate(name, initials, color) {
  return `<div class="contact-badge" style="background-color: ${color}" title="${name}">${initials}</div>`;
}

/**
 * Generates the HTML template for a subtask item.
 * @param {string} title - The title of the subtask
 * @param {number} index - The index of the subtask
 * @returns {string} HTML string for the subtask item
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
 * Generates the HTML template for the subtask edit mode.
 * @param {string} title - The current title of the subtask
 * @param {number} index - The index of the subtask
 * @returns {string} HTML string for the edit mode
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
