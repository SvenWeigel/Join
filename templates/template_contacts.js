/**
 * Generates the HTML template for a letter separator with divider line
 * @param {string} letter - The letter to display (e.g., "A")
 * @returns {string} HTML string for the letter separator
 */
function getLetterSeparatorTemplate(letter) {
  return `
    <div class="letter-separator">
      <span class="letter-separator-letter">${letter}</span>
    </div>
    <div class="letter-separator-line"></div>
  `;
}

/**
 * Generates the HTML template for a single contact list entry
 * @param {Object} contact - Contact object with name, email, phone, color
 * @param {number} index - Index of the contact in the array
 * @returns {string} HTML string for the contact entry
 */
function getContactListEntryTemplate(contact, index) {
  let initials = getInitials(contact.name);
  return `
    <div class="contact-list-entry" onclick="selectContact(${index})">
      <div class="contact-avatar" style="background-color: ${contact.color}">${initials}</div>
      <div class="contact-info">
        <div class="contact-name">${contact.name}</div>
        <div class="contact-email">${contact.email}</div>
      </div>
    </div>
  `;
}

/**
 * Generates the HTML template for contact details view
 * @param {Object} contact - Contact object with name, email, phone, color
 * @returns {string} HTML string for the contact details
 */
function getContactDetailsTemplate(contact) {
  let initials = getInitials(contact.name);
  return `
    <div class="contact-details">
      <div class="contacts-details-avatar" style="background-color: ${contact.color}">${initials}</div>
      <div class="contacts-details-name-row">
        <span class="contacts-details-name">${contact.name}</span>
        <div class="contacts-details-actions">
          <button class="edit-btn">
            <img src="/assets/icons/edit.svg" alt="Edit" title="Edit" class="contacts-details-action-icon" />
            <span>Edit</span>
          </button>
          <button class="del-btn">
            <img src="/assets/icons/delete.svg" alt="Delete" title="Delete" class="contacts-details-action-icon" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
    <div class="contacts-details-info">
      <h4>Contact Information</h4>
    </div>
    <div class="mail-and-phone-container">
      <span>Email</span>
      <a href="mailto:${contact.email}">${contact.email}</a>
      <span>Phone</span>
      <span id="phone-number">${contact.phone}</span>
    </div>
  `;
}
