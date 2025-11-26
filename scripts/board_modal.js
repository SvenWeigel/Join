/**
 * @fileoverview Board Modal Controller
 * @description Verwaltet die Add Task Modal-Funktionalität auf der Board-Seite
 */

/** @type {HTMLElement|null} Das Modal-Overlay-Element */
let overlay = null;

/** @type {HTMLFormElement|null} Das Formular-Element im Modal */
let form = null;

/** @type {HTMLElement[]} Array der Priority-Button-Elemente */
let priorityButtons = [];

/**
 * Initialisiert das Modal beim Laden der Seite.
 * Cached DOM-Elemente und bindet alle Event-Listener.
 */
function initModal() {
  cacheElements();
  bindEvents();
}

/**
 * Cached alle benötigten DOM-Elemente in Variablen.
 * Verbessert die Performance durch Vermeidung wiederholter DOM-Abfragen.
 */
function cacheElements() {
  overlay = document.getElementById("addTaskModalOverlay");
  form = document.getElementById("addTaskForm");
  priorityButtons = Array.from(document.querySelectorAll(".priority-btn"));
}

/**
 * Bindet alle Event-Listener für das Modal.
 * Delegiert an spezialisierte Binding-Funktionen.
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
 * Bindet den Click-Event-Listener an den "Add Task"-Button.
 * Öffnet das Modal beim Klicken.
 */
function bindOpenButton() {
  const openBtn = document.getElementById("addTaskBtn");
  if (openBtn) {
    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  }
}

/**
 * Bindet Click-Event-Listener an die Schließen-Buttons.
 * Schließt das Modal bei Klick auf X oder Cancel.
 */
function bindCloseButtons() {
  const closeBtn = document.getElementById("closeAddTaskBtn");
  const cancelBtn = document.getElementById("cancelAddTask");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
}

/**
 * Bindet den Click-Event-Listener an das Overlay.
 * Schließt das Modal bei Klick außerhalb des Dialogs.
 */
function bindOverlayClick() {
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
  }
}

/**
 * Bindet den Keydown-Event-Listener für die Escape-Taste.
 * Schließt das Modal bei Drücken von ESC.
 */
function bindEscapeKey() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isModalOpen()) closeModal();
  });
}

/**
 * Bindet Click-Event-Listener an alle Priority-Buttons.
 * Ermöglicht die Auswahl der Task-Priorität.
 */
function bindPriorityButtons() {
  priorityButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectPriority(btn));
  });
}

/**
 * Bindet den Submit-Event-Listener an das Formular.
 * Verarbeitet die Formular-Übermittlung.
 */
function bindFormSubmit() {
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
}

/**
 * Öffnet das Modal und zeigt es an.
 * Setzt aria-Attribute, blockiert Hintergrund-Scrolling und fokussiert das erste Eingabefeld.
 */
function openModal() {
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  focusFirstInput();
}

/**
 * Schließt das Modal und versteckt es.
 * Setzt aria-Attribute zurück, aktiviert Hintergrund-Scrolling und setzt Priority zurück.
 */
function closeModal() {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  resetPriority();
}

/**
 * Prüft, ob das Modal aktuell geöffnet ist.
 * @returns {boolean} True wenn das Modal geöffnet ist, sonst false
 */
function isModalOpen() {
  return overlay?.classList.contains("open");
}

/**
 * Fokussiert das erste Eingabefeld im Modal.
 * Verwendet einen Timeout für zuverlässige Fokussierung nach der Animation.
 */
function focusFirstInput() {
  const firstInput = document.getElementById("taskTitle");
  setTimeout(() => firstInput?.focus(), 50);
}

/**
 * Wählt einen Priority-Button aus und markiert ihn als aktiv.
 * Entfernt die aktive Markierung von allen anderen Buttons.
 * @param {HTMLElement} selectedBtn - Der ausgewählte Priority-Button
 */
function selectPriority(selectedBtn) {
  priorityButtons.forEach((btn) => btn.classList.remove("active"));
  selectedBtn.classList.add("active");
}

/**
 * Setzt die Priority-Auswahl auf den Standardwert "Medium" zurück.
 * Wird beim Schließen des Modals aufgerufen.
 */
function resetPriority() {
  priorityButtons.forEach((btn) => btn.classList.remove("active"));
  const defaultBtn = document.querySelector(
    '.priority-btn[data-priority="medium"]'
  );
  if (defaultBtn) defaultBtn.classList.add("active");
}

/**
 * Ermittelt die aktuell ausgewählte Priorität.
 * @returns {string} Die ausgewählte Priorität ("urgent", "medium" oder "low")
 */
function getSelectedPriority() {
  return (
    document.querySelector(".priority-btn.active")?.dataset?.priority ||
    "medium"
  );
}

/**
 * Sammelt alle Formulardaten und gibt sie als Objekt zurück.
 * @returns {Object} Objekt mit allen Task-Daten
 * @returns {string} return.title - Der Titel des Tasks
 * @returns {string} return.description - Die Beschreibung des Tasks
 * @returns {string} return.due - Das Fälligkeitsdatum
 * @returns {string} return.priority - Die Priorität
 * @returns {string} return.assignee - Der zugewiesene Kontakt
 * @returns {string} return.category - Die Kategorie
 * @returns {string} return.subtasks - Die Subtasks
 */
function getFormData() {
  return {
    title: form.title.value,
    description: form.description.value,
    due: form.due.value,
    priority: getSelectedPriority(),
    assignee: form.assignee.value,
    category: form.category.value,
    subtasks: form.subtasks.value,
  };
}

/**
 * Verarbeitet die Formular-Übermittlung.
 * Verhindert Standard-Submit, sammelt Daten, schließt Modal und setzt Formular zurück.
 * @param {Event} e - Das Submit-Event
 */
function handleSubmit(e) {
  e.preventDefault();
  const data = getFormData();
  console.log("Create Task:", data);
  closeModal();
  form.reset();
}

document.addEventListener("DOMContentLoaded", initModal);
