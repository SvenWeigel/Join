/**
 * @fileoverview Add Task Page Controller
 * @description Verwaltet die Task-Erstellung auf der Add Task-Seite
 */

/** @type {HTMLFormElement|null} Das Formular-Element */
let addTaskForm = null;

/** @type {HTMLElement[]} Array der Priority-Button-Elemente */
let addTaskPriorityButtons = [];

/** @type {Object[]} Array der verfügbaren Kontakte */
let availableContacts = [];

/** @type {string[]} Array der ausgewählten Kontakt-IDs */
let selectedAssignees = [];

/**
 * Initialisiert die Add Task-Seite beim Laden.
 * Cached DOM-Elemente und bindet alle Event-Listener.
 */
async function initAddTaskPage() {
  cacheAddTaskElements();
  bindAddTaskEvents();
  await loadContactsForDropdown();
}

/**
 * Lädt die Kontakte für das Dropdown-Menü.
 */
async function loadContactsForDropdown() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    availableContacts = [];
    renderAssigneeDropdown();
    return;
  }

  // Für Gäste: Demo-Kontakte aus localStorage laden
  if (currentUser.guest) {
    const guestContacts = localStorage.getItem("guestContacts");
    if (guestContacts) {
      availableContacts = JSON.parse(guestContacts);
    } else {
      availableContacts = [];
    }
    renderAssigneeDropdown();
    return;
  }

  try {
    availableContacts = await fetchContacts(currentUser.id);
    renderAssigneeDropdown();
  } catch (error) {
    console.error("Error loading contacts:", error);
    availableContacts = [];
    renderAssigneeDropdown();
  }
}

/**
 * Ermittelt die Initialen aus einem Namen.
 */
function getInitialsFromName(name) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Öffnet/Schließt das Assignee-Dropdown.
 */
function toggleAssigneeDropdown() {
  const dropdown = document.getElementById("assigneeDropdown");
  const list = document.getElementById("assigneeList");
  const arrow = dropdown.querySelector(".dropdown-arrow");
  const badges = document.getElementById("selectedContactsBadges");

  list.classList.toggle("open");
  arrow.classList.toggle("open");

  // Badges verstecken wenn Dropdown offen, anzeigen wenn geschlossen
  if (list.classList.contains("open")) {
    badges.classList.add("hidden");
  } else {
    badges.classList.remove("hidden");
  }
}

/**
 * Öffnet das Assignee-Dropdown (ohne Toggle).
 */
function openAssigneeDropdown() {
  const list = document.getElementById("assigneeList");
  const arrow = document.querySelector(".dropdown-arrow");
  const badges = document.getElementById("selectedContactsBadges");

  if (!list.classList.contains("open")) {
    list.classList.add("open");
    arrow.classList.add("open");
    badges.classList.add("hidden");
  }
}

/**
 * Filtert die Assignee-Liste basierend auf der Sucheingabe.
 */
function filterAssigneeList() {
  const searchInput = document.getElementById("assigneeSearch");
  const filter = searchInput.value;
  renderAssigneeDropdown(filter);

  const list = document.getElementById("assigneeList");
  const arrow = document.querySelector(".dropdown-arrow");
  if (!list.classList.contains("open")) {
    list.classList.add("open");
    arrow.classList.add("open");
  }
}

/**
 * Wählt einen Kontakt aus oder ab.
 * @param {Event} event - Das Click-Event
 * @param {string} contactId - Die ID des Kontakts
 */
function toggleAssignee(event, contactId) {
  event.stopPropagation();
  const index = selectedAssignees.indexOf(contactId);
  if (index > -1) {
    selectedAssignees.splice(index, 1);
  } else {
    selectedAssignees.push(contactId);
  }
  renderAssigneeDropdown(document.getElementById("assigneeSearch").value);
  renderSelectedContactsBadges();
}

/**
 * Schließt das Dropdown wenn außerhalb geklickt wird.
 */
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("assigneeDropdown");
  if (dropdown && !dropdown.contains(event.target)) {
    const list = document.getElementById("assigneeList");
    const arrow = dropdown.querySelector(".dropdown-arrow");
    const badges = document.getElementById("selectedContactsBadges");

    if (list && list.classList.contains("open")) {
      list.classList.remove("open");
      if (arrow) arrow.classList.remove("open");
      if (badges) badges.classList.remove("hidden");
    }
  }
});

/**
 * Cached alle benötigten DOM-Elemente in Variablen.
 */
function cacheAddTaskElements() {
  addTaskForm = document.getElementById("addTaskFormPage");
  addTaskPriorityButtons = Array.from(
    document.querySelectorAll(".priority-btn")
  );
}

/**
 * Bindet alle Event-Listener für die Add Task-Seite.
 */
function bindAddTaskEvents() {
  bindAddTaskPriorityButtons();
  bindAddTaskFormSubmit();
  bindClearButton();
}

/**
 * Bindet Click-Event-Listener an alle Priority-Buttons.
 */
function bindAddTaskPriorityButtons() {
  addTaskPriorityButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectAddTaskPriority(btn));
  });
}

/**
 * Bindet den Submit-Event-Listener an das Formular.
 */
function bindAddTaskFormSubmit() {
  if (addTaskForm) {
    addTaskForm.addEventListener("submit", handleAddTaskSubmit);
  }
}

