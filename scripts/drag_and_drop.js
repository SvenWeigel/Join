/** @type {HTMLElement|null} */
let draggedTask = null;

/** @type {HTMLElement|null} */
let dragPreview = null;

// ============================================================================
// HILFSFUNKTIONEN - Pointer Events & Drop Indicator
// ============================================================================

/**
 * Disables pointer events on all task cards except the dragged one.
 */
function disableCardPointerEvents() {
  document.querySelectorAll(".task-card").forEach((card) => {
    if (card !== draggedTask) {
      card.style.pointerEvents = "none";
    }
  });
}

/**
 * Re-enables pointer events on all task cards.
 */
function enableCardPointerEvents() {
  document.querySelectorAll(".task-card").forEach((card) => {
    card.style.pointerEvents = "auto";
  });
}

/**
 * Removes all drop indicators from the board.
 */
function removeAllDropIndicators() {
  document
    .querySelectorAll(".drag-drop-indicator")
    .forEach((el) => el.remove());
}

/**
 * Shows a drop indicator at the end of a column.
 * @param {HTMLElement} column - The column to show the indicator in
 */
function showDropIndicator(column) {
  if (!column || column.querySelector(".drag-drop-indicator")) return;
  const indicator = document.createElement("div");
  indicator.classList.add("drag-drop-indicator");
  column.appendChild(indicator);
}

/**
 * Shows drop indicators in all columns except the source column.
 * All columns get indicators to show they can receive the dragged task.
 * @param {HTMLElement} sourceColumn - The column where the drag started
 */
function showAdjacentDropIndicators(sourceColumn) {
  const columns = Array.from(document.querySelectorAll(".column-content"));

  columns.forEach((column) => {
    if (column !== sourceColumn) {
      column.classList.add("drag-over");
      showDropIndicator(column);
    }
  });
}

/**
 * Highlights the hovered column and dims others during drag.
 * @param {HTMLElement} hoveredColumn - The currently hovered column
 * @param {HTMLElement} sourceColumn - The column where the drag started
 */
function updateDropIndicatorHighlight(hoveredColumn, sourceColumn) {
  const columns = document.querySelectorAll(".column-content");

  columns.forEach((col) => {
    const indicator = col.querySelector(".drag-drop-indicator");
    if (indicator) {
      if (col === hoveredColumn) {
        indicator.classList.add("drag-drop-indicator-active");
      } else {
        indicator.classList.remove("drag-drop-indicator-active");
      }
    }
  });
}

/**
 * Finds the column element under a given point.
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {HTMLElement|null}
 */
function getColumnAtPoint(x, y) {
  const elements = document.elementsFromPoint(x, y);
  for (const el of elements) {
    if (el.classList.contains("column-content")) {
      return el;
    }
    const column = el.closest(".column-content");
    if (column) return column;
  }
  return null;
}

// ============================================================================
// DESKTOP DRAG & DROP
// ============================================================================

/**
 * Initializes drag & drop for all task cards and columns.
 */
function initDragAndDrop() {
  const taskCards = document.querySelectorAll(".task-card");
  taskCards.forEach((card) => {
    // Desktop drag events only - mobile uses move menu
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);
  });

  const columns = document.querySelectorAll(".column-content");
  const statuses = ["todo", "inprogress", "awaitfeedback", "done"];
  columns.forEach((column, index) => {
    column.dataset.status = statuses[index];
    column.addEventListener("dragover", handleDragOver);
    column.addEventListener("dragenter", handleDragEnter);
    column.addEventListener("dragleave", handleDragLeave);
    column.addEventListener("drop", handleDrop);
  });
}

/**
 * Handles the start of dragging a task card.
 * @param {DragEvent} e
 */
function handleDragStart(e) {
  draggedTask = e.target;

  const emptyImg = new Image();
  emptyImg.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  e.dataTransfer.setDragImage(emptyImg, 0, 0);

  const rect = draggedTask.getBoundingClientRect();
  dragPreview = draggedTask.cloneNode(true);
  dragPreview.classList.add("drag-preview");
  dragPreview.style.width = rect.width + "px";
  dragPreview.style.left = e.clientX - rect.width / 2 + "px";
  dragPreview.style.top = e.clientY - 30 + "px";
  document.body.appendChild(dragPreview);

  draggedTask.classList.add("dragging");
  draggedTask.classList.add("drag-start-pop");
  document.addEventListener("dragover", handleDragMove);

  // Disable pointer events on other cards so entire column is drop target
  disableCardPointerEvents();

  // Show drop indicators in adjacent columns
  const sourceColumn = draggedTask.closest(".column-content");
  if (sourceColumn) {
    showAdjacentDropIndicators(sourceColumn);
  }

  e.dataTransfer.setData("text/plain", draggedTask.dataset.taskId);
  e.dataTransfer.effectAllowed = "move";
}

/**
 * Updates the drag preview position while dragging.
 * @param {DragEvent} e
 */
