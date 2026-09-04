# Task Ledger

A to-do application styled as a physical accounting ledger rather than a
SaaS dashboard: ruled paper, ink-red flags for what's overdue, monospace
entry IDs, and a manual drag-to-reorder list. Backend is Java (Spring Boot),
frontend is React (Vite), talking over a plain REST API.

## What makes this different from a normal to-do app

- **Focus Stamp** — pick any outstanding entry and run a 25-minute focus
  block against it right in the sidebar. Finishing a block offers to
  "stamp" the task settled. Each task also carries an editable estimate
  of how many focus units it will take, shown as tick marks on its row.
- **Recurring entries that regenerate themselves** — mark a daily,
  weekday-only, or weekly task done and the backend automatically opens
  the next occurrence with the correct next due date, computed in Java
  (`TaskService.nextDueDate`), not just re-shown from a static rule.
- **Manual ledger ordering** — drag entries to reorder; the order is
  persisted server-side (`POST /api/tasks/reorder`) and is its own sort
  mode, distinct from sorting by due date or priority.
- **Inline editing** — click any task title to rename it in place; no
  modal dialogs anywhere in the app.
- **Ledger tally strip** — a computed summary (on the books / settled /
  outstanding / due today / overdue / focus units queued) served by the
  backend from real data, not hard-coded numbers.
- **Everything is a real button** — check off, edit, expand for notes,
  archive, delete, reorder, filter by view/project, sort, and the focus
  timer are all wired to working handlers and the Spring Boot API.

## Stack

- **Backend:** Java 17, Spring Boot 3, Spring Data JPA, H2 (file-based,
  so data survives restarts). Swap the two datasource lines in
  `application.properties` for Postgres/MySQL in production.
- **Frontend:** React 18 + Vite, plain CSS (no UI kit), zero external
  icon library (glyphs are Unicode characters styled with CSS).

## Running it

### 1. Backend (port 8080)

```bash
cd backend
./mvnw spring-boot:run
```

On Windows use `mvnw.cmd spring-boot:run` (see note below about the
wrapper). The first run seeds a handful of example tasks and creates a
local `data/ledger.mv.db` file. The API is now live at
`http://localhost:8080/api/tasks`.

If you'd rather use a Maven install you already have, `mvn spring-boot:run`
works identically.

### 2. Frontend (port 5173)

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` calls to
the backend on port 8080, so both must be running.

### Building for production

```bash
cd frontend
npm run build
```

Outputs static files to `frontend/dist`, which you can serve from any
static host, or copy into `backend/src/main/resources/static` if you'd
rather Spring Boot serve everything from one process.

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

## API reference

| Method | Path                     | Purpose                              |
|--------|--------------------------|---------------------------------------|
| GET    | `/api/tasks`             | List all active (non-archived) tasks  |
| GET    | `/api/tasks/stats`       | Computed summary counts               |
| POST   | `/api/tasks`             | Create a task                         |
| PUT    | `/api/tasks/{id}`        | Update a task                         |
| PATCH  | `/api/tasks/{id}/toggle` | Toggle complete (spawns recurrence)   |
| PATCH  | `/api/tasks/{id}/archive`| Archive (soft-hide) a task            |
| DELETE | `/api/tasks/{id}`        | Permanently delete a task             |
| POST   | `/api/tasks/reorder`     | Persist a new manual ordering         |

## Note on the Maven wrapper

`backend/mvnw` is included but the wrapper jar itself is downloaded on
first run (it isn't vendored in this zip to keep it small). If your
machine has no internet access, install Maven locally and run
`mvn spring-boot:run` instead — the `pom.xml` needs no other changes.
