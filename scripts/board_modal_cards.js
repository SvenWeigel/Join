/**
 * @fileoverview Task View Modal Logic
 * @description Funktionen für das Anzeigen von Task-Details im View-Modal.
 *              Ermöglicht das Öffnen, Befüllen und Schließen des View-Modals
 *              sowie das direkte Togglen von Subtask-Checkboxen.
 */

// ============================================================================
// GLOBALE VARIABLEN
// ============================================================================

/**
 * Speichert die ID des aktuell angezeigten Tasks.
 * Wird von beiden Modals (View und Edit) verwendet.
 */
let currentTaskId = null;

/**
 * Speichert die geladenen Task-Daten für schnellen Zugriff.
 */
let currentTaskData = null;

// ============================================================================
// VIEW MODAL FUNKTIONEN
// ============================================================================

/**
 * Öffnet das View-Modal und zeigt die Details eines Tasks an.
 *
 * @param {string} taskId - Die Firebase-ID des anzuzeigenden Tasks
 */
async function openTaskViewModal(taskId) {
  currentTaskId = taskId;

  try {
    const tasks = await fetchTasks();
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      console.error("Task not found:", taskId);
      return;
    }

    currentTaskData = task;
    populateViewModal(task);
    document.getElementById("modalTaskViewOverlay").classList.remove("d-none");
  } catch (error) {
    console.error("Error opening task view modal:", error);
  }
}

/**
 * Schließt das View-Modal.
 * currentTaskId wird NICHT zurückgesetzt, da sie für das Edit-Modal benötigt wird.
 */
function closeTaskViewModal() {
  document.getElementById("modalTaskViewOverlay").classList.add("d-none");
}

// ============================================================================
// SUBTASK TOGGLE FUNKTION
// ============================================================================

/**
 * Toggelt den Completed-Status eines Subtasks und speichert die Änderung.
 *
 * @param {number} subtaskIndex - Der Index des Subtasks im Array
 */
async function toggleSubtaskComplete(subtaskIndex) {
  if (!currentTaskId || !currentTaskData) return;

  try {
    // Subtasks normalisieren
    let subtasks = currentTaskData.subtasks
      ? Array.isArray(currentTaskData.subtasks)
        ? [...currentTaskData.subtasks]
        : Object.values(currentTaskData.subtasks)
      : [];

    if (subtaskIndex < 0 || subtaskIndex >= subtasks.length) return;

    // Status toggeln
    subtasks[subtaskIndex].completed = !subtasks[subtaskIndex].completed;

    // In Firebase speichern
    await updateTask(currentTaskId, { subtasks });

    // Lokale Daten aktualisieren
    currentTaskData.subtasks = subtasks;

    // Board neu rendern (für die Fortschrittsanzeige auf den Cards)
    await renderAllTasks();
  } catch (error) {
    console.error("Error toggling subtask:", error);
  }
}

// ============================================================================
// CLICK HANDLER INITIALISIERUNG
// ============================================================================

/**
 * Initialisiert Click-Handler für alle Task-Cards.
 * Wird nach dem Rendern der Tasks aufgerufen.
 */
function initTaskCardClickHandlers() {
  document.querySelectorAll(".task-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      // Nicht öffnen während Drag-Operation
      if (card.classList.contains("dragging")) return;

      const taskId = card.dataset.taskId;
      if (taskId) {
        openTaskViewModal(taskId);
      }
    });
  });
}

// Schließt das View-Modal bei Klick auf den Overlay-Hintergrund
document.addEventListener("click", function (event) {
  const overlay = document.getElementById("modalTaskViewOverlay");

  if (overlay && !overlay.classList.contains("d-none")) {
    // Nur schließen wenn auf den Overlay-Hintergrund geklickt wurde, nicht auf den Modal-Inhalt
    if (event.target === overlay) {
      closeTaskViewModal();
    }
  }
});
