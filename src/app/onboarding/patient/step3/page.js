'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ────────────────────────────────────────────────────────────
   CONSTANTS
─────────────────────────────────────────────────────────── */
const LOCAL_FOODS = [
  'Rice', 'Plantains', 'Eru', 'Ndole', 'Grilled Fish',
  'Beans', 'Achue', 'Koki', 'Salads', 'Fruits',
];

const EQUIPMENT_OPTIONS = [
  'Gas Cooker', 'Blender', 'Oven', 'Air Fryer',
  'Refrigerator', 'Freezer',
];

const SPICE_LEVELS = ['Mild', 'Medium', 'Spicy', 'Very Spicy'];
const DIETARY_OPTIONS = ['Halal', 'Vegetarian', 'Vegan', 'Low Carb', 'High Protein', 'None'];
const BUDGET_OPTIONS = [
  { value: 'low', label: 'Low (0‑2,000 XAF/day)' },
  { value: 'medium', label: 'Medium (2,000‑5,000 XAF/day)' },
  { value: 'premium', label: 'Premium (5,000+ XAF/day)' },
];

/* ────────────────────────────────────────────────────────────
   VALIDATION
─────────────────────────────────────────────────────────── */
function validate(data) {
  const errors = {};
  if (!data.consentTerms)
    errors.consentTerms = 'You must accept the data privacy terms.';
  if (!data.consentSharing)
    errors.consentSharing = 'You must agree to share instructions with chefs.';
  return errors;
}

