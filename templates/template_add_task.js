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
        <img src="/assets/icons/check.svg" alt="Selected">
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
