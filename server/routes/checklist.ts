/**
 * Checklist Routes
 *
 * Handles checklist CRUD operations:
 * - GET /api/checklist - List items
 * - POST /api/checklist - Create item
 * - PUT /api/checklist/:id - Update item
 * - DELETE /api/checklist/:id - Delete item
 */

import { Router } from 'express';
import * as checklistController from '../controllers/checklistController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// All checklist routes require authentication
router.use(authenticate);

// GET /api/checklist
router.get('/', checklistController.listChecklistItems);

// POST /api/checklist
router.post('/', checklistController.createChecklistItem);

// PUT /api/checklist/:id
router.put('/:id', checklistController.updateChecklistItem);

// DELETE /api/checklist/:id
router.delete('/:id', checklistController.deleteChecklistItem);

export default router;
