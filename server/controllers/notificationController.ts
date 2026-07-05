import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';
import { CreateNotificationInput, NotificationType } from '../models/notification';

/**
 * Lista notificações do usuário
 */
export async function getNotifications(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { read, type, limit } = req.query;

    const filters: any = {};
    if (read !== undefined) {
      filters.read = read === 'true';
    }
    if (type) {
      filters.type = type as string;
    }
    if (limit) {
      filters.limit = parseInt(limit as string);
    }

    const notifications = await NotificationService.getUserNotifications(userId, filters);
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Erro ao buscar notificações' });
  }
}

/**
 * Conta notificações não lidas
 */
export async function getUnreadCount(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const count = await NotificationService.getUnreadCount(userId);
    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ success: false, error: 'Erro ao contar notificações' });
  }
}

/**
 * Marca notificação como lida
 */
export async function markAsRead(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await NotificationService.markAsRead(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Erro ao marcar notificação como lida' });
  }
}

/**
 * Marca todas notificações como lidas
 */
export async function markAllAsRead(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    await NotificationService.markAllAsRead(userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ error: 'Erro ao marcar todas como lidas' });
  }
}

/**
 * Deleta uma notificação
 */
export async function deleteNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await NotificationService.deleteNotification(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Erro ao deletar notificação' });
  }
}

/**
 * Cria uma notificação (para testes e uso interno)
 */
export async function createNotification(req: Request, res: Response) {
  try {
    const { user_id, title, message, type, entity_type, entity_id, metadata } = req.body;

    if (!user_id || !title || !message || !type) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const notification = await NotificationService.createNotification({
      user_id,
      title,
      message,
      type: type as NotificationType,
      entity_type,
      entity_id,
      metadata,
    });

    res.json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Erro ao criar notificação' });
  }
}
