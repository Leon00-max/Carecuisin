import { createReport, getReports } from '@/lib/reportStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function GET(request) {
  const auth = requireSession(request, ['patient', 'dietitian', 'admin']);
  if (!auth.ok) return auth.response;

  const filters = {};
  if (auth.session.role === 'patient') filters.patientId = auth.session.userId;
  if (auth.session.role === 'dietitian') filters.dietitianId = auth.session.userId;
  return Response.json({ reports: getReports(filters) });
}

export async function POST(request) {
  const auth = requireSession(request, ['dietitian']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    const report = createReport({ ...payload, dietitianId: auth.session.userId });
    return Response.json({ report }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
