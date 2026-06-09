/**
 * lib/referralStore.js
 *
 * Single source of truth for referrals while on localStorage.
 * Swap each function body for a Supabase call later.
 */

import { recordAuditLog } from './auditLogStore';
import { readCollection, writeCollection } from './localDb';
import { createNotification } from './notificationStore';

const REFERRALS_KEY = 'cc_referrals';

/* ─── Raw storage ─────────────────────────────────────────── */

export function getReferrals() {
  return readCollection(REFERRALS_KEY);
}

export function saveReferrals(referrals) {
  writeCollection(REFERRALS_KEY, referrals);
}

/* ─── Create ──────────────────────────────────────────────── */

/**
 * createReferral — called by the dietitian after selecting a chef.
 */
export function createReferral({
  dietitianId,
  chefId,
  patientId,
  mealPlanId,
  notesForChef = '',
  chefName = '',
  patientName = '',
  patientLocation = '',
  condition = '',
}) {
  const referrals = getReferrals();
  const newRef = {
    id: `REF-${Date.now()}`,
    dietitianId,
    chefId,
    patientId,
    mealPlanId,
    notesForChef,
    chefName,
    patientName,
    patientLocation,
    condition,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  referrals.push(newRef);
  saveReferrals(referrals);

  createNotification({
    userId: patientId,
    title: 'Chef referral ready',
    message: 'Your dietitian has referred a verified chef for your meal plan.',
    type: 'referral',
    relatedType: 'referral',
    relatedId: newRef.id,
  });
  createNotification({
    userId: chefId,
    title: 'New dietitian referral',
    message: 'A dietitian has referred you for a clinical meal plan.',
    type: 'referral',
    relatedType: 'referral',
    relatedId: newRef.id,
  });
  recordAuditLog({
    actorId: dietitianId,
    action: 'chef_referred',
    module: 'referrals',
    recordId: newRef.id,
    affectedUserId: chefId,
    details: notesForChef,
  });

  return newRef;
}

/* ─── Reads ───────────────────────────────────────────────── */

/** All referrals for a specific chef */
export function getReferralsForChef(chefId) {
  return getReferrals()
    .filter(r => r.chefId === chefId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/** Get a referral by its ID */
export function getReferralById(id) {
  return getReferrals().find(r => r.id === id) || null;
}

/** All referrals for a specific patient */
export function getReferralsForPatient(patientId) {
  return getReferrals().filter(r => r.patientId === patientId);
}

/** Active/latest referral for a specific patient */
export function getActiveReferralForPatient(patientId) {
  const patientRefs = getReferralsForPatient(patientId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // Return latest referral (regardless of status, but latest created)
  return patientRefs[0] || null;
}

/* ─── Update status ───────────────────────────────────────── */

export function updateReferralStatus(id, newStatus) {
  const referrals = getReferrals();
  const index = referrals.findIndex(r => r.id === id);
  if (index === -1) throw new Error(`Referral ${id} not found`);
  referrals[index].status = newStatus;
  referrals[index].updatedAt = new Date().toISOString();
  saveReferrals(referrals);

  createNotification({
    userId: referrals[index].patientId,
    title: `Chef referral ${newStatus}`,
    message: `Your chef referral is now ${newStatus}.`,
    type: 'referral',
    relatedType: 'referral',
    relatedId: id,
  });
  recordAuditLog({
    actorId: referrals[index].chefId,
    action: `referral_${newStatus}`,
    module: 'referrals',
    recordId: id,
    affectedUserId: referrals[index].patientId,
    details: '',
  });

  return referrals[index];
}

/** Chef marks a referral as prepared */
export function markReferralPrepared(id) {
  return updateReferralStatus(id, 'prepared');
}

export function acceptReferral(id) {
  return updateReferralStatus(id, 'accepted');
}

export function declineReferral(id, reason = '') {
  const referrals = getReferrals();
  const index = referrals.findIndex(r => r.id === id);
  if (index === -1) throw new Error(`Referral ${id} not found`);
  referrals[index].status = 'declined';
  referrals[index].declineReason = reason;
  referrals[index].updatedAt = new Date().toISOString();
  saveReferrals(referrals);

  createNotification({
    userId: referrals[index].patientId,
    title: 'Chef referral declined',
    message: reason || 'The chef declined this referral. Your dietitian can refer another chef.',
    type: 'referral',
    relatedType: 'referral',
    relatedId: id,
  });
  recordAuditLog({
    actorId: referrals[index].chefId,
    action: 'referral_declined',
    module: 'referrals',
    recordId: id,
    affectedUserId: referrals[index].patientId,
    details: reason,
  });

  return referrals[index];
}

export function markPrepared(id) {
  return updateReferralStatus(id, 'prepared');
}
