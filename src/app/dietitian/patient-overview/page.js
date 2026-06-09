'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  HeartPulse,
  MessageSquare,
  MoreHorizontal,
  Phone,
  ShieldCheck,
  Stethoscope,
  UtensilsCrossed,
  Weight,
} from 'lucide-react';
import {
  DIETITIAN_MEAL_IMAGE,
  DIETITIAN_PATIENTS,
  statusTone,
} from '@/lib/dietitianPortalData';

export default function PatientOverviewPage() {
  const [patientId, setPatientId] = useState(DIETITIAN_PATIENTS[0].id);

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      setPatientId(params.get('patient') || DIETITIAN_PATIENTS[0].id);
    });
  }, []);

  const patient = useMemo(
    () => DIETITIAN_PATIENTS.find(item => item.id === patientId) || DIETITIAN_PATIENTS[0],
    [patientId]
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-4">
      <header className="flex items-center justify-between gap-4">
        <Link
          href="/dietitian/dashboard"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-100 bg-white text-surface-500 shadow-sm transition-colors hover:text-primary-600"
          aria-label="Back"
        >
          <ArrowLeft size={19} />
        </Link>
        <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusTone(patient.status)}`}>
          {patient.status}
        </span>
      </header>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xl font-black text-primary-700 ring-4 ring-primary-100">
            {patient.name.split(' ').map(part => part[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-black text-surface-900">{patient.name}</h1>
            <p className="mt-1 text-sm leading-relaxed text-surface-500">
              {patient.sex} - {patient.age} years - {patient.condition} - {patient.location}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <QuickAction href="/dietitian/messages" icon={MessageSquare} label="Message" />
              <QuickAction href="tel:+237650000000" icon={Phone} label="Call" />
              <QuickAction href="/dietitian/medical-summary" icon={MoreHorizontal} label="More" />
            </div>
          </div>
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="mb-4 flex items-center gap-2">
          <HeartPulse size={18} className="text-primary-600" />
          <h2 className="text-sm font-black text-surface-900">Health Snapshot</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric icon={Weight} label="Weight" value="66.5 kg" detail="down 1.5 kg" tone="success" />
          <Metric icon={HeartPulse} label="Blood Sugar" value="5.8 mmol/L" detail="good" tone="success" />
          <Metric icon={Stethoscope} label="Blood Pressure" value="120/80" detail="normal" tone="primary" />
          <Metric icon={CheckCircle} label="Adherence" value={`${patient.progress}%`} detail={patient.adherence} tone="primary" />
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-black text-surface-900">Care Progress</h2>
            <p className="mt-1 text-xs text-surface-500">{patient.week}</p>
          </div>
          <span className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-black text-primary-700">
            {patient.progress}%
          </span>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-surface-100">
          <div className="h-full rounded-full bg-primary-500" style={{ width: `${patient.progress}%` }} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-surface-500">
          Patient is following the plan consistently. Continue monitoring hydration and meal completion.
        </p>
      </section>

      <section className="card-medical overflow-hidden rounded-2xl border-surface-100 p-0">
        <div
          className="h-56 bg-cover bg-center"
          style={{ backgroundImage: `url("${DIETITIAN_MEAL_IMAGE}")` }}
          aria-hidden="true"
        />
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-primary-600">Today&apos;s Meal</p>
              <h2 className="mt-2 text-xl font-black text-surface-900">Eru with Pounded Yam & Chicken</h2>
              <p className="mt-1 text-sm text-surface-500">520 kcal - Prepared for blood sugar stability.</p>
            </div>
            <span className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-black text-success">
              Prepared
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link href="/dietitian/plans" className="btn-outline flex items-center justify-center gap-2 rounded-2xl bg-white">
          <UtensilsCrossed size={17} />
          View Plan
        </Link>
        <Link href="/dietitian/create-plan" className="btn-primary flex items-center justify-center gap-2 rounded-2xl">
          <ShieldCheck size={17} />
          Edit Plan
        </Link>
      </section>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label }) {
  return (
    <Link href={href} className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border border-surface-100 bg-surface-50 text-xs font-black text-surface-500 transition-colors hover:bg-primary-50 hover:text-primary-700">
      <Icon size={18} />
      {label}
    </Link>
  );
}

function Metric({ icon: Icon, label, value, detail, tone }) {
  const toneClass = tone === 'success'
    ? 'border-success/20 bg-success/10 text-success'
    : 'border-primary-100 bg-primary-50 text-primary-700';

  return (
    <div className="rounded-2xl border border-surface-100 bg-surface-50 p-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${toneClass}`}>
        <Icon size={17} />
      </div>
      <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-surface-400">{label}</p>
      <p className="mt-1 text-sm font-black text-surface-900">{value}</p>
      <p className={`mt-1 text-xs font-bold ${tone === 'success' ? 'text-success' : 'text-primary-600'}`}>{detail}</p>
    </div>
  );
}
