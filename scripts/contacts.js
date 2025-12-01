/**
 * Static contact data for testing
 */
let contacts = [
  {
    name: "Anton Mayer",
    email: "antonm@gmail.com",
    phone: "+49 1111 111 11 1",
    color: "#FF7A00",
  },
  {
    name: "Anja Schulz",
    email: "schulz@hotmail.com",
    phone: "+49 2222 222 22 2",
    color: "#9327FF",
  },
  {
    name: "Benedikt Ziegler",
    email: "benedikt@gmail.com",
    phone: "+49 3333 333 33 3",
    color: "#6E52FF",
  },
  {
    name: "David Eisenberg",
    email: "davidberg@gmail.com",
    phone: "+49 4444 444 44 4",
    color: "#FC71FF",
  },
  {
    name: "Eva Fischer",
    email: "eva@gmail.com",
    phone: "+49 5555 555 55 5",
    color: "#FFBB2B",
  },
  {
    name: "Emmanuel Mauer",
    email: "emmanuelma@gmail.com",
    phone: "+49 6666 666 66 6",
    color: "#1FD7C1",
  },
  {
    name: "Marcel Bauer",
    email: "bauer@gmail.com",
    phone: "+49 7777 777 77 7",
    color: "#462F8A",
  },
];

/**
 * Currently selected contact index (-1 means no contact selected)
 */
let selectedContactIndex = -1;

/**
 * Initializes the contacts page
 */
function initContacts() {
  renderContactList();
  renderContactDetails(null);
}

/**
 * Selects a contact and displays its details
 * @param {number} index - Index of the contact in the contacts array
 */
function selectContact(index) {
  selectedContactIndex = index;
  renderContactDetails(contacts[index]);
  highlightSelectedContact(index);
}

/**
 * Highlights the selected contact in the list
 * @param {number} index - Index of the selected contact
 */
function highlightSelectedContact(index) {
  let entries = document.querySelectorAll(".contact-list-entry");
  for (let i = 0; i < entries.length; i++) {
    entries[i].classList.remove("selected");
  }
  let selectedEntry = document.querySelector(
    `.contact-list-entry[onclick="selectContact(${index})"]`
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
