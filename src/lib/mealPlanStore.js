/**
 * lib/mealPlanStore.js
 *
 * Single source of truth for all meal plan data.
 * Mirrors the Meal_Plans + Clinical_Notes ERD tables.
 *
 * PRIVACY RULE (enforced here, not just in the UI):
 *   getMealPlanForChef()  — strips _clinical before returning
 *   getMealPlanForPatient() — strips _clinical before returning
 *   getMealPlanForDietitian() — returns full record including _clinical
 *
 * Replace each function body with a Supabase call when wiring backend.
 */

import { readCollection, writeCollection } from './localDb';

const PLANS_KEY = 'cc_meal_plans';

/* ─── Raw storage ─────────────────────────────────────────── */

export function getAllMealPlans() {
  return readCollection(PLANS_KEY);
}

function savePlans(plans) {
  writeCollection(PLANS_KEY, plans);
}

/* ─── Create ──────────────────────────────────────────────── */

/**
 * saveMealPlan — called from dietitian create-plan page.
 *
 * payload shape:
 * {
 *   patientId, dietitianId, title, description,
 *   startDate, endDate, details (array of day objects),
 *   status: 'draft' | 'active' | 'referred' | 'completed',
 *   _clinical: {
 *     medicalRationale, clinicalTargets, allergyFlags
 *   }
 * }
 *
 * _clinical is stored in the SAME record for localStorage MVP.
 * When Supabase is wired, split into Meal_Plans + Clinical_Notes tables.
 */
export function saveMealPlan(payload) {
  const plans  = getAllMealPlans();
  const exists = plans.findIndex(p => p.id === payload.id);

  const plan = {
    ...payload,
    id:        payload.id || `PLN-${Date.now()}`,
    createdAt: payload.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (exists !== -1) {
    plans[exists] = plan;
  } else {
    plans.push(plan);
  }

  savePlans(plans);
  return plan;
}

/* ─── Reads ───────────────────────────────────────────────── */

export function getMealPlanById(id) {
  return getAllMealPlans().find(p => p.id === id) || null;
}

/** Full record including _clinical — dietitian only */
export function getMealPlansForDietitian(dietitianId) {
  return getAllMealPlans().filter(p => p.dietitianId === dietitianId);
}

/** Strips _clinical — safe for patient */
export function getMealPlansForPatient(patientId) {
  return getAllMealPlans()
    .filter(p => p.patientId === patientId)
    .map(stripClinical);
}

/** Strips _clinical — safe for chef */
export function getMealPlanForChef(planId) {
  const plan = getMealPlanById(planId);
  return plan ? stripClinical(plan) : null;
}

/** Active plan for a specific patient (latest active) */
export function getActivePlanForPatient(patientId) {
  const plans = getMealPlansForPatient(patientId)
    .filter(p => p.status === 'active' || p.status === 'referred')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return plans[0] || null;
}

/** Latest safe patient plan, preferring active/referred plans */
export function getLatestMealPlanForPatient(patientId) {
  const plans = getMealPlansForPatient(patientId)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const active = plans.find(p => p.status === 'active' || p.status === 'referred');
  return active || plans[0] || null;
}

/* ─── Update ──────────────────────────────────────────────── */

export function updateMealPlanStatus(id, status) {
  const plans = getAllMealPlans();
  const i     = plans.findIndex(p => p.id === id);
  if (i === -1) return null;
  plans[i] = { ...plans[i], status, updatedAt: new Date().toISOString() };
  savePlans(plans);
  return plans[i];
}

/* ─── Privacy helper ──────────────────────────────────────── */

function stripClinical(plan) {
  const safe = { ...plan };
  delete safe._clinical;
  return safe;
}
