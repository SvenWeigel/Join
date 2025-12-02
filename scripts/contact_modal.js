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
}

/**
 * Handles the Add Contact form submission
 * @param {Event} event - The form submit event
 */
function handleAddContact(event) {
  event.preventDefault();
  let name = document.getElementById("contactName").value.trim();
  let email = document.getElementById("contactEmail").value.trim();
  let phone = document.getElementById("contactPhone").value.trim();
  let color = getRandomColor();
  let newContact = { name, email, phone, color };
  contacts.push(newContact);
  renderContactList();
  closeAddContactModal();
  selectContact(contacts.length - 1);
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
 * Index des aktuell bearbeiteten Kontakts
 */
let editingContactIndex = -1;

/**
 * Opens the Edit Contact Modal with pre-filled data
 * @param {number} index - Index of the contact to edit
 */
function openEditContactModal(index) {
  editingContactIndex = index;
  let contact = contacts[index];
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
  editingContactIndex = -1;
}

/**
 * Handles the Edit Contact form submission
 * @param {Event} event - The form submit event
 */
function handleEditContact(event) {
  event.preventDefault();
  if (editingContactIndex < 0) return;

  let name = document.getElementById("editContactName").value.trim();
  let email = document.getElementById("editContactEmail").value.trim();
  let phone = document.getElementById("editContactPhone").value.trim();

  // Kontakt aktualisieren (Farbe bleibt erhalten)
  contacts[editingContactIndex].name = name;
  contacts[editingContactIndex].email = email;
  contacts[editingContactIndex].phone = phone;

  renderContactList();
  closeEditContactModal();
  selectContact(editingContactIndex);
}

/**
 * Handles the delete action from the Edit Modal
 */
function handleDeleteContact() {
  if (editingContactIndex < 0) return;

  contacts.splice(editingContactIndex, 1);
  renderContactList();
  closeEditContactModal();
  renderContactDetails(null);
  selectedContactIndex = -1;
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
