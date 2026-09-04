# Task Ledger-Managing Daily Activity Website

A to-do application styled as a physical accounting ledge Backend is Java (Spring Boot),
frontend is React (Vite), talking over a plain REST API.

## ✨ Features 

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



## 🛠️ Tech Stack

- **Backend:** Java 17, Spring Boot 3, Spring Data JPA. Swap the two datasource lines in
  `application.properties` for Postgres/MySQL in production.
- **Frontend:** React 18 + Vite, styled with CSS.

## 📁 Project Structure
```
Task_Ledger/
├── backend/
│   ├── .mvn/wrapper/                  # Maven wrapper binaries and properties
│   ├── src/main/java/com/ledger/todo/
│   │   ├── config/                    # CORS configuration and first-run demo data seeder
│   │   ├── controller/                # REST endpoints under /api/tasks
│   │   ├── model/                     # Task entity, request/response DTOs
│   │   ├── repository/                # Spring Data JPA repositories
│   │   ├── service/                   # Business logic: recurrence engine, stats, reordering
│   │   └── TodoLedgerApplication.java # Spring Boot application entry point
│   ├── src/main/resources/
│   │   └── application.properties     # Database & server configurations
│   ├── .gitignore                     # Backend Git ignore rules
│   ├── mvnw                           # Maven wrapper execution script
│   └── pom.xml                        # Maven dependencies and build setup
│
├── frontend/
│   ├── public/                        # Static assets and favicon
│   ├── src/
│   │   ├── api/                       # Fetch-based API client for backend communication
│   │   ├── components/                # UI components: Masthead, Composer, FilterRail, TaskRow, FocusStamp
│   │   ├── hooks/                     # Custom hooks: useTasks (optimistic UI & data fetching)
│   │   ├── styles/                    # Design tokens (index.css) & component layouts (app.css)
│   │   ├── App.jsx                    # Root view orchestrator
│   │   └── main.jsx                   # React application mount point
│   ├── .gitignore                     # Frontend Git ignore rules
│   ├── index.html                     # Frontend HTML template
│   ├── package.json                   # UI dependencies and build scripts
│   ├── package-lock.json              # Locked npm dependency tree
│   └── vite.config.js                 # Vite bundler and dev server configuration
│
└── README.md                          # Full-stack documentation and setup guide
```

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



## 🚀 Getting Started

### **Clone the repository:**

```bash
git clone https://github.com/Priyansh2811/TaskLedger.git
```

### 1. Backend (Port 8080):
In first terminal:

```bash
cd backend
./mvnw spring-boot:run
```

### 2. Frontend (port 5173):

In second terminal:

```bash
cd frontend
npm install
npm run dev
```
### 3. Open in browser:
```bash
http://localhost:5173
``` 


