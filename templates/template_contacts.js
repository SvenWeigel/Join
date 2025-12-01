/**
 * Generates the HTML template for a letter separator with divider line
 * @param {string} letter - The letter to display (e.g., "A")
 * @returns {string} HTML string for the letter separator
 */
function getLetterSeparatorTemplate(letter) {
  return `
    <div class="letter-separator">
      <span class="letter-separator-letter">${letter}</span>
      <div class="letter-separator-line"></div>
    </div>
  `;
}

/**
 * Generates the HTML template for a single contact list entry
 * @param {Object} contact - Contact object with name, email, phone, color
 * @returns {string} HTML string for the contact entry
 */
function getContactListEntryTemplate(contact) {
  let initials = getInitials(contact.name);
  return `
    <div class="contact-list-entry">
      <div class="contact-avatar" style="background-color: ${contact.color}">${initials}</div>
      <div class="contact-info">
        <div class="contact-name">${contact.name}</div>
        <div class="contact-email">${contact.email}</div>
      </div>
    </div>
  `;
}
