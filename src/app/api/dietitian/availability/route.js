import {
  getAllAvailability,
  getDietitianAvailability,
  getDietitianSlots,
  saveDietitianAvailability,
} from '@/lib/availabilityStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function GET(request) {
  const auth = requireSession(request, ['patient', 'dietitian', 'admin']);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const dietitianId = searchParams.get('dietitianId') || (auth.session.role === 'dietitian' ? auth.session.userId : '');

  if (auth.session.role === 'admin' && !dietitianId) {
    return Response.json({ availability: getAllAvailability() });
  }
  if (!dietitianId) return Response.json({ error: 'Dietitian ID is required.' }, { status: 400 });

  return Response.json({
    availability: getDietitianAvailability(dietitianId),
    slots: getDietitianSlots(dietitianId, { daysAhead: Number(searchParams.get('daysAhead') || 14) }),
  });
}

export async function PATCH(request) {
  const auth = requireSession(request, ['dietitian']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    const availability = saveDietitianAvailability(auth.session.userId, payload, auth.session.userId);
    return Response.json({ availability });
  } catch (error) {
    return routeError(error);
  }
}
