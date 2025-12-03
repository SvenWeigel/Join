/**
 * @fileoverview Board Render Functions
 * @description Render-Funktionen für das Board Modal Assignee Dropdown
 */

// ============================================================================
// MODAL ASSIGNEE DROPDOWN RENDER FUNKTIONEN
// ============================================================================

/**
 * Erstellt das HTML für den aktuellen Benutzer.
 * @param {string} filter
 * @returns {string}
 */
function buildModalCurrentUserHtml(filter) {
  const currentUser = getModalCurrentUser();
  if (!currentUser || currentUser.guest) return "";
  const userName = getModalUserName(currentUser);
  if (!matchesModalFilter(userName, filter)) return "";
  return buildUserDropdownItem(userName);
}

/**
 * Erstellt ein Dropdown-Item für den aktuellen User.
 * @param {string} userName
 * @returns {string}
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
 * Erstellt das HTML für alle Kontakte.
 * @param {Array<Object>} filteredContacts
 * @returns {string}
 */
function buildModalContactsHtml(filteredContacts) {
  return filteredContacts
    .map((contact) => buildContactDropdownItem(contact))
    .join("");
}

/**
 * Erstellt ein Dropdown-Item für einen Kontakt.
 * @param {Object} contact
 * @returns {string}
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
 * Rendert die Kontaktliste im Dropdown.
 * @param {string} [filter=""]
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
 * Erstellt das HTML für alle Badges.
 * @returns {string}
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
 * Rendert die Badges der ausgewählten Kontakte.
 */
function renderModalSelectedContactsBadges() {
  const container = document.getElementById("modalSelectedContactsBadges");
  if (container) container.innerHTML = buildModalBadgesHtml();
}
