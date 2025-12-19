/**
 * @fileoverview Assigned To Dropdown Controller for Add Task Page
 * @description Manages the assignee dropdown on the Add Task page
 * @module AddTask/AssignedTo
 */

/** @type {Object[]} Array of available contacts */
let availableContacts = [];

/** @type {string[]} Array of selected contact IDs */
let selectedAssignees = [];

/**
 * Loads the contacts for the dropdown menu (global for all users including guests).
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
 * Determines the initials from a name.
 * @param {string} name - The name
 * @returns {string} The initials
 */
function getInitialsFromName(name) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Opens/closes the assignee dropdown.
 */
function toggleAssigneeDropdown() {
  const dropdown = document.getElementById("assigneeDropdown");
  const list = document.getElementById("assigneeList");
  const arrow = dropdown.querySelector(".dropdown-arrow");
  const badges = document.getElementById("selectedContactsBadges");

  list.classList.toggle("open");
  arrow.classList.toggle("open");

  if (list.classList.contains("open")) {
    badges.classList.add("hidden");
  } else {
    badges.classList.remove("hidden");
  }
}

/**
 * Opens the assignee dropdown (without toggle).
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
 * Filters the assignee list based on search input.
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
 * Selects or deselects a contact.
 * @param {Event} event - The click event
 * @param {string} contactId - The ID of the contact
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
 * Closes the dropdown when clicking outside.
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
