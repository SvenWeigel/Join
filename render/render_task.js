/**
 * @fileoverview Task Rendering Logic
 * @description Logik-Funktionen für das Rendern von Tasks auf dem Board.
 *              Templates befinden sich in /templates/template_board.js
 */

// ============================================================================
// HILFSFUNKTIONEN - Datenverarbeitung
// ============================================================================

/**
 * Extrahiert Initialen aus einem Namen oder einer E-Mail.
 *
 * @param {string} nameOrEmail - Name oder E-Mail-Adresse
 * @returns {string} Die Initialen (max. 2 Zeichen)
 *
 * @example
 * getInitials("max.mustermann@email.com") // "MM"
 * getInitials("Anna Schmidt") // "AS"
 */
function getInitials(nameOrEmail) {
  if (!nameOrEmail) return "??";

  // Falls E-Mail: Teil vor @ nehmen
  const name = nameOrEmail.includes("@")
    ? nameOrEmail.split("@")[0]
    : nameOrEmail;

  // Nach Leerzeichen, Punkten, Unterstrichen oder Bindestrichen splitten
  const parts = name.split(/[\s._-]+/);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Kürzt Text auf eine maximale Länge und fügt "..." hinzu.
 *
 * @param {string} text - Der zu kürzende Text
 * @param {number} maxLength - Die maximale Länge
 * @returns {string} Der gekürzte Text
 */
function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Escaped HTML-Sonderzeichen zur Vermeidung von XSS-Angriffen.
 *
 * @param {string} text - Der zu escapende Text
 * @returns {string} Der sichere Text
 */
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================================
// RENDER FUNKTIONEN - Bereiten Daten auf und rufen Templates auf
// ============================================================================

/**
 * Bereitet Task-Daten auf und generiert HTML über Template.
 *
 * @param {Object} task - Das rohe Task-Objekt aus Firebase
 * @returns {string} HTML-String der Task-Card
 */
function renderTaskCard(task) {
  // Konfiguration basierend auf Task-Daten holen
  const categoryConfig =
    CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.technical;
  const priorityIcon = PRIORITY_ICONS[task.priority] || PRIORITY_ICONS.medium;

  // Aufbereitete Daten für Template erstellen
  const templateData = {
    id: task.id,
    title: escapeHtml(task.title),
    description: escapeHtml(truncateText(task.description, 50)),
    categoryLabel: categoryConfig.label,
    priorityIcon: priorityIcon,
    priority: task.priority,
    subtasksHtml: renderSubtasksProgress(task.subtasks),
    assigneesHtml: renderAssignees(task.assignees),
  };

  // Template aufrufen mit aufbereiteten Daten
  return getTaskCardTemplate(templateData);
}

/**
 * Berechnet Subtask-Statistiken und generiert HTML über Template.
 *
 * @param {Array} subtasks - Array von Subtask-Objekten [{title, completed}, ...]
 * @returns {string} HTML-String der Fortschrittsanzeige oder leerer String
 */
function renderSubtasksProgress(subtasks) {
  if (!subtasks || subtasks.length === 0) return "";

  // Statistiken berechnen
  const completed = subtasks.filter((st) => st.completed).length;
  const total = subtasks.length;

  // Template aufrufen mit berechneten Werten
  return getSubtasksProgressTemplate(completed, total);
}

/**
 * Verarbeitet Assignees und generiert HTML über Template.
 *
 * @param {Array} assignees - Array von User-Emails oder Namen
 * @returns {string} HTML-String der Badges oder leerer String
 */
function renderAssignees(assignees) {
  if (!assignees || assignees.length === 0) return "";

  // Für jeden Assignee: Initialen berechnen und Template aufrufen
  return assignees
    .map((assignee) => {
      const initials = getInitials(assignee);
      return getAssigneeBadgeTemplate(initials);
    })
    .join("");
}

/**
 * Generiert Placeholder-HTML für eine leere Spalte.
 *
 * @param {number} columnIndex - Der Index der Spalte (0-3)
 * @returns {string} HTML-String des Placeholders
 */
function renderEmptyColumn(columnIndex) {
  const label = COLUMN_LABELS[columnIndex] || "";
  return getEmptyColumnTemplate(label);
}

// ============================================================================
// HAUPTFUNKTION - Orchestriert das komplette Board-Rendering
// ============================================================================

/**
 * Lädt alle Tasks aus Firebase und rendert sie ins Board.
 * Tasks werden basierend auf ihrem Status in die richtige Spalte sortiert.
 */
async function renderAllTasks() {
  try {
    // 1. Alle Tasks aus Firebase laden
    const tasks = await fetchTasks();

    // 2. Alle Spalten-Container holen
    const columns = document.querySelectorAll(".column-content");

    // 3. Alle Spalten leeren
    columns.forEach((col) => (col.innerHTML = ""));

    // 4. Jeden Task in die richtige Spalte rendern
    tasks.forEach((task) => {
      const columnIndex = STATUS_COLUMNS[task.status];
      if (columnIndex !== undefined && columns[columnIndex]) {
        columns[columnIndex].innerHTML += renderTaskCard(task);
      }
    });

    // 5. Leere Spalten mit Placeholder versehen
    columns.forEach((col, index) => {
      if (col.innerHTML.trim() === "") {
        col.innerHTML = renderEmptyColumn(index);
      }
    });

    // 6. Drag & Drop Event-Listener hinzufügen (aus drag_and_drop.js)
    initDragAndDrop();
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}
