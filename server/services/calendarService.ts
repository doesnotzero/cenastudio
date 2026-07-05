import { db, shouldUsePrisma } from '../lib/db';
import { supabase } from '../lib/supabase';
import { CalendarEvent, CreateCalendarEventInput } from '../models/calendarEvent';

export class CalendarService {
  /**
   * Cria novo evento no calendário
   */
  static async createEvent(data: CreateCalendarEventInput): Promise<CalendarEvent> {
    if (shouldUsePrisma) {
      const { data: event, error } = await supabase
        .from('calendar_events')
        .insert({
          user_id: data.user_id,
          title: data.title,
          description: data.description,
          type: data.type,
          project_id: data.project_id,
          start_date: data.start_date.toISOString(),
          end_date: data.end_date.toISOString(),
          all_day: data.all_day || false,
          color: data.color,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        ...event,
        start_date: new Date(event.start_date),
        end_date: new Date(event.end_date),
        created_at: new Date(event.created_at),
      };
    } else {
      const stmt = db.prepare(`
        INSERT INTO calendar_events
        (user_id, title, description, type, project_id, start_date, end_date, all_day, color, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `);
      const result = stmt.run(
        data.user_id,
        data.title,
        data.description || null,
        data.type,
        data.project_id || null,
        data.start_date.toISOString(),
        data.end_date.toISOString(),
        data.all_day ? 1 : 0,
        data.color || null
      );

      return {
        id: Number(result.lastInsertRowid),
        ...data,
        all_day: data.all_day || false,
        created_at: new Date(),
      };
    }
  }

  /**
   * Busca eventos de um usuário em um período
   */
  static async getEvents(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<CalendarEvent[]> {
    if (shouldUsePrisma) {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', userId)
        .gte('start_date', startDate.toISOString())
        .lte('end_date', endDate.toISOString())
        .order('start_date', { ascending: true });

      if (error) throw error;
      return (data || []).map((event) => ({
        ...event,
        start_date: new Date(event.start_date),
        end_date: new Date(event.end_date),
        created_at: new Date(event.created_at),
      }));
    } else {
      const stmt = db.prepare(`
        SELECT * FROM calendar_events
        WHERE user_id = ?
        AND start_date >= ?
        AND end_date <= ?
        ORDER BY start_date ASC
      `);
      const events = stmt.all(
        userId,
        startDate.toISOString(),
        endDate.toISOString()
      ) as any[];

      return events.map((event) => ({
        ...event,
        all_day: event.all_day === 1,
        start_date: new Date(event.start_date),
        end_date: new Date(event.end_date),
        created_at: new Date(event.created_at),
      }));
    }
  }

  /**
   * Busca todos eventos de um usuário
   */
  static async getAllUserEvents(userId: number): Promise<CalendarEvent[]> {
    if (shouldUsePrisma) {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: true });

      if (error) throw error;
      return (data || []).map((event) => ({
        ...event,
        start_date: new Date(event.start_date),
        end_date: new Date(event.end_date),
        created_at: new Date(event.created_at),
      }));
    } else {
      const stmt = db.prepare(`
        SELECT * FROM calendar_events
        WHERE user_id = ?
        ORDER BY start_date ASC
      `);
      const events = stmt.all(userId) as any[];

      return events.map((event) => ({
        ...event,
        all_day: event.all_day === 1,
        start_date: new Date(event.start_date),
        end_date: new Date(event.end_date),
        created_at: new Date(event.created_at),
      }));
    }
  }

  /**
   * Atualiza evento
   */
  static async updateEvent(
    eventId: number,
    updates: Partial<CreateCalendarEventInput>
  ): Promise<void> {
    if (shouldUsePrisma) {
      const updateData: any = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.type) updateData.type = updates.type;
      if (updates.project_id !== undefined) updateData.project_id = updates.project_id;
      if (updates.start_date) updateData.start_date = updates.start_date.toISOString();
      if (updates.end_date) updateData.end_date = updates.end_date.toISOString();
      if (updates.all_day !== undefined) updateData.all_day = updates.all_day;
      if (updates.color !== undefined) updateData.color = updates.color;

      const { error } = await supabase
        .from('calendar_events')
        .update(updateData)
        .eq('id', eventId);

      if (error) throw error;
    } else {
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.title) {
        fields.push('title = ?');
        values.push(updates.title);
      }
      if (updates.description !== undefined) {
        fields.push('description = ?');
        values.push(updates.description);
      }
      if (updates.type) {
        fields.push('type = ?');
        values.push(updates.type);
      }
      if (updates.project_id !== undefined) {
        fields.push('project_id = ?');
        values.push(updates.project_id);
      }
      if (updates.start_date) {
        fields.push('start_date = ?');
        values.push(updates.start_date.toISOString());
      }
      if (updates.end_date) {
        fields.push('end_date = ?');
        values.push(updates.end_date.toISOString());
      }
      if (updates.all_day !== undefined) {
        fields.push('all_day = ?');
        values.push(updates.all_day ? 1 : 0);
      }
      if (updates.color !== undefined) {
        fields.push('color = ?');
        values.push(updates.color);
      }

      if (fields.length === 0) return;

      values.push(eventId);
      const stmt = db.prepare(`
        UPDATE calendar_events
        SET ${fields.join(', ')}
        WHERE id = ?
      `);
      stmt.run(...values);
    }
  }

  /**
   * Deleta evento
   */
  static async deleteEvent(eventId: number): Promise<void> {
    if (shouldUsePrisma) {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
    } else {
      const stmt = db.prepare('DELETE FROM calendar_events WHERE id = ?');
      stmt.run(eventId);
    }
  }

  /**
   * Cria eventos automaticamente a partir de projetos
   */
  static async syncProjectEvents(userId: number, projectId: number): Promise<void> {
    // Buscar informações do projeto
    let project: any;

    if (shouldUsePrisma) {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      project = data;
    } else {
      const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
      project = stmt.get(projectId);
    }

    if (!project) return;

    // Criar evento para o projeto (se tiver datas no metadata)
    const metadata = typeof project.metadata_json === 'string'
      ? JSON.parse(project.metadata_json)
      : project.metadata_json || {};

    if (metadata.start_date || metadata.deadline) {
      await this.createEvent({
        user_id: userId,
        title: `Projeto: ${project.name}`,
        description: project.description,
        type: 'project',
        project_id: projectId,
        start_date: metadata.start_date ? new Date(metadata.start_date) : new Date(),
        end_date: metadata.deadline ? new Date(metadata.deadline) : new Date(),
        all_day: true,
        color: metadata.color || '#3b82f6',
      });
    }
  }
}