/**
 * Bindet den Click-Event-Listener an den Clear-Button.
 */
function bindClearButton() {
  const clearBtn = document.getElementById("clearTaskBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearAddTaskForm);
  }
}

/**
 * Wählt einen Priority-Button aus und markiert ihn als aktiv.
 * @param {HTMLElement} selectedBtn - Der ausgewählte Priority-Button
 */
function selectAddTaskPriority(selectedBtn) {
  addTaskPriorityButtons.forEach((btn) => btn.classList.remove("active"));
  selectedBtn.classList.add("active");
}

/**
 * Ermittelt die aktuell ausgewählte Priorität.
 * @returns {string} Die ausgewählte Priorität ("urgent", "medium" oder "low")
 */
function getAddTaskSelectedPriority() {
  return (
    document.querySelector(".priority-btn.active")?.dataset?.priority ||
    "medium"
  );
}

/**
 * Sammelt alle Formulardaten und gibt sie als Objekt zurück.
 * @returns {Object} Objekt mit allen Task-Daten
 */
function getAddTaskFormData() {
  return {
    title: addTaskForm.title.value,
    description: addTaskForm.description.value,
    due: addTaskForm.due.value,
    priority: getAddTaskSelectedPriority(),
    assignees: [...selectedAssignees],
    category: addTaskForm.category.value,
    subtasks: addTaskForm.subtasks.value,
  };
}

/**
 * Setzt die Priority-Auswahl auf den Standardwert "Medium" zurück.
 */
function resetAddTaskPriority() {
  addTaskPriorityButtons.forEach((btn) => btn.classList.remove("active"));
  const defaultBtn = document.querySelector(
    '.priority-btn[data-priority="medium"]'
  );
  if (defaultBtn) defaultBtn.classList.add("active");
}

/**
 * Leert das Formular und setzt die Priority zurück.
 */
function clearAddTaskForm() {
  if (addTaskForm) {
    addTaskForm.reset();
    resetAddTaskPriority();
    selectedAssignees = [];
    renderAssigneeDropdown();
    renderSelectedContactsBadges();
    const searchInput = document.getElementById("assigneeSearch");
    if (searchInput) searchInput.value = "";
  }
}

/**
 * Holt den aktuellen User aus dem localStorage.
 * @returns {Object|null} Der aktuelle User oder null
 */
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

/**
 * Prüft ob der User ein Gast ist und zeigt ggf. eine Meldung.
 * @param {Object|null} user - Der aktuelle User
 * @returns {boolean} True wenn Gast oder nicht eingeloggt
 */
function isGuestUser(user) {
  if (!user || user.guest) {
    alert("As a guest, you cannot create tasks. Please register or log in.");
    return true;
  }
  return false;
}

/**
 * Erstellt ein Task-Objekt aus den Formulardaten.
 * @param {Object} formData - Die gesammelten Formulardaten
 * @param {string} creatorEmail - E-Mail des Erstellers
 * @returns {Object} Das Task-Objekt für Firebase
 */
function buildTaskData(formData, creatorEmail) {
  return {
    title: formData.title,
    description: formData.description || "",
    dueDate: formData.due,
    priority: formData.priority,
    assignees: getAssigneesWithData(formData.assignees),
    category: formData.category,
    status: "todo",
    subtasks: formData.subtasks
      ? [{ title: formData.subtasks, completed: false }]
      : [],
    createdBy: creatorEmail,
  };
}

/**
 * Wandelt Assignee-IDs in vollständige Assignee-Objekte um.
 * @param {string[]} assigneeIds - Array der ausgewählten Kontakt-IDs
 * @returns {Object[]} Array von Objekten mit name und color
 */
function getAssigneesWithData(assigneeIds) {
  if (!assigneeIds || assigneeIds.length === 0) return [];

  const result = [];
  const currentUser = getCurrentUser();

  for (const id of assigneeIds) {
    if (id === "currentUser" && currentUser) {
      const userName = currentUser.name || currentUser.email.split("@")[0];
      result.push({ name: userName, color: "#29abe2" });
    } else {
      const contact = availableContacts.find((c) => c.id === id);
      if (contact) {
        result.push({ name: contact.name, color: contact.color });
      }
    }
  }

  return result;
}

/**
 * Zeigt eine Erfolgsmeldung an.
 */
function showSuccessMessage() {
  const successMsg = document.getElementById("taskSuccessMessage");
  if (successMsg) {
    successMsg.classList.add("show");
    setTimeout(() => successMsg.classList.remove("show"), 2000);
  }
}

/**
 * Verarbeitet die Formular-Übermittlung.
 * @param {Event} e - Das Submit-Event
 */
async function handleAddTaskSubmit(e) {
  e.preventDefault();
  const currentUser = getCurrentUser();
  if (isGuestUser(currentUser)) return;
  try {
    const formData = getAddTaskFormData();
    const taskData = buildTaskData(formData, currentUser.email);
    await createTask(taskData);
    clearAddTaskForm();
    showSuccessMessage();
  } catch (error) {
    console.error("Error creating task:", error);
    alert("Task could not be created. Please try again.");
  }
}

// Initialisierung beim Laden der Seite
document.addEventListener("DOMContentLoaded", initAddTaskPage);
