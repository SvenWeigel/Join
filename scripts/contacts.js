/**
 * Demo-Kontakte für Gast-User (werden in localStorage gespeichert)
 */
const GUEST_DEFAULT_CONTACTS = [
  {
    id: "guest-1",
    name: "Max Mustermann",
    email: "max.mustermann@beispiel.de",
    phone: "+49 170 1234567",
    color: "#FF7A00",
  },
  {
    id: "guest-2",
    name: "Laura Schmidt",
    email: "laura.schmidt@mail.de",
    phone: "+49 151 9876543",
    color: "#9327FF",
  },
  {
    id: "guest-3",
    name: "Thomas Weber",
    email: "t.weber@firma.de",
    phone: "+49 160 5551234",
    color: "#6E52FF",
  },
  {
    id: "guest-4",
    name: "Anna Becker",
    email: "anna.becker@web.de",
    phone: "+49 172 3334455",
    color: "#FC71FF",
  },
  {
    id: "guest-5",
    name: "Stefan Hoffmann",
    email: "s.hoffmann@business.de",
    phone: "+49 155 7778899",
    color: "#1FD7C1",
  },
  {
    id: "guest-6",
    name: "Julia Klein",
    email: "julia.klein@email.de",
    phone: "+49 163 2223344",
    color: "#FF4646",
  },
];

/**
 * Aktive Kontaktliste (wird beim Init aus Firebase oder localStorage geladen)
 */
let contacts = [];

/**
 * ID des aktuell ausgewählten Kontakts (null = kein Kontakt ausgewählt)
 */
let selectedContactId = null;

/**
 * Prüft ob der aktuelle User ein Gast ist
 * @returns {boolean}
 */
function isGuestUser() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return !currentUser || currentUser.guest === true;
}

/**
 * Gibt die User-ID des aktuellen Users zurück
 * @returns {string|null}
 */
function getCurrentUserId() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return null;
  if (currentUser.id) return currentUser.id;

  // Fallback: Wenn keine ID vorhanden, User neu einloggen lassen
  console.warn("User hat keine ID - bitte neu einloggen");
  return null;
}

/**
 * Lädt Kontakte aus localStorage für Gast-User
 * @returns {Array}
 */
function loadGuestContacts() {
  const stored = localStorage.getItem("guestContacts");
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialisiere mit Demo-Daten
  localStorage.setItem("guestContacts", JSON.stringify(GUEST_DEFAULT_CONTACTS));
  return [...GUEST_DEFAULT_CONTACTS];
}

/**
 * Speichert Kontakte in localStorage für Gast-User
 */
function saveGuestContacts() {
  localStorage.setItem("guestContacts", JSON.stringify(contacts));
}

/**
 * Initializes the contacts page (async für Firebase-Abfragen)
 */
async function initContacts() {
  if (isGuestUser()) {
    contacts = loadGuestContacts();
  } else {
    const userId = getCurrentUserId();
    if (userId) {
      try {
        contacts = await fetchContacts(userId);
      } catch (err) {
        console.error("Failed to load contacts:", err);
        contacts = [];
      }
    } else {
      contacts = [];
    }
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
  if (isGuestUser()) {
    alert("As a guest, you cannot delete contacts. Please sign up.");
    return;
  }

  try {
    const userId = getCurrentUserId();
    if (userId) {
      await deleteContactFromDb(userId, contactId);
      contacts = contacts.filter((c) => c.id !== contactId);
    }
    renderContactList();
    renderContactDetails(null);
    selectedContactId = null;
  } catch (err) {
    console.error("Failed to delete contact:", err);
    alert("Fehler beim Löschen des Kontakts.");
  }
}
