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

### Drizzle Kit
- `npx drizzle-kit studio` starts a local web UI for managing schema and migrations.
- `npx drizzle-kit migrate:dev` creates a new migration based on schema changes.

### Environment / Config
- `dotenv/config` auto-loads `.env` variables when `import 'dotenv/config'` is used.
- `DATABASE_URL` must be set before running the app.

### Docker (PostgreSQL)
- `docker compose up -d` starts Postgres in the background.
- `docker compose down` stops and removes containers.

### Difference between SQL  vs NoSQL
- SQL databases (like PostgreSQL) use structured schemas and support complex queries with JOINs, transactions, and ACID compliance. They are ideal for relational data and applications that require strong consistency.
- NoSQL databases (like MongoDB) are schema-less and can store unstructured data. They are designed for scalability and flexibility, making them suitable for applications with rapidly changing data or large volumes of unstructured data.


### Step by Step Explanation of how the code works:
1. The `index.js` file imports the `db` connection.
2. The `drizzle/schema.js` file defines the `users` table schema using Drizzle's schema builder and exports it for use in the main script.
3. The `drizzle.config.js` file configures Drizzle Kit to use the PostgreSQL database and specifies where to find the schema and migrations.
4. The `index.js`  function demonstrates how to insert a new user into the `users` table and then query all users.
5. The `db.insert(usersTable).values(...)` method is used to add a new user with a name and email.
6. The `db.select().from(usersTable)` method retrieves all users from the database.

### MVC Architecture
- Model: The `usersTable` schema in `drizzle/schema.js` represents the data model for users.
- View: Not applicable in this backend-only example, but could be implemented in a frontend or API layer.
- Controller: The functions in `index.js` (e.g., `getUserById`, `updateUser`, `deleteUser`) act as controllers that handle business logic and interact with the model.

---

## 📝 Notes / Next Steps

- Add migrations using `npx drizzle-kit migrate:dev` or `npx drizzle-kit push`.
- Add better error handling and CLI args for running different scripts.
- Persist notes / schema changes in version control.
