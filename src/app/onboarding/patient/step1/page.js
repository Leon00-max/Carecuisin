'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS  → will move to lib/constants.js
───────────────────────────────────────────────────────────── */
const BUEA_NEIGHBOURHOODS = [
  'Molyko',
  'Mile 17',
  'Checkpoint',
  'Buea Town',
  'Bokwango',
  'Bonduma',
  'Great Soppo',
  'Small Soppo',
  'Clerks Quarter',
  'Other',
];

const LANGUAGES = ['English', 'French', 'Pidgin'];

// Why is the patient joining? (A's addition — maps to reasons[] JSON in Patient_Profiles)
const JOIN_REASONS = [
  'Weight Loss',
  'Weight Gain',
  'Diabetes Management',
  'Hypertension',
  'Renal Disease',
  'General Healthy Eating',
  'Other',
];

/* ─────────────────────────────────────────────────────────────
   VALIDATION  — pure function, easy to unit-test later
───────────────────────────────────────────────────────────── */
function validate(data) {
  const errors = {};

  if (!data.fullName?.trim())
    errors.fullName = 'Full name is required.';

  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required.';
  } else {
    const today   = new Date();
    const dob     = new Date(data.dateOfBirth);
    let   age     = today.getFullYear() - dob.getFullYear();
    const notYet  = today < new Date(dob.setFullYear(dob.getFullYear() + age));
    const realAge = notYet ? age - 1 : age;
    if (realAge < 12)  errors.dateOfBirth = 'Patient must be at least 12 years old.';
    if (realAge > 120) errors.dateOfBirth = 'Please enter a valid date of birth.';
  }

  if (!data.gender)
    errors.gender = 'Please select a gender.';

  const cleanPhone = data.phone?.trim().replace(/\s+/g, '') || '';
  if (!/^6[0-9]{8}$/.test(cleanPhone))
    errors.phone = 'Enter a valid 9-digit number starting with 6 (e.g. 677 123 456).';

  if (!data.location)
    errors.location = 'Please select your neighbourhood.';

  if (data.location === 'Other' && !data.otherLocation?.trim())
    errors.otherLocation = 'Please specify your street or landmark.';

  return errors;
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function PatientStep1() {
  const router = useRouter();

  const [location,        setLocation]        = useState('');
  const [selectedReasons, setSelectedReasons] = useState([]);   // A's addition
  const [errors,          setErrors]          = useState({});
  const [loading,         setLoading]         = useState(false);

  // Pre-fill defaults from signup (my addition)
  const [defaults, setDefaults] = useState({ fullName: '', phone: '' });

  /* ── On mount: load signup pre-fill + restore any saved step1 data ── */
  useEffect(() => {
    queueMicrotask(() => {
    // 1. Pre-fill from signup
    try {
      const signupRaw = localStorage.getItem('cc_signup');
      if (signupRaw) {
        const signup = JSON.parse(signupRaw);
        setDefaults({
          fullName: signup.fullName || '',
          phone:    signup.phone    || '',
        });
      }
    } catch (_) {}

    // 2. Restore previously saved step1 (user came back from step 2)
    try {
      const savedRaw = localStorage.getItem('cc_onboarding_patient_step1');
      if (savedRaw) {
        const saved = JSON.parse(savedRaw);
        setDefaults({
          fullName: saved.fullName || '',
          phone:    saved.phone    || '',
        });
        setLocation(saved.location         || '');
        setSelectedReasons(saved.reasons   || []);
      }
    } catch (_) {}
    });
  }, []);

  /* ── Toggle a reason chip ── */
  function handleToggleReason(reason) {
    setSelectedReasons(prev =>
      prev.includes(reason)
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  }

  /* ── Submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    const form = new FormData(e.target);
    const raw  = Object.fromEntries(form.entries());

    const fieldErrors = validate(raw);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      // Scroll to first error field (my addition)
      document.querySelector('[data-error]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);

    // Resolve "Other" location
    const finalData = {
      ...raw,
      reasons:     selectedReasons,                                    // A's addition
      location:    raw.location === 'Other' ? raw.otherLocation : raw.location,
      completedAt: new Date().toISOString(),
    };
    delete finalData.otherLocation;

    localStorage.setItem('cc_onboarding_patient_step1', JSON.stringify(finalData));
    console.log('Patient step 1 ✓', finalData);

    setTimeout(() => router.push('/onboarding/patient/step2'), 500);
  }

  /* ── Render ── */
  return (
    <div className="w-full max-w-lg mx-auto">

      {/* ── Progress bar ── */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-semibold text-primary-600 mb-2">
          <span>Step 1 of 3</span>
          <span>Personal Identity</span>
        </div>
        <div className="h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: '33%' }}
          />
        </div>
      </div>

      {/* ── Card ── */}
      <div className="bg-white border border-surface-100 rounded-2xl shadow-sm p-7 sm:p-9">

        <h2 className="text-2xl font-bold text-surface-900 mb-1">Tell us about you</h2>
        <p className="text-sm text-surface-500 mb-7">
          This is the foundation of your clinical meal plan.
          Your dietitian uses this to understand who you are.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* ── Full Name (pre-filled from signup) ── */}
          <div data-error={errors.fullName ? true : undefined}>
            <label htmlFor="fullName" className="form-label">
              Full Name
              {defaults.fullName && (
                <span className="ml-2 text-xs text-primary-500 font-normal">
                  ✓ from signup
                </span>
              )}
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              key={defaults.fullName}
              defaultValue={defaults.fullName}
              className={`input-medical ${errors.fullName ? 'border-red-400 focus:border-red-400' : ''}`}
              placeholder="e.g. Amara Nkeng"
            />
            {errors.fullName && <p className="form-error">⚠ {errors.fullName}</p>}
          </div>

          {/* ── Why are you joining? (A's chip selector) ── */}
          <div>
            <label className="form-label">
              Why are you joining CareCuisin?
            </label>
            <p className="text-xs text-surface-400 mb-3">
              Select all that apply. This helps your dietitian prepare.
            </p>
            <div className="flex flex-wrap gap-2">
              {JOIN_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => handleToggleReason(reason)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    selectedReasons.includes(reason)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          {/* ── Date of Birth + Gender ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div data-error={errors.dateOfBirth ? true : undefined}>
              <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                max={new Date().toISOString().split('T')[0]}
                className={`input-medical ${errors.dateOfBirth ? 'border-red-400 focus:border-red-400' : ''}`}
              />
              {errors.dateOfBirth && <p className="form-error">⚠ {errors.dateOfBirth}</p>}
            </div>

            <div data-error={errors.gender ? true : undefined}>
              <label className="form-label">Gender</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {['Male', 'Female'].map((g) => (
                  <label key={g} className="cursor-pointer">
                    <input type="radio" name="gender" value={g} className="peer hidden" />
                    <div className="text-center py-2.5 rounded-xl border-2 border-surface-100 text-sm font-semibold text-surface-500 peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700 transition-all hover:border-surface-300 select-none">
                      {g}
                    </div>
                  </label>
                ))}
              </div>
              {errors.gender && <p className="form-error">⚠ {errors.gender}</p>}
            </div>

          </div>

          {/* ── Preferred Language ── */}
          <div>
            <label htmlFor="language" className="form-label">Preferred Language</label>
            <select id="language" name="language" className="input-medical">
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-surface-400">
              Used for clinical consultation notes and meal instructions.
            </p>
          </div>

          {/* ── Phone (pre-filled from signup) ── */}
          <div data-error={errors.phone ? true : undefined}>
            <label htmlFor="phone" className="form-label">
              Phone Number
              <span className="text-surface-400 font-normal"> (MTN / Orange)</span>
              {defaults.phone && (
                <span className="ml-2 text-xs text-primary-500 font-normal">
                  ✓ from signup
                </span>
              )}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 text-sm text-surface-500 border-r border-surface-200 pointer-events-none select-none">
                +237
              </span>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                pattern="[0-9]{9}"
                key={defaults.phone}
                defaultValue={defaults.phone}
                className={`input-medical pl-16 text-center ${errors.phone ? 'border-red-400 focus:border-red-400' : ''}`}
                placeholder="677 123 456"
              />
            </div>
            {errors.phone
              ? <p className="form-error">⚠ {errors.phone}</p>
              : <p className="mt-1 text-xs text-surface-400">
                  Used for SMS meal alerts and chef coordination.
                </p>
            }
          </div>

          {/* ── Neighbourhood ── */}
          <div data-error={errors.location ? true : undefined}>
            <label htmlFor="location" className="form-label">
              Neighbourhood in Buea
            </label>
            <select
              id="location"
              name="location"
              required
              className={`input-medical ${errors.location ? 'border-red-400 focus:border-red-400' : ''}`}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="" disabled>Select your neighbourhood</option>
              {BUEA_NEIGHBOURHOODS.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {errors.location && <p className="form-error">⚠ {errors.location}</p>}

            {/* Conditional "Other" input */}
            {location === 'Other' && (
              <div className="mt-3">
                <input
                  name="otherLocation"
                  type="text"
                  placeholder="Street name or nearby landmark…"
                  required
                  className={`input-medical ${errors.otherLocation ? 'border-red-400 focus:border-red-400' : ''}`}
                />
                {errors.otherLocation && (
                  <p className="form-error">⚠ {errors.otherLocation}</p>
                )}
              </div>
            )}
          </div>

          {/* ── Submit ── */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 shadow-sm"
            >
              {loading
                ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Saving…
                  </span>
                )
                : 'Next: Health Information →'
              }
            </button>
          </div>

        </form>
      </div>

      {/* Privacy reassurance (my addition) */}
      <p className="mt-4 text-center text-xs text-surface-400">
        Your information is private and only visible to your assigned dietitian.
      </p>

    </div>
  );
}
