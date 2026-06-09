'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  Droplets,
  Flame,
  Frown,
  Gauge,
  HeartPulse,
  Meh,
  Scale,
  ShieldCheck,
  Smile,
  Target,
  TrendingUp,
} from 'lucide-react';
import { getCurrentUserId, getUserById } from '@/lib/userStore';

const WEEK_DATA = [
  { day: 'Mon', value: 100 },
  { day: 'Tue', value: 100 },
  { day: 'Wed', value: 82 },
  { day: 'Thu', value: 94 },
  { day: 'Fri', value: 88 },
  { day: 'Sat', value: 76 },
  { day: 'Sun', value: 71 },
];

const ENERGY_OPTIONS = [
  { id: 'good', label: 'Energized', icon: Smile },
  { id: 'steady', label: 'Steady', icon: Meh },
  { id: 'low', label: 'Low', icon: Frown },
];

const METRICS = [
  {
    label: 'Weight',
    value: '66.5 kg',
    change: '+1.5 kg vs last week',
    tone: 'success',
    icon: Scale,
    bars: [22, 26, 24, 31, 36, 45, 60],
  },
  {
    label: 'Blood Sugar',
    value: '5.8 mmol/L',
    change: 'Stable range',
    tone: 'success',
    icon: Activity,
    bars: [38, 34, 42, 40, 45, 43, 50],
  },
  {
    label: 'Blood Pressure',
    value: '120/80 mmHg',
    change: 'Normal',
    tone: 'success',
    icon: HeartPulse,
    bars: [35, 40, 38, 48, 41, 45, 52],
  },
  {
    label: 'Water Intake',
    value: '6/8 glasses',
    change: 'Good',
    tone: 'warning',
    icon: Droplets,
    bars: [22, 30, 42, 52, 44, 60, 54],
  },
  {
    label: 'Meal Adherence',
    value: '71%',
    change: 'On track',
    tone: 'primary',
    icon: Target,
    bars: [58, 64, 68, 70, 72, 69, 71],
  },
  {
    label: 'Weekly Consistency',
    value: '5 days',
    change: 'Current streak',
    tone: 'primary',
    icon: Flame,
    bars: [40, 55, 65, 75, 82, 74, 71],
  },
];

function toneClasses(tone) {
  if (tone === 'success') return 'bg-success/10 text-success border-success/20';
  if (tone === 'warning') return 'bg-warning/10 text-warning border-warning/20';
  return 'bg-primary-50 text-primary-700 border-primary-100';
}

export default function ProgressPage() {
  const [patient, setPatient] = useState(null);
  const [energy, setEnergy] = useState('good');

  useEffect(() => {
    const userId = getCurrentUserId();
    queueMicrotask(() => {
      setPatient(userId ? getUserById(userId) : null);
    });
  }, []);

  const firstName = patient?.fullName?.split(' ')?.[0] || 'Amara';
  const overall = 71;

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <section className="flex items-start justify-between gap-4">
        <div>
          <span className="badge-clinical gap-2">
            <TrendingUp size={14} />
            Health progress
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Your Progress</h1>
          <p className="mt-2 text-sm leading-relaxed text-surface-500">
            Great job, {firstName}. You&apos;re on track.
          </p>
        </div>
        <div className="hidden rounded-2xl border border-primary-100 bg-primary-50 p-3 text-primary-600 sm:block">
          <Gauge size={22} />
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div className="flex justify-center">
            <div
              className="flex h-44 w-44 items-center justify-center rounded-full p-4"
              style={{
                background: `conic-gradient(var(--color-primary-500) ${overall * 3.6}deg, var(--color-surface-100) 0deg)`,
              }}
            >
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
                <span className="text-4xl font-black text-surface-900">{overall}%</span>
                <span className="mt-1 text-xs font-black uppercase tracking-wider text-primary-600">On track</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-wider text-surface-400">Overall progress</p>
            <h2 className="mt-2 text-xl font-black text-surface-900">You&apos;re on track.</h2>
            <p className="mt-2 text-sm leading-relaxed text-surface-500">
              Week 3 of 8 is progressing well. Keep following your plan, hydration, and review check-ins.
            </p>
            <div className="mt-5 flex h-24 items-end gap-2 rounded-2xl border border-surface-100 bg-surface-50 p-3">
              {WEEK_DATA.map(item => (
                <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full max-w-5 rounded-full bg-primary-500 transition-all duration-700"
                    style={{ height: `${item.value}%` }}
                  />
                  <span className="text-[10px] font-black uppercase text-surface-400">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-surface-900">Health Metrics</h2>
          <span className="text-xs font-bold text-primary-600">Updated today</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {METRICS.map(metric => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-center gap-2">
          <Activity size={17} className="text-primary-600" />
          <h2 className="text-sm font-black text-surface-900">Energy check-in</h2>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-surface-500">
          Log how you feel after today&apos;s meals. This stays local for now.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {ENERGY_OPTIONS.map(({ id, label, icon: Icon }) => {
            const active = energy === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setEnergy(id)}
                className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-xs font-black transition-colors ${
                  active
                    ? 'border-primary-200 bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                    : 'border-surface-100 bg-white text-surface-500 hover:bg-surface-50'
                }`}
              >
                <Icon size={23} />
                {label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-success">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 className="text-sm font-black text-surface-900">Tip for You</h2>
            <p className="mt-2 text-sm leading-relaxed text-surface-500">
              Keep drinking water and follow your plan consistently. Small steady actions are what move the health numbers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ metric }) {
  const Icon = metric.icon;

  return (
    <div className="card-medical rounded-2xl border-surface-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${toneClasses(metric.tone)}`}>
              <Icon size={17} />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-surface-400">{metric.label}</p>
              <p className="mt-1 text-lg font-black text-surface-900">{metric.value}</p>
            </div>
          </div>
          <p className={`mt-3 text-xs font-bold ${metric.tone === 'warning' ? 'text-warning' : metric.tone === 'success' ? 'text-success' : 'text-primary-600'}`}>
            {metric.change}
          </p>
        </div>

        <div className="flex h-14 w-24 items-end justify-end gap-1 rounded-xl bg-surface-50 px-2 py-2">
          {metric.bars.map((height, index) => (
            <span
              key={`${metric.label}-${index}`}
              className={`w-1.5 rounded-full ${metric.tone === 'success' ? 'bg-success' : metric.tone === 'warning' ? 'bg-warning' : 'bg-primary-500'}`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
