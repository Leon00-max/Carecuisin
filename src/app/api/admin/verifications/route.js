import { approveUser, getPendingProfessionals, rejectUser } from '@/lib/userStore';
import { recordAuditLog } from '@/lib/auditLogStore';
import { createNotification } from '@/lib/notificationStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function GET(request) {
  const auth = requireSession(request, ['admin']);
  if (!auth.ok) return auth.response;

  return Response.json({ professionals: getPendingProfessionals() });
}

export async function PATCH(request) {
  const auth = requireSession(request, ['admin']);
  if (!auth.ok) return auth.response;

  try {
    const { userId, action, reason = '' } = await readJson(request);
    if (!userId) throw new Error('User ID is required.');
    if (!['approve', 'reject'].includes(action)) throw new Error('Action must be approve or reject.');

    const user = action === 'approve' ? approveUser(userId) : rejectUser(userId, reason);
    createNotification({
      userId,
      title: action === 'approve' ? 'Professional account approved' : 'Professional account rejected',
      message: action === 'approve'
        ? 'Your CareCuisin professional account has been approved.'
        : reason || 'Admin could not approve your professional account.',
      type: 'verification',
      relatedType: 'user',
      relatedId: userId,
    });
    recordAuditLog({
      actorId: auth.session.userId,
      action: action === 'approve' ? 'professional_approved' : 'professional_rejected',
      module: 'verification',
      recordId: userId,
      affectedUserId: userId,
      details: reason,
    });

    return Response.json({ user });
  } catch (error) {
    return routeError(error);
  }
}
