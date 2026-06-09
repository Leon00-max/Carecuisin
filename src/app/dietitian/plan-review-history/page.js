'use client';

import { CalendarDays, CheckCircle, ClipboardList, TrendingUp } from 'lucide-react';

const REVIEWS = [
  { period: 'Week 1', note: 'Baseline plan started', progress: 18 },
  { period: 'Week 2', note: 'Hydration improved', progress: 44 },
  { period: 'Week 3', note: 'Meal adherence steady', progress: 71 },
];

export default function PlanReviewHistoryPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-4">
      <header>
        <span className="badge-clinical gap-2"><ClipboardList size={14} /> Plan History</span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Plan Review History</h1>
        <p className="mt-2 text-sm text-surface-500">Past plans and improvements over time.</p>
      </header>

      <section className="space-y-3">
        {REVIEWS.map(item => (
          <article key={item.period} className="card-medical rounded-2xl border-surface-100 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <CalendarDays size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-sm font-black text-surface-900">{item.period}</h2>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-success">
                    <CheckCircle size={13} />
                    {item.progress}%
                  </span>
                </div>
                <p className="mt-2 text-sm text-surface-500">{item.note}</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-100">
                  <div className="h-full rounded-full bg-primary-500" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="card-medical rounded-2xl border-success/20 bg-success/10 p-5">
        <div className="flex items-start gap-3">
          <TrendingUp size={20} className="mt-0.5 shrink-0 text-success" />
          <p className="text-sm leading-relaxed text-surface-700">
            Patient progress improved from baseline to Week 3. Continue steady portions, hydration, and low-sodium prep.
          </p>
        </div>
      </section>
    </div>
  );
}
