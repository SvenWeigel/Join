/**
 * @fileoverview Assigned To Dropdown Controller für Add Task Page
 * @description Verwaltet das Assignee-Dropdown auf der Add Task-Seite
 */

// ==========================================================================
// ASSIGNED TO DROPDOWN (Add Task Page)
// ==========================================================================

/** @type {Object[]} Array der verfügbaren Kontakte */
let availableContacts = [];

/** @type {string[]} Array der ausgewählten Kontakt-IDs */
let selectedAssignees = [];

/**
 * Lädt die Kontakte für das Dropdown-Menü (global für alle User inkl. Gäste).
 */
async function loadContactsForDropdown() {
  try {
    availableContacts = await fetchContacts();
    renderAssigneeDropdown();
  } catch (error) {
    console.error("Error loading contacts:", error);
    availableContacts = [];
    renderAssigneeDropdown();
  }
}

/**
 * Ermittelt die Initialen aus einem Namen.
 * @param {string} name - Der Name
 * @returns {string} Die Initialen
 */
function getInitialsFromName(name) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Öffnet/Schließt das Assignee-Dropdown.
 */
function toggleAssigneeDropdown() {
  const dropdown = document.getElementById("assigneeDropdown");
  const list = document.getElementById("assigneeList");
  const arrow = dropdown.querySelector(".dropdown-arrow");
  const badges = document.getElementById("selectedContactsBadges");

  list.classList.toggle("open");
  arrow.classList.toggle("open");

  // Badges verstecken wenn Dropdown offen, anzeigen wenn geschlossen
  if (list.classList.contains("open")) {
    badges.classList.add("hidden");
  } else {
    badges.classList.remove("hidden");
  }
}

/**
 * Öffnet das Assignee-Dropdown (ohne Toggle).
 */
function openAssigneeDropdown() {
  const list = document.getElementById("assigneeList");
  const arrow = document.querySelector(".dropdown-arrow");
  const badges = document.getElementById("selectedContactsBadges");

  if (!list.classList.contains("open")) {
    list.classList.add("open");
    arrow.classList.add("open");
    badges.classList.add("hidden");
  }
}

/**
 * Filtert die Assignee-Liste basierend auf der Sucheingabe.
 */
function filterAssigneeList() {
  const searchInput = document.getElementById("assigneeSearch");
  const filter = searchInput.value;
  renderAssigneeDropdown(filter);

  const list = document.getElementById("assigneeList");
  const arrow = document.querySelector(".dropdown-arrow");
  if (!list.classList.contains("open")) {
    list.classList.add("open");
    arrow.classList.add("open");
  }
}

/**
 * Wählt einen Kontakt aus oder ab.
 * @param {Event} event - Das Click-Event
 * @param {string} contactId - Die ID des Kontakts
 */
function toggleAssignee(event, contactId) {
  event.stopPropagation();
  const index = selectedAssignees.indexOf(contactId);
  if (index > -1) {
    selectedAssignees.splice(index, 1);
  } else {
    selectedAssignees.push(contactId);
  }
  renderAssigneeDropdown(document.getElementById("assigneeSearch").value);
  renderSelectedContactsBadges();
}

/**
 * Schließt das Dropdown wenn außerhalb geklickt wird.
 */
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("assigneeDropdown");
  if (dropdown && !dropdown.contains(event.target)) {
    const list = document.getElementById("assigneeList");
    const arrow = dropdown.querySelector(".dropdown-arrow");
    const badges = document.getElementById("selectedContactsBadges");

    if (list && list.classList.contains("open")) {
      list.classList.remove("open");
      if (arrow) arrow.classList.remove("open");
      if (badges) badges.classList.remove("hidden");
    }
  }
});
