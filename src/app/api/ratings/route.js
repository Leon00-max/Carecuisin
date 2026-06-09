import { createRating, getRatings } from '@/lib/ratingStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function GET(request) {
  const auth = requireSession(request, ['patient', 'dietitian', 'chef', 'admin']);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const filters = {};
  if (auth.session.role === 'patient') filters.patientId = auth.session.userId;
  if ((auth.session.role === 'dietitian' || auth.session.role === 'chef') && !searchParams.get('professionalId')) {
    filters.professionalId = auth.session.userId;
  }
  if (searchParams.get('professionalId')) filters.professionalId = searchParams.get('professionalId');
  return Response.json({ ratings: getRatings(filters) });
}

export async function POST(request) {
  const auth = requireSession(request, ['patient']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    const rating = createRating({ ...payload, patientId: auth.session.userId });
    return Response.json({ rating }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
