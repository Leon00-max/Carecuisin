'use client';

import { useState, useEffect } from 'react';
import {CheckCircle, Clock, Lock, ChevronDown, ChevronUp,Download,} from 'lucide-react';
import { getLatestMealPlanForPatient } from '@/lib/mealPlanStore';
import { getCurrentUserId } from '@/lib/userStore';
/* ────────────────────────────────────────────────────────────
   MOCK MEAL PLAN (replace with GET /api/meal-plans?patient=me)
   Only public meal data — clinical notes are never shown.
───────────────────────────────────────────────────────────── */
const WEEK_PLAN = [
  {
    day: 'Monday', date: 'May 5', done: true,
    meals: [
      { type: 'Breakfast', meal: 'Oatmeal with sliced bananas and low‑fat milk', time: '7:00 AM', kcal: 320 },
      { type: 'Lunch',     meal: 'Grilled tilapia, boiled plantains, steamed broccoli', time: '12:30 PM', kcal: 480 },
      { type: 'Dinner',    meal: 'Vegetable soup with whole‑grain bread', time: '6:30 PM', kcal: 380 },
    ],
  },
  {
    day: 'Tuesday', date: 'May 6', done: true,
    meals: [
      { type: 'Breakfast', meal: 'Boiled eggs with whole‑grain toast and orange juice', time: '7:00 AM', kcal: 290 },
      { type: 'Lunch',     meal: 'Brown rice with grilled chicken and garden salad', time: '12:30 PM', kcal: 510 },
      { type: 'Dinner',    meal: 'Groundnut soup (low‑salt) with fufu', time: '6:30 PM', kcal: 420 },
    ],
  },
  {
    day: 'Wednesday', date: 'May 7', done: true,
    meals: [
      { type: 'Breakfast', meal: 'Millet porridge with honey and sliced papaya', time: '7:00 AM', kcal: 310 },
      { type: 'Lunch',     meal: 'Baked mackerel, boiled yam, cucumber salad', time: '12:30 PM', kcal: 495 },
      { type: 'Dinner',    meal: 'Lentil stew with whole‑grain crackers', time: '6:30 PM', kcal: 360 },
    ],
  },
  {
    day: 'Thursday', date: 'May 8', done: true,
    meals: [
      { type: 'Breakfast', meal: 'Smoothie: banana, spinach, low‑fat milk, oats', time: '7:00 AM', kcal: 280 },
      { type: 'Lunch',     meal: 'Grilled chicken thighs, boiled sweet potato, salad', time: '12:30 PM', kcal: 520 },
      { type: 'Dinner',    meal: 'Fish pepper soup with white rice (small portion)', time: '6:30 PM', kcal: 440 },
    ],
  },
  {
    day: 'Friday', date: 'May 9', done: false, // today
    meals: [
      { type: 'Breakfast', meal: 'Oatmeal with sliced bananas and low‑fat milk', time: '7:00 AM', kcal: 320, doneToday: true },
      { type: 'Lunch',     meal: 'Grilled fish, boiled plantains, steamed vegetables', time: '12:30 PM', kcal: 480, doneToday: false },
      { type: 'Dinner',    meal: 'Fish pepper soup with whole‑grain crackers', time: '6:30 PM', kcal: 380, doneToday: false },
    ],
  },
  {
    day: 'Saturday', date: 'May 10', done: false, locked: true,
    meals: [
      { type: 'Breakfast', meal: 'Akara (bean cakes) with pap', time: '7:30 AM', kcal: 340 },
      { type: 'Lunch',     meal: 'Jollof rice with grilled chicken (low‑salt)', time: '1:00 PM', kcal: 500 },
      { type: 'Dinner',    meal: 'Vegetable stew with boiled cocoyam', time: '6:30 PM', kcal: 390 },
    ],
  },
  {
    day: 'Sunday', date: 'May 11', done: false, locked: true,
    meals: [
      { type: 'Breakfast', meal: 'Whole‑grain pancakes with fruit salad', time: '8:00 AM', kcal: 350 },
      { type: 'Lunch',     meal: 'Egusi soup (low‑salt) with pounded yam', time: '1:00 PM', kcal: 530 },
      { type: 'Dinner',    meal: 'Grilled tilapia with steamed vegetables', time: '6:30 PM', kcal: 400 },
    ],
  },
];

const TODAY_INDEX = 4; // Friday = index 4

