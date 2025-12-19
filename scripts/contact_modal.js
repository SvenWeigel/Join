/**
 * @fileoverview Contact Modal Controller
 * @description Manages the add and edit contact modal dialogs including form handling and validation.
 * @module Contacts/Modal
 */

/**
 * Opens the Add Contact Modal
 */
function openAddContactModal() {
  let overlay = document.getElementById("addContactModalOverlay");
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

/**
 * Closes the Add Contact Modal
 */
function closeAddContactModal() {
  let overlay = document.getElementById("addContactModalOverlay");
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  resetAddContactForm();
}

/**
 * Clears the contact form input fields.
 *
 * @param {string} nameId - ID of the name input
 * @param {string} emailId - ID of the email input
 * @param {string} phoneId - ID of the phone input
 */
function clearContactInputs(nameId, emailId, phoneId) {
  const nameInput = document.getElementById(nameId);
  const emailInput = document.getElementById(emailId);
  const phoneInput = document.getElementById(phoneId);
  if (nameInput) nameInput.value = "";
  if (emailInput) emailInput.value = "";
  if (phoneInput) phoneInput.value = "";
}

/**
 * Resets the Add Contact form fields.
 */
function resetAddContactForm() {
  const form = document.getElementById("addContactForm");
  if (form) form.reset();
  clearContactInputs("contactName", "contactEmail", "contactPhone");
}

/**
 * Collects data from the Add Contact form.
 *
 * @returns {Object} The contact data object
 */
function getAddContactFormData() {
  return {
    name: document.getElementById("contactName").value.trim(),
    email: document.getElementById("contactEmail").value.trim(),
    phone: document.getElementById("contactPhone").value.trim(),
    color: getRandomColor(),
  };
}

/**
 * Handles the Add Contact form submission.
 *
 * @param {Event} event - The form submit event
 */
async function handleAddContact(event) {
  event.preventDefault();
  const newContact = getAddContactFormData();

  try {
    const savedContact = await createContact(newContact);
    contacts.push(savedContact);
    renderContactList();
    closeAddContactModal();
    selectContact(savedContact.id);
  } catch (err) {
    console.error("Failed to create contact:", err);
    alert("Fehler beim Erstellen des Kontakts.");
  }
}

/**
 * Generates a random color for new contacts
 * @returns {string} A hex color code
 */
function getRandomColor() {
  let colors = [
    "#FF7A00",
    "#9327FF",
    "#6E52FF",
    "#FC71FF",
    "#FFBB2B",
    "#1FD7C1",
    "#462F8A",
    "#FF4646",
    "#00BEE8",
    "#FF745E",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Closes modal when clicking on overlay background
 */
document.addEventListener("click", function (event) {
  let overlay = document.getElementById("addContactModalOverlay");
  if (event.target === overlay) {
    closeAddContactModal();
  }
});

/**
 * Closes modal when pressing Escape key
 */
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    let addOverlay = document.getElementById("addContactModalOverlay");
    if (addOverlay && addOverlay.classList.contains("open")) {
      closeAddContactModal();
    }
    let editOverlay = document.getElementById("editContactModalOverlay");
    if (editOverlay && editOverlay.classList.contains("open")) {
      closeEditContactModal();
    }
  }
});

/**
 * ID of the currently edited contact
 */
let editingContactId = null;

/**
 * Fills the edit form with contact data.
 *
 * @param {Object} contact - The contact object
 */
function fillEditContactForm(contact) {
  document.getElementById("editContactName").value = contact.name;
  document.getElementById("editContactEmail").value = contact.email;
  document.getElementById("editContactPhone").value = contact.phone || "";
}

/**
 * Updates the edit modal badge with contact initials and color.
 *
 * @param {Object} contact - The contact object
 */
function updateEditContactBadge(contact) {
  const badge = document.getElementById("editContactBadge");
  badge.textContent = getInitials(contact.name);
  badge.style.backgroundColor = contact.color;
}

/**
 * Opens the Edit Contact Modal with pre-filled data.
 *
 * @param {string} contactId - ID of the contact to edit
 */
function openEditContactModal(contactId) {
  editingContactId = contactId;
  const contact = contacts.find((c) => c.id === contactId);
  if (!contact) return;

  fillEditContactForm(contact);
  updateEditContactBadge(contact);

  const overlay = document.getElementById("editContactModalOverlay");
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

/**
 * Closes the Edit Contact Modal
 */
function closeEditContactModal() {
  let overlay = document.getElementById("editContactModalOverlay");
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  editingContactId = null;
}

/**
 * Collects data from the Edit Contact form.
 *
 * @returns {Object} The updated contact data
 */
function getEditContactFormData() {
  return {
    name: document.getElementById("editContactName").value.trim(),
    email: document.getElementById("editContactEmail").value.trim(),
    phone: document.getElementById("editContactPhone").value.trim(),
  };
}

/**
 * Updates the local contact object with new data.
 *
 * @param {string} contactId - The contact ID
 * @param {Object} updateData - The updated data
 */
function updateLocalContact(contactId, updateData) {
  const contact = contacts.find((c) => c.id === contactId);
  if (contact) {
    contact.name = updateData.name;
    contact.email = updateData.email;
    contact.phone = updateData.phone;
  }
}

/**
 * Handles the Edit Contact form submission.
 *
 * @param {Event} event - The form submit event
 */
async function handleEditContact(event) {
  event.preventDefault();
  if (!editingContactId) return;

  const updateData = getEditContactFormData();
  try {
    await updateContactInDb(editingContactId, updateData);
    updateLocalContact(editingContactId, updateData);
    const contactIdToSelect = editingContactId;
    renderContactList();
    closeEditContactModal();
    selectContact(contactIdToSelect);
  } catch (err) {
    console.error("Failed to update contact:", err);
    alert("Fehler beim Aktualisieren des Kontakts.");
  }
}

/**
 * Handles the delete action from the Edit Modal
 */
async function handleDeleteContact() {
  if (!editingContactId) return;

  try {
    await deleteContactFromDb(editingContactId);
    contacts = contacts.filter((c) => c.id !== editingContactId);
    renderContactList();
    closeEditContactModal();
    renderContactDetails(null);
    selectedContactId = null;
  } catch (err) {
    console.error("Failed to delete contact:", err);
    alert("Fehler beim Löschen des Kontakts.");
  }
}

/**
 * Closes Edit modal when clicking on overlay background
 */
document.addEventListener("click", function (event) {
  let editOverlay = document.getElementById("editContactModalOverlay");
  if (event.target === editOverlay) {
    closeEditContactModal();
  }
});
