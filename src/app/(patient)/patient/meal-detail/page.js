'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChefHat,
  Clock,
  Flame,
  HeartPulse,
  Info,
  ShieldCheck,
  Stethoscope,
  UtensilsCrossed,
} from 'lucide-react';

const DEFAULT_MEAL = {
  name: 'Grilled Fish with Plantains & Vegetables',
  day: 'Today',
  reason: 'Prepared for blood sugar stability.',
  calories: 490,
  time: '12:30 PM',
};

const MACROS = [
  { label: 'Protein', value: '34g', percent: 72 },
  { label: 'Carbs', value: '48g', percent: 58 },
  { label: 'Fiber', value: '9g', percent: 64 },
  { label: 'Sodium', value: 'Low', percent: 36 },
];

const INGREDIENTS = [
  'Grilled fish',
  'Ripe plantain portion',
  'Steamed carrots',
  'Green vegetables',
  'Low-sodium seasoning',
];

export default function MealDetailPage() {
  const [meal, setMeal] = useState(DEFAULT_MEAL);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('meal');
    const day = params.get('day');
    queueMicrotask(() => {
      setMeal(prev => ({
        ...prev,
        name: name ? decodeURIComponent(name) : prev.name,
        day: day ? decodeURIComponent(day) : prev.day,
      }));
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-4">
      <header className="flex items-center justify-between gap-4">
        <Link
          href="/patient/meal-plan"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-100 bg-white text-surface-500 shadow-sm transition-colors hover:text-primary-600"
          aria-label="Back to meal plan"
        >
          <ArrowLeft size={19} />
        </Link>
        <span className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-black text-success">
          Chef preparing
        </span>
      </header>

      <section className="card-medical overflow-hidden rounded-2xl border-surface-100 p-0">
        <div
          className="h-72 bg-cover bg-center"
          style={{ backgroundImage: 'url("/hero-meal-placeholder.jpg")' }}
          aria-hidden="true"
        />
        <div className="p-5 sm:p-6">
          <p className="text-xs font-black uppercase tracking-wider text-primary-600">{meal.day} prescribed meal</p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-surface-900">{meal.name}</h1>
          <p className="mt-2 text-sm italic leading-relaxed text-primary-600">{meal.reason}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Fact icon={Flame} label="Calories" value={`${meal.calories} kcal`} />
            <Fact icon={Clock} label="Meal time" value={meal.time} />
            <Fact icon={ChefHat} label="Chef status" value="Preparing" />
            <Fact icon={ShieldCheck} label="Safety" value="Verified" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="card-medical rounded-2xl border-surface-100 p-5">
          <div className="flex items-center gap-2">
            <HeartPulse size={18} className="text-primary-600" />
            <h2 className="text-sm font-black text-surface-900">Nutrition Breakdown</h2>
          </div>
          <div className="mt-5 space-y-4">
            {MACROS.map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs font-bold text-surface-500">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-100">
                  <div className="h-full rounded-full bg-primary-500" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-medical rounded-2xl border-surface-100 p-5">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-primary-600" />
            <h2 className="text-sm font-black text-surface-900">Ingredients</h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {INGREDIENTS.map(item => (
              <span key={item} className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card-medical rounded-2xl border-surface-100 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <Stethoscope size={21} />
            </div>
            <div>
              <h2 className="text-sm font-black text-surface-900">Dietitian Public Note</h2>
              <p className="mt-2 text-sm leading-relaxed text-surface-500">
                Eat slowly, drink water, and keep the plantain portion measured. This meal is designed for steady energy.
              </p>
            </div>
          </div>
        </div>

        <div className="card-medical rounded-2xl border-surface-100 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-success">
              <Info size={21} />
            </div>
            <div>
              <h2 className="text-sm font-black text-surface-900">Private Clinical Notes</h2>
              <p className="mt-2 text-sm leading-relaxed text-surface-500">
                Private clinical rationale is visible only to your dietitian. Chefs receive safe preparation instructions, not sensitive medical notes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-surface-100 bg-surface-50 p-3">
      <Icon size={17} className="text-primary-600" />
      <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-surface-400">{label}</p>
      <p className="mt-1 text-sm font-black text-surface-900">{value}</p>
    </div>
  );
}
