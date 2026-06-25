import { db } from "../models/db.js";
import { getToolById, TOOLS } from "../../shared/tools.js";
import { AppError } from "../middleware/errorHandler.js";
import type { CreateToolInput, UpdateToolInput } from "../schemas/admin.js";

export interface DbTool {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  is_active: number;
  updated_at: string;
}

function mapTool(row: DbTool) {
  const meta = getToolById(row.id);
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? meta?.description ?? "",
    category: row.category ?? meta?.category ?? "",
    isActive: row.is_active === 1,
    icon: meta?.icon ?? "🎬",
    tags: meta?.tags ?? [],
    slug: meta?.slug ?? row.id,
    processingTime: meta?.processingTime,
    placeholder: meta?.placeholder,
  };
}

export function listActiveTools() {
  const rows = db
    .prepare("SELECT * FROM tools WHERE is_active = 1 ORDER BY id")
    .all() as DbTool[];
  return rows.map(mapTool);
}

export function listAllTools() {
  const rows = db.prepare("SELECT * FROM tools ORDER BY id").all() as DbTool[];
  return rows.map(mapTool);
}

export function getTool(id: string) {
  const row = db.prepare("SELECT * FROM tools WHERE id = ?").get(id) as DbTool | undefined;
  if (!row || row.is_active === 0) {
    throw new AppError("Tool not found", 404);
  }
  return mapTool(row);
}

export function getToolAdmin(id: string) {
  const row = db.prepare("SELECT * FROM tools WHERE id = ?").get(id) as DbTool | undefined;
  if (!row) throw new AppError("Tool not found", 404);
  return mapTool(row);
}

export function updateTool(id: string, data: UpdateToolInput) {
  const existing = db.prepare("SELECT id FROM tools WHERE id = ?").get(id);
  if (!existing) throw new AppError("Tool not found", 404);

  const current = db.prepare("SELECT * FROM tools WHERE id = ?").get(id) as DbTool;
  db.prepare(
    `UPDATE tools SET
      name = ?,
      description = ?,
      category = ?,
      is_active = ?,
      updated_at = datetime('now')
    WHERE id = ?`,
  ).run(
    data.name ?? current.name,
    data.description ?? current.description,
    data.category ?? current.category,
    data.is_active !== undefined ? (data.is_active ? 1 : 0) : current.is_active,
    id,
  );
  return getToolAdmin(id);
}

export function createTool(data: CreateToolInput) {
  if (db.prepare("SELECT id FROM tools WHERE id = ?").get(data.id)) {
    throw new AppError("Tool ID already exists", 400);
  }
  db.prepare(
    "INSERT INTO tools (id, name, description, category, is_active) VALUES (?, ?, ?, ?, 1)",
  ).run(data.id, data.name, data.description ?? "", data.category ?? "");
  return getToolAdmin(data.id);
}

export function softDeleteTool(id: string) {
  const result = db
    .prepare("UPDATE tools SET is_active = 0, updated_at = datetime('now') WHERE id = ?")
    .run(id);
  if (result.changes === 0) throw new AppError("Tool not found", 404);
  return { id, isActive: false };
}

/** Ensure static metadata exists for all 12 tools */
export function syncToolsFromDefinitions() {
  for (const t of TOOLS) {
    db.prepare(
      `INSERT INTO tools (id, name, description, category, is_active)
       VALUES (?, ?, ?, ?, 1)
       ON CONFLICT(id) DO NOTHING`,
    ).run(t.id, t.name, t.description, t.category);
  }
}
