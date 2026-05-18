/**
 * lib/referralStore.js
 *
 * Single source of truth for referrals while on localStorage.
 * Swap each function body for a Supabase call later.
 */

const REFERRALS_KEY = 'cc_referrals';

/* ─── Raw storage ─────────────────────────────────────────── */

function getReferrals() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(REFERRALS_KEY) || '[]');
  } catch (_) {
    return [];
  }
}

function saveReferrals(referrals) {
  localStorage.setItem(REFERRALS_KEY, JSON.stringify(referrals));
}

/* ─── Create ──────────────────────────────────────────────── */

/**
 * createReferral — called by the dietitian after selecting a chef.
 * @param { dietitianId, chefId, patientId, mealPlanId, notes }
 */
export function createReferral({ dietitianId, chefId, patientId, mealPlanId, notes = '' }) {
  const referrals = getReferrals();
  const newRef = {
    id: `REF-${Date.now()}`,
    dietitianId,
    chefId,
    patientId,
    mealPlanId,
    notes,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  referrals.push(newRef);
  saveReferrals(referrals);
  return newRef;
}

/* ─── Reads ───────────────────────────────────────────────── */

/** All active referrals for a chef (pending + accepted) */
export function getReferralsForChef(chefId) {
  return getReferrals()
    .filter(r => r.chefId === chefId && (r.status === 'pending' || r.status === 'accepted'))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/** Get a referral by its ID */
export function getReferralById(id) {
  return getReferrals().find(r => r.id === id) || null;
}

/* ─── Update status ───────────────────────────────────────── */

export function updateReferralStatus(id, newStatus) {
  const referrals = getReferrals();
  const index = referrals.findIndex(r => r.id === id);
  if (index === -1) throw new Error(`Referral ${id} not found`);
  referrals[index].status = newStatus;
  referrals[index].updatedAt = new Date().toISOString();
  saveReferrals(referrals);
  return referrals[index];
}

/** Chef marks a referral as prepared */
export function markReferralPrepared(id) {
  return updateReferralStatus(id, 'prepared');
}