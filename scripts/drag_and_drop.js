/** @type {HTMLElement|null} */
let draggedTask = null;

/** @type {HTMLElement|null} */
let dragPreview = null;

/**
 * Initializes drag & drop for all task cards and columns.
 */
function initDragAndDrop() {
  const taskCards = document.querySelectorAll(".task-card");
  taskCards.forEach((card) => {
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
  document.addEventListener("dragover", handleDragMove);

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
  }
  draggedTask = null;

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
  e.currentTarget.classList.add("drag-over");
}

/**
 * Removes highlight when a card leaves the column.
 * @param {DragEvent} e
 */
function handleDragLeave(e) {
  const column = e.currentTarget;
  if (!column.contains(e.relatedTarget)) {
    column.classList.remove("drag-over");
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