function handleDragMove(e) {
  if (dragPreview) {
    dragPreview.style.left = e.clientX - dragPreview.offsetWidth / 2 + "px";
    dragPreview.style.top = e.clientY - 30 + "px";
  }
}

/**
 * Handles the end of dragging (drop or cancel).
 * @param {DragEvent} e
 */
function handleDragEnd(e) {
  document.removeEventListener("dragover", handleDragMove);

  if (dragPreview) {
    dragPreview.remove();
    dragPreview = null;
  }

  if (draggedTask) {
    draggedTask.classList.remove("dragging");
    draggedTask.classList.remove("drag-start-pop");
  }
  draggedTask = null;

  // Cleanup: re-enable pointer events and remove indicators
  enableCardPointerEvents();
  removeAllDropIndicators();

  document.querySelectorAll(".column-content").forEach((col) => {
    col.classList.remove("drag-over");
  });
}

/**
 * Allows dropping by preventing default behavior.
 * @param {DragEvent} e
 */
function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

/**
 * Highlights the column when a card enters.
 * @param {DragEvent} e
 */
function handleDragEnter(e) {
  e.preventDefault();
  const column = e.currentTarget;

  // Highlight the active indicator in this column
  const sourceColumn = draggedTask?.closest(".column-content");
  updateDropIndicatorHighlight(column, sourceColumn);
}

/**
 * Removes highlight when a card leaves the column.
 * @param {DragEvent} e
 */
function handleDragLeave(e) {
  const column = e.currentTarget;
  if (!column.contains(e.relatedTarget)) {
    // Remove active highlight but keep the indicator
    const indicator = column.querySelector(".drag-drop-indicator");
    if (indicator) {
      indicator.classList.remove("drag-drop-indicator-active");
    }
  }
}

/**
 * Handles dropping a task card into a column and updates Firebase.
 * @param {DragEvent} e
 */
async function handleDrop(e) {
  e.preventDefault();

  const column = e.currentTarget;
  column.classList.remove("drag-over");
  removeAllDropIndicators();

  const taskId = e.dataTransfer.getData("text/plain");
  if (!taskId) return;

  const newStatus = column.dataset.status;

  try {
    await updateTask(taskId, { status: newStatus });
    await renderAllTasks();
  } catch (error) {
    console.error("Error updating task status:", error);
    alert("Task could not be moved. Please try again.");
  }
}

// ============================================================================
// MOBILE MOVE MENU
// ============================================================================

/** @type {string|null} */
let currentMoveTaskId = null;

/** @type {string|null} */
let currentMoveTaskStatus = null;

/**
 * Opens the move menu for a task.
 * @param {Event} event - The click event
 * @param {string} taskId - The ID of the task to move
 */
function openMoveMenu(event, taskId) {
  event.stopPropagation();

  currentMoveTaskId = taskId;

  // Find current status of the task
  const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
  const column = taskCard?.closest(".column-content");
  currentMoveTaskStatus = column?.dataset?.status || null;

  // Highlight current status option
  const menuOptions = document.querySelectorAll(".move-menu-option");
  menuOptions.forEach((option) => {
    if (option.dataset.status === currentMoveTaskStatus) {
      option.classList.add("current-status");
    } else {
      option.classList.remove("current-status");
    }
  });

  // Position menu at the task card
  const menu = document.querySelector(".move-menu");
  const button = event.currentTarget;
  const buttonRect = button.getBoundingClientRect();

  // Position below the button, aligned to the right
  menu.style.top = buttonRect.bottom + 8 + "px";
  menu.style.left = buttonRect.right - menu.offsetWidth + "px";

  // Show the menu
  const overlay = document.getElementById("moveMenuOverlay");
  overlay.classList.add("open");

  // Adjust if menu goes off screen
  const menuRect = menu.getBoundingClientRect();
  if (menuRect.right > window.innerWidth) {
    menu.style.left = window.innerWidth - menuRect.width - 16 + "px";
  }
  if (menuRect.left < 0) {
    menu.style.left = "16px";
  }
  if (menuRect.bottom > window.innerHeight) {
    menu.style.top = buttonRect.top - menuRect.height - 8 + "px";
  }
}

/**
 * Closes the move menu.
 */
function closeMoveMenu() {
  const overlay = document.getElementById("moveMenuOverlay");
  overlay.classList.remove("open");
  currentMoveTaskId = null;
  currentMoveTaskStatus = null;
}

/**
 * Moves the current task to a new status.
 * @param {string} newStatus - The new status to move the task to
 */
async function moveTaskToStatus(newStatus) {
  if (!currentMoveTaskId || newStatus === currentMoveTaskStatus) {
    closeMoveMenu();
    return;
  }

  try {
    await updateTask(currentMoveTaskId, { status: newStatus });
    closeMoveMenu();
    await renderAllTasks();
  } catch (error) {
    console.error("Error moving task:", error);
    alert("Task could not be moved. Please try again.");
    closeMoveMenu();
  }
}
