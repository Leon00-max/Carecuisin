/**
 * lib/mealPlanStore.js
 *
 * Single source of truth for meal plans while we’re on localStorage.
 * Swap each function body for a Supabase call later.
 */

const MEAL_PLANS_KEY = 'cc_meal_plans';
const CLINICAL_NOTES_KEY = 'cc_clinical_notes';

/* ─── Raw storage ─────────────────────────────────────────── */

function getMealPlans() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(MEAL_PLANS_KEY) || '[]');
  } catch (_) {
    return [];
  }
}

function saveMealPlans(plans) {
  localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(plans));
}

function getClinicalNotes() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CLINICAL_NOTES_KEY) || '[]');
  } catch (_) {
    return [];
  }
}

function saveClinicalNotes(notes) {
  localStorage.setItem(CLINICAL_NOTES_KEY, JSON.stringify(notes));
}

/* ─── Create ──────────────────────────────────────────────── */

/**
 * createMealPlan — called by the dietitian after filling the weekly form.
 * @param plan { patientId, dietitianId, startDate, meals: { public, clinical } }
 * @returns the saved plan object
 */
export function createMealPlan({ patientId, dietitianId, startDate, meals }) {
  const plans = getMealPlans();

  const publicMeals = {};
  const clinicalMeals = {};

  for (const day of Object.keys(meals)) {
    publicMeals[day] = {};
    clinicalMeals[day] = {};
    for (const mealType of Object.keys(meals[day])) {
      publicMeals[day][mealType] = meals[day][mealType].public || '';
      clinicalMeals[day][mealType] = meals[day][mealType].clinical || '';
    }
  }

  const plan = {
    id: `MP-${Date.now()}`,
    patientId,
    dietitianId,
    startDate,
    meals: publicMeals,          // safe for patient & chef
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  plans.push(plan);
  saveMealPlans(plans);

  // Store clinical notes separately so they never leak
  const clinicalNote = {
    id: `CN-${plan.id}`,
    planId: plan.id,
    meals: clinicalMeals,
    createdAt: new Date().toISOString(),
  };

  const notes = getClinicalNotes();
  notes.push(clinicalNote);
  saveClinicalNotes(notes);

  return { plan, clinicalNote };
}

/* ─── Reads ───────────────────────────────────────────────── */

/** Get the latest active meal plan for a patient */
export function getLatestMealPlanForPatient(patientId) {
  return getMealPlans()
    .filter(p => p.patientId === patientId && p.status === 'active')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
    || null;
}

/** Get all plans a dietitian has created */
export function getPlansByDietitian(dietitianId) {
  return getMealPlans()
    .filter(p => p.dietitianId === dietitianId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/** Get the clinical notes for a specific plan (dietitian + admin only) */
export function getClinicalNotesByPlanId(planId) {
  const notes = getClinicalNotes();
  return notes.find(n => n.planId === planId) || null;
}