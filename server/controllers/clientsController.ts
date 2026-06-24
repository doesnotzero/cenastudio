import type { RequestHandler } from "express";
import { db } from "../models/db.js";
import { AppError } from "../middleware/errorHandler.js";

// List all clients for current user
export const listClients: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { status, segment, search } = req.query;

    let query = "SELECT * FROM clients WHERE user_id = ?";
    const params: any[] = [userId];

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    if (segment) {
      query += " AND segment = ?";
      params.push(segment);
    }

    if (search) {
      query += " AND (name LIKE ? OR company LIKE ? OR email LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += " ORDER BY updated_at DESC";

    const rows = db.prepare(query).all(...params);
    res.json({ success: true, data: rows });
  } catch (e) {
    next(e);
  }
};

// Get specific client details
export const getClient: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const clientId = req.params.id;

    const client = db
      .prepare("SELECT * FROM clients WHERE id = ? AND user_id = ?")
      .get(clientId, userId);

    if (!client) {
      throw new AppError("Cliente não encontrado ou acesso não autorizado", 404);
    }

    // Get projects for this client
    const projects = db
      .prepare("SELECT id, name, status, created_at FROM projects WHERE client_id = ? ORDER BY created_at DESC")
      .all(clientId);

    // Get opportunities for this client
    const opportunities = db
      .prepare("SELECT * FROM opportunities WHERE client_id = ? ORDER BY updated_at DESC")
      .all(clientId);

    // Get recent interactions
    const interactions = db
      .prepare("SELECT * FROM interactions WHERE client_id = ? ORDER BY created_at DESC LIMIT 10")
      .all(clientId);

    res.json({
      success: true,
      data: {
        client,
        projects: projects || [],
        opportunities: opportunities || [],
        interactions: interactions || [],
      },
    });
  } catch (e) {
    next(e);
  }
};

// Create a new client
export const createClient: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { name, company, email, phone, segment, status, notes } = req.body;

    if (!name || !name.trim()) {
      throw new AppError("O nome do cliente é obrigatório", 400);
    }

    const result = db
      .prepare(
        `INSERT INTO clients (user_id, name, company, email, phone, segment, status, notes, first_contact_at, last_contact_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      )
      .run(
        userId,
        name.trim(),
        company?.trim() || null,
        email?.trim() || null,
        phone?.trim() || null,
        segment || "direct",
        status || "lead",
        notes?.trim() || null,
      );

    const newClient = db.prepare("SELECT * FROM clients WHERE id = ?").get(result.lastInsertRowid);

    res.json({ success: true, data: newClient });
  } catch (e) {
    next(e);
  }
};

// Update client
export const updateClient: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const clientId = req.params.id;
    const { name, company, email, phone, segment, status, notes, total_spent } = req.body;

    const client = db
      .prepare("SELECT * FROM clients WHERE id = ? AND user_id = ?")
      .get(clientId, userId) as Record<string, any> | undefined;

    if (!client) {
      throw new AppError("Cliente não encontrado ou acesso não autorizado", 404);
    }

    db.prepare(
      `UPDATE clients SET
        name = ?,
        company = ?,
        email = ?,
        phone = ?,
        segment = ?,
        status = ?,
        notes = ?,
        total_spent = COALESCE(?, total_spent),
        last_contact_at = datetime('now'),
        updated_at = datetime('now')
      WHERE id = ? AND user_id = ?`,
    ).run(
      name?.trim() ?? client.name,
      company?.trim() ?? client.company,
      email?.trim() ?? client.email,
      phone?.trim() ?? client.phone,
      segment ?? client.segment,
      status ?? client.status,
      notes?.trim() ?? client.notes,
      total_spent !== undefined ? total_spent : null,
      clientId,
      userId,
    );

    const updated = db.prepare("SELECT * FROM clients WHERE id = ?").get(clientId);

    res.json({ success: true, data: updated });
  } catch (e) {
    next(e);
  }
};

// Delete client
export const deleteClient: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;
    const clientId = req.params.id;

    const result = db.prepare("DELETE FROM clients WHERE id = ? AND user_id = ?").run(clientId, userId);

    if (result.changes === 0) {
      throw new AppError("Cliente não encontrado ou acesso não autorizado", 404);
    }

    res.json({ success: true, data: { id: Number(clientId) } });
  } catch (e) {
    next(e);
  }
};

// Get client statistics
export const getClientStats: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user!.id;

    const totalClients = db.prepare("SELECT COUNT(*) as c FROM clients WHERE user_id = ?").get(userId) as { c: number };
    const activeClients = db.prepare("SELECT COUNT(*) as c FROM clients WHERE user_id = ? AND status = 'active'").get(userId) as { c: number };
    const leadClients = db.prepare("SELECT COUNT(*) as c FROM clients WHERE user_id = ? AND status = 'lead'").get(userId) as { c: number };
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(total_spent), 0) as s FROM clients WHERE user_id = ?").get(userId) as { s: number };

    // Clients by segment
    const bySegment = db.prepare("SELECT segment, COUNT(*) as count FROM clients WHERE user_id = ? GROUP BY segment").all(userId);

    // Recent activity
    const recentActivity = db
      .prepare(
        `SELECT i.*, c.name as client_name FROM interactions i
         JOIN clients c ON i.client_id = c.id
         WHERE c.user_id = ?
         ORDER BY i.created_at DESC LIMIT 5`,
      )
      .all(userId);

    res.json({
      success: true,
      data: {
        totalClients: totalClients.c,
        activeClients: activeClients.c,
        leadClients: leadClients.c,
        totalRevenue: totalRevenue.s,
        bySegment,
        recentActivity,
      },
    });
  } catch (e) {
    next(e);
  }
};
