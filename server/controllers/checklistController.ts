/**
 * Checklist Controller
 *
 * Handles checklist CRUD operations:
 * - GET /api/checklist - List items
 * - POST /api/checklist - Create item
 * - PUT /api/checklist/:id - Update item
 * - DELETE /api/checklist/:id - Delete item
 */

import type { Request, Response } from 'express';
import { prisma, shouldUsePrisma } from '../models/prisma.js';
import { db } from '../models/db.js';
import { jsonSafe } from '../utils/prismaSerialization.js';

interface ChecklistItemData {
  id: string;
  text: string;
  checked: boolean;
  link?: string | null;
}

/**
 * GET /api/checklist
 *
 * Returns all checklist items for the authenticated user.
 * Items are ordered by creation date (newest first).
 *
 * Query params:
 * - status: 'completed' | 'pending' | 'all' (default: 'all')
 *
 * @param req - Express request with authenticated user
 * @param res - Express response
 */
export async function listChecklistItems(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const status = (req.query.status as string) || 'all';

    if (shouldUsePrisma) {
      // Use Prisma
      const where: any = {
        userId: BigInt(userId),
      };

      // Add status filter
      if (status === 'completed') {
        where.checked = true;
      } else if (status === 'pending') {
        where.checked = false;
      }

      const items = await prisma.checklistItem.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Serialize items
      const serializedItems = items.map((item) => {
        const safe = jsonSafe(item);
        return {
          id: String(safe.id),
          text: safe.text,
          checked: safe.checked,
          link: safe.link || undefined,
        };
      });

      return res.json({
        success: true,
        data: serializedItems,
      });
    } else {
      // Use SQLite
      let query = `
        SELECT id, text, checked, link
        FROM checklist_items
        WHERE user_id = ?
      `;

      const params: any[] = [userId];

      // Add status filter
      if (status === 'completed') {
        query += ' AND checked = 1';
      } else if (status === 'pending') {
        query += ' AND checked = 0';
      }

      query += ' ORDER BY created_at DESC';

      const items = await db.prepare(query).all(...params) as Array<{
        id: number;
        text: string;
        checked: number;
        link: string | null;
      }>;

      // Serialize items
      const serializedItems = items.map((item) => ({
        id: String(item.id),
        text: item.text,
        checked: item.checked === 1,
        link: item.link || undefined,
      }));

      return res.json({
        success: true,
        data: serializedItems,
      });
    }
  } catch (error) {
    console.error('Error listing checklist items:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to list checklist items',
    });
  }
}

/**
 * POST /api/checklist
 *
 * Creates a new checklist item for the authenticated user.
 *
 * Body:
 * - text: string (required)
 * - link: string (optional)
 *
 * @param req - Express request with authenticated user
 * @param res - Express response
 */
export async function createChecklistItem(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const { text, link } = req.body;

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Text is required and must be a non-empty string',
      });
    }

    if (link !== undefined && link !== null && typeof link !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Link must be a string',
      });
    }

    if (shouldUsePrisma) {
      // Use Prisma
      const item = await prisma.checklistItem.create({
        data: {
          userId: BigInt(userId),
          text: text.trim(),
          link: link || null,
        },
      });

      const safe = jsonSafe(item);

      return res.status(201).json({
        success: true,
        data: {
          id: String(safe.id),
          text: safe.text,
          checked: safe.checked,
          link: safe.link || undefined,
        },
      });
    } else {
      // Use SQLite
      const result = await db.prepare(`
        INSERT INTO checklist_items (user_id, text, checked, link, created_at, updated_at)
        VALUES (?, ?, 0, ?, datetime('now'), datetime('now'))
      `).run(userId, text.trim(), link || null);

      const insertedId = result.lastInsertRowid;

      return res.status(201).json({
        success: true,
        data: {
          id: String(insertedId),
          text: text.trim(),
          checked: false,
          link: link || undefined,
        },
      });
    }
  } catch (error) {
    console.error('Error creating checklist item:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create checklist item',
    });
  }
}

