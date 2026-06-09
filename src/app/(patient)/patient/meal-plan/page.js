'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  CheckCircle,
  ChefHat,
  ChevronRight,
  Clock,
  Coffee,
  Moon,
  ShieldCheck,
  Sun,
  UtensilsCrossed,
} from 'lucide-react';
import { getLatestMealPlanForPatient } from '@/lib/mealPlanStore';
import { getReferralsForPatient } from '@/lib/referralStore';
import { getCurrentUserId, getUserById } from '@/lib/userStore';

const WEEK_TABS = ['Week 3', 'Week 4', 'Week 5', 'Week 6'];

const SAMPLE_MEALS = [
  {
    day: 'Monday',
    type: 'Lunch',
    name: 'Grilled Fish with Plantains & Vegetables',
    description: 'Balanced protein with controlled starch portions.',
    calories: 490,
    time: '12:00 PM',
    status: 'completed',
  },
  {
    day: 'Tuesday',
    type: 'Lunch',
    name: 'Eru with Pounded Yam & Chicken',
    description: 'Local comfort meal prepared with measured oil.',
    calories: 520,
    time: '12:30 PM',
    status: 'active',
  },
  {
    day: 'Wednesday',
    type: 'Lunch',
    name: 'Achu Soup',
    description: 'Light yellow soup portion with vegetables.',
    calories: 480,
    time: '12:30 PM',
    status: 'planned',
  },
  {
    day: 'Thursday',
    type: 'Dinner',
    name: 'Fufu Kati Kati',
    description: 'Lean chicken with moderated fufu portion.',
    calories: 510,
    time: '7:00 PM',
    status: 'missed',
  },
  {
    day: 'Friday',
    type: 'Lunch',
    name: 'Jollof Rice',
    description: 'Served with grilled chicken and vegetables.',
    calories: 535,
    time: '12:30 PM',
    status: 'planned',
  },
  {
    day: 'Saturday',
    type: 'Dinner',
    name: 'Beans Porridge',
    description: 'Fiber-rich meal with plantain portion control.',
    calories: 460,
    time: '7:00 PM',
    status: 'planned',
  },
  {
    day: 'Sunday',
    type: 'Lunch',
    name: 'Vegetable Soup',
    description: 'Leafy vegetable bowl with wheat swallow.',
    calories: 440,
    time: '1:00 PM',
    status: 'planned',
  },
];

const TYPE_ICON = {
  Breakfast: Coffee,
  Lunch: Sun,
  Dinner: Moon,
  Snack: UtensilsCrossed,
};

function normalizePlanMeals(plan) {
  if (!plan) return [];

  if (Array.isArray(plan.details)) {
    return plan.details.flatMap((dayPlan, dayIndex) => (
      (dayPlan.items || []).map((meal, mealIndex) => ({
        day: dayPlan.day || `Day ${dayIndex + 1}`,
        type: meal.type || 'Meal',
        name: meal.description || meal.name || 'Prescribed meal',
        description: meal.publicNote || 'Prepared to match your dietitian-approved plan.',
        calories: Number(meal.kcal || meal.calories || 0) || 480,
        time: meal.time || '12:30 PM',
        status: meal.status || (dayIndex === 0 && mealIndex === 0 ? 'active' : 'planned'),
      }))
    ));
  }

  if (plan.meals && typeof plan.meals === 'object') {
    return Object.entries(plan.meals).flatMap(([day, meals]) => {
      const values = Array.isArray(meals) ? meals : Object.entries(meals || {}).map(([type, value]) => ({ ...value, type }));
      return values.map((meal, index) => ({
        day,
        type: meal.type || 'Meal',
        name: meal.description || meal.name || meal.meal || 'Prescribed meal',
        description: meal.publicNote || 'Prepared to match your dietitian-approved plan.',
        calories: Number(meal.kcal || meal.calories || 0) || 480,
        time: meal.time || '12:30 PM',
        status: meal.status || (index === 0 ? 'active' : 'planned'),
      }));
    });
  }

  return [];
}

function getLatestReferral(referrals, planId) {
  const sorted = [...referrals].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return sorted.find(ref => ref.mealPlanId === planId) || sorted[0] || null;
}

function statusStyle(status) {
  if (status === 'completed') {
    return {
      label: 'Completed',
      className: 'border-success/20 bg-success/10 text-success',
      dot: 'bg-success',
      icon: CheckCircle,
    };
  }
  if (status === 'active') {
    return {
      label: 'Active',
      className: 'border-primary-100 bg-primary-50 text-primary-700',
      dot: 'bg-primary-500',
      icon: Clock,
    };
  }
  if (status === 'missed') {
    return {
      label: 'Review',
      className: 'border-warning/20 bg-warning/10 text-warning',
      dot: 'bg-warning',
      icon: Clock,
    };
  }
  return {
    label: 'Planned',
    className: 'border-surface-100 bg-surface-50 text-surface-500',
    dot: 'bg-surface-300',
    icon: CalendarDays,
  };
}

