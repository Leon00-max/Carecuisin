import { byNewest, createId, insertRecord, readCollection, updateRecord, writeCollection } from './localDb';

export const NOTIFICATIONS_KEY = 'cc_notifications';

export function getNotifications(filters = {}) {
  let notifications = readCollection(NOTIFICATIONS_KEY);

  if (filters.userId) notifications = notifications.filter(item => item.userId === filters.userId);
  if (filters.type) notifications = notifications.filter(item => item.type === filters.type);
  if (typeof filters.read === 'boolean') notifications = notifications.filter(item => item.read === filters.read);

  return byNewest(notifications);
}

export function createNotification({
  userId,
  title,
  message,
  type = 'info',
  relatedType = '',
  relatedId = '',
}) {
  if (!userId || !title) return null;

  return insertRecord(NOTIFICATIONS_KEY, {
    id: createId('NTF'),
    userId,
    title,
    message: message || '',
    type,
    relatedType,
    relatedId,
    read: false,
  });
}

export function markNotificationRead(id) {
  return updateRecord(NOTIFICATIONS_KEY, id, { read: true });
}

export function markAllNotificationsRead(userId) {
  const notifications = readCollection(NOTIFICATIONS_KEY);
  const next = notifications.map(item =>
    item.userId === userId ? { ...item, read: true, updatedAt: new Date().toISOString() } : item
  );
  writeCollection(NOTIFICATIONS_KEY, next);
  return next.filter(item => item.userId === userId);
}