/**
 * PUT /api/checklist/:id
 *
 * Updates a checklist item (toggle checked status or update text).
 *
 * Body:
 * - text: string (optional)
 * - checked: boolean (optional)
 * - link: string (optional)
 *
 * @param req - Express request with authenticated user
 * @param res - Express response
 */
export async function updateChecklistItem(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const { id } = req.params;
    const { text, checked, link } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Item ID is required',
      });
    }

    // Build update data
    const updates: any = {};

    if (text !== undefined) {
      if (typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Text must be a non-empty string',
        });
      }
      updates.text = text.trim();
    }

    if (checked !== undefined) {
      if (typeof checked !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'Checked must be a boolean',
        });
      }
      updates.checked = checked;
    }

    if (link !== undefined) {
      if (link !== null && typeof link !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Link must be a string or null',
        });
      }
      updates.link = link || null;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update',
      });
    }

    if (shouldUsePrisma) {
      // Use Prisma
      // First, check if item exists and belongs to user
      const existing = await prisma.checklistItem.findFirst({
        where: {
          id: BigInt(id),
          userId: BigInt(userId),
        },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Checklist item not found',
        });
      }

      // Update item
      const item = await prisma.checklistItem.update({
        where: {
          id: BigInt(id),
        },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });

      const safe = jsonSafe(item);

      return res.json({
        success: true,
        data: {
          id: String(safe.id),
          text: safe.text,
          checked: safe.checked,
          link: safe.link || undefined,
        },
      });
    } else {
      // Use SQLite
      // First, check if item exists and belongs to user
      const existing = await db.prepare(
        'SELECT id FROM checklist_items WHERE id = ? AND user_id = ?'
      ).get(id, userId);

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Checklist item not found',
        });
      }

      // Build SQL update query
      const setClauses: string[] = [];
      const params: any[] = [];

      if (updates.text !== undefined) {
        setClauses.push('text = ?');
        params.push(updates.text);
      }

      if (updates.checked !== undefined) {
        setClauses.push('checked = ?');
        params.push(updates.checked ? 1 : 0);
      }

      if (updates.link !== undefined) {
        setClauses.push('link = ?');
        params.push(updates.link);
      }

      setClauses.push("updated_at = datetime('now')");

      const query = `
        UPDATE checklist_items
        SET ${setClauses.join(', ')}
        WHERE id = ? AND user_id = ?
      `;

      params.push(id, userId);

      await db.prepare(query).run(...params);

      // Fetch updated item
      const updated = await db.prepare(
        'SELECT id, text, checked, link FROM checklist_items WHERE id = ?'
      ).get(id) as {
        id: number;
        text: string;
        checked: number;
        link: string | null;
      };

      return res.json({
        success: true,
        data: {
          id: String(updated.id),
          text: updated.text,
          checked: updated.checked === 1,
          link: updated.link || undefined,
        },
      });
    }
  } catch (error) {
    console.error('Error updating checklist item:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update checklist item',
    });
  }
}

/**
 * DELETE /api/checklist/:id
 *
 * Deletes a checklist item.
 *
 * @param req - Express request with authenticated user
 * @param res - Express response
 */
export async function deleteChecklistItem(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Item ID is required',
      });
    }

    if (shouldUsePrisma) {
      // Use Prisma
      // Check if item exists and belongs to user
      const existing = await prisma.checklistItem.findFirst({
        where: {
          id: BigInt(id),
          userId: BigInt(userId),
        },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Checklist item not found',
        });
      }

      // Delete item
      await prisma.checklistItem.delete({
        where: {
          id: BigInt(id),
        },
      });

      return res.json({
        success: true,
        data: {
          id: String(id),
        },
      });
    } else {
      // Use SQLite
      // Check if item exists and belongs to user
      const existing = await db.prepare(
        'SELECT id FROM checklist_items WHERE id = ? AND user_id = ?'
      ).get(id, userId);

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Checklist item not found',
        });
      }

      // Delete item
      await db.prepare(
        'DELETE FROM checklist_items WHERE id = ? AND user_id = ?'
      ).run(id, userId);

      return res.json({
        success: true,
        data: {
          id: String(id),
        },
      });
    }
  } catch (error) {
    console.error('Error deleting checklist item:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete checklist item',
    });
  }
}
