/**
 * @fileoverview Board Templates
 * @description Pure template functions - only return HTML, no logic!
 *              Logic is located in /scripts/render.js
 */

/**
 * Mapping of task status to column index in the board.
 * Index corresponds to the order of .column-content elements in HTML.
 */
const STATUS_COLUMNS = {
  todo: 0,
  inprogress: 1,
  awaitfeedback: 2,
  done: 3,
};

/**
 * Mapping of category to CSS class and display label.
 */
const CATEGORY_CONFIG = {
  technical: { class: "technical", label: "Technical Task" },
  userstory: { class: "user-story", label: "User Story" },
};

/**
 * Mapping of priority to icon paths.
 */
const PRIORITY_ICONS = {
  urgent: "assets/icons/urgent_icon.svg",
  medium: "assets/icons/medium_icon_orange.svg",
  low: "assets/icons/low_icon.svg",
};

/**
 * Labels for empty columns.
 */
const COLUMN_LABELS = ["To do", "In progress", "Await feedback", "Done"];

/**
 * Generates the HTML for a single task card.
 * Structure matches exactly the hardcoded card in the HTML.
 *
 * @param {Object} task - The task object
 * @param {string} task.id - The Firebase ID
 * @param {string} task.title - The title (already escaped)
 * @param {string} task.description - The description (already escaped/truncated)
 * @param {string} task.categoryLabel - Display label for category (e.g. "User Story")
 * @param {string} task.categoryClass - CSS class for category styling
 * @param {string} task.priorityIcon - Path to the priority icon
 * @param {string} task.priority - Priority name for alt text
 * @param {string} task.subtasksHtml - Pre-rendered subtasks HTML
 * @param {string} task.assigneesHtml - Pre-rendered assignees HTML
 * @returns {string} HTML string of the task card
 */
function getTaskCardTemplate(task) {
  return `
      <div class="task-card" data-task-id="${task.id}" draggable="true">
        <button type="button" class="task-move-btn" onclick="openMoveMenu(event, '${task.id}')" aria-label="Move task">
          <img src="assets/icons/move_task.svg" alt="Move" />
        </button>
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
 * Generates the HTML for the subtasks progress indicator.
 * Structure matches exactly the hardcoded card in the HTML.
 *
 * @param {number} completed - Number of completed subtasks
 * @param {number} total - Total number of subtasks
 * @returns {string} HTML string of the progress indicator
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
 * Generates the HTML for a single assignee badge.
 *
 * @param {string} initials - The initials (e.g. "MM")
 * @param {string} [color] - Optional background color
 * @returns {string} HTML string of the badge
 */
function getAssigneeBadgeTemplate(initials, color) {
  const style = color ? `style="background-color: ${color}"` : "";
  return `<div class="badge" ${style}>${initials}</div>`;
}

/**
 * Generates the HTML for the overflow badge (+X).
 *
 * @param {number} count - Number of additional assignees
 * @returns {string} HTML string of the overflow badge
 */
function getOverflowBadgeTemplate(count) {
  return `<div class="badge badge-overflow">+${count}</div>`;
}

/**
 * Generates the HTML for an empty column (drag & drop placeholder).
 *
 * @param {string} columnLabel - The label of the column (e.g. "To do")
 * @returns {string} HTML string of the placeholder
 */
function getEmptyColumnTemplate(columnLabel) {
  return `
      <div class="drop-placeholder">
        <span>No tasks ${columnLabel}</span>
      </div>
  `;
}

/**
 * Generates the HTML for a dropdown item.
 * @param {string} id - The contact ID
 * @param {string} name - The contact name
 * @param {string} initials - The contact initials
 * @param {string} color - The background color
 * @param {boolean} isSelected - Whether the contact is selected
 * @returns {string} HTML string for the dropdown item
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
        <img src="assets/icons/check.svg" alt="Selected">
      </div>
    </div>
  `;
}

/**
 * Generates the HTML for a contact badge.
 * @param {string} name - The contact name
 * @param {string} initials - The contact initials
 * @param {string} color - The background color
 * @returns {string} HTML string for the contact badge
 */
function getModalContactBadgeTemplate(name, initials, color) {
  return `<div class="contact-badge" style="background-color: ${color}" title="${name}">${initials}</div>`;
}

/**
 * Generates the HTML template for a subtask item in the modal.
 * @param {string} title - The title of the subtask
 * @param {number} index - The index of the subtask
 * @returns {string} HTML string for the subtask item
 */
