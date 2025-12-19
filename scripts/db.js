/**
 * @fileoverview Database Service
 * @description Handles all Firebase Realtime Database operations including CRUD for tasks, contacts, and users.
 * @module Database
 */

/**
 * Base URL for the Realtime DB / REST API (e.g. Firebase).
 * Used in other modules as `BASE_URL` to call endpoints like
 * `${BASE_URL}/users.json`.
 */
const BASE_URL =
  "https://join-96f67-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Creates a new task in the Firebase database.
 *
 * @param {Object} taskData - The task data (title, description, dueDate, etc.)
 * @returns {Promise<Object>} The created task object with Firebase ID
 *
 * @example
 * const newTask = await createTask({
 *   title: "My Task",
 *   description: "Description",
 *   dueDate: "2025-12-01",
 *   priority: "medium",
 *   category: "technical",
 *   status: "todo"
 * });
 */
async function createTask(taskData) {
  const task = {
    ...taskData,
    createdAt: new Date().toISOString(),
  };

  const response = await fetch(`${BASE_URL}/tasks.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  const data = await response.json();
  return { id: data.name, ...task };
}

/**
 * Loads all tasks from the Firebase database.
 *
 * @returns {Promise<Object[]>} Array of all tasks with their IDs
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

  if (!data) return [];

  return Object.entries(data).map(([id, task]) => ({
    id,
    ...task,
  }));
}

/**
 * Updates an existing task in the Firebase database.
 *
 * @param {string} taskId - The Firebase ID of the task
 * @param {Object} updateData - The fields to update
 * @returns {Promise<Object>} The updated task data
 *
 * @example
 * await updateTask("-abc123", { status: "done" });
 */
async function updateTask(taskId, updateData) {
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
 * Deletes a task from the Firebase database.
 *
 * @param {string} taskId - The Firebase ID of the task
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

/**
 * Creates a new contact in Firebase (global for all users).
 *
 * @param {Object} contactData - The contact data (name, email, phone, color)
 * @returns {Promise<Object>} The created contact with Firebase ID
 */
async function createContact(contactData) {
  const contact = {
    ...contactData,
    createdAt: new Date().toISOString(),
  };

  const response = await fetch(`${BASE_URL}/contacts.json`, {
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
 * Loads all contacts from Firebase (global for all users).
 *
 * @returns {Promise<Object[]>} Array of all contacts with their IDs
 */
async function fetchContacts() {
  const response = await fetch(`${BASE_URL}/contacts.json`);

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
 * Updates an existing contact in Firebase (global).
 *
 * @param {string} contactId - The Firebase ID of the contact
 * @param {Object} updateData - The fields to update
 * @returns {Promise<Object>} The updated contact data
 */
async function updateContactInDb(contactId, updateData) {
  const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error("Failed to update contact");
  }

  return await response.json();
}

/**
 * Deletes a contact from Firebase (global).
 *
 * @param {string} contactId - The Firebase ID of the contact
 * @returns {Promise<void>}
 */
async function deleteContactFromDb(contactId) {
  const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete contact");
  }
}
