/**
 * @fileoverview Board Modal Controller
 * @description Verwaltet die Add Task Modal-Funktionalität auf der Board-Seite
 */

/** @type {HTMLElement|null} */
let overlay = null;
/** @type {HTMLFormElement|null} */
let form = null;
/** @type {HTMLElement[]} */
let priorityButtons = [];

/**
 * Initialisiert das Modal beim Laden der Seite.
 */
async function initModal() {
  cacheElements();
  bindEvents();
  await loadModalContactsForDropdown();
}

/**
 * Cached alle benötigten DOM-Elemente.
 */
function cacheElements() {
  overlay = document.getElementById("addTaskModalOverlay");
  form = document.getElementById("addTaskForm");
  priorityButtons = Array.from(document.querySelectorAll(".priority-btn"));
}

/**
 * Bindet alle Event-Listener für das Modal.
 */
function bindEvents() {
  bindOpenButton();
  bindCloseButtons();
  bindOverlayClick();
  bindEscapeKey();
  bindPriorityButtons();
  bindFormSubmit();
}

/**
 * Bindet den Click-Event an den "Add Task"-Button.
 */
function bindOpenButton() {
  const openBtn = document.getElementById("addTaskBtn");
  if (openBtn) openBtn.addEventListener("click", handleOpenClick);
}

/**
 * Behandelt den Klick auf den Open-Button.
 * @param {Event} e
 */
function handleOpenClick(e) {
  e.preventDefault();
  openModal();
}

/**
 * Bindet Click-Events an die Schließen-Buttons.
 */
function bindCloseButtons() {
  const closeBtn = document.getElementById("closeAddTaskBtn");
  const cancelBtn = document.getElementById("cancelAddTask");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
}

/**
 * Bindet den Click-Event an das Overlay.
 */
function bindOverlayClick() {
  if (overlay) overlay.addEventListener("click", handleOverlayClick);
}

/**
 * Behandelt Klicks auf das Overlay.
 * @param {Event} e
 */
function handleOverlayClick(e) {
  if (e.target === overlay) closeModal();
}

/**
 * Bindet den Escape-Tasten-Listener.
 */
function bindEscapeKey() {
  document.addEventListener("keydown", handleEscapeKey);
}

/**
 * Behandelt Escape-Tastendruck.
 * @param {Event} e
 */
function handleEscapeKey(e) {
  if (e.key === "Escape" && isModalOpen()) closeModal();
}

/**
 * Bindet Click-Events an alle Priority-Buttons.
 */
function bindPriorityButtons() {
  priorityButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectPriority(btn));
  });
}

/**
 * Bindet den Submit-Event an das Formular.
 */
function bindFormSubmit() {
  if (form) form.addEventListener("submit", handleSubmit);
}

/**
 * Öffnet das Modal.
 */
function openModal() {
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  focusFirstInput();
  renderModalAssigneeDropdown();
}

/**
 * Schließt das Modal.
 */
function closeModal() {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  resetPriority();
  resetModalAssignees();
}

/**
 * Prüft ob das Modal geöffnet ist.
 * @returns {boolean}
 */
function isModalOpen() {
  return overlay?.classList.contains("open");
}

/**
 * Fokussiert das erste Eingabefeld.
 */
function focusFirstInput() {
  const firstInput = document.getElementById("taskTitle");
  setTimeout(() => firstInput?.focus(), 50);
}

/**
 * Wählt einen Priority-Button aus.
 * @param {HTMLElement} selectedBtn
 */
function selectPriority(selectedBtn) {
  priorityButtons.forEach((btn) => btn.classList.remove("active"));
  selectedBtn.classList.add("active");
}

/**
 * Setzt die Priority auf "Medium" zurück.
 */
function resetPriority() {
  priorityButtons.forEach((btn) => btn.classList.remove("active"));
  const defaultBtn = document.querySelector(
    '.priority-btn[data-priority="medium"]'
  );
  if (defaultBtn) defaultBtn.classList.add("active");
}

/**
 * Ermittelt die ausgewählte Priorität.
 * @returns {string}
 */
function getSelectedPriority() {
  return (
    document.querySelector(".priority-btn.active")?.dataset?.priority ||
    "medium"
  );
}

/**
 * Sammelt alle Formulardaten.
 * @returns {Object}
 */
function getFormData() {
  return {
    title: form.title.value,
    description: form.description.value,
    due: form.due.value,
    priority: getSelectedPriority(),
    category: form.category.value,
    subtasks: form.subtasks.value,
  };
}

/**
 * Prüft ob der User ein Gast ist.
 * @param {Object|null} user
 * @returns {boolean}
 */
function isGuestOrNoUser(user) {
  return !user || user.guest;
}

/**
 * Erstellt das Task-Objekt für Firebase.
 * @param {Object} formData
 * @param {string} email
 * @returns {Object}
 */
function buildTaskData(formData, email) {
  return {
    title: formData.title,
    description: formData.description || "",
    dueDate: formData.due,
    priority: formData.priority,
    assignees: getModalAssigneesWithData(modalSelectedAssignees),
    category: formData.category,
    status: "todo",
    subtasks: formData.subtasks
      ? [{ title: formData.subtasks, completed: false }]
      : [],
    createdBy: email,
  };
}

/**
 * Verarbeitet die Formular-Übermittlung.
 * @param {Event} e
 */
async function handleSubmit(e) {
  e.preventDefault();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (isGuestOrNoUser(currentUser)) {
    alert("As a guest, you cannot create tasks. Please register or log in.");
    return;
  }
  await submitTask(currentUser);
}

/**
 * Speichert den Task und aktualisiert das Board.
 * @param {Object} currentUser
 */
async function submitTask(currentUser) {
  try {
    const taskData = buildTaskData(getFormData(), currentUser.email);
    await createTask(taskData);
    resetFormAndClose();
    if (typeof renderAllTasks === "function") await renderAllTasks();
  } catch (error) {
    console.error("Error creating task:", error);
    alert("Task could not be created. Please try again.");
  }
}

/**
 * Setzt das Formular zurück und schließt das Modal.
 */
function resetFormAndClose() {
  closeModal();
  form.reset();
  resetPriority();
  resetModalAssignees();
}

document.addEventListener("DOMContentLoaded", initModal);
