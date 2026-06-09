import { getOrderById, updateOrderStatus } from '@/lib/orderStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function PATCH(request, { params }) {
  const auth = requireSession(request, ['chef', 'admin']);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const order = getOrderById(id);
    if (!order) return Response.json({ error: 'Order not found.' }, { status: 404 });
    if (auth.session.role === 'chef' && order.chefId !== auth.session.userId) {
      return Response.json({ error: 'Not allowed.' }, { status: 403 });
    }

    const payload = await readJson(request);
    const updated = updateOrderStatus(id, payload.status, auth.session.userId, payload.details || '');
    return Response.json({ order: updated });
  } catch (error) {
    return routeError(error);
  }
}
