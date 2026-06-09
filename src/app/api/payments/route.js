import { createPayment, getPaymentById, getPayments, simulatePaymentResult } from '@/lib/paymentStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function GET(request) {
  const auth = requireSession(request, ['patient', 'admin']);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const filters = {};
  if (auth.session.role === 'patient') filters.userId = auth.session.userId;
  if (auth.session.role === 'admin' && searchParams.get('userId')) filters.userId = searchParams.get('userId');
  if (searchParams.get('status')) filters.status = searchParams.get('status');
  if (searchParams.get('provider')) filters.provider = searchParams.get('provider');
  if (searchParams.get('relatedType')) filters.relatedType = searchParams.get('relatedType');
  if (searchParams.get('relatedId')) filters.relatedId = searchParams.get('relatedId');

  return Response.json({ payments: getPayments(filters) });
}

export async function POST(request) {
  const auth = requireSession(request, ['patient']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    const payment = createPayment({ ...payload, userId: auth.session.userId });
    return Response.json({ payment }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}

export async function PATCH(request) {
  const auth = requireSession(request, ['patient', 'admin']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    const existing = getPaymentById(payload.id);
    if (!existing) return Response.json({ error: 'Payment not found' }, { status: 404 });
    if (auth.session.role === 'patient' && existing.userId !== auth.session.userId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const payment = simulatePaymentResult(payload.id, payload.status || 'successful');
    return Response.json({ payment });
  } catch (error) {
    return routeError(error);
  }
}
