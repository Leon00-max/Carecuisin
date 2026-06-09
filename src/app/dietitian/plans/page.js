'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Edit3,
  MoreHorizontal,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import {
  CLINICAL_PRIVATE_NOTE,
  DIETITIAN_MEAL_IMAGE,
  DIETITIAN_MEALS,
  DIETITIAN_PATIENTS,
  MEAL_PLAN_DAYS,
  statusTone,
} from '@/lib/dietitianPortalData';

const PLAN_TABS = ['All Plans', 'Active', 'Draft', 'Completed'];

export default function DietitianPlansPage() {
  const [tab, setTab] = useState('All Plans');
  const [day, setDay] = useState('Monday');
  const plans = DIETITIAN_PATIENTS.filter(patient => (
    tab === 'All Plans'
      || (tab === 'Active' && patient.status === 'Active Plan')
      || (tab === 'Draft' && patient.status === 'Pending Review')
      || (tab === 'Completed' && patient.status === 'Completed')
  ));

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <span className="badge-clinical gap-2">
            <ClipboardList size={14} />
            Meal plans
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">My Meal Plans</h1>
          <p className="mt-2 text-sm text-surface-500">View, edit, and publish patient meal plans.</p>
        </div>
        <Link
          href="/dietitian/create-plan"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm shadow-primary-200"
          aria-label="Create plan"
        >
          <Plus size={20} />
        </Link>
      </header>

      <section className="flex gap-2 overflow-x-auto pb-1">
        {PLAN_TABS.map(item => {
          const active = tab === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`min-w-[104px] rounded-full border px-4 py-2 text-xs font-black transition-colors ${
                active
                  ? 'border-primary-200 bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                  : 'border-surface-100 bg-white text-surface-500 hover:bg-surface-50'
              }`}
            >
              {item}
            </button>
          );
        })}
      </section>

      <section className="space-y-3">
        {plans.map(patient => (
          <article key={patient.id} className="card-medical rounded-2xl border-surface-100 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-black text-primary-700">
                {patient.name.split(' ').map(part => part[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-sm font-black text-surface-900">{patient.name}</h2>
                  <span className={`rounded-full border px-2 py-1 text-[10px] font-black ${statusTone(patient.status)}`}>
                    {patient.status === 'Pending Review' ? 'Draft' : patient.status.replace(' Plan', '')}
                  </span>
                </div>
                <p className="mt-1 text-xs text-surface-500">{patient.week} - May 12 to May 18, 2026</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-100">
                  <div
                    className={`h-full rounded-full ${patient.status === 'Completed' ? 'bg-success' : 'bg-primary-500'}`}
                    style={{ width: `${patient.progress}%` }}
                  />
                </div>
              </div>
              <Link
                href={`/dietitian/patient-overview?patient=${encodeURIComponent(patient.id)}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-surface-100 bg-surface-50 text-primary-600"
                aria-label="Open plan"
              >
                <MoreHorizontal size={18} />
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-primary-600">Meal Plan</p>
            <h2 className="mt-1 text-xl font-black text-surface-900">Amara Nkeng - Week 3 of 8</h2>
          </div>
          <Link href="/dietitian/plan-review-history" className="text-xs font-bold text-primary-600">History</Link>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {MEAL_PLAN_DAYS.map(item => {
            const active = day === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setDay(item)}
                className={`min-w-[112px] rounded-full border px-4 py-2 text-xs font-black transition-colors ${
                  active
                    ? 'border-primary-200 bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                    : 'border-surface-100 bg-white text-surface-500 hover:bg-surface-50'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-3">
          {DIETITIAN_MEALS.map(meal => (
            <article key={meal.type} className="rounded-2xl border border-surface-100 bg-surface-50 p-3">
              <div className="flex items-center gap-3">
                <div
                  className="h-20 w-20 shrink-0 rounded-2xl bg-cover bg-center"
                  style={{ backgroundImage: `url("${DIETITIAN_MEAL_IMAGE}")` }}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-primary-600">{meal.type}</p>
                  <h3 className="mt-1 truncate text-sm font-black text-surface-900">{meal.name}</h3>
                  <p className="mt-1 text-xs text-surface-500">{meal.calories} kcal - {meal.guidance}</p>
                </div>
                <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-surface-400">
                  <MoreHorizontal size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card-medical rounded-2xl border-primary-100 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-primary-600" />
          <div>
            <h2 className="text-sm font-black text-surface-900">Clinical Notes - Private</h2>
            <p className="mt-2 text-sm leading-relaxed text-primary-700">{CLINICAL_PRIVATE_NOTE}</p>
          </div>
        </div>
      </section>

      <Link href="/dietitian/create-plan" className="btn-primary flex items-center justify-center gap-2 rounded-2xl">
        <Edit3 size={17} />
        Edit Plan
      </Link>
    </div>
  );
}
