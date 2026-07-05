import { Request, Response } from 'express';
import { CalendarService } from '../services/calendarService';
import { EventType } from '../models/calendarEvent';

/**
 * GET /api/calendar/events
 * Lista eventos do calendário
 */
export async function getEvents(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Não autenticado' });
    }

    const { start, end } = req.query;

    let events;
    if (start && end) {
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);
      events = await CalendarService.getEvents(userId, startDate, endDate);
    } else {
      events = await CalendarService.getAllUserEvents(userId);
    }

    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar eventos' });
  }
}

/**
 * POST /api/calendar/events
 * Cria novo evento
 */
export async function createEvent(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Não autenticado' });
    }

    const { title, description, type, project_id, start_date, end_date, all_day, color } =
      req.body;

    if (!title || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: 'title, start_date e end_date são obrigatórios',
      });
    }

    const event = await CalendarService.createEvent({
      user_id: userId,
      title,
      description,
      type: (type as EventType) || EventType.OTHER,
      project_id,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      all_day: all_day || false,
      color,
    });

    res.json({ success: true, data: event });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({ success: false, error: 'Erro ao criar evento' });
  }
}

/**
 * PUT /api/calendar/events/:id
 * Atualiza evento
 */
export async function updateEvent(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, description, type, project_id, start_date, end_date, all_day, color } =
      req.body;

    const updates: any = {};
    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (type) updates.type = type;
    if (project_id !== undefined) updates.project_id = project_id;
    if (start_date) updates.start_date = new Date(start_date);
    if (end_date) updates.end_date = new Date(end_date);
    if (all_day !== undefined) updates.all_day = all_day;
    if (color !== undefined) updates.color = color;

    await CalendarService.updateEvent(parseInt(id), updates);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating calendar event:', error);
    res.status(500).json({ success: false, error: 'Erro ao atualizar evento' });
  }
}

/**
 * DELETE /api/calendar/events/:id
 * Deleta evento
 */
export async function deleteEvent(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await CalendarService.deleteEvent(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({ success: false, error: 'Erro ao deletar evento' });
  }
}

/**
 * POST /api/calendar/sync-project/:projectId
 * Sincroniza eventos de um projeto
 */
export async function syncProjectEvents(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Não autenticado' });
    }

    const { projectId } = req.params;
    await CalendarService.syncProjectEvents(userId, parseInt(projectId));

    res.json({ success: true, message: 'Eventos sincronizados' });
  } catch (error) {
    console.error('Error syncing project events:', error);
    res.status(500).json({ success: false, error: 'Erro ao sincronizar eventos' });
  }
}
