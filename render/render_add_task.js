/**
 * @fileoverview Render-Funktionen für die Add Task-Seite
 * @description Enthält alle Render-Funktionen für das Assignee-Dropdown und Badges
 */

/**
 * Holt den aktuellen Benutzer aus dem localStorage.
 * @returns {Object|null} Das User-Objekt oder null
 */
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

/**
 * Extrahiert den Anzeigenamen aus einem User-Objekt.
 * @param {Object} user - Das User-Objekt
 * @returns {string} Der Name oder der E-Mail-Präfix
 */
function getUserName(user) {
  return user.name || user.email.split("@")[0];
}

/**
 * Filtert die Kontaktliste nach einem Suchbegriff.
 * @param {string} filter - Der Suchbegriff
 * @returns {Array<Object>} Die gefilterten Kontakte
 */
function filterContacts(filter) {
  return availableContacts.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );
}

/**
 * Prüft, ob ein Name dem Filter entspricht.
 * @param {string} name - Der zu prüfende Name
 * @param {string} filter - Der Suchfilter
 * @returns {boolean} True wenn der Name passt oder Filter leer ist
 */
function matchesFilter(name, filter) {
  return filter === "" || name.toLowerCase().includes(filter.toLowerCase());
}

/**
 * Erstellt das HTML für den aktuellen Benutzer im Dropdown.
 * @param {string} filter - Der aktuelle Suchfilter
 * @returns {string} HTML-String oder leerer String
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
 * Erstellt das HTML für alle gefilterten Kontakte.
 * @param {Array<Object>} filteredContacts - Die gefilterten Kontakte
 * @returns {string} HTML-String mit allen Kontakt-Items
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
 * Rendert die Kontaktliste im Dropdown.
 * @param {string} [filter=""] - Optionaler Suchfilter
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
 * Holt die Daten eines Assignees anhand der ID.
 * @param {string} id - Die ID des Assignees
 * @returns {Object|null} Objekt mit name und color oder null
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
 * Erstellt das HTML für alle ausgewählten Assignee-Badges.
 * @returns {string} HTML-String mit allen Badges
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
 * Rendert die Badges der ausgewählten Kontakte.
 */
function renderSelectedContactsBadges() {
  const container = document.getElementById("selectedContactsBadges");
  if (!container) return;
  container.innerHTML = buildBadgesHtml();
}
