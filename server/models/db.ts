import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { TOOLS } from "@shared/tools";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, "..", "..", "data", "frame.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function ensureUserColumns() {
  const userCols = (db.prepare("PRAGMA table_info(users)").all() as { name: string }[]).map(
    (c) => c.name,
  );
  if (!userCols.includes("name")) db.prepare("ALTER TABLE users ADD COLUMN name TEXT").run();
  if (!userCols.includes("avatar_url")) db.prepare("ALTER TABLE users ADD COLUMN avatar_url TEXT").run();
  if (!userCols.includes("email_verified")) {
    db.prepare("ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0").run();
  }
  if (!userCols.includes("github_id")) db.prepare("ALTER TABLE users ADD COLUMN github_id TEXT UNIQUE").run();
}

function ensureSubscriptionColumns() {
  const subCols = (db.prepare("PRAGMA table_info(subscriptions)").all() as { name: string }[]).map(
    (c) => c.name,
  );
  if (!subCols.includes("stripe_customer_id")) {
    db.prepare("ALTER TABLE subscriptions ADD COLUMN stripe_customer_id TEXT").run();
  }
  if (!subCols.includes("stripe_subscription_id")) {
    db.prepare("ALTER TABLE subscriptions ADD COLUMN stripe_subscription_id TEXT").run();
  }
}

function ensureProjectColumns() {
  const genCols = (db.prepare("PRAGMA table_info(generations)").all() as { name: string }[]).map(
    (c) => c.name,
  );
  if (!genCols.includes("project_id")) {
    db.prepare("ALTER TABLE generations ADD COLUMN project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL").run();
  }

  const projCols = (db.prepare("PRAGMA table_info(projects)").all() as { name: string }[]).map(
    (c) => c.name,
  );
  if (!projCols.includes("client_id")) {
    db.prepare("ALTER TABLE projects ADD COLUMN client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL").run();
  }
  if (!projCols.includes("status")) {
    db.prepare("ALTER TABLE projects ADD COLUMN status TEXT DEFAULT 'active'").run();
  }
}

function ensureSubscription(userId: number, planId: string, status = "active") {
  const existing = db.prepare("SELECT id FROM subscriptions WHERE user_id = ?").get(userId);
  if (!existing) {
    db.prepare(
      `INSERT INTO subscriptions (user_id, plan_id, status, current_period_end)
       VALUES (?, ?, ?, datetime('now', '+1 month'))`,
    ).run(userId, planId, status);
  }
}

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tools (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      is_active INTEGER DEFAULT 1,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS generations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      tool_id TEXT REFERENCES tools(id),
      input TEXT,
      output TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'contact',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS checkout_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      full_name TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price_brl INTEGER NOT NULL,
      generation_limit INTEGER NOT NULL,
      features TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      plan_id TEXT NOT NULL REFERENCES plans(id),
      status TEXT NOT NULL DEFAULT 'active',
      trial_ends_at TEXT,
      current_period_start TEXT DEFAULT (datetime('now')),
      current_period_end TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      tool_id TEXT NOT NULL,
      period TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, tool_id, period)
    );

    CREATE TABLE IF NOT EXISTS reset_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      metadata_json TEXT DEFAULT '{}',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS project_states (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      tool_id TEXT NOT NULL,
      form_data TEXT,
      output_data TEXT,
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(project_id, tool_id)
    );

    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      company TEXT,
      email TEXT,
      phone TEXT,
      segment TEXT DEFAULT 'direct',
      status TEXT DEFAULT 'lead',
      notes TEXT,
      total_spent INTEGER DEFAULT 0,
      first_contact_at TEXT,
      last_contact_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS opportunities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      stage TEXT DEFAULT 'prospect',
      estimated_value INTEGER,
      probability INTEGER DEFAULT 50,
      expected_close_date TEXT,
      lost_reason TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
      opportunity_id INTEGER REFERENCES opportunities(id) ON DELETE SET NULL,
      type TEXT,
      subject TEXT,
      notes TEXT,
      next_follow_up TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS collaborators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      role TEXT,
      email TEXT,
      phone TEXT,
      skills TEXT,
      daily_rate INTEGER,
      availability TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS project_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      collaborator_id INTEGER REFERENCES collaborators(id) ON DELETE CASCADE,
      role TEXT DEFAULT 'member',
      permissions TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT,
      size INTEGER,
      path TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS video_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      file_id INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'draft',
      share_token TEXT UNIQUE,
      expires_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS video_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      review_id INTEGER NOT NULL REFERENCES video_reviews(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      author_name TEXT NOT NULL,
      timestamp_seconds REAL NOT NULL,
      comment TEXT NOT NULL,
      resolved INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  ensureUserColumns();
  ensureSubscriptionColumns();
  ensureProjectColumns();

  const planCount = db.prepare("SELECT COUNT(*) as c FROM plans").get() as { c: number };
  if (planCount.c === 0) {
    const insertPlan = db.prepare(
      "INSERT INTO plans (id, name, price_brl, generation_limit, features) VALUES (?, ?, ?, ?, ?)",
    );
    insertPlan.run(
      "free",
      "Free",
      0,
      5,
      JSON.stringify(["5 gerações/mês", "Acesso a 6 ferramentas", "Export .txt"]),
    );
    insertPlan.run(
      "pro",
      "Pro",
      4900,
      50,
      JSON.stringify([
        "50 gerações/mês",
        "Todas as 12 ferramentas",
        "Export PDF e DOCX",
        "Histórico completo",
      ]),
    );
    insertPlan.run(
      "studio",
      "Studio",
      9900,
      -1,
      JSON.stringify([
        "Gerações ilimitadas",
        "Todas as 12 ferramentas",
        "Projetos e pastas",
        "Suporte prioritário",
      ]),
    );
  }

  const seedAdmin = db.prepare("SELECT id FROM users WHERE email = ?").get("admin@frame.ai") as
    | { id: number }
    | undefined;
  if (!seedAdmin) {
    const hash = bcrypt.hashSync(process.env.ADMIN_DEFAULT_PASSWORD || "admin123", 10);
    const result = db
      .prepare(
        "INSERT INTO users (name, email, password_hash, role, email_verified) VALUES (?, ?, ?, 'admin', 1)",
      )
      .run("Admin", "admin@frame.ai", hash);
    ensureSubscription(Number(result.lastInsertRowid), "studio", "active");
  } else {
    ensureSubscription(seedAdmin.id, "studio", "active");
  }

  const seedDemo = db.prepare("SELECT id FROM users WHERE email = ?").get("demo@frame.ai") as
    | { id: number }
    | undefined;
  if (!seedDemo) {
    const hash = bcrypt.hashSync(process.env.DEMO_USER_PASSWORD || "demo123", 10);
    const result = db
      .prepare(
        "INSERT INTO users (name, email, password_hash, role, email_verified) VALUES (?, ?, ?, 'user', 1)",
      )
      .run("Demo User", "demo@frame.ai", hash);
    ensureSubscription(Number(result.lastInsertRowid), "free", "active");
  } else {
    ensureSubscription(seedDemo.id, "free", "active");
  }

  const insertTool = db.prepare(`
    INSERT INTO tools (id, name, description, category, is_active)
    VALUES (@id, @name, @description, @category, 1)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      description = excluded.description,
      category = excluded.category,
      updated_at = datetime('now')
  `);

  for (const tool of TOOLS) {
    insertTool.run({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category: tool.category,
    });
  }
}
