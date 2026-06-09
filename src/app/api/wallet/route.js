import { createPayment, getPayments, simulatePaymentResult } from '@/lib/paymentStore';
import { getWalletSummary } from '@/lib/walletStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function GET(request) {
  const auth = requireSession(request, ['patient', 'admin']);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const userId = auth.session.role === 'admin'
    ? searchParams.get('userId') || auth.session.userId
    : auth.session.userId;

  return Response.json({
    wallet: getWalletSummary(userId),
    payments: getPayments({ userId }),
  });
}

export async function POST(request) {
  const auth = requireSession(request, ['patient']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    const payment = createPayment({
      userId: auth.session.userId,
      amount: payload.amount,
      provider: payload.provider || 'mtn_momo',
      phone: payload.phone || '',
      relatedType: 'wallet_topup',
      description: 'CareCuisin wallet top-up',
      purpose: 'wallet_topup',
    });
    const completed = payload.autoConfirm === false ? payment : simulatePaymentResult(payment.id, 'successful');
    return Response.json({ payment: completed, wallet: getWalletSummary(auth.session.userId) }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
