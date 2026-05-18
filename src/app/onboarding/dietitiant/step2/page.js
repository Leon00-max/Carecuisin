'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ────────────────────────────────────────────────────────────
   CONSTANTS
─────────────────────────────────────────────────────────── */
const SPECIALTIES = [
  'Diabetes Management',
  'Hypertension',
  'Renal Nutrition',
  'Obesity / Weight Loss',
  'Sports Nutrition',
  'Maternal Nutrition',
  'Pediatric Nutrition',
  'Gastrointestinal Disorders',
  'General Clinical Nutrition',
];

const CONSULTATION_STYLES = [
  'Strict Clinical',
  'Coaching / Friendly',
  'Educational',
  'Motivational',
];

const LANGUAGES = ['English', 'French', 'Pidgin', 'Local Languages (Cameroon)'];

// Real Buea workplaces as per the project spec
const BUEA_HOSPITALS = [
  'Buea Regional Hospital',
  'Regional Hospital Limbe',
  'Mount Mary Hospital',
  'University of Buea Medical Centre',
  'Nkwen Baptist Hospital',
  'Other',
];

/* ────────────────────────────────────────────────────────────
   VALIDATION
─────────────────────────────────────────────────────────── */
function validate(data) {
  const errors = {};

  if (!data.specialties || data.specialties.length === 0)
    errors.specialties = 'Select at least one specialty.';

  if (!data.workplace) errors.workplace = 'Please select your current workplace.';
  if (data.workplace === 'Other' && !data.otherWorkplace?.trim())
    errors.otherWorkplace = 'Specify your workplace.';

  if (!data.department?.trim()) errors.department = 'Department is required.';
  if (!data.employmentStatus?.trim()) errors.employmentStatus = 'Employment status is required.';
  if (!data.supervisorContact?.trim()) errors.supervisorContact = 'Supervisor contact is required.';

  return errors;
}

