# My Personal Notes

A modern, accessible, and robust personal note-taking application built with React.

## Features

- **Create, Read, Update, Delete (CRUD)**: Fully manage your notes directly from the dashboard.
- **Inline Editing**: Quickly edit notes without leaving the main view.
- **Archive System**: Keep your active workspace clean by archiving older notes.
- **Categories & Tags**: Dynamically generated tag filters allow you to easily categorize and find notes.
- **Advanced Sorting & Filtering**: Sort by Date or Title, and filter by Active/Archived statuses.
- **Powerful Search**: Instantly find notes by searching through titles, body content, and tags.
- **Dark & Light Mode**: Seamlessly switch between themes. Preferences are saved automatically.
- **Persistent Storage**: Never lose your notes. Everything is synchronized with your browser's `localStorage`.
- **Undo Actions**: A non-blocking toast notification allows you to undo accidental deletions.
- **Full Accessibility (A11y)**: Fully navigable via keyboard, with screen reader support (`aria` attributes and live regions).
- **Automated Testing**: Highly reliable codebase backed by a comprehensive Vitest & React Testing Library test suite.

## Tech Stack

- **React 19**
- **Vite**
- **Vanilla CSS (CSS Variables for Theming)**
- **Vitest & React Testing Library**

## Getting Started

Follow these steps to run the project locally.

### Prerequisites
- Node.js installed on your machine.

### Installation

1. Clone the repository (or extract the source code).
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Running Tests

To verify the test suite:
```bash
npm run test
```
*(If you want the UI dashboard for testing, you can add and run `npm run test -- --ui`)*

## Architecture

This project strictly adheres to a clean React architecture:
- **UI Orchestrator**: `App.jsx` handles layouts and presentation.
- **Business Logic**: State management is abstracted into custom hooks (`useNotes`, `useTheme`).
- **Data Persistence**: Local storage sync is managed via service layers (`noteService`).
- **Pure Functions**: Sorting and filtering logic are separated into utility files (`noteUtils`).
