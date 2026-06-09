'use client';

import { Activity, BarChart3, ClipboardList, Send, TrendingUp, Users } from 'lucide-react';

const CONDITIONS = [
  { label: 'Diabetes', value: 38 },
  { label: 'Hypertension', value: 31 },
  { label: 'Kidney Disease', value: 14 },
  { label: 'Obesity', value: 10 },
  { label: 'PCOS', value: 7 },
];

export default function ProgressOverviewPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <header>
        <span className="badge-clinical gap-2"><TrendingUp size={14} /> Progress Overview</span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Practice Outcomes</h1>
        <p className="mt-2 text-sm text-surface-500">Monitor patient adherence, plan creation, and chef referrals.</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Users} label="Active Patients" value="8" />
        <Kpi icon={Activity} label="Plan Adherence" value="71%" />
        <Kpi icon={ClipboardList} label="Plans Created" value="12" />
        <Kpi icon={Send} label="Chef Referrals" value="5" />
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <h2 className="text-sm font-black text-surface-900">Adherence Trend</h2>
        <div className="mt-6 flex h-56 items-end justify-between gap-3 rounded-2xl border border-surface-100 bg-surface-50 p-4">
          {[42, 55, 61, 68, 71, 76, 80].map((height, index) => (
            <div key={index} className="flex h-full flex-1 items-end justify-center">
              <div className="w-full max-w-6 rounded-full bg-primary-500" style={{ height: `${height}%` }} />
            </div>
          ))}
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} className="text-primary-600" />
          <h2 className="text-sm font-black text-surface-900">Top Conditions Managed</h2>
        </div>
        <div className="mt-5 space-y-4">
          {CONDITIONS.map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-xs font-bold text-surface-500">
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-100">
                <div className="h-full rounded-full bg-primary-500" style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Kpi({ icon: Icon, label, value }) {
  return (
    <div className="card-medical rounded-2xl border-surface-100 p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
        <Icon size={21} />
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-wider text-surface-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-surface-900">{value}</p>
    </div>
  );
}
