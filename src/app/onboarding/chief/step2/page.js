'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ────────────────────────────────────────────────────────────
   CONSTANTS
─────────────────────────────────────────────────────────── */
const SPECIALIZATIONS = [
  'Low Sodium Meals',
  'Diabetic Meals',
  'High Protein Meals',
  'Renal‑Friendly Meals',
  'Vegetarian Meals',
  'Weight Loss Meals',
  'Child‑Friendly Meals',
  'Sports Nutrition',
  'Traditional Cameroon',
  'International Cuisine',
];

const DIETARY_RESTRICTIONS = [
  'Food Allergies',
  'Gluten‑Free',
  'Lactose Intolerance',
  'Kidney Disease',
  'Hypertension',
  'Diabetes',
];

const AGREEMENTS = [
  { id: 'portionControl', label: 'I understand precise medical portion control.' },
  { id: 'accurateMeasurement', label: 'I use digital scales for accurate ingredient measurement.' },
  { id: 'followInstructions', label: 'I will follow written dietary prescriptions exactly.' },
  { id: 'safeSubstitution', label: 'I know how to safely substitute prohibited ingredients.' },
  { id: 'dietitianContact', label: 'I consent to direct contact from prescribing dietitians.' },
  { id: 'rejectUnsafe', label: 'I will reject patient requests that violate their diet plan.' },
];

/* ────────────────────────────────────────────────────────────
   VALIDATION
─────────────────────────────────────────────────────────── */
function validate(data) {
  const errors = {};

  if (!data.bio?.trim()) errors.bio = 'Please write a short bio for patients.';
  if (!data.favoriteCuisine?.trim()) errors.favoriteCuisine = 'Favourite cuisine is required.';
  if (!data.languages?.trim()) errors.languages = 'Spoken languages are required.';
  if (!data.philosophy?.trim()) errors.philosophy = 'Your meal philosophy is required.';

  // All professional agreements must be accepted
  for (const a of AGREEMENTS) {
    if (!data[a.id]) {
      errors[a.id] = 'You must agree to this commitment.';
    }
  }

  return errors;
}

