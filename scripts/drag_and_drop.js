/** @type {HTMLElement|null} */
let draggedTask = null;

/** @type {HTMLElement|null} */
let dragPreview = null;

/** @type {number|null} */
let touchTimeout = null;

/** @type {boolean} */
let isTouchDragging = false;

/** @type {HTMLElement|null} */
let currentDropColumn = null;

/** @type {number} */
const LONG_PRESS_DELAY = 200;

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
 * Shows drop indicators in adjacent columns based on the source column.
 * Only neighboring columns get indicators (e.g., from "await feedback" → "in progress" and "done").
 * @param {HTMLElement} sourceColumn - The column where the drag started
 */
function showAdjacentDropIndicators(sourceColumn) {
  const columns = Array.from(document.querySelectorAll(".column-content"));
  const sourceIndex = columns.indexOf(sourceColumn);

  if (sourceIndex === -1) return;

  // Show indicator in previous column (if exists)
  if (sourceIndex > 0) {
    const prevColumn = columns[sourceIndex - 1];
    prevColumn.classList.add("drag-over");
    showDropIndicator(prevColumn);
  }

  // Show indicator in next column (if exists)
  if (sourceIndex < columns.length - 1) {
    const nextColumn = columns[sourceIndex + 1];
    nextColumn.classList.add("drag-over");
    showDropIndicator(nextColumn);
  }
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
    // Desktop drag events
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);

    // Touch events for mobile
    card.addEventListener("touchstart", handleTouchStart, { passive: true });
    card.addEventListener("touchmove", handleTouchMove, { passive: false });
    card.addEventListener("touchend", handleTouchEnd, { passive: true });
    card.addEventListener("touchcancel", handleTouchCancel, { passive: true });
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
// TOUCH DRAG & DROP (Mobile Support)
// ============================================================================

/**
 * Creates the drag preview for touch dragging.
 * @param {HTMLElement} card - The card to create preview from
 * @param {number} x - X position
 * @param {number} y - Y position
 */
function createTouchDragPreview(card, x, y) {
  const rect = card.getBoundingClientRect();
  dragPreview = card.cloneNode(true);
  dragPreview.classList.add("drag-preview");
  dragPreview.style.width = rect.width + "px";
  dragPreview.style.left = x - rect.width / 2 + "px";
  dragPreview.style.top = y - 30 + "px";
  document.body.appendChild(dragPreview);
}

/**
 * Cleans up after touch drag ends.
 */
function cleanupTouchDrag() {
  if (touchTimeout) {
    clearTimeout(touchTimeout);
    touchTimeout = null;
  }

  if (dragPreview) {
    dragPreview.remove();
    dragPreview = null;
  }

  if (draggedTask) {
    draggedTask.classList.remove("dragging");
    draggedTask.classList.remove("drag-start-pop");
  }

  draggedTask = null;
  isTouchDragging = false;
  currentDropColumn = null;

  enableCardPointerEvents();
  removeAllDropIndicators();

  document.querySelectorAll(".column-content").forEach((col) => {
    col.classList.remove("drag-over");
  });
}

/**
 * Handles touch start - initiates long press timer.
 * @param {TouchEvent} e
 */
function handleTouchStart(e) {
  const card = e.currentTarget;
  const touch = e.touches[0];

  touchTimeout = setTimeout(() => {
    // Long press activated - start dragging
    isTouchDragging = true;
    draggedTask = card;

    draggedTask.classList.add("dragging");
    draggedTask.classList.add("drag-start-pop");

    createTouchDragPreview(card, touch.clientX, touch.clientY);
    disableCardPointerEvents();

    // Show drop indicators in adjacent columns
    const sourceColumn = card.closest(".column-content");
    if (sourceColumn) {
      showAdjacentDropIndicators(sourceColumn);
    }

    // Find initial column and highlight its indicator
    const column = getColumnAtPoint(touch.clientX, touch.clientY);
    if (column) {
      updateDropIndicatorHighlight(column, sourceColumn);
      currentDropColumn = column;
    }
  }, LONG_PRESS_DELAY);
}

/**
 * Handles touch move - updates preview position and drop target.
 * @param {TouchEvent} e
 */
function handleTouchMove(e) {
  if (!isTouchDragging) {
    // Cancel long press if finger moves before timer completes
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      touchTimeout = null;
    }
    return;
  }

  e.preventDefault(); // Prevent scrolling while dragging

  const touch = e.touches[0];

  // Update preview position
  if (dragPreview) {
    dragPreview.style.left = touch.clientX - dragPreview.offsetWidth / 2 + "px";
    dragPreview.style.top = touch.clientY - 30 + "px";
  }

  // Find column under finger
  const column = getColumnAtPoint(touch.clientX, touch.clientY);

  if (column !== currentDropColumn) {
    // Update active indicator highlight
    const sourceColumn = draggedTask?.closest(".column-content");
    updateDropIndicatorHighlight(column, sourceColumn);

    currentDropColumn = column;
  }
}

/**
 * Handles touch end - performs drop if dragging.
 * @param {TouchEvent} e
 */
async function handleTouchEnd(e) {
  if (touchTimeout) {
    clearTimeout(touchTimeout);
    touchTimeout = null;
  }

  if (!isTouchDragging) return;

  const taskId = draggedTask?.dataset?.taskId;
  const targetColumn = currentDropColumn;

  cleanupTouchDrag();

  if (!taskId || !targetColumn) return;

  const newStatus = targetColumn.dataset.status;

  try {
    await updateTask(taskId, { status: newStatus });
    await renderAllTasks();
  } catch (error) {
    console.error("Error updating task status:", error);
    alert("Task could not be moved. Please try again.");
  }
}

/**
 * Handles touch cancel - cleans up without performing drop.
 * @param {TouchEvent} e
 */
function handleTouchCancel(e) {
  cleanupTouchDrag();
}
