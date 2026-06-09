'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Flame,
  Plus,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react';
import { saveMealPlan } from '@/lib/mealPlanStore';
import { getCurrentUserId } from '@/lib/userStore';
import {
  CLINICAL_PRIVATE_NOTE,
  DIETITIAN_MEALS,
  DIETITIAN_PATIENTS,
  MEAL_PLAN_DAYS,
} from '@/lib/dietitianPortalData';

const STEPS = ['Meals', 'Nutrients', 'Notes'];

export default function CreateMealPlanPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [day, setDay] = useState('Monday');
  const [patientId, setPatientId] = useState(DIETITIAN_PATIENTS[0].id);
  const [meals, setMeals] = useState(DIETITIAN_MEALS);
  const [patientNote, setPatientNote] = useState('This meal supports blood sugar stability and keeps you full longer.');
  const [clinicalNote, setClinicalNote] = useState(CLINICAL_PRIVATE_NOTE);
  const patient = DIETITIAN_PATIENTS.find(item => item.id === patientId) || DIETITIAN_PATIENTS[0];

  const totals = useMemo(() => {
    const calories = meals.reduce((sum, meal) => sum + Number(meal.calories || 0), 0);
    return {
      calories,
      carbs: 174,
      protein: 92,
      fat: 47,
      fiber: 29,
      water: '8 glasses',
      sodium: 'Reduced',
    };
  }, [meals]);

  const addMeal = () => {
    setMeals(prev => [
      ...prev,
      {
        type: 'Snack',
        name: 'New clinical snack',
        calories: 160,
        carbs: '18g',
        protein: '8g',
        fat: '4g',
        fiber: '5g',
        sodium: 'Low',
        guidance: 'Add preparation guidance for chef.',
      },
    ]);
  };

  const removeMeal = (index) => {
    setMeals(prev => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const publishPlan = (status = 'active') => {
    const dietitianId = getCurrentUserId() || 'DIETITIAN-DEMO';
    saveMealPlan({
      patientId: patient.id,
      dietitianId,
      title: `${patient.condition} Plan - Week 3`,
      description: patientNote,
      startDate: '2026-05-25',
      endDate: '2026-05-31',
      status,
      details: MEAL_PLAN_DAYS.map(planDay => ({
        day: planDay,
        items: meals.map(meal => ({
          type: meal.type,
          description: meal.name,
          time: meal.type === 'Breakfast' ? '7:00 AM' : meal.type === 'Lunch' ? '12:30 PM' : meal.type === 'Dinner' ? '7:00 PM' : '4:00 PM',
          kcal: meal.calories,
          publicNote: patientNote,
          preparationGuidance: meal.guidance,
        })),
      })),
      _clinical: {
        medicalRationale: clinicalNote,
        clinicalTargets: totals,
        allergyFlags: [],
      },
    });
    router.push('/dietitian/plans');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-4">
      <header className="flex items-center gap-3">
        <Link
          href="/dietitian/plans"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-100 bg-white text-surface-500 shadow-sm"
          aria-label="Back to plans"
        >
          <ArrowLeft size={19} />
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-surface-900">Create Meal Plan</h1>
          <p className="mt-1 text-sm text-surface-500">Guided clinical workflow for safe prescriptions.</p>
        </div>
      </header>

      <section className="card-medical rounded-2xl border-surface-100 p-4">
        <div className="grid grid-cols-3 gap-2">
          {STEPS.map((item, index) => (
            <button
              key={item}
              type="button"
              onClick={() => setStep(index)}
              className={`rounded-2xl border px-3 py-3 text-xs font-black transition-colors ${
                step === index
                  ? 'border-primary-200 bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                  : 'border-surface-100 bg-white text-surface-500'
              }`}
            >
              {index + 1}. {item}
            </button>
          ))}
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <label className="form-label">Patient</label>
        <select value={patientId} onChange={event => setPatientId(event.target.value)} className="input-medical rounded-2xl">
          {DIETITIAN_PATIENTS.map(item => (
            <option key={item.id} value={item.id}>{item.name} - {item.condition}</option>
          ))}
        </select>
      </section>

      {step === 0 && (
        <section className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {MEAL_PLAN_DAYS.map(item => {
              const active = day === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDay(item)}
                  className={`min-w-[112px] rounded-full border px-4 py-2 text-xs font-black ${
                    active
                      ? 'border-primary-200 bg-primary-50 text-primary-700'
                      : 'border-surface-100 bg-white text-surface-500'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {meals.map((meal, index) => (
            <article key={`${meal.type}-${index}`} className="card-medical rounded-2xl border-surface-100 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <UtensilsCrossed size={20} />
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input value={meal.type} readOnly className="input-medical rounded-2xl" />
                    <input value={`${meal.calories} kcal`} readOnly className="input-medical rounded-2xl" />
                  </div>
                  <input value={meal.name} readOnly className="input-medical rounded-2xl" />
                  <p className="rounded-2xl border border-primary-100 bg-primary-50 p-3 text-xs leading-relaxed text-primary-700">
                    {meal.guidance}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {[meal.carbs, meal.protein, meal.fat, meal.fiber, meal.sodium].map((value, valueIndex) => (
                      <span key={`${value}-${valueIndex}`} className="rounded-xl bg-surface-50 px-3 py-2 text-center text-xs font-black text-surface-600">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeMeal(index)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-alert/20 bg-alert/10 text-alert"
                  aria-label="Remove meal"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}

          <button type="button" onClick={addMeal} className="btn-outline flex w-full items-center justify-center gap-2 rounded-2xl bg-white">
            <Plus size={17} />
            Add Meal
          </button>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Nutrient label="Total Calories" value={`${totals.calories} kcal`} percent={78} />
            <Nutrient label="Carbohydrates" value={`${totals.carbs}g`} percent={64} />
            <Nutrient label="Protein" value={`${totals.protein}g`} percent={72} />
            <Nutrient label="Fat" value={`${totals.fat}g`} percent={52} />
            <Nutrient label="Fiber" value={`${totals.fiber}g`} percent={68} />
            <Nutrient label="Water Target" value={totals.water} percent={80} />
          </div>
          <section className="rounded-2xl border border-warning/20 bg-warning/10 p-4 text-sm leading-relaxed text-surface-700">
            Sodium target is reduced. Check chef-facing preparation guidance before publishing.
          </section>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <div className="card-medical rounded-2xl border-surface-100 p-5">
            <label className="form-label">Patient-facing note</label>
            <textarea value={patientNote} onChange={event => setPatientNote(event.target.value)} rows={4} className="input-medical rounded-2xl resize-none" />
          </div>

          <div className="card-medical rounded-2xl border-primary-100 bg-primary-50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary-600" />
              <h2 className="text-sm font-black text-surface-900">Private clinical note</h2>
            </div>
            <textarea value={clinicalNote} onChange={event => setClinicalNote(event.target.value)} rows={5} className="input-medical rounded-2xl resize-none" />
            <p className="mt-3 text-xs leading-relaxed text-primary-700">
              This note is for dietitian use only. Patients and chefs receive only safe public or preparation instructions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => publishPlan('draft')} className="btn-outline flex items-center justify-center gap-2 rounded-2xl bg-white">
              <Save size={17} />
              Save Draft
            </button>
            <button type="button" onClick={() => publishPlan('active')} className="btn-primary flex items-center justify-center gap-2 rounded-2xl">
              <Send size={17} />
              Publish Plan
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function Nutrient({ label, value, percent }) {
  return (
    <div className="card-medical rounded-2xl border-surface-100 p-4">
      <Flame size={18} className="text-primary-600" />
      <p className="mt-4 text-xs font-black uppercase tracking-wider text-surface-400">{label}</p>
      <p className="mt-1 text-xl font-black text-surface-900">{value}</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-100">
        <div className="h-full rounded-full bg-primary-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
