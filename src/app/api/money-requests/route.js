import { createMoneyRequest, decideMoneyRequest, getMoneyRequests } from '@/lib/walletStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function GET(request) {
  const auth = requireSession(request, ['patient', 'admin']);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const filters = {};
  if (auth.session.role === 'patient') filters.userId = auth.session.userId;
  if (auth.session.role === 'admin' && searchParams.get('userId')) filters.userId = searchParams.get('userId');
  if (searchParams.get('status')) filters.status = searchParams.get('status');
  if (searchParams.get('type')) filters.type = searchParams.get('type');

  return Response.json({ requests: getMoneyRequests(filters) });
}

export async function POST(request) {
  const auth = requireSession(request, ['patient']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    const moneyRequest = createMoneyRequest({
      ...payload,
      userId: auth.session.userId,
    });
    return Response.json({ request: moneyRequest }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}

export async function PATCH(request) {
  const auth = requireSession(request, ['admin']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    const moneyRequest = decideMoneyRequest(payload.id, payload.decision, auth.session.userId, payload.adminNotes || '');
    return Response.json({ request: moneyRequest });
  } catch (error) {
    return routeError(error);
  }
}
