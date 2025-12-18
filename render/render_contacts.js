/**
 * @fileoverview Contacts Render Functions
 * @description Render functions for displaying the contact list with alphabetical grouping.
 */

/**
 * Renders the contact list with alphabetical separators
 */
function renderContactList() {
  let contactsListElement = document.querySelector(".contacts-list");
  let groupedContacts = groupContactsByLetter(contacts);
  let letters = Object.keys(groupedContacts).sort();
  let html = "";
  for (let i = 0; i < letters.length; i++) {
    let letter = letters[i];
    html += getLetterSeparatorTemplate(letter);
    let contactsInGroup = groupedContacts[letter];
    for (let j = 0; j < contactsInGroup.length; j++) {
      let contact = contactsInGroup[j];
      html += getContactListEntryTemplate(contact);
    }
  }
  contactsListElement.innerHTML = html;
}

/**
 * Renders the contact details view
 * @param {Object} contact - Contact object to display, or null to clear
 */
function renderContactDetails(contact) {
  let detailsContainer = document.querySelector(".contact-details-container");
  if (contact) {
    detailsContainer.classList.remove("slide-in");
    void detailsContainer.offsetWidth;
    detailsContainer.innerHTML = getContactDetailsTemplate(contact);
    detailsContainer.classList.add("slide-in");
  } else {
    detailsContainer.innerHTML = "";
    detailsContainer.classList.remove("slide-in");
  }
}
