import { getComplaints, submitComplaint, updateComplaintStatus } from '@/lib/complaintStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function GET(request) {
  const auth = requireSession(request, ['admin']);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const filters = {};
  if (searchParams.get('status')) filters.status = searchParams.get('status');
  if (searchParams.get('priority')) filters.priority = searchParams.get('priority');

  return Response.json({ complaints: getComplaints(filters) });
}

export async function POST(request) {
  const auth = requireSession(request, ['patient', 'dietitian', 'chef', 'admin']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    const complaint = submitComplaint({
      ...payload,
      submittedBy: payload.submittedBy || auth.session.userId,
    });
    return Response.json({ complaint }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}

export async function PATCH(request) {
  const auth = requireSession(request, ['admin']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    const complaint = updateComplaintStatus(
      payload.id,
      payload.status,
      {
        adminResponse: payload.adminResponse || '',
        assignedAdminId: payload.assignedAdminId || auth.session.userId,
        resolutionType: payload.resolutionType || '',
        resolutionNotes: payload.resolutionNotes || '',
      },
      auth.session.userId
    );
    return Response.json({ complaint });
  } catch (error) {
    return routeError(error);
  }
}
