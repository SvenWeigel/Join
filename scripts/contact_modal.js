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
 * Resets the Add Contact form fields
 */
function resetAddContactForm() {
  let form = document.getElementById("addContactForm");
  if (form) {
    form.reset();
  }
  let nameInput = document.getElementById("contactName");
  let emailInput = document.getElementById("contactEmail");
  let phoneInput = document.getElementById("contactPhone");
  if (nameInput) nameInput.value = "";
  if (emailInput) emailInput.value = "";
  if (phoneInput) phoneInput.value = "";
}

/**
 * Handles the Add Contact form submission
 * @param {Event} event - The form submit event
 */
async function handleAddContact(event) {
  event.preventDefault();

  let name = document.getElementById("contactName").value.trim();
  let email = document.getElementById("contactEmail").value.trim();
  let phone = document.getElementById("contactPhone").value.trim();
  let color = getRandomColor();
  let newContact = { name, email, phone, color };

  try {
    const savedContact = await createContact(newContact);
    contacts.push(savedContact);
    newContact = savedContact;
    renderContactList();
    closeAddContactModal();
    selectContact(newContact.id);
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
 * ID des aktuell bearbeiteten Kontakts
 */
let editingContactId = null;

/**
 * Opens the Edit Contact Modal with pre-filled data
 * @param {string} contactId - ID of the contact to edit
 */
function openEditContactModal(contactId) {
  editingContactId = contactId;
  let contact = contacts.find((c) => c.id === contactId);
  if (!contact) return;
  let overlay = document.getElementById("editContactModalOverlay");

  // Felder mit Kontaktdaten füllen
  document.getElementById("editContactName").value = contact.name;
  document.getElementById("editContactEmail").value = contact.email;
  document.getElementById("editContactPhone").value = contact.phone || "";

  // Badge mit Initialen und Farbe aktualisieren
  let badge = document.getElementById("editContactBadge");
  badge.textContent = getInitials(contact.name);
  badge.style.backgroundColor = contact.color;

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
 * Handles the Edit Contact form submission
 * @param {Event} event - The form submit event
 */
async function handleEditContact(event) {
  event.preventDefault();
  if (!editingContactId) return;

  let name = document.getElementById("editContactName").value.trim();
  let email = document.getElementById("editContactEmail").value.trim();
  let phone = document.getElementById("editContactPhone").value.trim();

  const updateData = { name, email, phone };

  try {
    await updateContactInDb(editingContactId, updateData);
    let contact = contacts.find((c) => c.id === editingContactId);
    if (contact) {
      contact.name = name;
      contact.email = email;
      contact.phone = phone;
    }
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
