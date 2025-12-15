/**
 * @fileoverview Add Task Page Controller
 * @description Verwaltet die Task-Erstellung auf der Add Task-Seite
 */

/** @type {HTMLFormElement|null} Das Formular-Element */
let addTaskForm = null;

/** @type {HTMLElement[]} Array der Priority-Button-Elemente */
let addTaskPriorityButtons = [];

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
    subtasks: [...pageSubtasks],
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
    resetPageCategory();
    resetPageSubtasks();
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
    subtasks: formData.subtasks || [],
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
  try {
    const formData = getAddTaskFormData();
    const taskData = buildTaskData(
      formData,
      currentUser?.email || "guest@guest.local"
    );
    await createTask(taskData);
    clearAddTaskForm();
    showSuccessMessage();
    setTimeout(() => {
      window.location.href = "html/board.html";
    }, 1500);
  } catch (error) {
    console.error("Error creating task:", error);
    alert("Task could not be created. Please try again.");
  }
}

// Initialisierung beim Laden der Seite
document.addEventListener("DOMContentLoaded", initAddTaskPage);
