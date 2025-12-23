/**
 * @fileoverview Render functions for the Add Task page.
 * @description Contains all render functions for the assignee dropdown and badges.
 * @module Rendering/AddTask
 */

/**
 * Gets the current user from localStorage.
 * @returns {Object|null} The user object or null.
 */
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

/**
 * Extracts the display name from a user object.
 * @param {Object} user - The user object.
 * @returns {string} The name or email prefix.
 */
function getUserName(user) {
  return user.name || user.email.split("@")[0];
}

/**
 * Filters the contact list by a search term.
 * @param {string} filter - The search term.
 * @returns {Array<Object>} The filtered contacts.
 */
function filterContacts(filter) {
  return availableContacts.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );
}

/**
 * Checks if a name matches the filter.
 * @param {string} name - The name to check.
 * @param {string} filter - The search filter.
 * @returns {boolean} True if the name matches or filter is empty.
 */
function matchesFilter(name, filter) {
  return filter === "" || name.toLowerCase().includes(filter.toLowerCase());
}

/**
 * Builds the HTML for the current user in the dropdown.
 * @param {string} filter - The current search filter.
 * @returns {string} HTML string or empty string.
 */
function buildCurrentUserHtml(filter) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.guest) return "";
  const userName = getUserName(currentUser);
  if (!matchesFilter(userName, filter)) return "";
  const initials = getInitialsFromName(userName);
  const isSelected = selectedAssignees.includes("currentUser");
  return getDropdownItemTemplate(
    "currentUser",
    userName + " (You)",
    initials,
    "#29abe2",
    isSelected
  );
}

/**
 * Builds the HTML for all filtered contacts.
 * @param {Array<Object>} filteredContacts - The filtered contacts.
 * @returns {string} HTML string with all contact items.
 */
function buildContactsHtml(filteredContacts) {
  let html = "";
  for (let contact of filteredContacts) {
    const initials = getInitialsFromName(contact.name);
    const isSelected = selectedAssignees.includes(contact.id);
    html += getDropdownItemTemplate(
      contact.id,
      contact.name,
      initials,
      contact.color,
      isSelected
    );
  }
  return html;
}

/**
 * Renders the contact list in the dropdown.
 * @param {string} [filter=""] - Optional search filter.
 */
function renderAssigneeDropdown(filter = "") {
  const listElement = document.getElementById("assigneeList");
  if (!listElement) return;
  const html =
    buildCurrentUserHtml(filter) + buildContactsHtml(filterContacts(filter));
  listElement.innerHTML =
    html || '<div class="dropdown-item no-hover">No contacts available</div>';
}

/**
 * Gets the data of an assignee by ID.
 * @param {string} id - The assignee ID.
 * @returns {Object|null} Object with name and color or null.
 */
function getAssigneeData(id) {
  const currentUser = getCurrentUser();
  if (id === "currentUser" && currentUser) {
    return { name: getUserName(currentUser), color: "#29abe2" };
  }
  const contact = availableContacts.find((c) => c.id === id);
  return contact ? { name: contact.name, color: contact.color } : null;
}

/**
 * Builds the HTML for all selected assignee badges.
 * @returns {string} HTML string with all badges.
 */
function buildBadgesHtml() {
  let html = "";
  for (let id of selectedAssignees) {
    const data = getAssigneeData(id);
    if (!data) continue;
    html += getContactBadgeTemplate(
      data.name,
      getInitialsFromName(data.name),
      data.color
    );
  }
  return html;
}

/**
 * Renders the badges of the selected contacts.
 */
function renderSelectedContactsBadges() {
  const container = document.getElementById("selectedContactsBadges");
  if (!container) return;
  container.innerHTML = buildBadgesHtml();
}

/**
 * Renders the subtask list.
 */
function renderPageSubtasks() {
  const list = document.getElementById("subtaskList");
  if (!list) return;
  list.innerHTML = pageSubtasks
    .map((subtask, index) => getSubtaskItemTemplate(subtask.title, index))
    .join("");
  if (pageSubtasks.length === 0) {
    list.style.visibility = "hidden";
  } else {
    list.style.visibility = "visible";
  }
}
