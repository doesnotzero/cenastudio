import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  syncProjectEvents,
} from '../controllers/calendarController';

const router = Router();

// Todas rotas requerem autenticação
router.use(requireAuth);

// GET /api/calendar/events - Lista eventos
router.get('/events', getEvents);

// POST /api/calendar/events - Cria evento
router.post('/events', createEvent);

// PUT /api/calendar/events/:id - Atualiza evento
router.put('/events/:id', updateEvent);

// DELETE /api/calendar/events/:id - Deleta evento
router.delete('/events/:id', deleteEvent);

// POST /api/calendar/sync-project/:projectId - Sincroniza projeto
router.post('/sync-project/:projectId', syncProjectEvents);

export default router;
