/**
 * @fileoverview Contacts Page Controller
 * @description Manages the contacts page functionality including loading, selecting, and displaying contacts.
 * @module Contacts/Main
 */

/**
 * Active contact list (loaded from Firebase on init - global for all users)
 */
let contacts = [];

/**
 * ID of the currently selected contact (null = no contact selected)
 */
let selectedContactId = null;

/**
 * Initializes the contacts page (async for Firebase queries)
 * Loads global contacts from Firebase (for all users including guests)
 */
async function initContacts() {
  try {
    contacts = await fetchContacts();
  } catch (err) {
    console.error("Failed to load contacts:", err);
    contacts = [];
  }
  renderContactList();
  renderContactDetails(null);
}

/**
 * Toggles mobile view to show contact details.
 */
function showMobileContactDetails() {
  if (window.innerWidth >= 870) return;
  const contactsRight = document.querySelector(".contacts-right");
  const contactsLeft = document.querySelector(".contacts-left");
  if (contactsRight) {
    contactsRight.classList.add("show");
    contactsRight.classList.remove("close");
    contactsLeft.classList.add("close");
    contactsLeft.classList.remove("show");
  }
}

/**
 * Selects a contact and displays its details.
 *
 * @param {string} contactId - ID of the contact
 */
function selectContact(contactId) {
  selectedContactId = contactId;
  const contact = contacts.find((c) => c.id === contactId);
  renderContactDetails(contact);
  highlightSelectedContact(contactId);
  showMobileContactDetails();
}

/**
 * Highlights the selected contact in the list
 * @param {string} contactId - ID of the selected contact
 */
function highlightSelectedContact(contactId) {
  let entries = document.querySelectorAll(".contact-list-entry");
  for (let i = 0; i < entries.length; i++) {
    entries[i].classList.remove("selected");
  }
  let selectedEntry = document.querySelector(
    `.contact-list-entry[data-contact-id="${contactId}"]`
  );
  if (selectedEntry) {
    selectedEntry.classList.add("selected");
  }
}

/**
 * Generates initials from a full name
 * @param {string} name - Full name (e.g., "Anton Mayer")
 * @returns {string} Initials (e.g., "AM")
 */
function getInitials(name) {
  let nameParts = name.split(" ");
  let initials = "";
  for (let i = 0; i < nameParts.length && i < 2; i++) {
    initials += nameParts[i].charAt(0).toUpperCase();
  }
  return initials;
}

/**
 * Sorts contacts alphabetically by name.
 *
 * @param {Array} contactList - Array of contact objects
 * @returns {Array} Sorted array of contacts
 */
function sortContactsByName(contactList) {
  return contactList.slice().sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Groups contacts alphabetically by the first letter of their name.
 *
 * @param {Array} contactList - Array of contact objects
 * @returns {Object} Object with letters as keys and arrays of contacts as values
 */
function groupContactsByLetter(contactList) {
  const sortedContacts = sortContactsByName(contactList);
  const grouped = {};
  for (let i = 0; i < sortedContacts.length; i++) {
    const contact = sortedContacts[i];
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) grouped[firstLetter] = [];
    grouped[firstLetter].push(contact);
  }
  return grouped;
}

/**
 * Deletes a contact from the details view
 * @param {string} contactId - ID of the contact to delete
 */
async function deleteContactFromDetails(contactId) {
  try {
    await deleteContactFromDb(contactId);
    contacts = contacts.filter((c) => c.id !== contactId);
    renderContactList();
    renderContactDetails(null);
    selectedContactId = null;
  } catch (err) {
    console.error("Failed to delete contact:", err);
    alert("Fehler beim Löschen des Kontakts.");
  }
}

/**
 * Navigates back to the contact list (mobile view)
 */
function backToContactList() {
  if (window.innerWidth < 870) {
    const contactsRight = document.querySelector(".contacts-right");
    const contactsLeft = document.querySelector(".contacts-left");
    if (contactsRight) {
      contactsRight.classList.add("close");
      contactsRight.classList.remove("show");
      contactsLeft.classList.add("show");
      contactsLeft.classList.remove("close");
    }
  }
}

/**
 * Shows the responsive edit/delete menu on click
 */
function showDetails() {
  const actionsResponsive = document.querySelector(
    ".contacts-details-actions-responsive"
  );
  if (actionsResponsive) {
    actionsResponsive.classList.add("show");
  }
}

/**
 * Closes the responsive edit/delete menu when clicking outside
 */
document.addEventListener("mousedown", function handleClickOutside(event) {
  const actionsContainer = document.querySelector(
    ".contacts-details-actions-responsive"
  );
  if (
    actionsContainer &&
    actionsContainer.classList.contains("show") &&
    !actionsContainer.contains(event.target)
  ) {
    actionsContainer.classList.remove("show");
  }
});
