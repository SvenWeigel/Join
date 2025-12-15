/**
 * Aktive Kontaktliste (wird beim Init aus Firebase geladen - global für alle User)
 */
let contacts = [];

/**
 * ID des aktuell ausgewählten Kontakts (null = kein Kontakt ausgewählt)
 */
let selectedContactId = null;

/**
 * Initializes the contacts page (async für Firebase-Abfragen)
 * Lädt globale Kontakte aus Firebase (für alle User inkl. Gäste)
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
 * Selects a contact and displays its details
 * @param {string} contactId - ID of the contact
 */
function selectContact(contactId) {
  selectedContactId = contactId;
  const contact = contacts.find((c) => c.id === contactId);
  renderContactDetails(contact);
  highlightSelectedContact(contactId);

  // Klasse für mobile Ansicht hinzufügen
  if (window.innerWidth < 870) {
    const contactsRight = document.querySelector(".contacts-right");
    const contactsLeft = document.querySelector(".contacts-left");
    if (contactsRight) {
      contactsRight.classList.add("show");
      contactsRight.classList.remove("close");
      contactsLeft.classList.add("close");
      contactsLeft.classList.remove("show");
    }
  }
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
 * Groups contacts alphabetically by the first letter of their name
 * @param {Array} contactList - Array of contact objects
 * @returns {Object} Object with letters as keys and arrays of contacts as values
 */
function groupContactsByLetter(contactList) {
  let sortedContacts = contactList
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  let grouped = {};
  for (let i = 0; i < sortedContacts.length; i++) {
    let contact = sortedContacts[i];
    let firstLetter = contact.name.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
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

//Responsiv: Edit/Delete Menü bei onclick öffnen
function showDetails() {
  const actionsResponsive = document.querySelector(
    ".contacts-details-actions-responsive"
  );
  if (actionsResponsive) {
    actionsResponsive.classList.add("show");
  }
}

//Responsiv: Edit/Delete Menü beim Klick außerhalb schließen
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
