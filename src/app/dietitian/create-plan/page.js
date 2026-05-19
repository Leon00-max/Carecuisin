'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye, EyeOff, ArrowLeft, UserCheck, Calendar, Coffee, Sun, Moon, Apple } from 'lucide-react';
import { saveMealPlan } from '@/lib/mealPlanStore';
import { getCurrentUserId, getUserById } from '@/lib/userStore';

function getPatientsWithConditions() {
  const allUsers = getUsers();
  return allUsers
    .filter(u => u.role === 'patient')
    .map(u => {
      let condition = 'Unknown';
      try {
        // Read the patient's Step 2 onboarding data (contains medical conditions)
        const step2 = JSON.parse(localStorage.getItem('cc_onboarding_patient_step2') || '{}');
        // Use the first condition if available
        condition = step2.conditions?.[0] || 'General';
      } catch (_) {}
      return {
        id: u.id,
        name: u.fullName || 'Patient',
        condition,
      };
    });
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_ICONS = { breakfast: Coffee, lunch: Sun, dinner: Moon, snacks: Apple };

export default function CreatePlanPage() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [showPrivate, setShowPrivate] = useState(false);

  useEffect(() => {
    
    const data = getPatientsWithConditions();
    setPatients(data);
    if (data.length > 0) setSelectedPatient(data[0].id);

  }, []);

  const [meals, setMeals] = useState(
    DAYS.map(() => ({
      breakfast: { public: '', clinical: '' },
      lunch:     { public: '', clinical: '' },
      dinner:    { public: '', clinical: '' },
      snacks:    { public: '', clinical: '' },
    }))
  );

  const updateMeal = (dayIdx, mealType, field, value) => {
    setMeals(prev => {
      const copy = [...prev];
      copy[dayIdx] = { ...copy[dayIdx], [mealType]: { ...copy[dayIdx][mealType], [field]: value } };
      return copy;
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // Build the meals object in the format the store expects
  const mealsByDay = {};
  DAYS.forEach((day, idx) => {
    mealsByDay[day] = meals[idx];
  });

  const patientId = selectedPatient; // currently holds the patient ID from the dropdown
  const dietitianId = getCurrentUserId(); // from lib/userStore

  const { plan, clinicalNote } = saveMealPlan({
    patientId,
    dietitianId,
    startDate: new Date().toISOString(),
    meals: mealsByDay,
  });

  console.log('Plan saved:', plan);
  console.log('Clinical notes saved:', clinicalNote);

  router.push('/dietitian/dashboard');
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="badge-clinical mb-2 inline-block">Prescription Engine</span>
          <h1 className="text-2xl font-bold text-surface-900">Create Meal Plan</h1>
          <p className="text-sm text-surface-500 mt-1">
            Build a weekly clinical‑culinary plan for your patient.
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-surface-600 hover:text-primary-600"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Patient selection + clinical mode toggle */}
      <div className="card-medical space-y-4">
        <div className="flex items-center gap-3">
          <UserCheck size={20} className="text-primary-500" />
          <h3 className="text-sm font-semibold text-surface-800">Subject Selection</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="patient" className="form-label">Target Patient</label>
            <select
              id="patient"
              value={selectedPatient}
              onChange={e => setSelectedPatient(e.target.value)}
              className="input-medical mt-1"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} — {p.condition}</option>
              ))}
            </select>
          </div>
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPrivate(!showPrivate)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  showPrivate ? 'bg-primary-600 text-white' : 'bg-white text-primary-600 border border-primary-200'
                }`}
              >
                {showPrivate ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <div>
                <p className="text-sm font-semibold text-primary-700">Clinical Mode</p>
                <p className="text-xs text-primary-500">
                  {showPrivate ? 'Private notes enabled' : 'Private notes hidden'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly plan form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {DAYS.map((day, dayIdx) => (
          <div key={day} className="card-medical overflow-hidden !p-0">
            {/* Day header — light primary blue */}
            <div className="bg-primary-500 px-6 py-3 flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2 text-sm">
                <Calendar size={16} />
                {day}
              </h3>
              <span className="text-xs text-primary-100">Day {dayIdx + 1}</span>
            </div>

            <div className="p-6 space-y-5">
              {Object.entries(MEAL_ICONS).map(([mealType, Icon]) => (
                <div key={mealType} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-surface-50 pb-4 last:border-0 last:pb-0">
                  {/* Public meal */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} className="text-primary-500" />
                      <label className="text-xs font-semibold text-surface-500 uppercase tracking-wider capitalize">
                        {mealType}
                      </label>
                      <span className="text-xs text-surface-300">(Patient sees this)</span>
                    </div>
                    <input
                      type="text"
                      placeholder={`Prescribe ${mealType}…`}
                      value={meals[dayIdx][mealType].public}
                      onChange={e => updateMeal(dayIdx, mealType, 'public', e.target.value)}
                      className="input-medical"
                    />
                  </div>

                  {/* Private clinical note */}
                  {showPrivate && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <EyeOff size={16} className="text-primary-600" />
                        <label className="text-xs font-semibold text-primary-600 uppercase tracking-wider capitalize">
                          {mealType}
                        </label>
                        <span className="text-xs text-primary-400">(Dietitian & Admin only)</span>
                      </div>
                      <textarea
                        rows={1}
                        placeholder="Clinical targets, allergies, prep notes…"
                        value={meals[dayIdx][mealType].clinical}
                        onChange={e => updateMeal(dayIdx, mealType, 'clinical', e.target.value)}
                        className="input-medical"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Submit */}
        <div className="card-medical flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-surface-800">Finalize Plan</h4>
            <p className="text-xs text-surface-400">Submit to system & notify patient</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button type="button" onClick={() => router.back()} className="btn-outline">
              Discard
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Save size={16} /> Deploy Meal Plan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}