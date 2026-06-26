---
name: database-evolve
description: "Use when the user requests database schema changes, new tables, new columns, data migrations, seed data updates, or any SQLite/BetterSQLite3 modifications for the FRAME.AI Director. Front-loaded keywords: banco, database, db, SQLite, tabela, table, coluna, column, migration, schema, seed, dado, data, modelo, model, query, consulta, index, trigger."
---

# Skill: database-evolve

Use this skill when modifying the database schema, seed data, or data layer of the FRAME.AI Director.

## Database

**SQLite** via **better-sqlite3** (synchronous API). Initialized in `server/models/db.ts`.

```tsx
import { db } from "../models/db.js";

// Query
const rows = db.prepare("SELECT * FROM users WHERE role = ?").all("admin");

// Single row
const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

// Insert/Update/Delete
const result = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)").run(name, email);
// result.changes — number of affected rows
// result.lastInsertRowid — last insert ID
```

## Schema Location

- **Table definitions**: Inline `CREATE TABLE IF NOT EXISTS` statements in `server/models/db.ts`
- **Seed data**: Same file in `initDatabase()` function
- **Tool definitions**: `shared/tools.ts` (source of truth for tool metadata)

## Adding a New Table

1. Add `CREATE TABLE IF NOT EXISTS` statement in `server/models/db.ts` inside `initDatabase()`
2. Create corresponding service functions in `server/services/`
3. Create controller in `server/controllers/`
4. Create routes in `server/routes/`
5. Mount routes in `server/router.ts`

## Adding a New Column

Use `ALTER TABLE ADD COLUMN` pattern (SQLite limitation — no DROP COLUMN easily):

```tsx
function ensureNewColumn() {
  const cols = (db.prepare("PRAGMA table_info(my_table)").all() as { name: string }[]).map(c => c.name);
  if (!cols.includes("new_column")) {
    db.prepare("ALTER TABLE my_table ADD COLUMN new_column TEXT").run();
  }
}
```

Call this function inside `initDatabase()` after table creation.

## Seed Data

Seeded in `initDatabase()` after table creation:

```tsx
// Upsert pattern (insert or update on conflict)
db.prepare(`
  INSERT INTO tools (id, name, description, category, is_active)
  VALUES (@id, @name, @description, @category, 1)
  ON CONFLICT(id) DO UPDATE SET name = excluded.name
`).run({ id: "01", name: "Tool", description: "...", category: "..." });
```

## Current Schema Overview

**Tables:**
- `users` — id, name, email, password_hash, role, github_id, avatar_url, email_verified, created_at, updated_at
- `plans` — id, name, description, generation_limit, features
- `subscriptions` — id, user_id, plan_id, status, trial_ends_at, current_period_end, created_at
- `projects` — id, user_id, name, description, status, client_id, metadata_json, created_at, updated_at
- `tool_states` — id, project_id, tool_id, form_data, output_data, created_at, updated_at
- `tools` — id, name, description, category, is_active, updated_at
- `generation_usage` — id, user_id, tool_id, period, count
- `generation_logs` — id, user_id, tool_id, project_id, input_tokens, output_tokens, created_at
- `clients` — id, user_id, name, company, email, phone, stage, value, probability, metadata_json, created_at
- `interactions` — id, client_id, user_id, type, notes, created_at
- `opportunities` — id, client_id, user_id, title, value, stage, probability, expected_close, created_at, updated_at
- `collaborators` — id, user_id, name, email, role, phone, specialties, metadata_json, updated_at
- `project_members` — id, project_id, collaborator_id, role, created_at, updated_at
- `files` — id, user_id, project_id, name, type, size, metadata_json, file_path, content_type, created_at, updated_at
- `video_reviews` — id, user_id, project_id, title, description, file_path, video_url, status, created_at, updated_at
- `video_comments` — id, review_id, user_id, text, parent_id, timestamp, metadata_json, created_at
- `notifications` — id, user_id, type, title, message, data, read, created_at

## Data Flow

- Controllers parse request → call service → return JSON `{ success, data?, error? }`
- Services contain business logic + DB queries
- Routes define HTTP methods + middleware
- Client calls `/api/*` endpoints via `api.ts` request function

## On Vercel

DB file lives at `/tmp/frame.db` — ephemeral. Seed runs on every cold start.
Use `process.env.VERCEL === "1"` check for DB path in `db.ts`.
