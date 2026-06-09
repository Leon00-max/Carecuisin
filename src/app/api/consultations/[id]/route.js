import { getConsultationById, updateConsultationStatus } from '@/lib/consultationStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function GET(request, { params }) {
  const auth = requireSession(request, ['patient', 'dietitian', 'admin']);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const consultation = getConsultationById(id);
  if (!consultation) return Response.json({ error: 'Consultation not found.' }, { status: 404 });

  const ownsRecord =
    auth.session.role === 'admin' ||
    consultation.patientId === auth.session.userId ||
    consultation.dietitianId === auth.session.userId;

  if (!ownsRecord) return Response.json({ error: 'Not allowed.' }, { status: 403 });
  return Response.json({ consultation });
}

export async function PATCH(request, { params }) {
  const auth = requireSession(request, ['dietitian', 'admin']);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const payload = await readJson(request);
    const current = getConsultationById(id);
    if (!current) return Response.json({ error: 'Consultation not found.' }, { status: 404 });
    if (auth.session.role === 'dietitian' && current.dietitianId !== auth.session.userId) {
      return Response.json({ error: 'Not allowed.' }, { status: 403 });
    }

    const consultation = updateConsultationStatus(
      id,
      payload.status,
      {
        scheduledDateTime: payload.scheduledDateTime || current.scheduledDateTime,
        notes: payload.notes || current.notes,
        rejectionReason: payload.rejectionReason || current.rejectionReason || '',
      },
      auth.session.userId
    );
    return Response.json({ consultation });
  } catch (error) {
    return routeError(error);
  }
}
