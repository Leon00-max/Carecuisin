'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ────────────────────────────────────────────────────────────
   CONSTANTS
─────────────────────────────────────────────────────────── */
const MEDICAL_CONDITIONS = [
  'Diabetes Type 1', 'Diabetes Type 2', 'Hypertension',
  'Kidney Disease', 'Ulcer', 'Obesity', 'PCOS',
  'High Cholesterol', 'Thyroid Problems', 'None',
  'Other',
];

const ALLERGY_OPTIONS = [
  'Nuts', 'Seafood', 'Milk / Dairy', 'Eggs',
  'Gluten', 'Soy', 'None', 'Other',
];

const EXERCISE_TYPES = ['Walking', 'Gym', 'Running', 'Sports', 'None'];

const WATER_OPTIONS = ['Less than 1L', '1–2L', '2–3L', 'More than 3L'];
const ACTIVITY_LEVELS = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'];

/* ────────────────────────────────────────────────────────────
   VALIDATION
─────────────────────────────────────────────────────────── */
function validate(data) {
  const errors = {};

  if (!data.conditions || data.conditions.length === 0)
    errors.conditions = 'Select at least one condition or "None".';

  if (data.takingMedication === 'yes') {
    data.medications.forEach((med, idx) => {
      if (!med.name?.trim())
        errors[`med_name_${idx}`] = 'Medication name is required.';
    });
  }

  if (!data.activityLevel)
    errors.activityLevel = 'Please select your activity level.';

  return errors;
}

