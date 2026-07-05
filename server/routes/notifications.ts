import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
} from '../controllers/notificationController';

const router = Router();

// Todas rotas requerem autenticação
router.use(requireAuth);

// GET /api/notifications - Lista notificações
router.get('/', getNotifications);

// GET /api/notifications/unread-count - Conta não lidas
router.get('/unread-count', getUnreadCount);

// PUT /api/notifications/:id/read - Marca como lida (compatível com frontend)
router.put('/:id/read', markAsRead);

// PUT /api/notifications/read-all - Marca todas como lidas (alias para compatibilidade)
router.put('/read-all', markAllAsRead);

// PUT /api/notifications/mark-all-read - Marca todas como lidas
router.put('/mark-all-read', markAllAsRead);

// DELETE /api/notifications/:id - Deleta notificação
router.delete('/:id', deleteNotification);

// DELETE /api/notifications/read - Deleta notificações lidas
router.delete('/read', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    // Get all read notifications and delete them
    const { db, shouldUsePrisma } = await import('../lib/db');
    const { supabase } = await import('../lib/supabase');

    if (shouldUsePrisma) {
      const { data: readNotifications } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('read', true);

      const count = readNotifications?.length || 0;

      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .eq('read', true);

      return res.json({ success: true, data: { removed: count } });
    } else {
      const stmt = db.prepare('DELETE FROM notifications WHERE user_id = ? AND read = 1');
      const result = stmt.run(userId);
      return res.json({ success: true, data: { removed: result.changes } });
    }
  } catch (error) {
    console.error('Error deleting read notifications:', error);
    res.status(500).json({ success: false, error: 'Erro ao deletar notificações lidas' });
  }
});

// DELETE /api/notifications/all - Deleta todas notificações
router.delete('/all', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { db, shouldUsePrisma } = await import('../lib/db');
    const { supabase } = await import('../lib/supabase');

    if (shouldUsePrisma) {
      const { data: allNotifications } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId);

      const count = allNotifications?.length || 0;

      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      return res.json({ success: true, data: { removed: count } });
    } else {
      const stmt = db.prepare('DELETE FROM notifications WHERE user_id = ?');
      const result = stmt.run(userId);
      return res.json({ success: true, data: { removed: result.changes } });
    }
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({ success: false, error: 'Erro ao deletar todas notificações' });
  }
});

// POST /api/notifications - Cria notificação (para testes/uso interno)
router.post('/', createNotification);

export default router;
