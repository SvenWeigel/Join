/**
 * @fileoverview Summary Page Controller
 * @description Manages the summary dashboard page, displaying task statistics and greeting messages.
 * @module Summary
 */

/**
 * Navigates to the board page.
 */
function navigateToBoard() {
  window.location.href = "html/board.html";
}

/**
 * Attaches click listeners to summary divs for navigation.
 */
function attachSummaryClickListeners() {
  const ids = [
    "todo-div",
    "done-div",
    "priority-date-div",
    "tasks-in-board-div",
    "tasks-in-progress-div",
    "awaiting-feedback-div",
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", navigateToBoard);
  });
}

document.addEventListener("DOMContentLoaded", attachSummaryClickListeners);

/**
 * Initializes the summary page with dynamic data.
 */
async function initSummaryPage() {
  updateGreeting();
  await loadAndDisplaySummaryData();
}

/**
 * Loads all tasks and updates the summary displays.
 */
async function loadAndDisplaySummaryData() {
  try {
    const tasks = await fetchTasks();
    updateTodoCount(tasks);
    updateDoneCount(tasks);
    updateUrgentAndDeadline(tasks);
    updateTotalTasksCount(tasks);
    updateInProgressCount(tasks);
    updateAwaitingFeedbackCount(tasks);
  } catch (error) {
    console.error("Error loading summary data:", error);
  }
}

/**
 * Updates the count of to-do tasks.
 *
 * @param {Array} tasks - Array of all tasks
 */
function updateTodoCount(tasks) {
  const todoCount = tasks.filter((task) => task.status === "todo").length;
  const element = document.querySelector(".todo-number-span");
  if (element) element.textContent = todoCount;
}

/**
 * Updates the count of completed tasks.
 *
 * @param {Array} tasks - Array of all tasks
 */
function updateDoneCount(tasks) {
  const doneCount = tasks.filter((task) => task.status === "done").length;
  const element = document.querySelector(".done-number-span");
  if (element) element.textContent = doneCount;
}

/**
 * Updates the count of tasks in progress.
 *
 * @param {Array} tasks - Array of all tasks
 */
function updateInProgressCount(tasks) {
  const inProgressCount = tasks.filter(
    (task) => task.status === "inprogress"
  ).length;
  const element = document.querySelector(".tasks-in-progress-number-span");
  if (element) element.textContent = inProgressCount;
}

/**
 * Updates the count of tasks awaiting feedback.
 *
 * @param {Array} tasks - Array of all tasks
 */
function updateAwaitingFeedbackCount(tasks) {
  const awaitingCount = tasks.filter(
    (task) => task.status === "awaitfeedback"
  ).length;
  const element = document.querySelector(".awaiting-feedback-number-span");
  if (element) element.textContent = awaitingCount;
}

/**
 * Updates the total count of tasks in the board.
 *
 * @param {Array} tasks - Array of all tasks
 */
function updateTotalTasksCount(tasks) {
  const element = document.querySelector(".tasks-in-board-number-span");
  if (element) element.textContent = tasks.length;
}

/**
 * Updates the urgent task count display.
 *
 * @param {number} count - Number of urgent tasks
 */
function updateUrgentCount(count) {
  const element = document.querySelector(".urgency-number-span");
  if (element) element.textContent = count;
}

/**
 * Gets the deadline text for urgent tasks.
 *
 * @param {Array} urgentTasks - Array of urgent tasks
 * @returns {string} Formatted deadline text
 */
function getDeadlineText(urgentTasks) {
  if (urgentTasks.length === 0) return "No urgent deadline";
  const earliest = findEarliestDeadline(urgentTasks);
  return earliest ? formatDateToEnglish(earliest) : "No urgent deadline";
}

/**
 * Updates urgent count and nearest deadline display.
 *
 * @param {Array} tasks - Array of all tasks
 */
function updateUrgentAndDeadline(tasks) {
  const urgentTasks = tasks.filter((task) => task.priority === "urgent");
  updateUrgentCount(urgentTasks.length);
  const deadlineElement = document.querySelector(".date-span");
  if (deadlineElement)
    deadlineElement.textContent = getDeadlineText(urgentTasks);
}

/**
 * Finds the earliest deadline among the given tasks.
 *
 * @param {Array} tasks - Array of tasks
 * @returns {string|null} The earliest date or null
 */
function findEarliestDeadline(tasks) {
  const tasksWithDates = tasks.filter((task) => task.dueDate);
  if (tasksWithDates.length === 0) return null;

  return tasksWithDates.reduce((earliest, task) => {
    if (!earliest) return task.dueDate;
    return task.dueDate < earliest ? task.dueDate : earliest;
  }, null);
}

/**
 * Formats a date from YYYY-MM-DD to English format.
 *
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Date in "Month DD, YYYY" format
 */
function formatDateToEnglish(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Gets greeting elements for desktop view.
 *
 * @returns {{greet: HTMLElement|null, name: HTMLElement|null}} Desktop elements
 */
function getDesktopGreetingElements() {
  return {
    greet: document.querySelector(".greet-span"),
    name: document.querySelector(".greet-name-span"),
  };
}

/**
 * Gets greeting elements for mobile view.
 *
 * @returns {{greet: HTMLElement|null, name: HTMLElement|null}} Mobile elements
 */
function getMobileGreetingElements() {
  return {
    greet: document.querySelector(".greet-span-responsive"),
    name: document.querySelector(".greet-name-span-responsive"),
  };
}

/**
 * Applies greeting to element pair.
 *
 * @param {{greet: HTMLElement|null, name: HTMLElement|null}} elements - Greeting elements
 * @param {string} greetingText - The greeting text
 * @param {boolean} isGuest - Whether user is a guest
 * @param {string} userName - The user name
 */
function applyGreeting(elements, greetingText, isGuest, userName) {
  if (!elements.greet) return;
  elements.greet.textContent = greetingText + (isGuest ? "!" : ",");
  if (elements.name) {
    elements.name.style.display = isGuest ? "none" : "";
    if (!isGuest) elements.name.textContent = userName;
  }
}

/**
 * Updates the greeting based on time and user.
 */
function updateGreeting() {
  const greetingText = getTimeBasedGreeting();
  const user = readUserFromStorage();
  const isGuest = !user || user.guest || !user.name;
  const userName = user?.name || "";
  applyGreeting(getDesktopGreetingElements(), greetingText, isGuest, userName);
  applyGreeting(getMobileGreetingElements(), greetingText, isGuest, userName);
}

/**
 * Returns a time-based greeting.
 *
 * @returns {string} Greeting based on current hour
 */
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Reads the current user from localStorage.
 *
 * @returns {Object|null} The user object or null
 */
function readUserFromStorage() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * Hides the greeting overlay with fade effect.
 *
 * @param {HTMLElement} overlay - The overlay element
 */
function hideOverlayWithFade(overlay) {
  setTimeout(() => {
    overlay.style.opacity = "0";
    setTimeout(() => (overlay.style.display = "none"), 1500);
  }, 2000);
}

/**
 * Initializes greeting overlay behavior.
 */
function initGreetingOverlay() {
  const overlay = document.getElementById("greetOverlay");
  if (!overlay) return;
  if (sessionStorage.getItem("greetOverlayShown")) {
    overlay.style.display = "none";
  } else {
    hideOverlayWithFade(overlay);
    sessionStorage.setItem("greetOverlayShown", "true");
  }
}

document.addEventListener("DOMContentLoaded", initGreetingOverlay);
document.addEventListener("DOMContentLoaded", initSummaryPage);
