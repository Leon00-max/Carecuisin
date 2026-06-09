'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { markOnboardingComplete, getCurrentUserId } from '@/lib/userStore';

/* ────────────────────────────────────────────────────────────
   CONSTANTS
─────────────────────────────────────────────────────────── */
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DELIVERY_OPTIONS = [
  'Self‑Delivery',
  'Local Bike Rider (Partnered)',
  'Patient Pickup Only',
];

/* ────────────────────────────────────────────────────────────
   VALIDATION  –  consent boxes are REQUIRED
─────────────────────────────────────────────────────────── */
function validate(data) {
  const errors = {};

  if (!data.baseRate?.trim()) errors.baseRate = 'Base rate is required.';
  if (!data.availableDays || data.availableDays.length === 0)
    errors.availableDays = 'Select at least one available day.';
  if (!data.agreesToTerms) errors.agreesToTerms = 'You must agree to the Terms of Service.';
  if (!data.dataPrivacyConsent) errors.dataPrivacyConsent = 'You must accept the Data Privacy policy.';
  if (!data.medicalDisclaimer) errors.medicalDisclaimer = 'You must accept the medical disclaimer.';

  return errors;
}

/* ────────────────────────────────────────────────────────────
   PAGE COMPONENT
─────────────────────────────────────────────────────────── */
export default function ChefStep3() {
  const router = useRouter();

  // ---------- state ----------
  const [weeklyCapacity, setWeeklyCapacity] = useState(10);
  const [availableDays, setAvailableDays] = useState([]);
  const [noticePeriod, setNoticePeriod] = useState('24 Hours');
  const [deliveryMethod, setDeliveryMethod] = useState('Self‑Delivery');
  const [providesPackaging, setProvidesPackaging] = useState(true);
  const [pickupLocation, setPickupLocation] = useState('');
  const [pricingType, setPricingType] = useState('Per Meal');
  const [baseRate, setBaseRate] = useState('');
  const [includesIngredients, setIncludesIngredients] = useState(false);

  const [agreesToTerms, setAgreesToTerms] = useState(false);
  const [dataPrivacyConsent, setDataPrivacyConsent] = useState(false);
  const [medicalDisclaimer, setMedicalDisclaimer] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------- restore saved data ----------
  useEffect(() => {
    queueMicrotask(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cc_onboarding_chef_step3') || '{}');
      if (saved.weeklyCapacity) setWeeklyCapacity(saved.weeklyCapacity);
      if (saved.availableDays) setAvailableDays(saved.availableDays);
      if (saved.noticePeriod) setNoticePeriod(saved.noticePeriod);
      if (saved.deliveryMethod) setDeliveryMethod(saved.deliveryMethod);
      if (saved.providesPackaging !== undefined) setProvidesPackaging(saved.providesPackaging);
      if (saved.pickupLocation) setPickupLocation(saved.pickupLocation);
      if (saved.pricingType) setPricingType(saved.pricingType);
      if (saved.baseRate) setBaseRate(saved.baseRate);
      if (saved.includesIngredients !== undefined) setIncludesIngredients(saved.includesIngredients);
      if (saved.agreesToTerms) setAgreesToTerms(saved.agreesToTerms);
      if (saved.dataPrivacyConsent) setDataPrivacyConsent(saved.dataPrivacyConsent);
      if (saved.medicalDisclaimer) setMedicalDisclaimer(saved.medicalDisclaimer);
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
      weeklyCapacity,
      availableDays,
      noticePeriod,
      deliveryMethod,
      providesPackaging,
      pickupLocation,
      pricingType,
      baseRate,
      includesIngredients,
      agreesToTerms,
      dataPrivacyConsent,
      medicalDisclaimer,
    };
    localStorage.setItem('cc_onboarding_chef_step3', JSON.stringify(data));
    // Generate and store a stable ID if not exists
    if (!localStorage.getItem('cc_onboarding_patient_id')) {
     localStorage.setItem('cc_onboarding_patient_id', 'P-' + Date.now().toString(36).toUpperCase());
    }
    router.back();
  };

  // ---------- submit (enforces consent) ----------
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const data = {
      weeklyCapacity,
      availableDays,
      noticePeriod,
      deliveryMethod,
      providesPackaging,
      pickupLocation,
      pricingType,
      baseRate,
      includesIngredients,
      agreesToTerms,
      dataPrivacyConsent,
      medicalDisclaimer,
    };

    const fieldErrors = validate(data);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const first = document.querySelector('[data-error]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    localStorage.setItem('cc_onboarding_chef_step3', JSON.stringify(data));
    console.log('Chief onboarding complete:', data);
    // Mark onboarding complete in userStore (for review page logic)
    const uid = getCurrentUserId();
    if (uid) markOnboardingComplete(uid);
    // Chief goes to pending review, just like dietitian
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
          Set your availability, pricing, and operational preferences.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* Weekly Capacity slider */}
          <div>
            <label className="form-label">Weekly Patient Capacity (max meals/week)</label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={weeklyCapacity}
              onChange={(e) => setWeeklyCapacity(e.target.value)}
              className="w-full accent-primary-500 mt-2"
            />
            <div className="flex justify-between text-xs text-surface-500 mt-1">
              <span>5 meals</span>
              <span className="font-semibold text-primary-600">{weeklyCapacity} meals</span>
              <span>50+ meals</span>
            </div>
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

          {/* Delivery Method */}
          <div>
            <label htmlFor="deliveryMethod" className="form-label">Delivery Method</label>
            <select
              id="deliveryMethod"
              className="input-medical"
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
            >
              {DELIVERY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          {/* Packaging toggle */}
          <div>
            <label className="form-label">Packaging</label>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setProvidesPackaging(true)}
                className={`flex-1 py-2 rounded-full border text-xs font-semibold transition-all ${
                  providesPackaging
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                }`}
              >
                I Provide
              </button>
              <button
                type="button"
                onClick={() => setProvidesPackaging(false)}
                className={`flex-1 py-2 rounded-full border text-xs font-semibold transition-all ${
                  !providesPackaging
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                }`}
              >
                Patient Provides
              </button>
            </div>
          </div>

          {/* Pickup Location (conditional) */}
          {deliveryMethod === 'Patient Pickup Only' && (
            <div>
              <label htmlFor="pickupLocation" className="form-label">Pickup Location</label>
              <input
                id="pickupLocation"
                type="text"
                className="input-medical"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g., Molyko, opposite UB Junction"
              />
            </div>
          )}

          <hr className="border-surface-100" />

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pricingType" className="form-label">Pricing Type</label>
              <select
                id="pricingType"
                className="input-medical"
                value={pricingType}
                onChange={(e) => setPricingType(e.target.value)}
              >
                <option value="Per Meal">Per Meal</option>
                <option value="Weekly Subscription">Weekly Subscription</option>
                <option value="Per Day (3 Meals)">Per Day (3 Meals)</option>
              </select>
            </div>
            <div data-error={errors.baseRate ? true : undefined}>
              <label htmlFor="baseRate" className="form-label">Base Rate (XAF)</label>
              <input
                id="baseRate"
                type="number"
                required
                className={`input-medical ${errors.baseRate ? 'border-red-400' : ''}`}
                value={baseRate}
                onChange={(e) => setBaseRate(e.target.value)}
                placeholder="e.g., 2500"
              />
              {errors.baseRate && <p className="form-error">⚠ {errors.baseRate}</p>}
            </div>
          </div>

          {/* Includes Ingredients */}
          <div className="flex items-center justify-between">
            <label className="form-label mb-0">Price includes cost of ingredients?</label>
            <input
              type="checkbox"
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              checked={includesIngredients}
              onChange={(e) => setIncludesIngredients(e.target.checked)}
            />
          </div>

          <hr className="border-surface-100" />

          {/* Consent Checkboxes (BLOCKING) */}
          <div className="space-y-3">
            {/* Terms of Service */}
            <div data-error={errors.agreesToTerms ? true : undefined}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                  checked={agreesToTerms}
                  onChange={(e) => setAgreesToTerms(e.target.checked)}
                />
                <span className="text-sm text-surface-600">
                  I agree to the CareCuisin Terms of Service and Professional Code of Conduct for Culinary Providers.
                </span>
              </label>
              {errors.agreesToTerms && <p className="form-error ml-7">⚠ {errors.agreesToTerms}</p>}
            </div>

            {/* Data Privacy */}
            <div data-error={errors.dataPrivacyConsent ? true : undefined}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                  checked={dataPrivacyConsent}
                  onChange={(e) => setDataPrivacyConsent(e.target.checked)}
                />
                <span className="text-sm text-surface-600">
                  I consent to the processing of my professional data for patient matching and admin verification.
                </span>
              </label>
              {errors.dataPrivacyConsent && <p className="form-error ml-7">⚠ {errors.dataPrivacyConsent}</p>}
            </div>

            {/* Medical Disclaimer */}
            <div data-error={errors.medicalDisclaimer ? true : undefined}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                  checked={medicalDisclaimer}
                  onChange={(e) => setMedicalDisclaimer(e.target.checked)}
                />
                <span className="text-sm text-surface-600">
                  I certify that I will only cook meals based on the prescriptions provided by verified dietitians on this platform.
                </span>
              </label>
              {errors.medicalDisclaimer && <p className="form-error ml-7">⚠ {errors.medicalDisclaimer}</p>}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
             type="submit"
              disabled={loading || !agreesToTerms || !dataPrivacyConsent || !medicalDisclaimer}
              className={`w-full py-3 shadow-sm transition-all ${
                medicalDisclaimer && dataPrivacyConsent && agreesToTerms
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
