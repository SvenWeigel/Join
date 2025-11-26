/**
 * @fileoverview Drag & Drop Funktionalität
 * @description Ermöglicht das Verschieben von Task-Cards zwischen Spalten
 */

// ============================================================================
// DRAG & DROP FUNKTIONALITÄT
// ============================================================================

/** @type {HTMLElement|null} Die aktuell gezogene Task-Card */
let draggedTask = null;

/**
 * Initialisiert Drag & Drop für alle Task-Cards und Spalten.
 */
function initDragAndDrop() {
  // Drag-Events für alle Task-Cards
  const taskCards = document.querySelectorAll(".task-card");
  taskCards.forEach((card) => {
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);
  });

  // Drop-Events für alle Spalten
  const columns = document.querySelectorAll(".column-content");
  columns.forEach((column, index) => {
    // Status als data-Attribut speichern für später
    const statuses = ["todo", "inprogress", "awaitfeedback", "done"];
    column.dataset.status = statuses[index];

    column.addEventListener("dragover", handleDragOver);
    column.addEventListener("dragenter", handleDragEnter);
    column.addEventListener("dragleave", handleDragLeave);
    column.addEventListener("drop", handleDrop);
  });
}

/**
 * Wird aufgerufen wenn das Ziehen einer Card beginnt.
 * @param {DragEvent} e - Das Drag-Event
 */
function handleDragStart(e) {
  draggedTask = e.target;
  draggedTask.classList.add("dragging");

  // Task-ID für den Transfer speichern
  e.dataTransfer.setData("text/plain", draggedTask.dataset.taskId);
  e.dataTransfer.effectAllowed = "move";
}

/**
 * Wird aufgerufen wenn das Ziehen endet (egal ob Drop oder Abbruch).
 * @param {DragEvent} e - Das Drag-Event
 */
function handleDragEnd(e) {
  if (draggedTask) {
    draggedTask.classList.remove("dragging");
  }
  draggedTask = null;

  // Alle Drag-Over Highlights entfernen
  document.querySelectorAll(".column-content").forEach((col) => {
    col.classList.remove("drag-over");
  });
}

/**
 * Wird aufgerufen während eine Card über einer Spalte schwebt.
 * Muss preventDefault() aufrufen um Drop zu erlauben.
 * @param {DragEvent} e - Das Drag-Event
 */
function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

/**
 * Wird aufgerufen wenn eine Card in eine Spalte eintritt.
 * @param {DragEvent} e - Das Drag-Event
 */
function handleDragEnter(e) {
  e.preventDefault();
  const column = e.currentTarget;
  column.classList.add("drag-over");
}

/**
 * Wird aufgerufen wenn eine Card eine Spalte verlässt.
 * @param {DragEvent} e - Das Drag-Event
 */
function handleDragLeave(e) {
  const column = e.currentTarget;
  // Nur entfernen wenn wir wirklich die Spalte verlassen (nicht nur ein Kind-Element)
  if (!column.contains(e.relatedTarget)) {
    column.classList.remove("drag-over");
  }
}

/**
 * Wird aufgerufen wenn eine Card in einer Spalte losgelassen wird.
 * Aktualisiert den Task-Status in Firebase.
 * @param {DragEvent} e - Das Drag-Event
 */
async function handleDrop(e) {
  e.preventDefault();
  const column = e.currentTarget;
  column.classList.remove("drag-over");

  if (!draggedTask) return;

  const taskId = e.dataTransfer.getData("text/plain");
  const newStatus = column.dataset.status;

  try {
    // Task-Status in Firebase aktualisieren
    await updateTask(taskId, { status: newStatus });

    // Board neu rendern um die Änderung anzuzeigen
    await renderAllTasks();
  } catch (error) {
    console.error("Error updating task status:", error);
    alert("Task could not be moved. Please try again.");
  }
}
