/**
 * @fileoverview Board Modal Assigned To Controller
 * @description Verwaltet die Assigned-To Dropdown-Funktionalität im Add Task Modal
 */

/** @type {Object[]} */
let modalAvailableContacts = [];
/** @type {string[]} */
let modalSelectedAssignees = [];

// ==========================================================================
// KONTAKTE LADEN
// ==========================================================================

/**
 * Lädt die Kontakte für das Modal-Dropdown (global für alle User inkl. Gäste).
 */
async function loadModalContactsForDropdown() {
  try {
    modalAvailableContacts = await fetchContacts();
  } catch (error) {
    console.error("Error loading contacts for modal:", error);
    modalAvailableContacts = [];
  }
}

// ==========================================================================
// DROPDOWN STEUERUNG
// ==========================================================================

/**
 * Holt die Modal-Dropdown-Elemente.
 * @returns {Object}
 */
function getModalDropdownElements() {
  return {
    dropdown: document.getElementById("modalAssigneeDropdown"),
    list: document.getElementById("modalAssigneeList"),
    badges: document.getElementById("modalSelectedContactsBadges"),
  };
}

/**
 * Öffnet/Schließt das Modal-Assignee-Dropdown.
 */
function toggleModalAssigneeDropdown() {
  const { dropdown, list, badges } = getModalDropdownElements();
  const arrow = dropdown.querySelector(".dropdown-arrow");
  list.classList.toggle("open");
  arrow.classList.toggle("open");
  badges.classList.toggle("hidden", list.classList.contains("open"));
}

/**
 * Öffnet das Modal-Assignee-Dropdown.
 */
function openModalAssigneeDropdown() {
  const { list, badges } = getModalDropdownElements();
  const arrow = document.querySelector(
    "#modalAssigneeDropdown .dropdown-arrow"
  );
  if (!list.classList.contains("open")) {
    list.classList.add("open");
    arrow.classList.add("open");
    badges.classList.add("hidden");
  }
}

/**
 * Öffnet die Dropdown-Liste falls geschlossen.
 */
function openDropdownListIfClosed() {
  const list = document.getElementById("modalAssigneeList");
  const arrow = document.querySelector(
    "#modalAssigneeDropdown .dropdown-arrow"
  );
  if (!list.classList.contains("open")) {
    list.classList.add("open");
    arrow.classList.add("open");
  }
}

/**
 * Schließt das Modal-Dropdown.
 * @param {HTMLElement} dropdown
 */
function closeModalDropdown(dropdown) {
  const list = document.getElementById("modalAssigneeList");
  const arrow = dropdown.querySelector(".dropdown-arrow");
  const badges = document.getElementById("modalSelectedContactsBadges");
  if (list?.classList.contains("open")) {
    list.classList.remove("open");
    arrow?.classList.remove("open");
    badges?.classList.remove("hidden");
  }
}

/**
 * Schließt das Dropdown bei Klick außerhalb.
 */
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("modalAssigneeDropdown");
  if (dropdown && !dropdown.contains(event.target))
    closeModalDropdown(dropdown);
});

// ==========================================================================
// FILTER & AUSWAHL
// ==========================================================================

/**
 * Filtert die Modal-Assignee-Liste.
 */
function filterModalAssigneeList() {
  const filter = document.getElementById("modalAssigneeSearch").value;
  renderModalAssigneeDropdown(filter);
  openDropdownListIfClosed();
}

/**
 * Wählt einen Kontakt aus oder ab.
 * @param {Event} event
 * @param {string} contactId
 */
function toggleModalAssignee(event, contactId) {
  event.stopPropagation();
  const index = modalSelectedAssignees.indexOf(contactId);
  index > -1
    ? modalSelectedAssignees.splice(index, 1)
    : modalSelectedAssignees.push(contactId);
  renderModalAssigneeDropdown(
    document.getElementById("modalAssigneeSearch").value
  );
  renderModalSelectedContactsBadges();
}

/**
 * Setzt die Modal-Assignees zurück.
 */
function resetModalAssignees() {
  modalSelectedAssignees = [];
  const searchInput = document.getElementById("modalAssigneeSearch");
  if (searchInput) searchInput.value = "";
  renderModalAssigneeDropdown();
  renderModalSelectedContactsBadges();
}

// ==========================================================================
// HILFSFUNKTIONEN
// ==========================================================================

/**
 * Holt den aktuellen Benutzer.
 * @returns {Object|null}
 */
function getModalCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

/**
 * Extrahiert den Anzeigenamen.
 * @param {Object} user
 * @returns {string}
 */
function getModalUserName(user) {
  return user.name || user.email.split("@")[0];
}

/**
 * Ermittelt die Initialen aus einem Namen.
 * @param {string} name
 * @returns {string}
 */
function getModalInitialsFromName(name) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Filtert die Kontaktliste.
 * @param {string} filter
 * @returns {Array<Object>}
 */
function filterModalContacts(filter) {
  return modalAvailableContacts.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );
}

/**
 * Prüft ob ein Name dem Filter entspricht.
 * @param {string} name
 * @param {string} filter
 * @returns {boolean}
 */
function matchesModalFilter(name, filter) {
  return filter === "" || name.toLowerCase().includes(filter.toLowerCase());
}

// ==========================================================================
// ASSIGNEE DATEN
// ==========================================================================

/**
 * Holt die Daten eines Assignees.
 * @param {string} id
 * @returns {Object|null}
 */
function getModalAssigneeData(id) {
  if (id === "currentUser") return getCurrentUserData();
  const contact = modalAvailableContacts.find((c) => c.id === id);
  return contact ? { name: contact.name, color: contact.color } : null;
}

/**
 * Holt die Daten des aktuellen Users als Assignee.
 * @returns {Object|null}
 */
function getCurrentUserData() {
  const currentUser = getModalCurrentUser();
  return currentUser
    ? { name: getModalUserName(currentUser), color: "#29abe2" }
    : null;
}

/**
 * Wandelt Assignee-IDs in Objekte um.
 * @param {string[]} assigneeIds
 * @returns {Object[]}
 */
function getModalAssigneesWithData(assigneeIds) {
  if (!assigneeIds?.length) return [];
  return assigneeIds.map((id) => getAssigneeObjectById(id)).filter(Boolean);
}

/**
 * Holt ein Assignee-Objekt anhand der ID.
 * @param {string} id
 * @returns {Object|null}
 */
function getAssigneeObjectById(id) {
  if (id === "currentUser") {
    const user = getModalCurrentUser();
    return user ? { name: getModalUserName(user), color: "#29abe2" } : null;
  }
  const contact = modalAvailableContacts.find((c) => c.id === id);
  return contact ? { name: contact.name, color: contact.color } : null;
}
