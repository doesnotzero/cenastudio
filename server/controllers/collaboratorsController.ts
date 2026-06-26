import { RequestHandler } from "express";
import { db } from "../models/db.js";
import { AppError } from "../middleware/errorHandler.js";
import type { DbCollaborator, DbCountByCount } from "../models/types.js";

// List all collaborators for the current user
export const listCollaborators: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;

    const collaborators = db
      .prepare("SELECT * FROM collaborators WHERE user_id = ? ORDER BY created_at DESC")
      .all(userId);

    res.json({ success: true, data: collaborators });
  } catch (e) {
    next(e);
  }
};

// Get a specific collaborator
export const getCollaborator: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const collaboratorId = parseInt(req.params.id);

    if (!collaboratorId) {
      throw new AppError("Collaborator ID is required", 400);
    }

    const collaborator = db
      .prepare("SELECT * FROM collaborators WHERE id = ? AND user_id = ?")
      .get(collaboratorId, userId);

    if (!collaborator) {
      throw new AppError("Collaborator not found", 404);
    }

    res.json({ success: true, data: collaborator });
  } catch (e) {
    next(e);
  }
};

// Create a new collaborator
export const createCollaborator: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { name, email, role, phone, skills, hourly_rate } = req.body;

    if (!name || !email) {
      throw new AppError("Name and email are required", 400);
    }

    const result = db
      .prepare(
        `INSERT INTO collaborators (user_id, name, email, role, phone, skills, hourly_rate, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      )
      .run(userId, name.trim(), email.trim(), role || "member", phone || "", skills || "", hourly_rate || 0);

    const newCollaborator = db
      .prepare("SELECT * FROM collaborators WHERE id = ?")
      .get(result.lastInsertRowid);

    res.json({ success: true, data: newCollaborator });
  } catch (e) {
    next(e);
  }
};

// Update a collaborator
export const updateCollaborator: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const collaboratorId = parseInt(req.params.id);
    const { name, email, role, phone, skills, hourly_rate, status } = req.body;

    if (!collaboratorId) {
      throw new AppError("Collaborator ID is required", 400);
    }

    const collaborator = db
      .prepare("SELECT * FROM collaborators WHERE id = ? AND user_id = ?")
      .get(collaboratorId, userId) as DbCollaborator | undefined;

    if (!collaborator) {
      throw new AppError("Collaborator not found", 404);
    }

    db
      .prepare(
        `UPDATE collaborators
         SET name = ?, email = ?, role = ?, phone = ?, skills = ?, hourly_rate = ?, status = ?, updated_at = datetime('now')
         WHERE id = ?`,
      )
      .run(
        name?.trim() || collaborator.name,
        email?.trim() || collaborator.email,
        role || collaborator.role,
        phone !== undefined ? phone : collaborator.phone,
        skills !== undefined ? skills : collaborator.skills,
        hourly_rate !== undefined ? hourly_rate : collaborator.hourly_rate,
        status || collaborator.status,
        collaboratorId,
      );

    const updatedCollaborator = db
      .prepare("SELECT * FROM collaborators WHERE id = ?")
      .get(collaboratorId);

    res.json({ success: true, data: updatedCollaborator });
  } catch (e) {
    next(e);
  }
};

// Delete a collaborator
export const deleteCollaborator: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const collaboratorId = parseInt(req.params.id);

    if (!collaboratorId) {
      throw new AppError("Collaborator ID is required", 400);
    }

    const collaborator = db
      .prepare("SELECT * FROM collaborators WHERE id = ? AND user_id = ?")
      .get(collaboratorId, userId);

    if (!collaborator) {
      throw new AppError("Collaborator not found", 404);
    }

    // Remove from all projects first
    db.prepare("DELETE FROM project_members WHERE collaborator_id = ?").run(collaboratorId);

    // Delete collaborator
    db.prepare("DELETE FROM collaborators WHERE id = ?").run(collaboratorId);

    res.json({ success: true, message: "Collaborator deleted successfully" });
  } catch (e) {
    next(e);
  }
};

// Get collaborator statistics
export const getCollaboratorStats: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;

    const totalCollaborators = db.prepare("SELECT COUNT(*) as count FROM collaborators WHERE user_id = ?").get(userId) as DbCountByCount;
    const activeCollaborators = db.prepare("SELECT COUNT(*) as count FROM collaborators WHERE user_id = ? AND status = 'active'").get(userId) as DbCountByCount;
    const byRole = db.prepare("SELECT role, COUNT(*) as count FROM collaborators WHERE user_id = ? GROUP BY role").all(userId);
    const totalProjects = db.prepare("SELECT COUNT(*) as count FROM project_members pm JOIN collaborators c ON pm.collaborator_id = c.id WHERE c.user_id = ?").get(userId) as DbCountByCount;

    res.json({
      success: true,
      data: {
        totalCollaborators: totalCollaborators.count,
        activeCollaborators: activeCollaborators.count,
        byRole,
        totalProjects: totalProjects.count,
      },
    });
  } catch (e) {
    next(e);
  }
};