/* ────────────────────────────────────────────────────────────
   PAGE COMPONENT
─────────────────────────────────────────────────────────── */
export default function PatientStep2() {
  const router = useRouter();

  // ---------- state ----------
  const [conditions, setConditions] = useState([]);
  const [otherCondition, setOtherCondition] = useState('');
  const [takingMedication, setTakingMedication] = useState('no');
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '' }]);
  const [allergies, setAllergies] = useState([]);
  const [allergySeverity, setAllergySeverity] = useState('Mild');
  const [otherAllergy, setOtherAllergy] = useState('');
  const [mealsPerDay, setMealsPerDay] = useState('3');
  const [skipsMeals, setSkipsMeals] = useState('no');
  const [waterIntake, setWaterIntake] = useState('1–2L');
  const [activityLevel, setActivityLevel] = useState('');
  const [exerciseType, setExerciseType] = useState([]);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [foodDiary, setFoodDiary] = useState({ breakfast: '', lunch: '', dinner: '', snacks: '' });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------- pre‑fill from saved data ----------
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cc_onboarding_patient_step2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.conditions) setConditions(parsed.conditions);
        if (parsed.otherCondition) setOtherCondition(parsed.otherCondition);
        if (parsed.takingMedication) setTakingMedication(parsed.takingMedication);
        if (parsed.medications) setMedications(parsed.medications);
        if (parsed.allergies) setAllergies(parsed.allergies);
        if (parsed.allergySeverity) setAllergySeverity(parsed.allergySeverity);
        if (parsed.otherAllergy) setOtherAllergy(parsed.otherAllergy);
        if (parsed.mealsPerDay) setMealsPerDay(parsed.mealsPerDay);
        if (parsed.skipsMeals) setSkipsMeals(parsed.skipsMeals);
        if (parsed.waterIntake) setWaterIntake(parsed.waterIntake);
        if (parsed.activityLevel) setActivityLevel(parsed.activityLevel);
        if (parsed.exerciseType) setExerciseType(parsed.exerciseType);
        if (parsed.sleepQuality) setSleepQuality(parsed.sleepQuality);
        if (parsed.stressLevel) setStressLevel(parsed.stressLevel);
        if (parsed.foodDiary) setFoodDiary(parsed.foodDiary);
      }
    } catch (_) {}
  }, []);

  // ---------- helpers ----------
  const toggleMulti = (list, setList, value) => {
    setList(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const addMedication = () => {
    setMedications(prev => [...prev, { name: '', dosage: '', frequency: '' }]);
  };

  const updateMedication = (idx, field, value) => {
    const copy = [...medications];
    copy[idx] = { ...copy[idx], [field]: value };
    setMedications(copy);
  };

  const updateFood = (meal, value) => {
    setFoodDiary(prev => ({ ...prev, [meal]: value }));
  };

  // ---------- submit ----------
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const data = {
      conditions,
      otherCondition: conditions.includes('Other') ? otherCondition : '',
      takingMedication,
      medications: takingMedication === 'yes' ? medications : [],
      allergies,
      otherAllergy: allergies.includes('Other') ? otherAllergy : '',
      allergySeverity,
      mealsPerDay,
      skipsMeals,
      waterIntake,
      activityLevel,
      exerciseType,
      sleepQuality,
      stressLevel,
      foodDiary,
    };

    const fieldErrors = validate(data);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const first = document.querySelector('[data-error]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    localStorage.setItem('cc_onboarding_patient_step2', JSON.stringify(data));
    setTimeout(() => router.push('/onboarding/patient/step3'), 600);
  };

  // ---------- render ----------
  return (
    <div className="w-full max-w-lg mx-auto">

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-semibold text-primary-600 mb-2">
          <span>Step 2 of 3</span>
          <span>Health Profile</span>
        </div>
        <div className="h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: '66%' }} />
        </div>
      </div>

      <div className="bg-white border border-surface-100 rounded-2xl shadow-sm p-7 sm:p-9">
        <h2 className="text-2xl font-bold text-surface-900 mb-1">Your medical context</h2>
        <p className="text-sm text-surface-500 mb-7">
          This information is shared only with your dietitian.
        </p>

        <form onSubmit={handleSubmit} className="space-y-7" noValidate>

          {/* ----- Medical Conditions (multi‑select chips) ----- */}
          <div data-error={errors.conditions ? true : undefined}>
            <label className="form-label">Diagnosed medical conditions</label>
            <p className="text-xs text-surface-400 mb-2">Select all that apply.</p>
            <div className="flex flex-wrap gap-2">
              {MEDICAL_CONDITIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleMulti(conditions, setConditions, c)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    conditions.includes(c)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            {errors.conditions && <p className="form-error">⚠ {errors.conditions}</p>}
            {conditions.includes('Other') && (
              <input
                type="text"
                className="input-medical mt-2"
                placeholder="Please specify"
                value={otherCondition}
                onChange={(e) => setOtherCondition(e.target.value)}
              />
            )}
          </div>

          {/* ----- Medications ----- */}
          <div>
            <label className="form-label">Are you currently taking any medications?</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="takingMedication"
                  value="yes"
                  checked={takingMedication === 'yes'}
                  onChange={() => setTakingMedication('yes')}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-surface-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="takingMedication"
                  value="no"
                  checked={takingMedication === 'no'}
                  onChange={() => setTakingMedication('no')}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-surface-700">No</span>
              </label>
            </div>
            {takingMedication === 'yes' && (
              <div className="mt-4 space-y-3 border-l-2 border-primary-200 pl-4">
                {medications.map((med, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Name"
                        className={`input-medical ${errors[`med_name_${idx}`] ? 'border-red-400' : ''}`}
                        value={med.name}
                        onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                      />
                      {errors[`med_name_${idx}`] && (
                        <p className="form-error">⚠ {errors[`med_name_${idx}`]}</p>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Dosage"
                      className="input-medical"
                      value={med.dosage}
                      onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Frequency"
                      className="input-medical"
                      value={med.frequency}
                      onChange={(e) => updateMedication(idx, 'frequency', e.target.value)}
                    />
                  </div>
                ))}
                <button type="button" onClick={addMedication} className="text-xs font-semibold text-primary-600 underline">
                  + Add another medication
                </button>
              </div>
            )}
          </div>

          {/* ----- Allergies & Severity ----- */}
          <div>
            <label className="form-label">Food allergies or intolerances</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ALLERGY_OPTIONS.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleMulti(allergies, setAllergies, a)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    allergies.includes(a)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            {allergies.includes('Other') && (
              <input
                type="text"
                className="input-medical mt-2"
                placeholder="Specify other allergy"
                value={otherAllergy}
                onChange={(e) => setOtherAllergy(e.target.value)}
              />
            )}
            {allergies.length > 0 && !allergies.includes('None') && (
              <div className="mt-3">
                <label className="form-label">Severity</label>
                <select
                  value={allergySeverity}
                  onChange={(e) => setAllergySeverity(e.target.value)}
                  className="input-medical"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
            )}
          </div>

          {/* ----- Eating habits ----- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mealsPerDay" className="form-label">Meals per day</label>
              <select
                id="mealsPerDay"
                value={mealsPerDay}
                onChange={(e) => setMealsPerDay(e.target.value)}
                className="input-medical"
              >
                {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                <option value="4+">4+</option>
              </select>
            </div>
            <div>
              <label className="form-label">Do you often skip meals?</label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="skipsMeals" value="yes" checked={skipsMeals === 'yes'} onChange={() => setSkipsMeals('yes')} className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-surface-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="skipsMeals" value="no" checked={skipsMeals === 'no'} onChange={() => setSkipsMeals('no')} className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-surface-700">No</span>
                </label>
              </div>
            </div>
          </div>

          {/* ----- Water intake ----- */}
          <div>
            <label className="form-label">Daily water intake</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {WATER_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setWaterIntake(opt)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    waterIntake === opt
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* ----- Activity level & Exercise ----- */}
          <div data-error={errors.activityLevel ? true : undefined}>
            <label className="form-label">Physical activity level</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ACTIVITY_LEVELS.map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setActivityLevel(level)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    activityLevel === level
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            {errors.activityLevel && <p className="form-error">⚠ {errors.activityLevel}</p>}
          </div>

          <div>
            <label className="form-label">Type of exercise</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {EXERCISE_TYPES.map(ex => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => toggleMulti(exerciseType, setExerciseType, ex)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    exerciseType.includes(ex)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'
                  }`}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* ----- Sleep & Stress sliders ----- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Sleep quality ({sleepQuality}/10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(e.target.value)}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-surface-400 mt-1">
                <span>Poor</span><span>Excellent</span>
              </div>
            </div>
            <div>
              <label className="form-label">Stress level ({stressLevel}/10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(e.target.value)}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-surface-400 mt-1">
                <span>Low</span><span>High</span>
              </div>
            </div>
          </div>

          {/* ----- Food diary snapshot ----- */}
          <div>
            <label className="form-label">Typical daily eating (optional)</label>
            <p className="text-xs text-surface-400 mb-3">Helps the dietitian understand your current habits.</p>
            <div className="space-y-3">
              {['breakfast', 'lunch', 'dinner', 'snacks'].map(meal => (
                <div key={meal}>
                  <label className="text-xs font-medium text-surface-600 capitalize mb-1 block">{meal}</label>
                  <input
                    type="text"
                    className="input-medical"
                    placeholder={`What do you usually eat for ${meal}?`}
                    value={foodDiary[meal]}
                    onChange={(e) => updateFood(meal, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ----- Submit ----- */}
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
                'Next: Lifestyle & Budget →'
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