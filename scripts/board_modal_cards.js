/**
 * @fileoverview Task View Modal Logic
 * @description Functions for displaying task details in the view modal.
 *              Enables opening, populating, and closing the view modal
 *              as well as toggling subtask checkboxes.
 * @module Board/ModalView
 */

/**
 * Stores the ID of the currently displayed task.
 * Used by both view and edit modals.
 */
let currentTaskId = null;

/**
 * Stores the loaded task data for quick access.
 */
let currentTaskData = null;

/**
 * Opens the view modal and displays the details of a task.
 *
 * @param {string} taskId - The Firebase ID of the task to display
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
 * Closes the view modal.
 * currentTaskId is NOT reset as it is needed for the edit modal.
 */
function closeTaskViewModal() {
  document.getElementById("modalTaskViewOverlay").classList.add("d-none");
}

/**
 * Toggles the completed status of a subtask and saves the change.
 *
 * @param {number} subtaskIndex - The index of the subtask in the array
 */
async function toggleSubtaskComplete(subtaskIndex) {
  if (!currentTaskId || !currentTaskData) return;

  try {
    let subtasks = currentTaskData.subtasks
      ? Array.isArray(currentTaskData.subtasks)
        ? [...currentTaskData.subtasks]
        : Object.values(currentTaskData.subtasks)
      : [];

    if (subtaskIndex < 0 || subtaskIndex >= subtasks.length) return;

    subtasks[subtaskIndex].completed = !subtasks[subtaskIndex].completed;
    await updateTask(currentTaskId, { subtasks });
    currentTaskData.subtasks = subtasks;
    await renderAllTasks();
  } catch (error) {
    console.error("Error toggling subtask:", error);
  }
}

/**
 * Initializes click handlers for all task cards.
 * Called after rendering tasks.
 */
function initTaskCardClickHandlers() {
  document.querySelectorAll(".task-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (card.classList.contains("dragging")) return;

      const taskId = card.dataset.taskId;
      if (taskId) {
        openTaskViewModal(taskId);
      }
    });
  });
}

document.addEventListener("click", function (event) {
  const overlay = document.getElementById("modalTaskViewOverlay");

  if (overlay && !overlay.classList.contains("d-none")) {
    if (event.target === overlay) {
      closeTaskViewModal();
    }
  }
});
