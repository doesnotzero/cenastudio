import { db } from "../models/db.js";
import { prisma, shouldUsePrisma } from "../models/prisma.js";

export interface WorkspaceSummary {
  id: number;
  name: string;
  type: string;
  role: string;
  status: string;
}

function soloWorkspaceName(name?: string | null, email?: string | null) {
  return name?.trim() || email?.split("@")[0] || "Meu Studio";
}

export async function ensureDefaultWorkspaceForUser(
  userId: number,
  options: { name?: string | null; email?: string | null; role?: "owner" | "admin" | "member" } = {},
): Promise<WorkspaceSummary> {
  const role = options.role || "owner";

  if (shouldUsePrisma) {
    const client = prisma as any;
    const existing = await client.workspaceMember.findFirst({
      where: { userId: BigInt(userId), status: "active" },
      include: { workspace: true },
      orderBy: { id: "asc" },
    });

    if (existing?.workspace) {
      return {
        id: Number(existing.workspace.id),
        name: existing.workspace.name,
        type: existing.workspace.type,
        role: existing.role,
        status: existing.status,
      };
    }

    const workspace = await client.workspace.create({
      data: {
        name: soloWorkspaceName(options.name, options.email),
        type: "solo",
        ownerUserId: BigInt(userId),
        members: {
          create: {
            userId: BigInt(userId),
            role,
            status: "active",
            acceptedAt: new Date(),
          },
        },
      },
      include: { members: true },
    });

    const membership = workspace.members[0];
    return {
      id: Number(workspace.id),
      name: workspace.name,
      type: workspace.type,
      role: membership?.role || role,
      status: membership?.status || "active",
    };
  }

  const existing = db.prepare(
    `SELECT w.id, w.name, w.type, wm.role, wm.status
     FROM workspace_members wm
     JOIN workspaces w ON w.id = wm.workspace_id
     WHERE wm.user_id = ? AND wm.status = 'active'
     ORDER BY wm.id ASC
     LIMIT 1`,
  ).get(userId) as WorkspaceSummary | undefined;

  if (existing) return existing;

  const workspaceResult = db.prepare(
    "INSERT INTO workspaces (name, type, owner_user_id) VALUES (?, 'solo', ?)",
  ).run(soloWorkspaceName(options.name, options.email), userId);
  const workspaceId = Number(workspaceResult.lastInsertRowid);

  db.prepare(
    `INSERT OR IGNORE INTO workspace_members
      (workspace_id, user_id, role, status, accepted_at)
     VALUES (?, ?, ?, 'active', datetime('now'))`,
  ).run(workspaceId, userId, role);

  return {
    id: workspaceId,
    name: soloWorkspaceName(options.name, options.email),
    type: "solo",
    role,
    status: "active",
  };
}

export async function listWorkspacesForUser(userId: number): Promise<WorkspaceSummary[]> {
  if (shouldUsePrisma) {
    const client = prisma as any;
    const memberships = await client.workspaceMember.findMany({
      where: { userId: BigInt(userId), status: "active" },
      include: { workspace: true },
      orderBy: { id: "asc" },
    });
    return memberships.map((membership: any) => ({
      id: Number(membership.workspace.id),
      name: membership.workspace.name,
      type: membership.workspace.type,
      role: membership.role,
      status: membership.status,
    }));
  }

  return db.prepare(
    `SELECT w.id, w.name, w.type, wm.role, wm.status
     FROM workspace_members wm
     JOIN workspaces w ON w.id = wm.workspace_id
     WHERE wm.user_id = ? AND wm.status = 'active'
     ORDER BY wm.id ASC`,
  ).all(userId) as WorkspaceSummary[];
}
