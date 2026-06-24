import { RequestHandler } from "express";
import { db } from "../models/db.js";
import { AppError } from "../middleware/errorHandler.js";

// List members for a project
export const listProjectMembers: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const projectId = parseInt(req.params.projectId);

    if (!projectId) {
      throw new AppError("Project ID is required", 400);
    }

    // Verify user owns the project
    const project = db
      .prepare("SELECT id FROM projects WHERE id = ? AND user_id = ?")
      .get(projectId, userId);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    const members = db
      .prepare(
        `SELECT pm.*, c.name, c.email, c.role as collaborator_role
         FROM project_members pm
         LEFT JOIN collaborators c ON pm.collaborator_id = c.id
         WHERE pm.project_id = ?`,
      )
      .all(projectId);

    res.json({ success: true, data: members });
  } catch (e) {
    next(e);
  }
};

// Add a member to a project
export const addProjectMember: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const projectId = parseInt(req.params.projectId);
    const { collaboratorId, role } = req.body;

    if (!projectId || !collaboratorId) {
      throw new AppError("Project ID and Collaborator ID are required", 400);
    }

    // Verify user owns the project
    const project = db
      .prepare("SELECT id FROM projects WHERE id = ? AND user_id = ?")
      .get(projectId, userId);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    // Verify collaborator exists and belongs to user
    const collaborator = db
      .prepare("SELECT * FROM collaborators WHERE id = ? AND user_id = ?")
      .get(collaboratorId, userId);

    if (!collaborator) {
      throw new AppError("Collaborator not found", 404);
    }

    // Check if already a member
    const existing = db
      .prepare("SELECT * FROM project_members WHERE project_id = ? AND collaborator_id = ?")
      .get(projectId, collaboratorId);

    if (existing) {
      throw new AppError("Collaborator is already a member of this project", 400);
    }

    const result = db
      .prepare(
        `INSERT INTO project_members (project_id, collaborator_id, role, created_at)
         VALUES (?, ?, ?, datetime('now'))`,
      )
      .run(projectId, collaboratorId, role || "member");

    const newMember = db
      .prepare(
        `SELECT pm.*, c.name, c.email, c.role as collaborator_role
         FROM project_members pm
         LEFT JOIN collaborators c ON pm.collaborator_id = c.id
         WHERE pm.id = ?`,
      )
      .get(result.lastInsertRowid);

    res.json({ success: true, data: newMember });
  } catch (e) {
    next(e);
  }
};

// Update member role
export const updateProjectMember: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const memberId = parseInt(req.params.id);
    const { role } = req.body;

    if (!memberId) {
      throw new AppError("Member ID is required", 400);
    }

    const member = db
      .prepare(
        `SELECT pm.*, p.user_id as project_owner_id
         FROM project_members pm
         JOIN projects p ON pm.project_id = p.id
         WHERE pm.id = ?`,
      )
      .get(memberId) as any;

    if (!member) {
      throw new AppError("Member not found", 404);
    }

    if (member.project_owner_id !== userId) {
      throw new AppError("You don't have permission to update this member", 403);
    }

    db
      .prepare("UPDATE project_members SET role = ?, updated_at = datetime('now') WHERE id = ?")
      .run(role || "member", memberId);

    const updatedMember = db
      .prepare(
        `SELECT pm.*, c.name, c.email, c.role as collaborator_role
         FROM project_members pm
         LEFT JOIN collaborators c ON pm.collaborator_id = c.id
         WHERE pm.id = ?`,
      )
      .get(memberId);

    res.json({ success: true, data: updatedMember });
  } catch (e) {
    next(e);
  }
};

// Remove a member from a project
export const removeProjectMember: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const memberId = parseInt(req.params.id);

    if (!memberId) {
      throw new AppError("Member ID is required", 400);
    }

    const member = db
      .prepare(
        `SELECT pm.*, p.user_id as project_owner_id
         FROM project_members pm
         JOIN projects p ON pm.project_id = p.id
         WHERE pm.id = ?`,
      )
      .get(memberId) as any;

    if (!member) {
      throw new AppError("Member not found", 404);
    }

    if (member.project_owner_id !== userId) {
      throw new AppError("You don't have permission to remove this member", 403);
    }

    db.prepare("DELETE FROM project_members WHERE id = ?").run(memberId);

    res.json({ success: true, message: "Member removed successfully" });
  } catch (e) {
    next(e);
  }
};

// Get projects for a collaborator
export const getCollaboratorProjects: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const collaboratorId = parseInt(req.params.collaboratorId);

    if (!collaboratorId) {
      throw new AppError("Collaborator ID is required", 400);
    }

    // Verify collaborator belongs to user
    const collaborator = db
      .prepare("SELECT * FROM collaborators WHERE id = ? AND user_id = ?")
      .get(collaboratorId, userId);

    if (!collaborator) {
      throw new AppError("Collaborator not found", 404);
    }

    const projects = db
      .prepare(
        `SELECT p.*, pm.role as member_role, pm.created_at as joined_at
         FROM project_members pm
         JOIN projects p ON pm.project_id = p.id
         WHERE pm.collaborator_id = ?
         ORDER BY pm.created_at DESC`,
      )
      .all(collaboratorId);

    res.json({ success: true, data: projects });
  } catch (e) {
    next(e);
  }
};
