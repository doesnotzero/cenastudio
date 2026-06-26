import type { RequestHandler } from "express";
import { db } from "../models/db.js";
import { AppError } from "../middleware/errorHandler.js";
import type { DbInteraction } from "../models/types.js";

// List interactions for a client or opportunity
export const listInteractions: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { clientId, opportunityId } = req.query;

    let query = `
      SELECT i.*, c.name as client_name
      FROM interactions i
      JOIN clients c ON i.client_id = c.id
      WHERE c.user_id = ?
    `;
    const params: any[] = [userId];

    if (clientId) {
      query += " AND i.client_id = ?";
      params.push(clientId);
    }

    if (opportunityId) {
      query += " AND i.opportunity_id = ?";
      params.push(opportunityId);
    }

    query += " ORDER BY i.created_at DESC LIMIT 50";

    const rows = db.prepare(query).all(...params);
    res.json({ success: true, data: rows });
  } catch (e) {
    next(e);
  }
};

// Create a new interaction
export const createInteraction: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { clientId, opportunityId, type, subject, notes, nextFollowUp } = req.body;

    if (!clientId) {
      throw new AppError("O ID do cliente é obrigatório", 400);
    }

    // Verify client ownership
    const client = db.prepare("SELECT id FROM clients WHERE id = ? AND user_id = ?").get(clientId, userId);
    if (!client) {
      throw new AppError("Cliente não encontrado ou acesso não autorizado", 404);
    }

    const result = db
      .prepare(
        `INSERT INTO interactions (user_id, client_id, opportunity_id, type, subject, notes, next_follow_up)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        userId,
        clientId,
        opportunityId || null,
        type || "note",
        subject?.trim() || null,
        notes?.trim() || null,
        nextFollowUp || null,
      );

    const newInteraction = db.prepare("SELECT * FROM interactions WHERE id = ?").get(result.lastInsertRowid);

    res.json({ success: true, data: newInteraction });
  } catch (e) {
    next(e);
  }
};

// Update interaction
export const updateInteraction: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const interactionId = req.params.id;
    const { type, subject, notes, nextFollowUp } = req.body;

    const interaction = db
      .prepare(
        `SELECT i.id, i.type, i.subject, i.notes, i.next_follow_up FROM interactions i
         JOIN clients c ON i.client_id = c.id
         WHERE i.id = ? AND c.user_id = ?`,
      )
      .get(interactionId, userId) as DbInteraction | undefined;

    if (!interaction) {
      throw new AppError("Interação não encontrada ou acesso não autorizado", 404);
    }

    db.prepare(
      `UPDATE interactions SET
        type = ?,
        subject = ?,
        notes = ?,
        next_follow_up = ?
      WHERE id = ?`,
    ).run(
      type ?? interaction.type,
      subject?.trim() ?? interaction.subject,
      notes?.trim() ?? interaction.notes,
      nextFollowUp ?? interaction.next_follow_up,
      interactionId,
    );

    const updated = db.prepare("SELECT * FROM interactions WHERE id = ?").get(interactionId);

    res.json({ success: true, data: updated });
  } catch (e) {
    next(e);
  }
};

// Delete interaction
export const deleteInteraction: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const interactionId = req.params.id;

    const result = db
      .prepare(
        `DELETE FROM interactions
         WHERE id = ? AND client_id IN (SELECT id FROM clients WHERE user_id = ?)`,
      )
      .run(interactionId, userId);

    if (result.changes === 0) {
      throw new AppError("Interação não encontrada ou acesso não autorizado", 404);
    }

    res.json({ success: true, data: { id: Number(interactionId) } });
  } catch (e) {
    next(e);
  }
};

// Get upcoming follow-ups
export const getUpcomingFollowUps: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;

    const rows = db
      .prepare(
        `SELECT i.*, c.name as client_name, c.company as client_company
         FROM interactions i
         JOIN clients c ON i.client_id = c.id
         WHERE c.user_id = ? AND i.next_follow_up IS NOT NULL
         AND date(i.next_follow_up) >= date('now')
         ORDER BY i.next_follow_up ASC
         LIMIT 20`,
      )
      .all(userId);

    res.json({ success: true, data: rows });
  } catch (e) {
    next(e);
  }
};
