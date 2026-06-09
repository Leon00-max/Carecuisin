'use client';

import { AlertTriangle, CheckCircle, ClipboardList, HeartPulse, ShieldCheck, Stethoscope } from 'lucide-react';
import { CLINICAL_PRIVATE_NOTE } from '@/lib/dietitianPortalData';

const METRICS = [
  { label: 'Weight', value: '66.5 kg', note: 'down 1.5 kg' },
  { label: 'Blood Sugar', value: '5.8 mmol/L', note: 'good' },
  { label: 'Blood Pressure', value: '120/80', note: 'normal' },
  { label: 'Adherence', value: '71%', note: 'on track' },
];

export default function PatientMedicalSummaryPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-4">
      <header>
        <span className="badge-clinical gap-2"><Stethoscope size={14} /> Medical Summary</span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Amara Nkeng</h1>
        <p className="mt-2 text-sm text-surface-500">Condition, restrictions, active plan, and recent health metrics.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <SummaryCard icon={HeartPulse} title="Condition" items={['Diabetes + Hypertension', 'Buea, Fako', 'Week 3 of 8']} />
        <SummaryCard icon={AlertTriangle} title="Allergies & Restrictions" items={['No shellfish', 'Reduced sodium', 'Low glycemic foods']} />
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} className="text-primary-600" />
          <h2 className="text-sm font-black text-surface-900">Current Plan</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-surface-500">
          Eru with Pounded Yam & Chicken, controlled portions, low sodium guidance, hydration target 8 glasses daily.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {METRICS.map(item => (
          <div key={item.label} className="card-medical rounded-2xl border-surface-100 p-4">
            <CheckCircle size={18} className="text-success" />
            <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-surface-400">{item.label}</p>
            <p className="mt-1 text-sm font-black text-surface-900">{item.value}</p>
            <p className="mt-1 text-xs font-bold text-success">{item.note}</p>
          </div>
        ))}
      </section>

      <section className="card-medical rounded-2xl border-primary-100 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-primary-600" />
          <div>
            <h2 className="text-sm font-black text-surface-900">Private Clinical Rationale</h2>
            <p className="mt-2 text-sm leading-relaxed text-primary-700">{CLINICAL_PRIVATE_NOTE}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ icon: Icon, title, items }) {
  return (
    <div className="card-medical rounded-2xl border-surface-100 p-5">
      <Icon size={22} className="text-primary-600" />
      <h2 className="mt-4 text-sm font-black text-surface-900">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map(item => (
          <span key={item} className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-black text-primary-700">{item}</span>
        ))}
      </div>
    </div>
  );
}