const MEAL_COLORS = {
  Breakfast: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
  Lunch:     { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
  Dinner:    { bg: 'bg-primary-50', border: 'border-primary-100', text: 'text-primary-700' },
};

export default function MealPlanPage() {
  const [patientName, setPatientName] = useState('Patient');
  const [todayMeals, setTodayMeals] = useState([]);
  const [expandedDay, setExpandedDay] = useState(null);

  useEffect(() => {
    try {
      const step1 = JSON.parse(localStorage.getItem('cc_onboarding_patient_step1') || '{}');
      if (step1.fullName) setPatientName(step1.fullName.split(' ')[0]);
    } catch (_) {}

    // Real meal plan from the store (replace the WEEK_PLAN mock)
     const userId = getCurrentUserId();
    if (userId) {
      const plan = getLatestMealPlanForPatient(userId);
      if (plan && plan.meals) {
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const mapped = dayNames.map((day, i) => ({
          day,
          date: new Date(new Date(plan.startDate).getTime() + i * 86400000)
            .toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          done: false,          // can be tracked later
          locked: i > new Date().getDay() - 1,  // future days locked
          meals: [
            { type: 'Breakfast', desc: plan.meals[day]?.breakfast || '—', time: '7:00 AM', kcal: 0 },
            { type: 'Lunch',     desc: plan.meals[day]?.lunch || '—',     time: '12:30 PM', kcal: 0 },
            { type: 'Dinner',    desc: plan.meals[day]?.dinner || '—',    time: '6:30 PM', kcal: 0 },
          ],
        }));
        setWeekPlan(mapped);
        // Expand today
        setExpandedDay(new Date().getDay() - 1 >= 0 ? new Date().getDay() - 1 : 0);
      }
    }

  }, []);

  const today = WEEK_PLAN[TODAY_INDEX];
  const totalKcalToday = today.meals.reduce((s, m) => s + m.kcal, 0);
  const doneKcal = today.meals.filter(m => m.doneToday).reduce((s, m) => s + m.kcal, 0);

  return (
    <div className="space-y-7 pb-16 sm:pb-0">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Weekly Meal Plan
          </h1>
          <p className="text-sm text-surface-500 mt-0.5">
            Prescribed for {patientName} · May 5 – 11, 2026
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-surface-200 bg-white text-xs font-semibold text-surface-600 hover:bg-surface-50 transition-colors">
          <Download size={13} />
          Download PDF
        </button>
      </div>

      {/* Clinical privacy notice */}
      <div className="flex items-start gap-3 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
        <Lock size={14} className="text-primary-500 mt-0.5 shrink-0" />
        <p className="text-xs text-primary-700 leading-relaxed">
          <strong>Your meal plan is clinically prescribed.</strong> Nutritional targets
          and medical rationale are managed privately by your dietitian and are not
          shown here. Do not modify meals without consulting your dietitian.
        </p>
      </div>

      {/* Today's calorie progress */}
      <div className="bg-white border border-surface-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-surface-900">Today's Nutrition</h2>
            <p className="text-xs text-surface-400 mt-0.5">Friday, May 9</p>
          </div>
          <span className="text-sm font-bold text-primary-600">
            {doneKcal} / {totalKcalToday} kcal
          </span>
        </div>
        <div className="h-2.5 bg-surface-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.round((doneKcal / totalKcalToday) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-surface-400 mt-2">
          {Math.round((doneKcal / totalKcalToday) * 100)}% of today's prescribed intake consumed
        </p>
      </div>

      {/* Day-by-day accordion */}
      <div className="space-y-3">
        {WEEK_PLAN.map((dayPlan, i) => {
          const isOpen = expandedDay === i;
          const isToday = i === TODAY_INDEX;
          const totalKcal = dayPlan.meals.reduce((s, m) => s + m.kcal, 0);

          return (
            <div
              key={dayPlan.day}
              className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                isToday ? 'border-primary-200 shadow-sm' : dayPlan.done ? 'border-emerald-100' : 'border-surface-100'
              }`}
            >
              {/* Day header */}
              <button
                onClick={() => setExpandedDay(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      dayPlan.done
                        ? 'bg-primary-600 text-white'
                        : isToday
                        ? 'bg-primary-50 border-2 border-primary-500 text-primary-600'
                        : dayPlan.locked
                        ? 'bg-surface-50 border border-surface-200 text-surface-300'
                        : 'bg-surface-100 text-surface-400'
                    }`}
                  >
                    {dayPlan.done ? <CheckCircle size={14} /> : dayPlan.locked ? <Lock size={12} /> : isToday ? <Clock size={13} /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-surface-900">{dayPlan.day}</span>
                      {isToday && <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full font-medium">Today</span>}
                      {dayPlan.done && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Completed</span>}
                    </div>
                    <span className="text-xs text-surface-400">{dayPlan.date} · {totalKcal} kcal total</span>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-surface-400 shrink-0" /> : <ChevronDown size={16} className="text-surface-400 shrink-0" />}
              </button>

              {/* Expanded meals */}
              {isOpen && (
                <div className="px-5 pb-5 space-y-3 border-t border-surface-50">
                  <div className="pt-3" />
                  {dayPlan.meals.map(({ type, meal, time, kcal, doneToday }) => {
                    const style = MEAL_COLORS[type];
                    return (
                      <div key={type} className={`flex items-start gap-4 p-4 rounded-xl border ${style.bg} ${style.border} ${dayPlan.locked ? 'opacity-60' : ''}`}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>{type}</span>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <span className="text-xs text-surface-400">{kcal} kcal</span>
                              <span className="text-xs text-surface-400">{time}</span>
                              {isToday && (doneToday ? <CheckCircle size={13} className="text-primary-500" /> : <Clock size={13} className="text-surface-300" />)}
                            </div>
                          </div>
                          <p className="text-sm text-surface-700 leading-relaxed">{meal}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="bg-surface-50 border border-surface-100 rounded-xl px-5 py-4 text-xs text-surface-500 leading-relaxed">
        Meal plan valid for the week of <strong>May 5 – 11, 2026</strong>.
        Your dietitian will review and update this plan at your next consultation.
        If you experience any adverse reaction to a meal, report it immediately using the
        <strong> Report a Problem</strong> button on your dashboard.
      </div>
    </div>
  );
}