export default function MealPlanPage() {
  const [state, setState] = useState({
    ready: false,
    plan: null,
    referral: null,
  });
  const [activeWeek, setActiveWeek] = useState('Week 3');

  useEffect(() => {
    const patientId = getCurrentUserId();
    if (!patientId) {
      queueMicrotask(() => {
        setState(prev => ({ ...prev, ready: true }));
      });
      return;
    }

    const plan = getLatestMealPlanForPatient(patientId);
    const referral = getLatestReferral(getReferralsForPatient(patientId), plan?.id);
    queueMicrotask(() => {
      setState({ ready: true, plan, referral });
    });
  }, []);

  const { ready, plan, referral } = state;
  const realMeals = useMemo(() => normalizePlanMeals(plan), [plan]);
  const meals = realMeals.length ? realMeals : SAMPLE_MEALS;
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const completedMeals = meals.filter(meal => meal.status === 'completed').length;
  const progress = Math.round((completedMeals / meals.length) * 100) || (plan ? 42 : 0);
  const chef = referral?.chefId ? getUserById(referral.chefId) : null;
  const chefName = chef?.fullName || referral?.chefName || 'Chef Amadou';
  const hasChef = Boolean(referral || chef);

  if (!ready) {
    return <MealPlanSkeleton />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="badge-clinical gap-2">
            <CalendarDays size={14} />
            Weekly plan
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Your Meal Plan</h1>
          <p className="mt-2 text-sm text-surface-500">
            {plan ? (plan.title || 'Week 3 of 8') : 'Week 3 of 8 preview while your plan is prepared.'}
          </p>
        </div>

        {hasChef && (
          <Link
            href="/patient/chef"
            className="flex w-fit items-center gap-2 rounded-2xl border border-success/20 bg-success/10 px-4 py-2 text-xs font-black text-success transition-colors hover:bg-success/15"
          >
            <ShieldCheck size={15} />
            Chef verified: {chefName}
          </Link>
        )}
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {WEEK_TABS.map(week => {
            const active = week === activeWeek;
            return (
              <button
                key={week}
                type="button"
                onClick={() => setActiveWeek(week)}
                className={`min-w-[82px] rounded-full border px-4 py-2 text-xs font-black transition-colors ${
                  active
                    ? 'border-primary-200 bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                    : 'border-surface-100 bg-white text-surface-500 hover:bg-surface-50'
                }`}
              >
                {week}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-surface-400">Plan completion</p>
            <p className="mt-1 text-2xl font-black text-surface-900">{progress}%</p>
            <p className="mt-1 text-sm text-surface-500">
              {completedMeals} of {meals.length} meals marked complete.
            </p>
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold text-surface-500">
              <span>{activeWeek}</span>
              <span>{totalCalories.toLocaleString()} kcal planned</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-surface-100">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {!plan && (
        <section className="rounded-2xl border border-primary-100 bg-primary-50 p-4 text-sm leading-relaxed text-primary-700">
          Your dietitian is preparing your personalized meal plan. These local meal examples show the experience you will use once the plan is activated.
        </section>
      )}

      <section className="space-y-3">
        {meals.map((meal, index) => (
          <MealRow
            key={`${meal.day}-${meal.name}-${index}`}
            meal={meal}
            chefVerified={hasChef}
          />
        ))}
      </section>
    </div>
  );
}

function MealRow({ meal, chefVerified }) {
  const status = statusStyle(meal.status);
  const StatusIcon = status.icon;
  const TypeIcon = TYPE_ICON[meal.type] || UtensilsCrossed;
  const href = `/patient/meal-detail?meal=${encodeURIComponent(meal.name)}&day=${encodeURIComponent(meal.day)}`;

  return (
    <Link
      href={href}
      className="block rounded-2xl border border-surface-100 bg-white p-3 shadow-sm transition-all hover:border-primary-100 hover:bg-primary-50/50 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div
          className="h-20 w-20 shrink-0 rounded-2xl bg-cover bg-center shadow-sm"
          style={{ backgroundImage: 'url("/hero-meal-placeholder.jpg")' }}
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-surface-500">
              <TypeIcon size={11} />
              {meal.day}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-black ${status.className}`}>
              <StatusIcon size={11} />
              {status.label}
            </span>
          </div>

          <h2 className="mt-2 truncate text-sm font-black text-surface-900">{meal.name}</h2>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-surface-500">{meal.description}</p>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-surface-500">
            <span>{meal.calories} kcal</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {meal.time}
            </span>
            {chefVerified && (
              <span className="inline-flex items-center gap-1 text-success">
                <ChefHat size={12} />
                Chef verified
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
          <ChevronRight size={17} className="text-surface-400" />
        </div>
      </div>
    </Link>
  );
}

function MealPlanSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-56 rounded-xl bg-surface-200" />
      <div className="h-32 rounded-2xl border border-surface-100 bg-white" />
      {[0, 1, 2, 3].map(item => (
        <div key={item} className="h-28 rounded-2xl border border-surface-100 bg-white" />
      ))}
    </div>
  );
}