/* ────────────────────────────────────────────────────────────
   PAGE COMPONENT
─────────────────────────────────────────────────────────── */
export default function ChefStep2() {
  const router = useRouter();

  // ---------- state ----------
  const [specializations, setSpecializations] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [agreements, setAgreements] = useState({
    portionControl: false,
    accurateMeasurement: false,
    followInstructions: false,
    safeSubstitution: false,
    dietitianContact: false,
    rejectUnsafe: false,
  });
  const [bio, setBio] = useState('');
  const [favoriteCuisine, setFavoriteCuisine] = useState('');
  const [languages, setLanguages] = useState('');
  const [philosophy, setPhilosophy] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------- restore saved data ----------
  useEffect(() => {
    queueMicrotask(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cc_onboarding_chef_step2') || '{}');
      if (saved.specializations) setSpecializations(saved.specializations);
      if (saved.dietaryRestrictions) setDietaryRestrictions(saved.dietaryRestrictions);
      if (saved.agreements) setAgreements(saved.agreements);
      if (saved.bio) setBio(saved.bio);
      if (saved.favoriteCuisine) setFavoriteCuisine(saved.favoriteCuisine);
      if (saved.languages) setLanguages(saved.languages);
      if (saved.philosophy) setPhilosophy(saved.philosophy);
    } catch (_) {}
    });
  }, []);

  // ---------- helpers ----------
  const toggleMulti = (list, setter, value) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const handleBack = () => {
    const data = {
      specializations,
      dietaryRestrictions,
      agreements,
      bio,
      favoriteCuisine,
      languages,
      philosophy,
    };
    localStorage.setItem('cc_onboarding_chef_step2', JSON.stringify(data));
    router.back();
  };

  // ---------- submit ----------
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const data = {
      specializations,
      dietaryRestrictions,
      ...agreements,
      bio,
      favoriteCuisine,
      languages,
      philosophy,
    };

    const fieldErrors = validate(data);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const first = document.querySelector('[data-error]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    localStorage.setItem('cc_onboarding_chef_step2', JSON.stringify(data));
    console.log('Chief step 2 saved:', data);
    setTimeout(() => router.push('/onboarding/chief/step3'), 800);
  };

  // ---------- render ----------
  return (
    <div className="w-full max-w-lg mx-auto">

      {/* Back button + progress bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handleBack}
          className="text-xs font-semibold text-surface-400 hover:text-primary-600 transition-colors"
        >
          ← Back to Identity
        </button>
        <div className="flex-1 ml-4">
          <div className="flex justify-between text-xs font-semibold text-primary-600 mb-2">
            <span>Step 2 of 3</span>
            <span>Cooking Expertise</span>
          </div>
          <div className="h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: '66%' }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-surface-100 rounded-2xl shadow-sm p-7 sm:p-9">

        <h2 className="text-2xl font-bold text-surface-900 mb-1">Your cooking capabilities</h2>
        <p className="text-sm text-surface-500 mb-7">
          This information helps dietitians match you with patients.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* ----- Specializations (chips) ----- */}
          <div>
            <label className="form-label">Meal types you are experienced preparing</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {SPECIALIZATIONS.map(spec => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => toggleMulti(specializations, setSpecializations, spec)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    specializations.includes(spec)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* ----- Dietary Restrictions (chips) ----- */}
          <div>
            <label className="form-label">Comfortable with dietary restrictions</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {DIETARY_RESTRICTIONS.map(rest => (
                <button
                  key={rest}
                  type="button"
                  onClick={() => toggleMulti(dietaryRestrictions, setDietaryRestrictions, rest)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    dietaryRestrictions.includes(rest)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {rest}
                </button>
              ))}
            </div>
          </div>

          {/* ----- Professional Agreements (must be all checked) ----- */}
          <div>
            <h3 className="text-sm font-semibold text-surface-700 mb-3">
              Clinical Collaboration Commitments
            </h3>
            <p className="text-xs text-surface-400 mb-3">
              As a medical meal provider, you must agree to these protocols.
            </p>
            <div className="space-y-2">
              {AGREEMENTS.map(({ id, label }) => (
                <div key={id} data-error={errors[id] ? true : undefined}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                      checked={agreements[id]}
                      onChange={(e) => setAgreements({ ...agreements, [id]: e.target.checked })}
                    />
                    <span className="text-sm text-surface-600">{label}</span>
                  </label>
                  {errors[id] && <p className="form-error ml-7">⚠ {errors[id]}</p>}
                </div>
              ))}
            </div>
          </div>

          <hr className="border-surface-100" />

          {/* ----- Public Profile ----- */}
          <div>
            <h3 className="text-sm font-semibold text-surface-700 mb-3">Public Chef Profile</h3>
            <p className="text-xs text-surface-400 mb-4">
              This is what patients and dietitians will see when browsing your profile.
            </p>
            <div className="space-y-4">
              <div data-error={errors.bio ? true : undefined}>
                <label htmlFor="bio" className="form-label">Cooking Bio / About Me</label>
                <textarea
                  id="bio"
                  rows={3}
                  required
                  className={`input-medical ${errors.bio ? 'border-red-400' : ''}`}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell patients about your culinary journey…"
                />
                {errors.bio && <p className="form-error">⚠ {errors.bio}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-error={errors.favoriteCuisine ? true : undefined}>
                  <label htmlFor="favoriteCuisine" className="form-label">Favourite Cuisine Style</label>
                  <input
                    id="favoriteCuisine"
                    type="text"
                    required
                    className={`input-medical ${errors.favoriteCuisine ? 'border-red-400' : ''}`}
                    value={favoriteCuisine}
                    onChange={(e) => setFavoriteCuisine(e.target.value)}
                    placeholder="e.g., Healthy Cameroonian fusion"
                  />
                  {errors.favoriteCuisine && <p className="form-error">⚠ {errors.favoriteCuisine}</p>}
                </div>

                <div data-error={errors.languages ? true : undefined}>
                  <label htmlFor="languages" className="form-label">Languages Spoken</label>
                  <input
                    id="languages"
                    type="text"
                    required
                    className={`input-medical ${errors.languages ? 'border-red-400' : ''}`}
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="English, French, Pidgin…"
                  />
                  {errors.languages && <p className="form-error">⚠ {errors.languages}</p>}
                </div>
              </div>

              <div data-error={errors.philosophy ? true : undefined}>
                <label htmlFor="philosophy" className="form-label">Meal Philosophy</label>
                <input
                  id="philosophy"
                  type="text"
                  required
                  className={`input-medical ${errors.philosophy ? 'border-red-400' : ''}`}
                  value={philosophy}
                  onChange={(e) => setPhilosophy(e.target.value)}
                  placeholder="e.g., 'Food is medicine, but it should still taste amazing.'"
                />
                {errors.philosophy && <p className="form-error">⚠ {errors.philosophy}</p>}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 shadow-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Saving…
                </span>
              ) : (
                'Next: Operations & Schedule →'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
