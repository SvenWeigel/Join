/**
 * @fileoverview Board Templates
 * @description Reine Template-Funktionen - geben nur HTML zurück, keine Logik!
 *              Logik befindet sich in /scripts/render.js
 */

// ============================================================================
// KONFIGURATION - Mapping von Daten zu HTML/CSS
// ============================================================================

/**
 * Mapping von Task-Status zu Spalten-Index im Board
 * Index entspricht der Reihenfolge der .column-content Elemente im HTML
 */
const STATUS_COLUMNS = {
  todo: 0, // Erste Spalte: "To do"
  inprogress: 1, // Zweite Spalte: "In progress"
  awaitfeedback: 2, // Dritte Spalte: "Await feedback"
  done: 3, // Vierte Spalte: "Done"
};

/**
 * Mapping von Kategorie zu CSS-Klasse und Anzeige-Label
 */
const CATEGORY_CONFIG = {
  technical: { class: "technical", label: "Technical Task" },
  userstory: { class: "user-story", label: "User Story" },
};

/**
 * Mapping von Priorität zu Icon-Pfaden
 */
const PRIORITY_ICONS = {
  urgent: "/assets/icons/urgent_icon.svg",
  medium: "/assets/icons/medium_icon_orange.svg",
  low: "/assets/icons/low_icon.svg",
};

/**
 * Labels für leere Spalten
 */
const COLUMN_LABELS = ["To do", "In progress", "Await feedback", "Done"];

// ============================================================================
// TEMPLATE FUNKTIONEN - Geben nur HTML zurück, keine Logik!
// ============================================================================

/**
 * Generiert die HTML für eine einzelne Task-Card.
 * Struktur entspricht exakt der hardcoded Card im HTML.
 *
 * @param {Object} task - Das Task-Objekt
 * @param {string} task.id - Die Firebase-ID
 * @param {string} task.title - Der Titel (bereits escaped)
 * @param {string} task.description - Die Beschreibung (bereits escaped/gekürzt)
 * @param {string} task.categoryLabel - Anzeige-Label für Kategorie (z.B. "User Story")
 * @param {string} task.priorityIcon - Pfad zum Priority-Icon
 * @param {string} task.priority - Priority-Name für alt-Text
 * @param {string} task.subtasksHtml - Fertig gerendertes Subtasks-HTML
 * @param {string} task.assigneesHtml - Fertig gerendertes Assignees-HTML
 * @returns {string} HTML-String der Task-Card
 */
function getTaskCardTemplate(task) {
  return `
      <div class="task-card" data-task-id="${task.id}" draggable="true">
        <div>${task.categoryLabel}</div>
        <h4 class="task-title">${task.title}</h4>
        <p class="task-description">
          ${task.description}
        </p>
        ${task.subtasksHtml}
        <div class="task-footer">
          <div class="task-assignees">
            ${task.assigneesHtml}
          </div>
          <img class="task-icon" src="${task.priorityIcon}" />
        </div>
      </div>
  `;
}

/**
 * Generiert die HTML für die Subtasks-Fortschrittsanzeige.
 * Struktur entspricht exakt der hardcoded Card im HTML.
 *
 * @param {number} completed - Anzahl erledigter Subtasks
 * @param {number} total - Gesamtanzahl Subtasks
 * @returns {string} HTML-String der Fortschrittsanzeige
 */
function getSubtasksProgressTemplate(completed, total) {
  return `
        <div class="task-progress">
          <div class="progress-bar"></div>
          <span class="subtasks">${completed}/${total} Subtasks</span>
        </div>
  `;
}

/**
 * Generiert die HTML für einen einzelnen Assignee-Badge.
 *
 * @param {string} initials - Die Initialen (z.B. "MM")
 * @param {string} [color] - Optionale Hintergrundfarbe
 * @returns {string} HTML-String des Badges
 */
function getAssigneeBadgeTemplate(initials, color) {
  const style = color ? `style="background-color: ${color}"` : "";
  return `<div class="badge" ${style}>${initials}</div>`;
}

/**
 * Generiert die HTML für das Overflow-Badge (+X).
 *
 * @param {number} count - Anzahl der weiteren Assignees
 * @returns {string} HTML-String des Overflow-Badges
 */
function getOverflowBadgeTemplate(count) {
  return `<div class="badge badge-overflow">+${count}</div>`;
}

/**
 * Generiert die HTML für eine leere Spalte (Drag & Drop Platzhalter).
 *
 * @param {string} columnLabel - Das Label der Spalte (z.B. "To do")
 * @returns {string} HTML-String des Placeholders
 */
function getEmptyColumnTemplate(columnLabel) {
  return `
      <div class="drop-placeholder">
        <span>No tasks ${columnLabel}</span>
      </div>
  `;
}