/* ────────────────────────────────────────────────────────────
   PAGE COMPONENT
─────────────────────────────────────────────────────────── */
export default function DietitianStep2() {
  const router = useRouter();

  // ---------- state ----------
  const [specialties, setSpecialties] = useState([]);
  const [consultationStyle, setConsultationStyle] = useState('Educational');
  const [philosophy, setPhilosophy] = useState('');
  const [languages, setLanguages] = useState([]);
  const [bio, setBio] = useState('');

  // NEW: workplace & supervisor fields (from ERD)
  const [workplace, setWorkplace] = useState('');
  const [otherWorkplace, setOtherWorkplace] = useState('');
  const [department, setDepartment] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [supervisorContact, setSupervisorContact] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------- restore saved data ----------
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cc_onboarding_dietitian_step2') || '{}');
      if (saved.specialties) setSpecialties(saved.specialties);
      if (saved.consultationStyle) setConsultationStyle(saved.consultationStyle);
      if (saved.philosophy) setPhilosophy(saved.philosophy);
      if (saved.languages) setLanguages(saved.languages);
      if (saved.bio) setBio(saved.bio);
      if (saved.workplace) setWorkplace(saved.workplace);
      if (saved.otherWorkplace) setOtherWorkplace(saved.otherWorkplace);
      if (saved.department) setDepartment(saved.department);
      if (saved.employmentStatus) setEmploymentStatus(saved.employmentStatus);
      if (saved.supervisorContact) setSupervisorContact(saved.supervisorContact);
    } catch (_) {}
  }, []);

  // ---------- helpers ----------
  const toggleMulti = (list, setList, value) => {
    setList(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  // ---------- back (saves current state first) ----------
  const handleBack = () => {
    const data = {
      specialties, consultationStyle, philosophy, languages, bio,
      workplace, otherWorkplace, department, employmentStatus, supervisorContact,
    };
    localStorage.setItem('cc_onboarding_dietitian_step2', JSON.stringify(data));
    router.back();
  };

  // ---------- submit ----------
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const data = {
      specialties,
      consultationStyle,
      philosophy,
      languages,
      bio,
      workplace: workplace === 'Other' ? otherWorkplace : workplace,
      otherWorkplace: workplace === 'Other' ? otherWorkplace : '',
      department,
      employmentStatus,
      supervisorContact,
    };

    const fieldErrors = validate(data);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const first = document.querySelector('[data-error]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    localStorage.setItem('cc_onboarding_dietitian_step2', JSON.stringify(data));
    console.log('Dietitian step 2 saved:', data);
    setTimeout(() => router.push('/onboarding/dietitiant/step3'), 500);
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
            <span>Clinical Expertise</span>
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

        <h2 className="text-2xl font-bold text-surface-900 mb-1">Your expertise</h2>
        <p className="text-sm text-surface-500 mb-7">
          This helps patients find the right specialist.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* ----- Specialties ----- */}
          <div data-error={errors.specialties ? true : undefined}>
            <label className="form-label">Primary Specialties</label>
            <p className="text-xs text-surface-400 mb-2">Select all that apply.</p>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleMulti(specialties, setSpecialties, s)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    specialties.includes(s)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {errors.specialties && <p className="form-error">⚠ {errors.specialties}</p>}
          </div>

          {/* ----- Consultation style ----- */}
          <div>
            <label className="form-label">Consultation Style</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {CONSULTATION_STYLES.map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setConsultationStyle(style)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    consultationStyle === style
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* ----- Treatment philosophy ----- */}
          <div>
            <label htmlFor="philosophy" className="form-label">Treatment Philosophy</label>
            <p className="text-xs text-surface-400 mb-1">
              Briefly describe your approach. E.g., “I focus on affordable, locally sourced Cameroon foods.”
            </p>
            <textarea
              id="philosophy"
              rows={3}
              className="input-medical"
              value={philosophy}
              onChange={(e) => setPhilosophy(e.target.value)}
            />
          </div>

          {/* ----- Languages ----- */}
          <div>
            <label className="form-label">Languages Spoken</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleMulti(languages, setLanguages, lang)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    languages.includes(lang)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* ----- Workplace, department, employment, supervisor (ERD) ----- */}
          <hr className="border-surface-100" />
          <h3 className="text-sm font-semibold text-surface-700">Workplace Information</h3>

          <div data-error={errors.workplace ? true : undefined}>
            <label htmlFor="workplace" className="form-label">Current / Most Recent Workplace</label>
            <select
              id="workplace"
              className={`input-medical ${errors.workplace ? 'border-red-400' : ''}`}
              value={workplace}
              onChange={(e) => setWorkplace(e.target.value)}
            >
              <option value="" disabled>Select workplace</option>
              {BUEA_HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            {errors.workplace && <p className="form-error">⚠ {errors.workplace}</p>}
            {workplace === 'Other' && (
              <input
                type="text"
                className="input-medical mt-2"
                placeholder="Name of institution"
                value={otherWorkplace}
                onChange={(e) => setOtherWorkplace(e.target.value)}
              />
            )}
          </div>

          <div data-error={errors.department ? true : undefined}>
            <label htmlFor="department" className="form-label">Department</label>
            <input
              id="department"
              type="text"
              required
              className={`input-medical ${errors.department ? 'border-red-400' : ''}`}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g., Nutrition Unit"
            />
            {errors.department && <p className="form-error">⚠ {errors.department}</p>}
          </div>

          <div data-error={errors.employmentStatus ? true : undefined}>
            <label htmlFor="employmentStatus" className="form-label">Employment Status</label>
            <select
              id="employmentStatus"
              className={`input-medical ${errors.employmentStatus ? 'border-red-400' : ''}`}
              value={employmentStatus}
              onChange={(e) => setEmploymentStatus(e.target.value)}
            >
              <option value="" disabled>Select status</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Retired">Retired</option>
            </select>
            {errors.employmentStatus && <p className="form-error">⚠ {errors.employmentStatus}</p>}
          </div>

          <div data-error={errors.supervisorContact ? true : undefined}>
            <label htmlFor="supervisorContact" className="form-label">Supervisor / Reference Contact</label>
            <input
              id="supervisorContact"
              type="text"
              required
              className={`input-medical ${errors.supervisorContact ? 'border-red-400' : ''}`}
              value={supervisorContact}
              onChange={(e) => setSupervisorContact(e.target.value)}
              placeholder="Name and phone (for admin verification)"
            />
            {errors.supervisorContact && <p className="form-error">⚠ {errors.supervisorContact}</p>}
          </div>

          {/* ----- Submit ----- */}
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
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full mt-3 text-sm text-surface-400 hover:text-surface-600 transition-colors py-2"
            >
              ← Back
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}