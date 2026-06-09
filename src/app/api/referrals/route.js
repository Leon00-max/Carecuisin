import {
  acceptReferral,
  createReferral,
  declineReferral,
  getReferrals,
  getReferralsForChef,
  getReferralsForPatient,
} from '@/lib/referralStore';
import { readJson, requireSession, routeError } from '@/lib/apiAuth';

export async function GET(request) {
  const auth = requireSession(request, ['patient', 'dietitian', 'chef', 'admin']);
  if (!auth.ok) return auth.response;

  if (auth.session.role === 'admin') return Response.json({ referrals: getReferrals() });
  if (auth.session.role === 'chef') return Response.json({ referrals: getReferralsForChef(auth.session.userId) });
  if (auth.session.role === 'patient') return Response.json({ referrals: getReferralsForPatient(auth.session.userId) });

  return Response.json({ referrals: getReferrals().filter(referral => referral.dietitianId === auth.session.userId) });
}

export async function POST(request) {
  const auth = requireSession(request, ['dietitian']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    const referral = createReferral({ ...payload, dietitianId: auth.session.userId });

    return Response.json({ referral }, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}

export async function PATCH(request) {
  const auth = requireSession(request, ['chef']);
  if (!auth.ok) return auth.response;

  try {
    const payload = await readJson(request);
    const referral = payload.action === 'decline'
      ? declineReferral(payload.id, payload.reason || '')
      : acceptReferral(payload.id);

    return Response.json({ referral });
  } catch (error) {
    return routeError(error);
  }
}
