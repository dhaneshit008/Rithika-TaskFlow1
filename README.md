# TaskFlow

A polished task management application built with React, Vite, Tailwind CSS, Express, JWT, and bcrypt.

## Features

- Authentication with JWT and password hashing
- Protected task dashboard
- Create, view, edit, delete, complete, and pending task flows
- Search and filter by status and priority
- Responsive, modern UI
- In-memory users and tasks for demo purposes

## Project Structure

- Frontend: client/
- Backend: server/

## Getting Started

### 1. Start the backend

```bash
cd server
node index.js
```

### 2. Start the frontend

```bash
cd client
npm run dev
```

### 3. Open the app

Visit http://localhost:5173

## Testing

### Backend tests

```bash
cd server
npm test
```

### Frontend tests

```bash
cd client
npm test
```

## Demo credentials

You can register a new account or use:

- Email: demo@taskflow.com
- Password: demo123

> The backend stores users and tasks temporarily in memory.
