/**
 * @fileoverview Board Modal Assigned To Controller
 * @description Manages the Assigned-To dropdown functionality in the Add Task modal
 * @module Board/ModalAssignedTo
 */

/** @type {Object[]} */
let modalAvailableContacts = [];

/** @type {string[]} */
let modalSelectedAssignees = [];

/**
 * Loads contacts for the modal dropdown (global for all users including guests).
 */
async function loadModalContactsForDropdown() {
  try {
    modalAvailableContacts = await fetchContacts();
  } catch (error) {
    console.error("Error loading contacts for modal:", error);
    modalAvailableContacts = [];
  }
}

/**
 * Gets the modal dropdown elements.
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
 * Opens/closes the modal assignee dropdown.
 */
function toggleModalAssigneeDropdown() {
  const { dropdown, list, badges } = getModalDropdownElements();
  const arrow = dropdown.querySelector(".dropdown-arrow");
  list.classList.toggle("open");
  arrow.classList.toggle("open");
  badges.classList.toggle("hidden", list.classList.contains("open"));
}

/**
 * Opens the modal assignee dropdown.
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
 * Opens the dropdown list if closed.
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
 * Closes the modal dropdown.
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
 * Closes the dropdown when clicking outside.
 */
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("modalAssigneeDropdown");
  if (dropdown && !dropdown.contains(event.target))
    closeModalDropdown(dropdown);
});

/**
 * Filters the modal assignee list.
 */
function filterModalAssigneeList() {
  const filter = document.getElementById("modalAssigneeSearch").value;
  renderModalAssigneeDropdown(filter);
  openDropdownListIfClosed();
}

/**
 * Selects or deselects a contact.
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
 * Resets the modal assignees.
 */
function resetModalAssignees() {
  modalSelectedAssignees = [];
  const searchInput = document.getElementById("modalAssigneeSearch");
  if (searchInput) searchInput.value = "";
  renderModalAssigneeDropdown();
  renderModalSelectedContactsBadges();
}

/**
 * Gets the current user.
 * @returns {Object|null}
 */
function getModalCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

/**
 * Extracts the display name.
 * @param {Object} user
 * @returns {string}
 */
function getModalUserName(user) {
  return user.name || user.email.split("@")[0];
}

/**
 * Gets initials from a name.
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
 * Filters the contact list.
 * @param {string} filter
 * @returns {Array<Object>}
 */
function filterModalContacts(filter) {
  return modalAvailableContacts.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );
}

/**
 * Checks if a name matches the filter.
 * @param {string} name
 * @param {string} filter
 * @returns {boolean}
 */
function matchesModalFilter(name, filter) {
  return filter === "" || name.toLowerCase().includes(filter.toLowerCase());
}

/**
 * Gets the data of an assignee.
 * @param {string} id
 * @returns {Object|null}
 */
function getModalAssigneeData(id) {
  if (id === "currentUser") return getCurrentUserData();
  const contact = modalAvailableContacts.find((c) => c.id === id);
  return contact ? { name: contact.name, color: contact.color } : null;
}

/**
 * Gets the current user's data as assignee.
 * @returns {Object|null}
 */
function getCurrentUserData() {
  const currentUser = getModalCurrentUser();
  return currentUser
    ? { name: getModalUserName(currentUser), color: "#29abe2" }
    : null;
}

/**
 * Converts assignee IDs to objects.
 * @param {string[]} assigneeIds
 * @returns {Object[]}
 */
function getModalAssigneesWithData(assigneeIds) {
  if (!assigneeIds?.length) return [];
  return assigneeIds.map((id) => getAssigneeObjectById(id)).filter(Boolean);
}

/**
 * Gets an assignee object by ID.
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
