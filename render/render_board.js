/**
 * @fileoverview Board Render Functions
 * @description Render functions for the board modal assignee dropdown.
 */

/**
 * Builds the HTML for the current user in the dropdown.
 *
 * @param {string} filter - The search filter
 * @returns {string} HTML string or empty string
 */
function buildModalCurrentUserHtml(filter) {
  const currentUser = getModalCurrentUser();
  if (!currentUser || currentUser.guest) return "";
  const userName = getModalUserName(currentUser);
  if (!matchesModalFilter(userName, filter)) return "";
  return buildUserDropdownItem(userName);
}

/**
 * Builds a dropdown item for the current user.
 *
 * @param {string} userName - The user's name
 * @returns {string} HTML string for the dropdown item
 */
function buildUserDropdownItem(userName) {
  const initials = getModalInitialsFromName(userName);
  const isSelected = modalSelectedAssignees.includes("currentUser");
  return getModalDropdownItemTemplate(
    "currentUser",
    userName + " (You)",
    initials,
    "#29abe2",
    isSelected
  );
}

/**
 * Builds the HTML for all contacts in the dropdown.
 *
 * @param {Array<Object>} filteredContacts - The filtered contacts array
 * @returns {string} HTML string with all contact items
 */
function buildModalContactsHtml(filteredContacts) {
  return filteredContacts
    .map((contact) => buildContactDropdownItem(contact))
    .join("");
}

/**
 * Builds a dropdown item for a contact.
 *
 * @param {Object} contact - The contact object
 * @returns {string} HTML string for the dropdown item
 */
function buildContactDropdownItem(contact) {
  const initials = getModalInitialsFromName(contact.name);
  const isSelected = modalSelectedAssignees.includes(contact.id);
  return getModalDropdownItemTemplate(
    contact.id,
    contact.name,
    initials,
    contact.color,
    isSelected
  );
}

/**
 * Renders the contact list in the dropdown.
 *
 * @param {string} [filter=""] - Optional search filter
 */
function renderModalAssigneeDropdown(filter = "") {
  const listElement = document.getElementById("modalAssigneeList");
  if (!listElement) return;
  const html =
    buildModalCurrentUserHtml(filter) +
    buildModalContactsHtml(filterModalContacts(filter));
  listElement.innerHTML =
    html || '<div class="dropdown-item no-hover">No contacts available</div>';
}

/**
 * Builds the HTML for all selected badges.
 *
 * @returns {string} HTML string with all badges
 */
function buildModalBadgesHtml() {
  return modalSelectedAssignees
    .map((id) => {
      const data = getModalAssigneeData(id);
      return data
        ? getModalContactBadgeTemplate(
            data.name,
            getModalInitialsFromName(data.name),
            data.color
          )
        : "";
    })
    .join("");
}

/**
 * Renders the badges of the selected contacts.
 */
function renderModalSelectedContactsBadges() {
  const container = document.getElementById("modalSelectedContactsBadges");
  if (container) container.innerHTML = buildModalBadgesHtml();
}

/**
 * Renders the subtask list in the modal.
 */
function renderModalSubtasks() {
  const list = document.getElementById("modalSubtaskList");
  if (!list) return;

  list.innerHTML = modalSubtasks
    .map((subtask, index) => getModalSubtaskItemTemplate(subtask.title, index))
    .join("");
}
