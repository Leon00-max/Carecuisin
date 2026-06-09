import { getPaymentById, simulatePaymentResult } from '@/lib/paymentStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function GET(request, { params }) {
  const auth = requireSession(request, ['patient', 'admin']);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const payment = getPaymentById(id);
  if (!payment) return Response.json({ error: 'Payment not found.' }, { status: 404 });
  if (auth.session.role === 'patient' && payment.userId !== auth.session.userId) {
    return Response.json({ error: 'Not allowed.' }, { status: 403 });
  }
  return Response.json({ payment });
}

export async function PATCH(request, { params }) {
  const auth = requireSession(request, ['patient', 'admin']);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const payment = getPaymentById(id);
    if (!payment) return Response.json({ error: 'Payment not found.' }, { status: 404 });
    if (auth.session.role === 'patient' && payment.userId !== auth.session.userId) {
      return Response.json({ error: 'Not allowed.' }, { status: 403 });
    }

    const payload = await readJson(request);
    const updated = simulatePaymentResult(id, payload.status || 'successful');
    return Response.json({ payment: updated });
  } catch (error) {
    return routeError(error);
  }
}
