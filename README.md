# Join

Join is a web-based Kanban and task management application with login, board, contacts, task management, and dashboard features.

## Features

- User login and guest login
- Create, edit, and delete tasks
- Kanban board with status columns
- Filter and search tasks
- Drag and drop to move tasks
- Create, edit, and delete contacts
- Summary page with key metrics
- Responsive layout for desktop and mobile

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Firebase Realtime Database (REST API)

## Project Structure

- index.html: Entry point (login)
- html/: Pages such as Board, Summary, Add Task, Contacts, Help
- scripts/: Business logic, API calls, validation, UI logic
- render/: Rendering functions for dynamic content
- templates/: HTML template functions in JavaScript
- styles/: Page styles, global styles, responsive styles
- assets/: Icons, images, and static resources

## Requirements

- A modern browser (Chrome, Edge, Firefox)
- Optional: Node.js and npm (only for development tools like JSDoc)

## Run Locally

### Option 1: Open Directly in Browser

1. Clone or download the project.
2. Open index.html in your browser.

### Option 2: Use a Local Web Server (recommended)

1. Clone the project.
2. Start a local server, for example with VS Code Live Server.
3. Open index.html through the local server.

## Install Dev Dependencies

This project currently has one dev dependency for documentation.

```bash
npm install
```

## JSDoc Documentation (optional)

The configuration is located in jsdoc.json.

```bash
npx jsdoc -c jsdoc.json
```

The generated documentation will be available in the out/ folder.

## Data Storage

The application uses Firebase Realtime Database via REST endpoints. The base URL is defined in scripts/db.js.

## Deployment

Since this is a static frontend project, it can be deployed to platforms such as GitHub Pages, Netlify, or Vercel.

## Known Notes

- There is currently no automated test setup.
- The npm test script is currently a placeholder.

## Lizenz

ISC
