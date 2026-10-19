import { Response } from 'express';
import { campusStore } from '../services/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const notifications = await campusStore.getUserNotifications(req.user.id);
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
}

export async function markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const id = req.params.id as string;
    const ok = await campusStore.markNotificationRead(id, req.user.id);
    if (!ok) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update notification', error: error.message });
  }
}

export async function markAllAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const count = await campusStore.markAllNotificationsRead(req.user.id);
    res.status(200).json({ success: true, message: `Marked ${count} notifications as read` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update notifications', error: error.message });
  }
}
