import { getNotifications, markAllNotificationsRead } from '@/lib/notificationStore';
import { requireSession } from '@/lib/apiAuth';

export async function GET(request) {
  const auth = requireSession(request, ['patient', 'dietitian', 'chef', 'admin']);
  if (!auth.ok) return auth.response;
  return Response.json({ notifications: getNotifications({ userId: auth.session.userId }) });
}

export async function PATCH(request) {
  const auth = requireSession(request, ['patient', 'dietitian', 'chef', 'admin']);
  if (!auth.ok) return auth.response;
  return Response.json({ notifications: markAllNotificationsRead(auth.session.userId) });
}
