# Task Reminder (Go + React)

Basic task reminder app: Go REST API + React (Vite + TypeScript) UI.

## Structure

```
.
├── backend/                 # Go API
│   ├── cmd/server/          # Entry point
│   └── internal/
│       ├── handlers/        # HTTP handlers
│       ├── models/          # Domain types
│       └── store/           # In-memory store (swap for DB later)
└── frontend/                # React app (Vite)
    └── src/
        ├── api/             # API client
        ├── components/      # UI pieces
        └── types/           # Shared TypeScript types
```

## Prerequisites

- Go 1.22+
- Node.js 20+

## Run locally

**Terminal 1 — API**

```bash
cd backend
go run ./cmd/server
```

API listens on `http://localhost:8080`.

**Terminal 2 — UI**

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite proxy forwards `/api` to the Go server.

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/tasks` | List tasks |
| `POST` | `/api/tasks` | Create task (`title` required) |
| `GET` | `/api/tasks/{id}` | Get one task |
| `PUT` | `/api/tasks/{id}` | Update task |
| `DELETE` | `/api/tasks/{id}` | Delete task |

Tasks are stored in memory and reset when the server restarts.
