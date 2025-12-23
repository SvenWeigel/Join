/**
 * @fileoverview Task Edit Modal Logic
 * @description Functions for editing tasks in the edit modal.
 *              Enables opening, populating, saving and closing the edit modal
 *              as well as deleting tasks.
 * @module Board/ModalEdit
 */

/**
 * Temporary list of selected assignees in the edit modal.
 */
let editSelectedAssignees = [];

/**
 * Temporary list of subtasks in the edit modal.
 */
let editSubtasks = [];

/**
 * Opens the edit modal for the current task.
 * Closes the view modal first.
 */
async function openEditModal() {
  closeTaskViewModal();

  if (!currentTaskId) {
    console.error("No task selected for editing");
    return;
  }

  try {
    const tasks = await fetchTasks();
    const task = tasks.find((t) => t.id === currentTaskId);

    if (!task) {
      console.error("Task not found:", currentTaskId);
      return;
    }

    currentTaskData = task;
    populateEditModal(task);
    document
      .getElementById("modalEditViewTaskOverlay")
      .classList.remove("d-none");
  } catch (error) {
    console.error("Error opening edit modal:", error);
  }
}

/**
 * Closes the edit modal and resets the state.
 */
function closeEditModal() {
  document.getElementById("modalEditViewTaskOverlay").classList.add("d-none");
  currentTaskId = null;
  currentTaskData = null;
  editSelectedAssignees = [];
  editSubtasks = [];
}

/**
 * Populates the edit modal with the task data.
 *
 * @param {Object} task - The task object with all data
 */
async function populateEditModal(task) {
  const titleInput = document.querySelector(".title-input-div input");
  if (titleInput) titleInput.value = task.title || "";

  const descTextarea = document.querySelector(
    ".description-input-div textarea"
  );
  if (descTextarea) descTextarea.value = task.description || "";

  const dueDateInput = document.getElementById("editTaskDueDate");
  if (dueDateInput) dueDateInput.value = task.dueDate || "";

  populateEditPriority(task.priority);

  await loadEditContactsForDropdown();

  const rawAssignees = normalizeAssignees(task.assignees);
  editSelectedAssignees = rawAssignees.map((assignee) => {
    const contact = editAvailableContacts.find((c) => c.name === assignee.name);
    return {
      id: contact?.id || assignee.id || assignee.name,
      name: assignee.name,
      color: assignee.color || contact?.color || "#2A3647",
    };
  });
  populateEditAssignees();

  editSubtasks = task.subtasks
    ? Array.isArray(task.subtasks)
      ? [...task.subtasks]
      : Object.values(task.subtasks)
    : [];
  renderEditSubtasks();
}

/**
 * Sets the active priority button in the edit modal.
 *
 * @param {string} priority - The priority (urgent, medium, low)
 */
function populateEditPriority(priority) {
  const buttons = document.querySelectorAll(".priority-btn-edit-view");

  buttons.forEach((btn) => {
    btn.classList.remove("active");
    const btnPriority = btn.dataset.priority;

    if (btnPriority === priority) {
      btn.classList.add("active");
    }
  });
}

/**
 * Handles the click on a priority button in the edit modal.
 *
 * @param {string} priority - The selected priority
 */
function selectEditPriority(priority) {
  populateEditPriority(priority);
}

/**
 * Temporary list of available contacts for the edit modal.
 */
let editAvailableContacts = [];

/**
 * Loads contacts for the edit modal (global for all users including guests).
 */
async function loadEditContactsForDropdown() {
  try {
    editAvailableContacts = await fetchContacts();
  } catch (error) {
    console.error("Error loading contacts for edit modal:", error);
    editAvailableContacts = [];
  }
}

/**
 * Populates the assignees display in the edit modal.
 * Delegates to the render function in render_board_cards.js
 */
function populateEditAssignees() {
  renderEditAssigneesBadges();
}

/**
 * Opens the assignee dropdown in the edit modal.
 */
async function openEditViewAssigneeDropdown() {
  const dropdown = document.getElementById("assignedDropdownList");
  const arrow = document.getElementById("assignedArrow");
  const badges = document.getElementById("editSelectedAssigneesBadges");

  if (dropdown && arrow) {
    const isOpen = dropdown.classList.contains("open");
    dropdown.classList.toggle("open");
    arrow.classList.toggle("open");

    if (badges) {
      badges.classList.toggle("hidden", !isOpen);
    }

    if (!isOpen) {
      await loadEditContactsForDropdown();
      renderEditAssigneeDropdown();
    }
  }
}