function getModalSubtaskItemTemplate(title, index) {
  return `
    <li class="subtask-item" ondblclick="editModalSubtask(${index})">
      <span class="subtask-item-text">${escapeHtml(title)}</span>
      <div class="subtask-item-actions">
        <img
          src="assets/icons/edit_subtask.svg"
          alt="Edit"
          class="subtask-edit-icon"
          onclick="editModalSubtask(${index}); event.stopPropagation();"
        />
        <div class="subtask-action-divider"></div>
        <img
          src="assets/icons/delete_subtask.svg"
          alt="Delete"
          class="subtask-delete-icon"
          onclick="deleteModalSubtask(${index}, event)"
        />
      </div>
    </li>
  `;
}

/**
 * Generates the HTML template for the subtask edit mode in the modal.
 * @param {string} title - The current title of the subtask
 * @param {number} index - The index of the subtask
 * @returns {string} HTML string for the edit mode
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
          src="assets/icons/delete_subtask.svg"
          alt="Delete"
          class="subtask-edit-icon"
          onclick="deleteModalSubtask(${index}, event)"
        />
        <div class="subtask-action-divider"></div>
        <img
          src="assets/icons/check_subtask.svg"
          alt="Confirm"
          class="subtask-edit-icon"
          onclick="confirmModalSubtaskEdit(${index})"
        />
      </div>
    </div>
  `;
}

/**
 * Generates the HTML for an assignee in the view modal.
 * @param {string} initials - The initials of the assignee
 * @param {string} color - The background color
 * @param {string} name - The full name
 * @returns {string} HTML string for the assignee
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
 * Generates the HTML for a subtask with checkbox in the view modal.
 * @param {number} index - The index of the subtask
 * @param {string} title - The title of the subtask (already escaped)
 * @param {boolean} completed - Whether the subtask is completed
 * @returns {string} HTML string for the subtask
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

/**
 * Generates the HTML for an assignee badge in the edit modal.
 * @param {string} initials - The initials of the assignee
 * @param {string} color - The background color
 * @param {string} name - The full name
 * @returns {string} HTML string for the badge
 */
function getEditAssigneeBadgeTemplate(initials, color, name) {
  return `<div class="contact-badge" style="background-color: ${color}" title="${name}">${initials}</div>`;
}

/**
 * Generates the HTML for a dropdown item in the edit modal assignee dropdown.
 * @param {string} id - The contact ID
 * @param {string} name - The contact name (already escaped)
 * @param {string} initials - The initials
 * @param {string} color - The background color
 * @param {boolean} isSelected - Whether the contact is selected
 * @returns {string} HTML string for the dropdown item
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
        <img src="assets/icons/check.svg" />
      </div>
    </div>
  `;
}

/**
 * Generates the HTML for a subtask item in the edit modal.
 * @param {number} index - The index of the subtask
 * @param {string} title - The title of the subtask (already escaped)
 * @returns {string} HTML string for the subtask item
 */
function getEditSubtaskItemTemplate(index, title) {
  return `
    <div class="subtask-item-edit" data-index="${index}" ondblclick="editEditSubtask(${index})">
      <span class="subtask-text">${title}</span>
      <div class="subtask-actions-edit">
        <img src="assets/icons/edit_subtask.svg" alt="Edit" onclick="editEditSubtask(${index}); event.stopPropagation();" />
        <div class="subtask-action-divider-edit"></div>
        <img src="assets/icons/delete_subtask.svg" alt="Delete" onclick="deleteEditSubtask(${index}); event.stopPropagation();" />
      </div>
    </div>
  `;
}

/**
 * Generates the HTML for the inline edit mode of a subtask in the edit modal.
 * @param {number} index - The index of the subtask
 * @param {string} title - The current title (already escaped)
 * @returns {string} HTML string for the inline edit mode
 */
function getEditSubtaskInlineEditTemplate(index, title) {
  return `
    <input type="text" class="subtask-edit-input-inline" value="${title}" id="editSubtaskInput${index}" />
    <div class="subtask-actions-edit">
      <img src="assets/icons/delete_subtask.svg" alt="Delete" onclick="deleteEditSubtask(${index})" />
      <img src="assets/icons/check_subtask.svg" alt="Confirm" onclick="confirmEditSubtask(${index})" />
    </div>
  `;
}
