import type { RequestHandler } from "express";
import { db } from "../models/db.js";
import { AppError } from "../middleware/errorHandler.js";

// List all opportunities for current user
export const listOpportunities: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { stage, clientId } = req.query;

    let query = `
      SELECT o.*, c.name as client_name, c.company as client_company
      FROM opportunities o
      LEFT JOIN clients c ON o.client_id = c.id
      WHERE o.user_id = ?
    `;
    const params: any[] = [userId];

    if (stage) {
      query += " AND o.stage = ?";
      params.push(stage);
    }

    if (clientId) {
      query += " AND o.client_id = ?";
      params.push(clientId);
    }

    query += " ORDER BY o.updated_at DESC";

    const rows = db.prepare(query).all(...params);
    res.json({ success: true, data: rows });
  } catch (e) {
    next(e);
  }
};

// Get specific opportunity
export const getOpportunity: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const opportunityId = req.params.id;

    const opportunity = db
      .prepare(
        `SELECT o.*, c.name as client_name, c.company as client_company
         FROM opportunities o
         LEFT JOIN clients c ON o.client_id = c.id
         WHERE o.id = ? AND o.user_id = ?`,
      )
      .get(opportunityId, userId);

    if (!opportunity) {
      throw new AppError("Oportunidade não encontrada ou acesso não autorizado", 404);
    }

    // Get interactions for this opportunity
    const interactions = db
      .prepare("SELECT * FROM interactions WHERE opportunity_id = ? ORDER BY created_at DESC")
      .all(opportunityId);

    res.json({
      success: true,
      data: {
        opportunity,
        interactions: interactions || [],
      },
    });
  } catch (e) {
    next(e);
  }
};

// Create a new opportunity
export const createOpportunity: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { clientId, title, stage, estimatedValue, probability, expectedCloseDate } = req.body;

    if (!title || !title.trim()) {
      throw new AppError("O título da oportunidade é obrigatório", 400);
    }

    const result = db
      .prepare(
        `INSERT INTO opportunities (user_id, client_id, title, stage, estimated_value, probability, expected_close_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        userId,
        clientId || null,
        title.trim(),
        stage || "prospect",
        estimatedValue || null,
        probability || 50,
        expectedCloseDate || null,
      );

    const newOpportunity = db.prepare("SELECT * FROM opportunities WHERE id = ?").get(result.lastInsertRowid);

    res.json({ success: true, data: newOpportunity });
  } catch (e) {
    next(e);
  }
};

// Update opportunity (move stage, update details)
export const updateOpportunity: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const opportunityId = req.params.id;
    const { title, stage, estimatedValue, probability, expectedCloseDate, lostReason } = req.body;

    const opportunity = db
      .prepare("SELECT * FROM opportunities WHERE id = ? AND user_id = ?")
      .get(opportunityId, userId) as Record<string, any> | undefined;

    if (!opportunity) {
      throw new AppError("Oportunidade não encontrada ou acesso não autorizado", 404);
    }

    db.prepare(
      `UPDATE opportunities SET
        title = ?,
        stage = ?,
        estimated_value = ?,
        probability = ?,
        expected_close_date = ?,
        lost_reason = ?,
        updated_at = datetime('now')
      WHERE id = ? AND user_id = ?`,
    ).run(
      title?.trim() ?? opportunity.title,
      stage ?? opportunity.stage,
      estimatedValue !== undefined ? estimatedValue : opportunity.estimated_value,
      probability !== undefined ? probability : opportunity.probability,
      expectedCloseDate ?? opportunity.expected_close_date,
      lostReason ?? opportunity.lost_reason,
      opportunityId,
      userId,
    );

    const updated = db.prepare("SELECT * FROM opportunities WHERE id = ?").get(opportunityId);

    res.json({ success: true, data: updated });
  } catch (e) {
    next(e);
  }
};

// Delete opportunity
export const deleteOpportunity: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const opportunityId = req.params.id;

    const result = db.prepare("DELETE FROM opportunities WHERE id = ? AND user_id = ?").run(opportunityId, userId);

    if (result.changes === 0) {
      throw new AppError("Oportunidade não encontrada ou acesso não autorizado", 404);
    }

    res.json({ success: true, data: { id: Number(opportunityId) } });
  } catch (e) {
    next(e);
  }
};

// Get pipeline statistics
export const getPipelineStats: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;

    const totalOpportunities = db.prepare("SELECT COUNT(*) as c FROM opportunities WHERE user_id = ?").get(userId) as { c: number };
    const totalValue = db.prepare("SELECT COALESCE(SUM(estimated_value), 0) as s FROM opportunities WHERE user_id = ? AND stage != 'lost'").get(userId) as { s: number };

    // By stage
    const byStage = db
      .prepare(
        `SELECT stage, COUNT(*) as count, COALESCE(SUM(estimated_value), 0) as value
         FROM opportunities
         WHERE user_id = ? AND stage != 'lost'
         GROUP BY stage`,
      )
      .all(userId);

    // Won this month
    const wonThisMonth = db
      .prepare(
        `SELECT COUNT(*) as c, COALESCE(SUM(estimated_value), 0) as s
         FROM opportunities
         WHERE user_id = ? AND stage = 'won'
         AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`,
      )
      .get(userId) as { c: number; s: number };

    res.json({
      success: true,
      data: {
        totalOpportunities: totalOpportunities.c,
        totalPipelineValue: totalValue.s,
        byStage,
        wonThisMonth: {
          count: wonThisMonth.c,
          value: wonThisMonth.s,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};
