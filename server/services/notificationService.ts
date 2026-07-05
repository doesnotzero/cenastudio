import { db, shouldUsePrisma } from '../lib/db';
import { supabase } from '../lib/supabase';
import { CreateNotificationInput, Notification } from '../models/notification';

export class NotificationService {
  /**
   * Cria uma nova notificação
   */
  static async createNotification(data: CreateNotificationInput): Promise<Notification> {
    if (shouldUsePrisma) {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: data.user_id,
          title: data.title,
          message: data.message,
          type: data.type,
          entity_type: data.entity_type,
          entity_id: data.entity_id,
          metadata: data.metadata,
          read: false,
        })
        .select()
        .single();

      if (error) throw error;
      return notification;
    } else {
      const stmt = db.prepare(`
        INSERT INTO notifications (user_id, title, message, type, entity_type, entity_id, metadata, read, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, datetime('now'))
      `);
      const result = stmt.run(
        data.user_id,
        data.title,
        data.message,
        data.type,
        data.entity_type || null,
        data.entity_id || null,
        data.metadata ? JSON.stringify(data.metadata) : null
      );

      return {
        id: Number(result.lastInsertRowid),
        ...data,
        read: false,
        created_at: new Date(),
      };
    }
  }

  /**
   * Busca notificações de um usuário
   */
  static async getUserNotifications(
    userId: number,
    filters?: { read?: boolean; type?: string; limit?: number }
  ): Promise<Notification[]> {
    if (shouldUsePrisma) {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filters?.read !== undefined) {
        query = query.eq('read', filters.read);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } else {
      let sql = 'SELECT * FROM notifications WHERE user_id = ?';
      const params: any[] = [userId];

      if (filters?.read !== undefined) {
        sql += ' AND read = ?';
        params.push(filters.read ? 1 : 0);
      }

      if (filters?.type) {
        sql += ' AND type = ?';
        params.push(filters.type);
      }

      sql += ' ORDER BY created_at DESC';

      if (filters?.limit) {
        sql += ' LIMIT ?';
        params.push(filters.limit);
      }

      const stmt = db.prepare(sql);
      return stmt.all(...params) as Notification[];
    }
  }

  /**
   * Conta notificações não lidas
   */
  static async getUnreadCount(userId: number): Promise<number> {
    if (shouldUsePrisma) {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } else {
      const stmt = db.prepare(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0'
      );
      const result = stmt.get(userId) as { count: number };
      return result.count;
    }
  }

  /**
   * Marca notificação como lida
   */
  static async markAsRead(notificationId: number): Promise<void> {
    if (shouldUsePrisma) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } else {
      const stmt = db.prepare('UPDATE notifications SET read = 1 WHERE id = ?');
      stmt.run(notificationId);
    }
  }

  /**
   * Marca todas notificações de um usuário como lidas
   */
  static async markAllAsRead(userId: number): Promise<void> {
    if (shouldUsePrisma) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
    } else {
      const stmt = db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ? AND read = 0');
      stmt.run(userId);
    }
  }

  /**
   * Deleta uma notificação
   */
  static async deleteNotification(notificationId: number): Promise<void> {
    if (shouldUsePrisma) {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    } else {
      const stmt = db.prepare('DELETE FROM notifications WHERE id = ?');
      stmt.run(notificationId);
    }
  }

  /**
   * Deleta notificações antigas (mais de 30 dias)
   */
  static async cleanupOldNotifications(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (shouldUsePrisma) {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .lt('created_at', thirtyDaysAgo.toISOString());

      if (error) throw error;
    } else {
      const stmt = db.prepare("DELETE FROM notifications WHERE created_at < datetime('now', '-30 days')");
      stmt.run();
    }
  }

  /**
   * Envia notificação para usuário via WebSocket (real-time)
   * TODO: Implementar quando WebSocket estiver configurado (TASK-005)
   * Por enquanto, apenas cria a notificação no banco
   */
  static async sendToUser(userId: number, notification: Omit<CreateNotificationInput, 'user_id'>): Promise<Notification> {
    // Cria a notificação no banco
    const createdNotification = await this.createNotification({
      user_id: userId,
      ...notification,
    });

    // TODO: Quando WebSocket estiver implementado (TASK-005), adicionar:
    // if (global.io) {
    //   global.io.to(`user_${userId}`).emit('notification', createdNotification);
    // }

    return createdNotification;
  }

  /**
   * Job para criar notificações de deadlines próximos
   * Deve ser executado diariamente (ex: via cron job)
   * Notifica usuários sobre projetos com deadline em 48 horas
   */
  static async scheduleDeadlineNotifications(): Promise<void> {
    try {
      // Data de 48 horas à frente
      const fortyEightHoursAhead = new Date();
      fortyEightHoursAhead.setHours(fortyEightHoursAhead.getHours() + 48);

      // Data de agora
      const now = new Date();

      if (shouldUsePrisma) {
        // Busca projetos com deadline próximo (próximas 48h)
        const { data: projects, error } = await supabase
          .from('projects')
          .select('id, title, deadline, user_id')
          .gte('deadline', now.toISOString())
          .lte('deadline', fortyEightHoursAhead.toISOString())
          .not('status', 'eq', 'completed');

        if (error) throw error;

        // Cria notificação para cada projeto
        if (projects && projects.length > 0) {
          for (const project of projects) {
            const hoursRemaining = Math.round(
              (new Date(project.deadline).getTime() - now.getTime()) / (1000 * 60 * 60)
            );

            await this.createNotification({
              user_id: project.user_id,
              type: 'deadline_approaching',
              title: 'Deadline Próximo!',
              message: `O projeto "${project.title}" tem deadline em ${hoursRemaining} horas.`,
              entity_type: 'project',
              entity_id: project.id,
              metadata: {
                deadline: project.deadline,
                hoursRemaining,
              },
            });
          }
        }
      } else {
        // SQLite implementation
        const stmt = db.prepare(`
          SELECT id, title, deadline, user_id
          FROM projects
          WHERE deadline >= datetime('now')
            AND deadline <= datetime('now', '+48 hours')
            AND status != 'completed'
        `);

        const projects = stmt.all() as Array<{
          id: number;
          title: string;
          deadline: string;
          user_id: number;
        }>;

        // Cria notificação para cada projeto
        for (const project of projects) {
          const deadline = new Date(project.deadline);
          const hoursRemaining = Math.round((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));

          await this.createNotification({
            user_id: project.user_id,
            type: 'deadline_approaching',
            title: 'Deadline Próximo!',
            message: `O projeto "${project.title}" tem deadline em ${hoursRemaining} horas.`,
            entity_type: 'project',
            entity_id: project.id,
            metadata: {
              deadline: project.deadline,
              hoursRemaining,
            },
          });
        }
      }
    } catch (error) {
      console.error('Erro ao criar notificações de deadline:', error);
      throw error;
    }
  }
}