/* ────────────────────────────────────────────────────────────
   PAGE COMPONENT
─────────────────────────────────────────────────────────── */
export default function PatientStep3() {
  const router = useRouter();

  // ---------- state ----------
  const [enjoyedFoods, setEnjoyedFoods] = useState([]);
  const [dislikedFoods, setDislikedFoods] = useState('');
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [dietaryPreference, setDietaryPreference] = useState('None');
  const [budget, setBudget] = useState('medium');
  const [needsChef, setNeedsChef] = useState('no');
  const [mealFrequency, setMealFrequency] = useState('Daily');
  const [equipment, setEquipment] = useState([]);
  const [medicalFile, setMedicalFile] = useState(null);
  const [consentSharing, setConsentSharing] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [finalNotes, setFinalNotes] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------- pre‑fill from saved data ----------
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cc_onboarding_patient_step3');
      if (saved) {
        const d = JSON.parse(saved);
        if (d.enjoyedFoods) setEnjoyedFoods(d.enjoyedFoods);
        if (d.dislikedFoods) setDislikedFoods(d.dislikedFoods);
        if (d.spiceLevel) setSpiceLevel(d.spiceLevel);
        if (d.dietaryPreference) setDietaryPreference(d.dietaryPreference);
        if (d.budget) setBudget(d.budget);
        if (d.needsChef) setNeedsChef(d.needsChef);
        if (d.mealFrequency) setMealFrequency(d.mealFrequency);
        if (d.equipment) setEquipment(d.equipment);
        if (d.consentSharing) setConsentSharing(d.consentSharing);
        if (d.consentTerms) setConsentTerms(d.consentTerms);
        if (d.finalNotes) setFinalNotes(d.finalNotes);
      }
    } catch (_) {}
  }, []);

  // ---------- helpers ----------
  const toggleArray = (arr, setArr, item) => {
    setArr(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setMedicalFile(file);
  };

  // ---------- submit ----------
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      enjoyedFoods,
      dislikedFoods,
      spiceLevel,
      dietaryPreference,
      budget,
      needsChef,
      mealFrequency,
      equipment,
      medicalFileName: medicalFile?.name || null,
      consentSharing,
      consentTerms,
      finalNotes,
    };

    const fieldErrors = validate(formData);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const first = document.querySelector('[data-error]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    localStorage.setItem('cc_onboarding_patient_step3', JSON.stringify(formData));
    console.log('Patient onboarding complete:', formData);
    
    // Generate and store a stable ID if not exists
    if (!localStorage.getItem('cc_onboarding_patient_id')) {
      localStorage.setItem('cc_onboarding_patient_id', 'P-' + Date.now().toString(36).toUpperCase());
    }

    // Patient gets immediate dashboard access
    setTimeout(() => router.push('/patient/dashboard'), 800);
  };

  // ---------- render ----------
  return (
    <div className="w-full max-w-lg mx-auto">

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-semibold text-primary-600 mb-2">
          <span>Step 3 of 3</span>
          <span>Lifestyle & Preferences</span>
        </div>
        <div className="h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: '100%' }} />
        </div>
      </div>

      <div className="bg-white border border-surface-100 rounded-2xl shadow-sm p-7 sm:p-9">
        <h2 className="text-2xl font-bold text-surface-900 mb-1">Your preferences & setup</h2>
        <p className="text-sm text-surface-500 mb-7">
          How should we help you eat better every day?
        </p>

        <form onSubmit={handleSubmit} className="space-y-7" noValidate>

          {/* ---------- Medical Record Upload ---------- */}
          <div className="border border-dashed border-primary-200 bg-primary-50 rounded-xl p-5 text-center">
            <p className="text-sm font-semibold text-primary-700 mb-1">
              📄 Medical documents (optional)
            </p>
            <p className="text-xs text-primary-600 mb-3">
              Upload lab results or prescription – visible only to your dietitian.
            </p>
            <input
              type="file"
              accept=".jpg,.png,.pdf"
              onChange={handleFileChange}
              className="block w-full text-xs text-surface-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600 cursor-pointer"
            />
            {medicalFile && (
              <p className="mt-2 text-xs text-primary-600 font-medium">
                ✓ {medicalFile.name}
              </p>
            )}
          </div>

          {/* ---------- Foods you enjoy (chips) ---------- */}
          <div>
            <label className="form-label">Foods you enjoy (local favorites)</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {LOCAL_FOODS.map(food => (
                <button
                  key={food}
                  type="button"
                  onClick={() => toggleArray(enjoyedFoods, setEnjoyedFoods, food)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    enjoyedFoods.includes(food)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {food}
                </button>
              ))}
            </div>
          </div>

          {/* ---------- Foods you dislike ---------- */}
          <div>
            <label htmlFor="dislikedFoods" className="form-label">Foods you dislike</label>
            <textarea
              id="dislikedFoods"
              rows={2}
              className="input-medical"
              placeholder="e.g., bitter leaf, too oily…"
              value={dislikedFoods}
              onChange={(e) => setDislikedFoods(e.target.value)}
            />
          </div>

          {/* ---------- Spice level ---------- */}
          <div>
            <label className="form-label">Preferred spice level</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {SPICE_LEVELS.map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSpiceLevel(lvl)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    spiceLevel === lvl
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* ---------- Dietary preference ---------- */}
          <div>
            <label className="form-label">Dietary preference</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {DIETARY_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDietaryPreference(opt)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    dietaryPreference === opt
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* ---------- Budget ---------- */}
          <div>
            <label className="form-label">Weekly food budget</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
              {BUDGET_OPTIONS.map(b => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setBudget(b.value)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    budget === b.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* ---------- Chef service ---------- */}
          <div>
            <label className="form-label">Do you need a CareCuisin chef to cook for you?</label>
            <p className="text-xs text-surface-400 mb-2">
              A verified chef in Buea can prepare your meals at home.
            </p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="needsChef"
                  value="yes"
                  checked={needsChef === 'yes'}
                  onChange={() => setNeedsChef('yes')}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="needsChef"
                  value="no"
                  checked={needsChef === 'no'}
                  onChange={() => setNeedsChef('no')}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>

          {/* ---------- Kitchen equipment ---------- */}
          <div>
            <label className="form-label">Available cooking equipment at home</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {EQUIPMENT_OPTIONS.map(eq => (
                <button
                  key={eq}
                  type="button"
                  onClick={() => toggleArray(equipment, setEquipment, eq)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    equipment.includes(eq)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>

          {/* ---------- Consent ---------- */}
          <div className="space-y-3 pt-2">
            <div data-error={errors.consentSharing ? true : undefined}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentSharing}
                  onChange={(e) => setConsentSharing(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-surface-600">
                  I consent to sharing dietary instructions with referred chefs. Chefs will never see my full diagnosis.
                </span>
              </label>
              {errors.consentSharing && <p className="form-error ml-7">⚠ {errors.consentSharing}</p>}
            </div>

            <div data-error={errors.consentTerms ? true : undefined}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentTerms}
                  onChange={(e) => setConsentTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-surface-600">
                  I agree to the secure storage of my health data under CareCuisin clinical protocols.
                </span>
              </label>
              {errors.consentTerms && <p className="form-error ml-7">⚠ {errors.consentTerms}</p>}
            </div>
          </div>

          {/* ---------- Final notes ---------- */}
          <div>
            <label htmlFor="finalNotes" className="form-label">Anything else your dietitian should know?</label>
            <textarea
              id="finalNotes"
              rows={3}
              className="input-medical"
              placeholder="Any additional information…"
              value={finalNotes}
              onChange={(e) => setFinalNotes(e.target.value)}
            />
          </div>

          {/* ---------- Submit ---------- */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Saving…
                </span>
              ) : (
                'Complete Onboarding →'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}