/**
 * Renders the assignee dropdown list in the edit modal.
 * Delegates to the render function in render_board_cards.js
 *
 * @param {string} filter - Optional search filter
 */
function renderEditAssigneeDropdown(filter = "") {
  renderEditAssigneeDropdownList(filter);
}

/**
 * Toggles the selection of an assignee in the edit modal.
 *
 * @param {Event} event - The click event
 * @param {string} contactId - The ID of the contact
 */
function toggleEditAssignee(event, contactId) {
  event.stopPropagation();

  const index = editSelectedAssignees.findIndex((a) => a.id === contactId);

  if (index >= 0) {
    editSelectedAssignees.splice(index, 1);
  } else {
    const contact = editAvailableContacts.find((c) => c.id === contactId);
    if (contact) {
      editSelectedAssignees.push({
        id: contact.id,
        name: contact.name,
        color: contact.color || "#2A3647",
      });
    }
  }

  const searchInput = document.getElementById("editViewAssigneeSearch");
  renderEditAssigneeDropdown(searchInput?.value || "");
  populateEditAssignees();
}

/**
 * Filters the assignee list in the edit modal.
 */
function filterEditViewAssigneeList() {
  const searchInput = document.getElementById("editViewAssigneeSearch");
  const searchTerm = searchInput?.value || "";

  const dropdown = document.getElementById("assignedDropdownList");
  const arrow = document.getElementById("assignedArrow");
  if (dropdown && !dropdown.classList.contains("open")) {
    dropdown.classList.add("open");
    arrow?.classList.add("open");
  }

  renderEditAssigneeDropdown(searchTerm);
}

/**
 * Closes the edit modal assignee dropdown.
 */
function closeEditAssigneeDropdown() {
  const dropdown = document.getElementById("assignedDropdownList");
  const arrow = document.getElementById("assignedArrow");
  const badges = document.getElementById("editSelectedAssigneesBadges");

  if (dropdown?.classList.contains("open")) {
    dropdown.classList.remove("open");
    arrow?.classList.remove("open");
    badges?.classList.remove("hidden");
  }
}

/**
 * Saves all changes from the edit modal to Firebase.
 */
async function saveTaskChanges() {
  if (!currentTaskId) {
    console.error("No task to save");
    return;
  }

  try {
    const title =
      document.querySelector(".title-input-div input")?.value.trim() || "";
    const description =
      document.querySelector(".description-input-div textarea")?.value.trim() ||
      "";
    const dueDate = document.getElementById("editTaskDueDate")?.value || "";
    const priority = getSelectedEditPriority();

    if (title === "") {
      alert("Title is required");
      return;
    }

    const updateData = {
      title,
      description,
      dueDate,
      priority,
      assignees: editSelectedAssignees,
      subtasks: editSubtasks,
    };

    await updateTask(currentTaskId, updateData);

    await renderAllTasks();

    document.getElementById("modalEditViewTaskOverlay").classList.add("d-none");

    await openTaskViewModal(currentTaskId);
  } catch (error) {
    console.error("Error saving task:", error);
    alert("Error saving task. Please try again.");
  }
}

/**
 * Gets the selected priority in the edit modal.
 *
 * @returns {string} The selected priority
 */
function getSelectedEditPriority() {
  const activeBtn = document.querySelector(".priority-btn-edit-view.active");
  return activeBtn?.dataset.priority || "medium";
}

/**
 * Deletes the current task after confirmation.
 */
async function deleteCurrentTask() {
  if (!currentTaskId) {
    console.error("No task to delete");
    return;
  }

  try {
    await deleteTask(currentTaskId);

    closeTaskViewModal();
    closeEditModal();

    await renderAllTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Error deleting task. Please try again.");
  }
}

document.addEventListener("click", function (event) {
  const assignedToDiv = document.querySelector(".assigned-to-div");
  const dropdown = document.getElementById("assignedDropdownList");

  if (assignedToDiv && dropdown?.classList.contains("open")) {
    if (!assignedToDiv.contains(event.target)) {
      closeEditAssigneeDropdown();
    }
  }
});
