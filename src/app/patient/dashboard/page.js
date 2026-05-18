'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, Utensils } from 'lucide-react';
import { getLatestMealPlanForPatient } from '@/lib/mealPlanStore';
import { getCurrentUserId } from '@/lib/userStore';

/* ────────────────────────────────────────────────────────────
   HELPERS – read real data from onboarding localStorage
─────────────────────────────────────────────────────────── */
function getPatientInfo() {
  if (typeof window === 'undefined')
    return { name: 'Patient', condition: 'Unknown', dietitian: 'Not assigned' };

  try {
    const step1 = JSON.parse(localStorage.getItem('cc_onboarding_patient_step1') || '{}');
    const step2 = JSON.parse(localStorage.getItem('cc_onboarding_patient_step2') || '{}');
    const dietitianData = localStorage.getItem('cc_onboarding_dietitian_step1');
    const dietitianName = dietitianData ? 'Dr. Ambe Florence' : 'Not yet assigned';

    return {
      name: step1.fullName || 'Patient',
      condition: step2.conditions?.[0] || 'Unknown',
      dietitian: dietitianName,
    };
  } catch (_) {
    return { name: 'Patient', condition: 'Unknown', dietitian: 'Not assigned' };
  }
}

/* ── Mock today's meals (will eventually come from API) ── */
const [TODAY_MEALS, setTODAY_MEALS] = useState([
  { type: 'Breakfast', desc: 'Loading...', eaten: false },
  { type: 'Lunch',     desc: 'Loading...', eaten: false },
  { type: 'Dinner',    desc: 'Loading...', eaten: false },
]);

/* ────────────────────────────────────────────────────────────
   SVG RING COMPONENT
───────────────────────────────────────────────────────────── */
function ProgressRing({ radius = 45, stroke = 7, progress = 0 }) {
  const size = radius * 2;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            stroke="#e2e8f0"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke="#2563eb"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        {/* Percentage in the middle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-600">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────── */
export default function PatientDashboard() {
  const [info, setInfo] = useState({ name: '', condition: '', dietitian: '' });

  useEffect(() => {
  const userId = getCurrentUserId();
  if (userId) {
    const plan = getLatestMealPlanForPatient(userId);
    if (plan) {
      const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const today = dayNames[new Date().getDay()];
      const todayMealsData = plan.meals[today] || {};
      setTodayMeals([
        { type: 'Breakfast', desc: todayMealsData.breakfast || 'No meal planned', eaten: false },
        { type: 'Lunch', desc: todayMealsData.lunch || 'No meal planned', eaten: false },
        { type: 'Dinner', desc: todayMealsData.dinner || 'No meal planned', eaten: false },
      ]);
    } else {
      setTodayMeals([
        { type: 'Breakfast', desc: 'No meal plan yet', eaten: false },
        { type: 'Lunch', desc: 'No meal plan yet', eaten: false },
        { type: 'Dinner', desc: 'No meal plan yet', eaten: false },
      ]);
    }
  }
}, []);

  const eatenCount = TODAY_MEALS.filter(m => m.eaten).length;
  const progressPercent = Math.round((eatenCount / TODAY_MEALS.length) * 100);

  return (
    <div className="space-y-7">
      {/* Welcome header */}
      <div>
        <span className="badge-clinical mb-2 inline-block">Patient Portal</span>
        <h1 className="text-2xl font-bold text-surface-900">
          Welcome, {info.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Here is your daily meal progress and weekly plan.
        </p>
      </div>

      {/* Progress ring + quick info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ring with percentage */}
        <div className="card-medical flex flex-col items-center justify-center py-8">
          <ProgressRing progress={progressPercent} />
          <p className="text-sm text-surface-500 mt-3">
            {eatenCount} of {TODAY_MEALS.length} meals eaten today
          </p>
        </div>

        {/* Info cards */}
        <div className="space-y-4">
          <div className="card-medical !p-4">
            <p className="text-xs text-surface-500 uppercase tracking-widest">Your Condition</p>
            <p className="text-lg font-bold text-primary-700 mt-1">{info.condition}</p>
          </div>
          <div className="card-medical !p-4">
            <p className="text-xs text-surface-500 uppercase tracking-widest">Your Dietitian</p>
            <p className="text-lg font-bold text-surface-900 mt-1">{info.dietitian}</p>
          </div>
        </div>

        {/* Weekly plan link */}
        <div className="card-medical flex flex-col items-center justify-center text-center space-y-3 !p-6">
          <Utensils size={28} className="text-primary-500" />
          <p className="text-sm font-semibold text-surface-700">Your Weekly Meal Plan</p>
          <p className="text-xs text-surface-400">Prescribed by your dietitian</p>
          <Link href="/patient/meal-plan" className="btn-primary text-sm">
            View Full Plan
          </Link>
        </div>
      </div>

      {/* Today's meals cards */}
      <div className="card-medical">
        <h2 className="text-lg font-semibold text-surface-800 mb-4">Today's Meals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TODAY_MEALS.map((meal) => (
            <div
              key={meal.type}
              className={`rounded-xl border p-4 flex flex-col gap-2 ${
                meal.eaten
                  ? 'bg-emerald-50 border-emerald-100'
                  : 'bg-surface-50 border-surface-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
                  {meal.type}
                </span>
                {meal.eaten ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-700">
                    <CheckCircle size={12} />
                    Eaten
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-surface-400">
                    <Clock size={12} />
                    Pending
                  </span>
                )}
              </div>
              <p className="text-sm text-surface-700 leading-relaxed">{meal.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/patient/meal-plan" className="btn-primary">
          Full Weekly Schedule
        </Link>
        <button className="btn-outline">
          Report a Problem
        </button>
      </div>
    </div>
  );
}