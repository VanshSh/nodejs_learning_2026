# Fullstack App (Section 7)

A minimal Node.js + Drizzle ORM + PostgreSQL example project from the Udemy Fullstack course. It demonstrates using `drizzle-orm` with `pg` and Docker for a local database.

---

## ✅ What’s in this folder

- `index.js` — example script that reads/writes users using Drizzle ORM
- `db/index.js` — Drizzle `db` connection using `process.env.DATABASE_URL`
- `drizzle/schema.js` — schema definition for the `users` table
- `drizzle.config.js` — Drizzle Kit config for generating/migrating schema
- `docker-compose.yml` — local PostgreSQL instance used during development

---

## 🧩 Prerequisites

- Node.js (v18+ recommended)
- Docker & Docker Compose (for running PostgreSQL locally)

---

## 🚀 Getting started

1. Install dependencies:

```bash
npm install
```

2. Start PostgreSQL via Docker Compose:

```bash
docker compose up -d
```

3. Set the `DATABASE_URL` environment variable (matching `docker-compose.yml`) and run the script:

```bash
# macOS / Linux
export DATABASE_URL="postgres://postgres:postgres@localhost:5432/postgres"
node index.js

# Windows PowerShell
$env:DATABASE_URL = "postgres://postgres:postgres@localhost:5432/postgres"
node index.js
```

---

## 🧠 Learning Notes

### Drizzle ORM (Postgres)
- `drizzle-orm` uses a typed schema definition (`drizzle/schema.js`) to build SQL queries.
- `db.select().from(usersTable)` generates a safe `SELECT` query.
- `db.insert(usersTable).values(...)` inserts rows using parameterized queries.

### Environment / Config
- `dotenv/config` auto-loads `.env` variables when `import 'dotenv/config'` is used.
- `DATABASE_URL` must be set before running the app.

### Docker (PostgreSQL)
- `docker compose up -d` starts Postgres in the background.
- `docker compose down` stops and removes containers.

---

## 📝 Notes / Next Steps

- Add migrations using `npx drizzle-kit migrate:dev` or `npx drizzle-kit push`.
- Add better error handling and CLI args for running different scripts.
- Persist notes / schema changes in version control.
