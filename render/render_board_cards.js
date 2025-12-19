/**
 * @fileoverview Board Cards Render Functions
 * @description Render functions for populating and displaying task cards in view and edit modals.
 * @module Rendering/BoardCards
 */

/**
 * Populates the view modal with task data.
 *
 * @param {Object} task - The task object containing all data
 */
function populateViewModal(task) {
  populateViewCategory(task.category);
  populateViewTitle(task.title);
  populateViewDescription(task.description);
  populateViewDueDate(task.dueDate);
  populateViewPriority(task.priority);
  populateViewAssignees(task.assignees);
  populateViewSubtasks(task.subtasks);
}

/**
 * Populates the category badge in the view modal.
 *
 * @param {string} category - The task category
 */
function populateViewCategory(category) {
  const categoryBadge = document.querySelector(".task-view-header span");
  const categoryConfig = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.technical;
  categoryBadge.textContent = categoryConfig.label;
  categoryBadge.className =
    category === "userstory" ? "user-story" : "technical";
}

/**
 * Populates the title in the view modal.
 *
 * @param {string} title - The task title
 */
function populateViewTitle(title) {
  document.querySelector(".task-view-title span").textContent = title || "";
}

/**
 * Populates the description in the view modal.
 *
 * @param {string} description - The task description
 */
function populateViewDescription(description) {
  document.querySelector(".task-view-description span").textContent =
    description || "";
}

/**
 * Populates the due date in the view modal.
 *
 * @param {string} dueDate - The task due date
 */
function populateViewDueDate(dueDate) {
  const dueDateSpans = document.querySelectorAll(".task-view-due-date span");
  if (dueDateSpans.length >= 2) {
    dueDateSpans[1].textContent = formatDate(dueDate) || "";
  }
}

/**
 * Formats a date from YYYY-MM-DD to DD/MM/YYYY.
 *
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Date in DD/MM/YYYY format
 */
function formatDate(dateString) {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Populates the priority display in the view modal.
 *
 * @param {string} priority - The priority level (urgent, medium, low)
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
 * Populates the assignees list in the view modal.
 *
 * @param {Array} assignees - Array of assignee objects [{name, color}, ...]
 */
function populateViewAssignees(assignees) {
  const container = document.querySelector(".task-view-assigned-to-container");
  const listContainer = container.querySelector(
    ".assigned-avatars-container-list"
  );
  if (!listContainer) return;

  const assigneesArray = normalizeAssignees(assignees);
  if (assigneesArray.length === 0) {
    listContainer.innerHTML = '<span class="no-assignees">No assignees</span>';
    return;
  }

  const html = buildAssigneesHtml(assigneesArray);
  clearExistingAssigneeLists(container);
  container.insertAdjacentHTML("beforeend", html);
}

/**
 * Builds HTML string for assignees list.
 *
 * @param {Array} assigneesArray - Normalized array of assignee objects
 * @returns {string} HTML string for assignees
 */
function buildAssigneesHtml(assigneesArray) {
  let html = "";
  assigneesArray.forEach((assignee) => {
    const initials = getInitials(assignee.name);
    const color = assignee.color || "#2A3647";
    html += getViewAssigneeTemplate(initials, color, assignee.name);
  });
  return html;
}

/**
 * Removes existing assignee list containers.
 *
 * @param {HTMLElement} container - The parent container element
 */
function clearExistingAssigneeLists(container) {
  const existingLists = container.querySelectorAll(
    ".assigned-avatars-container-list"
  );
  existingLists.forEach((el) => el.remove());
}

/**
 * Normalizes assignees to an array.
 * Firebase may store arrays as objects.
 *
 * @param {Array|Object} assignees - Assignees as array or object
 * @returns {Array} Normalized array of assignee objects
 */
function normalizeAssignees(assignees) {
  if (!assignees) return [];
  if (Array.isArray(assignees)) return assignees;
  return Object.values(assignees);
}

/**
 * Populates the subtasks list in the view modal with checkboxes.
 *
 * @param {Array} subtasks - Array of subtask objects [{title, completed}, ...]
 */
function populateViewSubtasks(subtasks) {
  const container = document.querySelector(".subtasks-list-container");
  if (!container) return;

  const subtasksArray = normalizeSubtasks(subtasks);
  if (subtasksArray.length === 0) {
    container.innerHTML = '<span class="no-subtasks">No subtasks</span>';
    return;
  }

  container.innerHTML = buildSubtasksHtml(subtasksArray);
}

/**
 * Normalizes subtasks to an array.
 *
 * @param {Array|Object} subtasks - Subtasks as array or object
 * @returns {Array} Normalized array of subtask objects
 */
function normalizeSubtasks(subtasks) {
  if (!subtasks) return [];
  if (Array.isArray(subtasks)) return subtasks;
  return Object.values(subtasks);
}

/**
 * Builds HTML string for subtasks list.
 *
 * @param {Array} subtasksArray - Normalized array of subtask objects
 * @returns {string} HTML string for subtasks
 */
function buildSubtasksHtml(subtasksArray) {
  let html = "";
  subtasksArray.forEach((subtask, index) => {
    html += getViewSubtaskTemplate(
      index,
      escapeHtml(subtask.title),
      subtask.completed
    );
  });
  return html;
}

/**
 * Renders the assignees badges in the edit modal.
 */
function renderEditAssigneesBadges() {
  const badgesContainer = document.getElementById(
    "editSelectedAssigneesBadges"
  );
  if (!badgesContainer) return;

  if (editSelectedAssignees.length === 0) {
    badgesContainer.innerHTML = "";
    return;
  }

  badgesContainer.innerHTML = buildEditAssigneesBadgesHtml();
}

/**
 * Builds HTML string for edit assignees badges.
 *
 * @returns {string} HTML string for assignee badges
 */
function buildEditAssigneesBadgesHtml() {
  let html = "";
  editSelectedAssignees.forEach((assignee) => {
    const initials = getInitials(assignee.name);
    html += getEditAssigneeBadgeTemplate(
      initials,
      assignee.color || "#2A3647",
      assignee.name
    );
  });
  return html;
}

/**
 * Renders the assignee dropdown list in the edit modal.
 *
 * @param {string} filter - Optional search filter
 */
function renderEditAssigneeDropdownList(filter = "") {
  const dropdown = document.getElementById("assignedDropdownList");
  if (!dropdown) return;

  const filteredContacts = getFilteredContacts(filter);
  if (filteredContacts.length === 0) {
    dropdown.innerHTML =
      '<div class="assigned-dropdown-item no-hover">No contacts available</div>';
    return;
  }

  dropdown.innerHTML = buildDropdownItemsHtml(filteredContacts);
}

/**
 * Filters contacts by search string.
 *
 * @param {string} filter - Search filter string
 * @returns {Array} Filtered contacts array
 */
function getFilteredContacts(filter) {
  return editAvailableContacts.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );
}

/**
 * Builds HTML string for dropdown items.
 *
 * @param {Array} contacts - Array of contact objects
 * @returns {string} HTML string for dropdown items
 */
function buildDropdownItemsHtml(contacts) {
  let html = "";
  contacts.forEach((contact) => {
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
  return html;
}

/**
 * Renders the subtasks list in the edit modal.
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
