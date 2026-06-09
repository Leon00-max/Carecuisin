'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { markOnboardingComplete, getCurrentUserId } from '@/lib/userStore';

/* ────────────────────────────────────────────────────────────
   CONSTANTS
─────────────────────────────────────────────────────────── */
const CONSULTATION_TYPES = ['Virtual Only', 'In‑Person Only', 'Both (Virtual & In‑Person)'];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/* ────────────────────────────────────────────────────────────
   VALIDATION  –  consent boxes are REQUIRED
─────────────────────────────────────────────────────────── */
function validate(data) {
  const errors = {};

  if (!data.consultationType) errors.consultationType = 'Select a consultation type.';
  if (!data.availableDays || data.availableDays.length === 0)
    errors.availableDays = 'Select at least one available day.';
  if (!data.feeRange?.trim()) errors.feeRange = 'Consultation fee range is required.';

  // These two lines STOP the user if the boxes are unchecked
  if (!data.signedTerms) errors.signedTerms = 'You must agree to the Terms of Service.';
  if (!data.dataPrivacy) errors.dataPrivacy = 'You must accept the Data Privacy policy.';

  return errors;
}

/* ────────────────────────────────────────────────────────────
   PAGE COMPONENT
─────────────────────────────────────────────────────────── */
export default function DietitianStep3() {
  const router = useRouter();

  // ---------- state (all separate – NO formData) ----------
  const [consultationType, setConsultationType] = useState('Both (Virtual & In‑Person)');
  const [availableDays, setAvailableDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState('');
  const [emergencyAvailability, setEmergencyAvailability] = useState(false);
  const [feeRange, setFeeRange] = useState('');
  const [followUpFee, setFollowUpFee] = useState('');
  const [longTermPrograms, setLongTermPrograms] = useState(false);
  const [chefCollaboration, setChefCollaboration] = useState(true);
  const [canCreateMealPlans, setCanCreateMealPlans] = useState(true);
  const [canReferToChefs, setCanReferToChefs] = useState(true);
  const [multiPatientMonitoring, setMultiPatientMonitoring] = useState(true);
  const [signedTerms, setSignedTerms] = useState(false);
  const [dataPrivacy, setDataPrivacy] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------- restore saved data ----------
  useEffect(() => {
    queueMicrotask(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cc_onboarding_dietitian_step3') || '{}');
      if (saved.consultationType) setConsultationType(saved.consultationType);
      if (saved.availableDays) setAvailableDays(saved.availableDays);
      if (saved.timeSlots) setTimeSlots(saved.timeSlots || '');
      if (saved.emergencyAvailability !== undefined) setEmergencyAvailability(saved.emergencyAvailability);
      if (saved.feeRange) setFeeRange(saved.feeRange);
      if (saved.followUpFee) setFollowUpFee(saved.followUpFee);
      if (saved.longTermPrograms !== undefined) setLongTermPrograms(saved.longTermPrograms);
      if (saved.chefCollaboration !== undefined) setChefCollaboration(saved.chefCollaboration);
      if (saved.canCreateMealPlans !== undefined) setCanCreateMealPlans(saved.canCreateMealPlans);
      if (saved.canReferToChefs !== undefined) setCanReferToChefs(saved.canReferToChefs);
      if (saved.multiPatientMonitoring !== undefined) setMultiPatientMonitoring(saved.multiPatientMonitoring);
      if (saved.signedTerms) setSignedTerms(saved.signedTerms);
      if (saved.dataPrivacy) setDataPrivacy(saved.dataPrivacy);
    } catch (_) {}
    });
  }, []);

  // ---------- helpers ----------
  const toggleDay = (day) => {
    setAvailableDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleBack = () => {
    const data = {
      consultationType, availableDays, timeSlots, emergencyAvailability,
      feeRange, followUpFee, longTermPrograms, chefCollaboration,
      canCreateMealPlans, canReferToChefs, multiPatientMonitoring,
      signedTerms, dataPrivacy,
    };
    localStorage.setItem('cc_onboarding_dietitian_step3', JSON.stringify(data));
    router.back();
  };

  // ---------- submit (enforces consent) ----------
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const data = {
      consultationType,
      availableDays,
      timeSlots,
      emergencyAvailability,
      feeRange,
      followUpFee,
      longTermPrograms,
      chefCollaboration,
      canCreateMealPlans,
      canReferToChefs,
      multiPatientMonitoring,
      signedTerms,
      dataPrivacy,
    };

    const fieldErrors = validate(data);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const first = document.querySelector('[data-error]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;   // ❗ stops here if consent boxes are unchecked
    }

    setLoading(true);
    localStorage.setItem('cc_onboarding_dietitian_step3', JSON.stringify(data));
    console.log('Dietitian onboarding complete:', data);

     //  Mark onboarding as complete in the central user store
const userId = getCurrentUserId();
    if (userId) {
      markOnboardingComplete(userId);
    }

    setTimeout(() => router.push('/onboarding/review'), 800);
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
          ← Back to Expertise
        </button>
        <div className="flex-1 ml-4">
          <div className="flex justify-between text-xs font-semibold text-primary-600 mb-2">
            <span>Step 3 of 3</span>
            <span>Operations</span>
          </div>
          <div className="h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-surface-100 rounded-2xl shadow-sm p-7 sm:p-9">

        <h2 className="text-2xl font-bold text-surface-900 mb-1">How you&apos;ll work on CareCuisin</h2>
        <p className="text-sm text-surface-500 mb-7">
          Set your availability, fees, and platform permissions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* Consultation Type */}
          <div data-error={errors.consultationType ? true : undefined}>
            <label htmlFor="consultationType" className="form-label">Consultation Type</label>
            <select
              id="consultationType"
              className={`input-medical ${errors.consultationType ? 'border-red-400' : ''}`}
              value={consultationType}
              onChange={(e) => setConsultationType(e.target.value)}
            >
              {CONSULTATION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            {errors.consultationType && <p className="form-error">⚠ {errors.consultationType}</p>}
          </div>

          {/* Available Days */}
          <div data-error={errors.availableDays ? true : undefined}>
            <label className="form-label">Available Days</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    availableDays.includes(day)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            {errors.availableDays && <p className="form-error">⚠ {errors.availableDays}</p>}
          </div>

          {/* Time Slots */}
          <div>
            <label htmlFor="timeSlots" className="form-label">Preferred Time Slots</label>
            <input
              id="timeSlots"
              type="text"
              className="input-medical"
              value={timeSlots}
              onChange={(e) => setTimeSlots(e.target.value)}
              placeholder="e.g., 9:00 AM – 12:00 PM, 2:00 PM – 5:00 PM"
            />
          </div>

          {/* Emergency Availability */}
          <div className="flex items-center justify-between">
            <label className="form-label mb-0">Available for emergency consultations?</label>
            <input
              type="checkbox"
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              checked={emergencyAvailability}
              onChange={(e) => setEmergencyAvailability(e.target.checked)}
            />
          </div>

          <hr className="border-surface-100" />

          {/* Fees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div data-error={errors.feeRange ? true : undefined}>
              <label htmlFor="feeRange" className="form-label">Consultation Fee Range (XAF)</label>
              <input
                id="feeRange"
                type="text"
                required
                className={`input-medical ${errors.feeRange ? 'border-red-400' : ''}`}
                value={feeRange}
                onChange={(e) => setFeeRange(e.target.value)}
                placeholder="e.g., 5,000 – 15,000"
              />
              {errors.feeRange && <p className="form-error">⚠ {errors.feeRange}</p>}
            </div>
            <div>
              <label htmlFor="followUpFee" className="form-label">Follow‑Up Fee (optional)</label>
              <input
                id="followUpFee"
                type="text"
                className="input-medical"
                value={followUpFee}
                onChange={(e) => setFollowUpFee(e.target.value)}
                placeholder="e.g., 3,000"
              />
            </div>
          </div>

          {/* Long‑term Programs */}
          <div className="flex items-center justify-between">
            <label className="form-label mb-0">Do you support long‑term meal programs?</label>
            <input
              type="checkbox"
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              checked={longTermPrograms}
              onChange={(e) => setLongTermPrograms(e.target.checked)}
            />
          </div>

          {/* Chef Collaboration */}
          <div className="flex items-center justify-between">
            <label className="form-label mb-0">Accept chef collaboration referrals?</label>
            <input
              type="checkbox"
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              checked={chefCollaboration}
              onChange={(e) => setChefCollaboration(e.target.checked)}
            />
          </div>

          {/* Workflow Toggles */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-surface-700">Platform Capabilities</h3>
            {[
              { label: 'Create meal plans', value: canCreateMealPlans, setter: setCanCreateMealPlans },
              { label: 'Refer patients to chefs', value: canReferToChefs, setter: setCanReferToChefs },
              { label: 'Monitor multiple patients simultaneously', value: multiPatientMonitoring, setter: setMultiPatientMonitoring },
            ].map(({ label, value, setter }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-surface-600">{label}</span>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  checked={value}
                  onChange={(e) => setter(e.target.checked)}
                />
              </div>
            ))}
          </div>

          <hr className="border-surface-100" />

          {/* Consent Checkboxes – now using correct state variables */}
          <div className="space-y-3">
            {/* Terms of Service */}
            <div data-error={errors.signedTerms ? true : undefined}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                  checked={signedTerms}
                  onChange={(e) => setSignedTerms(e.target.checked)}
                />
                <span className="text-sm text-surface-600">
                  I agree to the CareCuisin Terms of Service and Professional Code of Conduct.
                </span>
              </label>
              {errors.signedTerms && <p className="form-error ml-7">⚠ {errors.signedTerms}</p>}
            </div>

            {/* Data Privacy */}
            <div data-error={errors.dataPrivacy ? true : undefined}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                  checked={dataPrivacy}
                  onChange={(e) => setDataPrivacy(e.target.checked)}
                />
                <span className="text-sm text-surface-600">
                  I consent to the processing of my professional data for patient matching and admin verification.
                </span>
              </label>
              {errors.dataPrivacy && <p className="form-error ml-7">⚠ {errors.dataPrivacy}</p>}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !signedTerms || !dataPrivacy}
              className={`w-full py-3 shadow-sm transition-all ${
                signedTerms && dataPrivacy
                  ? 'btn-primary'
                  : 'bg-surface-200 text-surface-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Finalizing…
                </span>
              ) : (
                'Complete Registration'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
