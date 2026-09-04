# Task Ledger-Managing Daily Activity

A to-do application styled as a physical accounting ledge Backend is Java (Spring Boot),
frontend is React (Vite), talking over a plain REST API.

## What makes this different from a normal to-do app

- **Focus Stamp** — pick any outstanding entry and run a 25-minute focus
  block against it right in the sidebar Each task also carries an editable estimate
  of how many focus units it will take, shown as tick marks on its row.
- **Recurring entries that regenerate themselves** — mark a daily,
  weekday-only, or weekly task done and the backend automatically opens
  the next occurrence with the correct next due date.
- **Manual ledger ordering** — drag entries to reorder; the order is
  persisted server-side (`POST /api/tasks/reorder`) and is its own sort
  mode, distinct from sorting by due date or priority.
- **Inline editing** — click any task title to rename it in place; no
  modal dialogs anywhere in the app.



## Stack

- **Backend:** Java 17, Spring Boot 3, Spring Data JPA. Swap the two datasource lines in
  `application.properties` for Postgres/MySQL in production.
- **Frontend:** React 18 + Vite, styled with CSS.

## Project structure

```
backend/
  src/main/java/com/ledger/todo/
    model/        Task entity, request/response DTOs
    repository/   Spring Data JPA repository
    service/      Business logic: recurrence engine, stats, reordering
    controller/   REST endpoints under /api/tasks
    config/       CORS config + first-run demo data seeder
frontend/
  src/
    api/          fetch-based client for the backend
    hooks/        useTasks – data fetching + optimistic UI updates
    components/   Masthead, Composer, FilterRail, LedgerList, TaskRow, FocusStamp
    styles/       design tokens (index.css) + layout/components (app.css)
```

## Running it

### 1. Backend (port 8080)

```bash
cd backend
./mvnw spring-boot:run
```

On Windows use `mvn spring-boot:run` (First install Maven) . The API is now live at
`http://localhost:8080/api/tasks`.

### 2. Frontend (port 5173)

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` calls to
the backend on port 8080, so both must be running.

## API reference

| Method | Path                     | Purpose                               |
|--------|--------------------------|---------------------------------------|
| GET    | `/api/tasks`             | List all active (non-archived) tasks  |
| GET    | `/api/tasks/stats`       | Computed summary counts               |
| POST   | `/api/tasks`             | Create a task                         |
| PUT    | `/api/tasks/{id}`        | Update a task                         |
| PATCH  | `/api/tasks/{id}/toggle` | Toggle complete (spawns recurrence)   |
| PATCH  | `/api/tasks/{id}/archive`| Archive (soft-hide) a task            |
| DELETE | `/api/tasks/{id}`        | Permanently delete a task             |
| POST   | `/api/tasks/reorder`     | Persist a new manual ordering         |


