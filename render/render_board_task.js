/**
 * @fileoverview Task Rendering Logic
 * @description Logic functions for rendering tasks on the board.
 *              Templates are located in /templates/template_board.js
 */

/**
 * Stores all loaded tasks for the search function.
 * @type {Array<Object>}
 */
let allTasks = [];

/**
 * Debounce timer for the search function.
 * @type {number|null}
 */
let searchDebounceTimer = null;

/**
 * Extracts initials from a name or email address.
 *
 * @param {string} nameOrEmail - Name or email address
 * @returns {string} The initials (max 2 characters)
 *
 * @example
 * getInitials("max.mustermann@email.com") // "MM"
 * getInitials("Anna Schmidt") // "AS"
 */
function getInitials(nameOrEmail) {
  if (!nameOrEmail) return "??";

  const name = nameOrEmail.includes("@")
    ? nameOrEmail.split("@")[0]
    : nameOrEmail;

  const parts = name.split(/[\s._-]+/);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Truncates text to a maximum length and adds "...".
 *
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum length
 * @returns {string} The truncated text
 */
function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Escapes HTML special characters to prevent XSS attacks.
 *
 * @param {string} text - The text to escape
 * @returns {string} The safe text
 */
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Prepares task data and generates HTML via template.
 *
 * @param {Object} task - The raw task object from Firebase
 * @returns {string} HTML string of the task card
 */
function renderTaskCard(task) {
  const categoryConfig =
    CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.technical;
  const priorityIcon = PRIORITY_ICONS[task.priority] || PRIORITY_ICONS.medium;

  const templateData = {
    id: task.id,
    title: escapeHtml(task.title),
    description: escapeHtml(truncateText(task.description, 50)),
    categoryLabel: categoryConfig.label,
    categoryClass: categoryConfig.class,
    priorityIcon: priorityIcon,
    priority: task.priority,
    subtasksHtml: renderSubtasksProgress(task.subtasks),
    assigneesHtml: renderAssignees(task.assignees),
  };

  return getTaskCardTemplate(templateData);
}

/**
 * Calculates subtask statistics and generates HTML via template.
 *
 * @param {Array} subtasks - Array of subtask objects [{title, completed}, ...]
 * @returns {string} HTML string of the progress bar or empty string
 */
function renderSubtasksProgress(subtasks) {
  if (!subtasks || subtasks.length === 0) return "";

  const completed = subtasks.filter((st) => st.completed).length;
  const total = subtasks.length;

  return getSubtasksProgressTemplate(completed, total);
}

/**
 * Processes assignees and generates HTML via template.
 * Shows a maximum of 5 badges, displays a "+X" badge for overflow.
 *
 * @param {Array|Object} assignees - Array or object of assignee objects [{name, color}, ...]
 * @returns {string} HTML string of badges or empty string
 */
function renderAssignees(assignees) {
  if (!assignees) return "";

  const assigneesArray = Array.isArray(assignees)
    ? assignees
    : Object.values(assignees);

  if (assigneesArray.length === 0) return "";

  const maxVisible = 5;
  const visibleAssignees = assigneesArray.slice(0, maxVisible);
  const overflowCount = assigneesArray.length - maxVisible;

  let html = visibleAssignees
    .map((assignee) => {
      if (typeof assignee === "object" && assignee.name) {
        const initials = getInitials(assignee.name);
        return getAssigneeBadgeTemplate(initials, assignee.color);
      } else {
        const initials = getInitials(assignee);
        return getAssigneeBadgeTemplate(initials);
      }
    })
    .join("");

  if (overflowCount > 0) {
    html += getOverflowBadgeTemplate(overflowCount);
  }

  return html;
}

/**
 * Generates placeholder HTML for an empty column.
 *
 * @param {number} columnIndex - The index of the column (0-3)
 * @returns {string} HTML string of the placeholder
 */
function renderEmptyColumn(columnIndex) {
  const label = COLUMN_LABELS[columnIndex] || "";
  return getEmptyColumnTemplate(label);
}

/**
 * Loads all tasks from Firebase and renders them to the board.
 * Tasks are sorted into the correct column based on their status.
 */
async function renderAllTasks() {
  try {
    allTasks = await fetchTasks();
    renderFilteredTasks(allTasks);
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

/**
 * Renders the provided tasks to the board.
 *
 * @param {Array<Object>} tasks - Array of task objects
 * @param {boolean} isSearchActive - Indicates if a search is currently active
 */
function renderFilteredTasks(tasks, isSearchActive = false) {
  const columns = document.querySelectorAll(".column-content");
  columns.forEach((col) => (col.innerHTML = ""));

  tasks.forEach((task) => {
    const columnIndex = STATUS_COLUMNS[task.status];
    if (columnIndex !== undefined && columns[columnIndex]) {
      columns[columnIndex].innerHTML += renderTaskCard(task);
    }
  });

  if (!isSearchActive) {
    columns.forEach((col, index) => {
      if (col.innerHTML.trim() === "") {
        col.innerHTML = renderEmptyColumn(index);
      }
    });
  }

  toggleNoResultsMessage(isSearchActive, tasks.length);
  initDragAndDrop();
  initTaskCardClickHandlers();
}

/**
 * Toggles the visibility of the no results message.
 *
 * @param {boolean} isSearchActive - Whether search is active
 * @param {number} taskCount - Number of tasks found
 */
function toggleNoResultsMessage(isSearchActive, taskCount) {
  const noResultsMessage = document.getElementById("noSearchResults");
  if (!noResultsMessage) return;

  if (isSearchActive && taskCount === 0) {
    noResultsMessage.classList.add("show");
  } else {
    noResultsMessage.classList.remove("show");
  }
}

/**
 * Filters tasks by search term in title and description.
 *
 * @param {string} searchText - The search term
 * @returns {Array<Object>} Filtered tasks
 */
function filterTasksBySearch(searchText) {
  if (!searchText || searchText.trim() === "") {
    return allTasks;
  }

  const searchLower = searchText.toLowerCase().trim();

  return allTasks.filter((task) => {
    const titleMatch =
      task.title && task.title.toLowerCase().includes(searchLower);
    const descriptionMatch =
      task.description && task.description.toLowerCase().includes(searchLower);
    return titleMatch || descriptionMatch;
  });
}

/**
 * Handler for search input with debounce.
 * Synchronizes both search fields and filters tasks.
 *
 * @param {Event} event - The input event
 */
function handleSearchInput(event) {
  const searchText = event.target.value;

  const findTaskInput = document.getElementById("findTask");
  const findTaskResponsive = document.getElementById("findTask-responsive");

  if (findTaskInput && findTaskInput !== event.target) {
    findTaskInput.value = searchText;
  }
  if (findTaskResponsive && findTaskResponsive !== event.target) {
    findTaskResponsive.value = searchText;
  }

  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(() => {
    const filteredTasks = filterTasksBySearch(searchText);
    const isSearchActive = searchText && searchText.trim() !== "";
    renderFilteredTasks(filteredTasks, isSearchActive);
  }, 200);
}

/**
 * Initializes the search function for both input fields.
 */
function initBoardSearch() {
  const findTaskInput = document.getElementById("findTask");
  const findTaskResponsive = document.getElementById("findTask-responsive");

  if (findTaskInput) {
    findTaskInput.addEventListener("input", handleSearchInput);
  }
  if (findTaskResponsive) {
    findTaskResponsive.addEventListener("input", handleSearchInput);
  }
}
