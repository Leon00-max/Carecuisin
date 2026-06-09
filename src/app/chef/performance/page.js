'use client';

import {
  BarChart3,
  CheckCircle,
  Clock,
  Gauge,
  PackageCheck,
  TrendingUp,
} from 'lucide-react';

const WEEK = [
  { day: 'Mon', value: 55 },
  { day: 'Tue', value: 72 },
  { day: 'Wed', value: 68 },
  { day: 'Thu', value: 82 },
  { day: 'Fri', value: 76 },
  { day: 'Sat', value: 88 },
  { day: 'Sun', value: 71 },
];

const METRICS = [
  { label: 'Meals Prepared', value: '32', detail: 'This week', icon: PackageCheck, tone: 'primary' },
  { label: 'Completion Rate', value: '96%', detail: 'Reliable service', icon: CheckCircle, tone: 'success' },
  { label: 'Avg Prep Time', value: '34 min', detail: 'On target', icon: Clock, tone: 'warning' },
  { label: 'Consistency', value: '91%', detail: 'Delivery quality', icon: Gauge, tone: 'success' },
];

function toneClass(tone) {
  if (tone === 'success') return 'border-success/20 bg-success/10 text-success';
  if (tone === 'warning') return 'border-warning/20 bg-warning/10 text-warning';
  return 'border-primary-100 bg-primary-50 text-primary-700';
}

export default function ChefPerformancePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <header>
        <span className="badge-clinical gap-2">
          <TrendingUp size={14} />
          Kitchen performance
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Performance</h1>
        <p className="mt-2 text-sm leading-relaxed text-surface-500">
          Productivity and reliability for your clinical kitchen work.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map(metric => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="card-medical rounded-2xl border-surface-100 p-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${toneClass(metric.tone)}`}>
                <Icon size={21} />
              </div>
              <p className="mt-4 text-xs font-black uppercase tracking-wider text-surface-400">{metric.label}</p>
              <p className="mt-1 text-2xl font-black text-surface-900">{metric.value}</p>
              <p className="mt-1 text-xs font-semibold text-surface-500">{metric.detail}</p>
            </div>
          );
        })}
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-black text-surface-900">Meals Prepared This Week</h2>
            <p className="mt-1 text-xs text-surface-500">Daily kitchen activity trend.</p>
          </div>
          <span className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-black text-success">
            Improving
          </span>
        </div>

        <div className="mt-6 flex h-56 items-end justify-between gap-3 rounded-2xl border border-surface-100 bg-surface-50 p-4">
          {WEEK.map(item => (
            <div key={item.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div
                className="w-full max-w-6 rounded-full bg-primary-500 shadow-sm shadow-primary-100 transition-all duration-700"
                style={{ height: `${item.value}%` }}
              />
              <span className="text-[10px] font-black uppercase text-surface-400">{item.day}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card-medical rounded-2xl border-primary-100 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <BarChart3 size={20} className="mt-0.5 shrink-0 text-primary-600" />
          <p className="text-sm leading-relaxed text-primary-700">
            Strong completion and preparation consistency help patients trust their prescribed meal routine.
          </p>
        </div>
      </section>
    </div>
  );
}
