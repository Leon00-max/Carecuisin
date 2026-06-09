import { createChefOrder, getOrders } from '@/lib/orderStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function GET(request) {
  const auth = requireSession(request, ['patient', 'chef', 'dietitian', 'admin']);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const filters = {};
  if (auth.session.role === 'patient') filters.patientId = auth.session.userId;
  if (auth.session.role === 'chef') filters.chefId = auth.session.userId;
  if (auth.session.role === 'dietitian') filters.dietitianId = auth.session.userId;
  if (auth.session.role === 'admin') {
    if (searchParams.get('patientId')) filters.patientId = searchParams.get('patientId');
    if (searchParams.get('chefId')) filters.chefId = searchParams.get('chefId');
  }
  if (searchParams.get('status')) filters.status = searchParams.get('status');

  return Response.json({ orders: getOrders(filters) });
}

export async function POST(request) {
  const auth = requireSession(request, ['patient']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    const order = createChefOrder({ ...payload, patientId: auth.session.userId });
    return Response.json({ order }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
