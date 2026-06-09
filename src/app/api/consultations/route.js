import { createConsultation, getConsultations } from '@/lib/consultationStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function GET(request) {
  const auth = requireSession(request, ['patient', 'dietitian', 'admin']);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const filters = {};
  const requestedPatientId = searchParams.get('patientId');
  const requestedDietitianId = searchParams.get('dietitianId');
  const status = searchParams.get('status');

  if (auth.session.role === 'patient') filters.patientId = auth.session.userId;
  if (auth.session.role === 'dietitian') filters.dietitianId = auth.session.userId;
  if (auth.session.role === 'admin') {
    if (requestedPatientId) filters.patientId = requestedPatientId;
    if (requestedDietitianId) filters.dietitianId = requestedDietitianId;
  }
  if (status) filters.status = status;

  return Response.json({ consultations: getConsultations(filters) });
}

export async function POST(request) {
  const auth = requireSession(request, ['patient']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    const consultation = createConsultation({
      ...payload,
      patientId: auth.session.userId,
    });
    return Response.json({ consultation }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
