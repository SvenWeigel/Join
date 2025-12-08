// ============================================================================
// EVENT LISTENERS - Navigation
// ============================================================================

document.getElementById("todo-div").addEventListener("click", function () {
  window.location.href = "html/board.html";
});

document.getElementById("done-div").addEventListener("click", function () {
  window.location.href = "html/board.html";
});

document
  .getElementById("priority-date-div")
  .addEventListener("click", function () {
    window.location.href = "html/board.html";
  });

document
  .getElementById("tasks-in-board-div")
  .addEventListener("click", function () {
    window.location.href = "html/board.html";
  });

document
  .getElementById("tasks-in-progress-div")
  .addEventListener("click", function () {
    window.location.href = "html/board.html";
  });

document
  .getElementById("awaiting-feedback-div")
  .addEventListener("click", function () {
    window.location.href = "html/board.html";
  });

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialisiert die Summary-Seite mit dynamischen Daten.
 */
async function initSummaryPage() {
  updateGreeting();
  await loadAndDisplaySummaryData();
}

/**
 * Lädt alle Tasks und aktualisiert die Summary-Anzeigen.
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

// ============================================================================
// TASK COUNT FUNCTIONS
// ============================================================================

/**
 * Aktualisiert die Anzahl der To-do Tasks.
 * @param {Array} tasks - Array aller Tasks
 */
function updateTodoCount(tasks) {
  const todoCount = tasks.filter((task) => task.status === "todo").length;
  const element = document.querySelector(".todo-number-span");
  if (element) element.textContent = todoCount;
}

/**
 * Aktualisiert die Anzahl der erledigten Tasks.
 * @param {Array} tasks - Array aller Tasks
 */
function updateDoneCount(tasks) {
  const doneCount = tasks.filter((task) => task.status === "done").length;
  const element = document.querySelector(".done-number-span");
  if (element) element.textContent = doneCount;
}

/**
 * Aktualisiert die Anzahl der Tasks in Progress.
 * @param {Array} tasks - Array aller Tasks
 */
function updateInProgressCount(tasks) {
  const inProgressCount = tasks.filter(
    (task) => task.status === "inprogress"
  ).length;
  const element = document.querySelector(".tasks-in-progress-number-span");
  if (element) element.textContent = inProgressCount;
}

/**
 * Aktualisiert die Anzahl der Tasks die auf Feedback warten.
 * @param {Array} tasks - Array aller Tasks
 */
function updateAwaitingFeedbackCount(tasks) {
  const awaitingCount = tasks.filter(
    (task) => task.status === "awaitfeedback"
  ).length;
  const element = document.querySelector(".awaiting-feedback-number-span");
  if (element) element.textContent = awaitingCount;
}

/**
 * Aktualisiert die Gesamtanzahl der Tasks im Board.
 * @param {Array} tasks - Array aller Tasks
 */
function updateTotalTasksCount(tasks) {
  const element = document.querySelector(".tasks-in-board-number-span");
  if (element) element.textContent = tasks.length;
}

// ============================================================================
// URGENT & DEADLINE FUNCTIONS
// ============================================================================

/**
 * Aktualisiert die Anzahl der dringenden Tasks und die nächste Deadline.
 * @param {Array} tasks - Array aller Tasks
 */
function updateUrgentAndDeadline(tasks) {
  const urgentTasks = tasks.filter((task) => task.priority === "urgent");
  const urgentCount = urgentTasks.length;

  // Urgent Count aktualisieren
  const urgentElement = document.querySelector(".urgency-number-span");
  if (urgentElement) urgentElement.textContent = urgentCount;

  // Früheste Deadline finden
  const deadlineElement = document.querySelector(".date-span");
  if (deadlineElement) {
    if (urgentCount === 0) {
      deadlineElement.textContent = "No urgent deadline";
    } else {
      const earliestDeadline = findEarliestDeadline(urgentTasks);
      deadlineElement.textContent = earliestDeadline
        ? formatDateToEnglish(earliestDeadline)
        : "No urgent deadline";
    }
  }
}

/**
 * Findet die früheste Deadline unter den gegebenen Tasks.
 * @param {Array} tasks - Array von Tasks
 * @returns {string|null} Das früheste Datum im Format YYYY-MM-DD oder null
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
 * Formatiert ein Datum von YYYY-MM-DD zu "Month DD, YYYY" (English).
 * @param {string} dateString - Datum im Format YYYY-MM-DD
 * @returns {string} Datum im Format "Month DD, YYYY"
 */
function formatDateToEnglish(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// ============================================================================
// GREETING FUNCTIONS
// ============================================================================

/**
 * Aktualisiert die Begrüßung basierend auf der Tageszeit und dem Benutzer.
 */
function updateGreeting() {
  const greetingText = getTimeBasedGreeting();

  // Desktop Greeting
  const greetElement = document.querySelector(".greet-span");
  const nameElement = document.querySelector(".greet-name-span");

  // Mobile Greeting (Overlay)
  const greetElementResponsive = document.querySelector(
    ".greet-span-responsive"
  );
  const nameElementResponsive = document.querySelector(
    ".greet-name-span-responsive"
  );

  const user = readUserFromStorage();
  const isGuest = !user || user.guest || !user.name;

  // Desktop
  if (greetElement) {
    if (isGuest) {
      greetElement.textContent = greetingText + "!";
      if (nameElement) nameElement.style.display = "none";
    } else {
      greetElement.textContent = greetingText + ",";
      if (nameElement) {
        nameElement.textContent = user.name;
        nameElement.style.display = "";
      }
    }
  }

  // Mobile Overlay
  if (greetElementResponsive) {
    if (isGuest) {
      greetElementResponsive.textContent = greetingText + "!";
      if (nameElementResponsive) nameElementResponsive.style.display = "none";
    } else {
      greetElementResponsive.textContent = greetingText + ",";
      if (nameElementResponsive) {
        nameElementResponsive.textContent = user.name;
        nameElementResponsive.style.display = "";
      }
    }
  }
}

/**
 * Gibt eine zeitbasierte Begrüßung zurück.
 * @returns {string} "Good morning", "Good afternoon" oder "Good evening"
 */
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Liest den aktuellen Benutzer aus dem localStorage.
 * @returns {Object|null} Das User-Objekt oder null
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

// ============================================================================
// INIT ON PAGE LOAD
// ============================================================================

document.addEventListener("DOMContentLoaded", initSummaryPage);
