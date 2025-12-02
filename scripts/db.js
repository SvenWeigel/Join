/**
 * Basis-URL für die Realtime-DB / REST-API (z. B. Firebase).
 * Wird in anderen Modulen als `BASE_URL` verwendet, um Endpunkte wie
 * `${BASE_URL}/users.json` aufzurufen.
 */
const BASE_URL =
  "https://join-96f67-default-rtdb.europe-west1.firebasedatabase.app";

// ============================================================================
// TASK CRUD OPERATIONS
// ============================================================================

/**
 * Erstellt einen neuen Task in der Firebase-Datenbank.
 *
 * @param {Object} taskData - Die Task-Daten (title, description, dueDate, etc.)
 * @returns {Promise<Object>} Das erstellte Task-Objekt mit Firebase-ID
 *
 * @example
 * const newTask = await createTask({
 *   title: "Mein Task",
 *   description: "Beschreibung",
 *   dueDate: "2025-12-01",
 *   priority: "medium",
 *   category: "technical",
 *   status: "todo"
 * });
 */
async function createTask(taskData) {
  // Timestamp hinzufügen
  const task = {
    ...taskData,
    createdAt: new Date().toISOString(),
  };

  // POST-Request an Firebase - erstellt neuen Eintrag mit auto-generierter ID
  const response = await fetch(`${BASE_URL}/tasks.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  // Firebase gibt { name: "auto-generated-id" } zurück
  const data = await response.json();
  return { id: data.name, ...task };
}

/**
 * Lädt alle Tasks aus der Firebase-Datenbank.
 *
 * @returns {Promise<Object[]>} Array aller Tasks mit ihren IDs
 *
 * @example
 * const tasks = await fetchTasks();
 * // [{ id: "-abc123", title: "Task 1", ... }, { id: "-def456", title: "Task 2", ... }]
 */
async function fetchTasks() {
  const response = await fetch(`${BASE_URL}/tasks.json`);

  if (!response.ok) {
    throw new Error("Failed to load tasks");
  }

  const data = await response.json();

  // Falls keine Tasks existieren, leeres Array zurückgeben
  if (!data) return [];

  // Firebase gibt { id1: {task1}, id2: {task2} } zurück
  // Wir wandeln es in ein Array um: [{ id: "id1", ...task1 }, ...]
  return Object.entries(data).map(([id, task]) => ({
    id,
    ...task,
  }));
}

/**
 * Aktualisiert einen bestehenden Task in der Firebase-Datenbank.
 *
 * @param {string} taskId - Die Firebase-ID des Tasks
 * @param {Object} updateData - Die zu aktualisierenden Felder
 * @returns {Promise<Object>} Die aktualisierten Task-Daten
 *
 * @example
 * await updateTask("-abc123", { status: "done" });
 */
async function updateTask(taskId, updateData) {
  // PATCH aktualisiert nur die angegebenen Felder
  const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  return await response.json();
}

/**
 * Löscht einen Task aus der Firebase-Datenbank.
 *
 * @param {string} taskId - Die Firebase-ID des Tasks
 * @returns {Promise<void>}
 *
 * @example
 * await deleteTask("-abc123");
 */
async function deleteTask(taskId) {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}

// ============================================================================
// CONTACT CRUD OPERATIONS
// ============================================================================

/**
 * Erstellt einen neuen Kontakt für einen bestimmten User in Firebase.
 *
 * @param {string} userId - Die Firebase-ID des Users
 * @param {Object} contactData - Die Kontaktdaten (name, email, phone, color)
 * @returns {Promise<Object>} Der erstellte Kontakt mit Firebase-ID
 */
async function createContact(userId, contactData) {
  const contact = {
    ...contactData,
    createdAt: new Date().toISOString(),
  };

  const response = await fetch(`${BASE_URL}/users/${userId}/contacts.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });

  if (!response.ok) {
    throw new Error("Failed to create contact");
  }

  const data = await response.json();
  return { id: data.name, ...contact };
}

/**
 * Lädt alle Kontakte eines Users aus Firebase.
 *
 * @param {string} userId - Die Firebase-ID des Users
 * @returns {Promise<Object[]>} Array aller Kontakte mit ihren IDs
 */
async function fetchContacts(userId) {
  const response = await fetch(`${BASE_URL}/users/${userId}/contacts.json`);

  if (!response.ok) {
    throw new Error("Failed to load contacts");
  }

  const data = await response.json();

  if (!data) return [];

  return Object.entries(data).map(([id, contact]) => ({
    id,
    ...contact,
  }));
}

/**
 * Aktualisiert einen bestehenden Kontakt in Firebase.
 *
 * @param {string} userId - Die Firebase-ID des Users
 * @param {string} contactId - Die Firebase-ID des Kontakts
 * @param {Object} updateData - Die zu aktualisierenden Felder
 * @returns {Promise<Object>} Die aktualisierten Kontaktdaten
 */
async function updateContactInDb(userId, contactId, updateData) {
  const response = await fetch(
    `${BASE_URL}/users/${userId}/contacts/${contactId}.json`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update contact");
  }

  return await response.json();
}

/**
 * Löscht einen Kontakt aus Firebase.
 *
 * @param {string} userId - Die Firebase-ID des Users
 * @param {string} contactId - Die Firebase-ID des Kontakts
 * @returns {Promise<void>}
 */
async function deleteContactFromDb(userId, contactId) {
  const response = await fetch(
    `${BASE_URL}/users/${userId}/contacts/${contactId}.json`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete contact");
  }
}
