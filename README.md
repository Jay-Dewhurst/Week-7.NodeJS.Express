# Full Stack Notes Application

A full stack note and task tracking application built with Node.js and Express. The backend serves a static frontend and exposes a REST API for creating, reading, updating, and deleting notes. Data is persisted to a local JSON file on the server.

## Table of Contents

1. [Features](#features)
2. [Programming Languages](#programming-languages)
3. [File and Folder Structure](#file-and-folder-structure)
4. [Local Setup and Installation](#local-setup-and-installation)
5. [CRUD Operations](#crud-create-read-update-delete)
6. [Persistent Storage](#persistent-storage)
7. [API Reference](#api-reference)
8. [Deployment](#deployment)

## Features

- Two-column interface for tracking tasks and saving notes side by side
- Create, read, update, and delete entries through the browser
- Inline editing of existing entries via `contenteditable` text
- Task completion toggling
- Duplicate entry prevention on create and update
- Data persists across server restarts using a JSON file on disk

## Programming Languages

- **Backend:** Node.js, Express
- **Frontend:** HTML, CSS, JavaScript
- **Storage:** JSON file (`data.json`) via the Node `fs` module
- **ID Generation:** `uuid` package

## File and Folder Structure

```
Week-7.NodeJS.Express/
├── public/
│   ├── index.html         # Frontend markup for the task and note UI
│   ├── script.js          # Frontend logic (fetch calls to the API)
│   └── style.css          # Styling for the interface
├── data.json              # Persistent storage for tasks and notes
├── server.js              # Express server, routes, and CRUD logic
├── package.json           # Project metadata, scripts, and dependencies
├── package-lock.json      # Locked dependency versions
├── .gitignore             # Excludes node_modules and other local files
└── README.md              # Project documentation
```

The project separates concerns by keeping API and server logic in `server.js`, and frontend assets in the `public` folder. Express serves the `public` folder directly, and all data requests go through the `/data` API route.

## Local Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/) installed (includes npm)

### Steps

1. Clone or download this repository to your machine.

2. Open a terminal in the project folder and install dependencies:

   ```bash
   npm install
   ```

   This installs the packages listed in `package.json`, which are `express` and `uuid`.

3. Start the server:

   ```bash
   npm start
   ```

   This runs `node server.js` as defined in the `scripts` section of `package.json`.

4. Open a browser and go to:

   ```
   http://localhost:3001
   ```

   The port is set in `server.js` via the `PORT` constant.

5. To stop the server, return to the terminal and press `Ctrl + C`.

No environment variables or database setup are required, since notes are stored in the local `data.json` file.

## CRUD (Create, Read, Update, Delete)

All CRUD routes are defined in `server.js` and operate on the `/data` endpoint, each route is wrapped in an `asyncHandler` helper function so that errors are caught and returned as a 500 response rather than crashing the server.

## Persistent Storage

Notes and tasks are stored in `data.json` at the root of the project, two helper functions in `server.js` handle reading from and writing to this file.

## API Reference

| Method | Route        | Description                          |
|--------|--------------|---------------------------------------|
| GET    | `/data`      | Retrieve all stored entries           |
| GET    | `/data/:id`  | Retrieve a single entry by ID         |
| POST   | `/data`      | Create a new entry                    |
| PUT    | `/data/:id`  | Update an existing entry by ID        |
| DELETE | `/data/:id`  | Delete an entry by ID                 |

## Deployment

This application is deployed on [Render.com](https://render.com/), since it is a Node.js application started with `npm start`.
No additional build step is required for deployment, set the build command to `npm install` and the start command to `npm start` when configuring the Render web service.