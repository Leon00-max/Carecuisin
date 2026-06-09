'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  ChefHat,
  Clock,
  ClipboardList,
  ShieldCheck,
  Truck,
  UtensilsCrossed,
} from 'lucide-react';
import { CHEF_ORDERS, CHEF_PATIENTS } from '@/lib/chefPortalData';

export default function PatientAssignmentPage() {
  const [patientId, setPatientId] = useState(CHEF_PATIENTS[0].id);

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      setPatientId(params.get('patient') || CHEF_PATIENTS[0].id);
    });
  }, []);

  const patient = useMemo(
    () => CHEF_PATIENTS.find(item => item.id === patientId) || CHEF_PATIENTS[0],
    [patientId]
  );
  const activeMeals = CHEF_ORDERS.slice(0, 2);

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-4">
      <header className="flex items-center justify-between gap-4">
        <Link
          href="/chef/patients"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-100 bg-white text-surface-500 shadow-sm transition-colors hover:text-primary-600"
          aria-label="Back to patients"
        >
          <ArrowLeft size={19} />
        </Link>
        <span className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-black text-success">
          {patient.status}
        </span>
      </header>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xl font-black text-primary-700">
            {patient.name.split(' ').map(part => part[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wider text-surface-400">Patient Meal Assignment</p>
            <h1 className="mt-1 text-2xl font-black text-surface-900">{patient.name}</h1>
            <p className="mt-1 text-sm text-surface-500">{patient.sex} - {patient.age} years - {patient.category}</p>
          </div>
        </div>
      </section>

      <section className="card-medical rounded-2xl border-primary-100 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-primary-600" />
          <p className="text-sm leading-relaxed text-primary-700">
            This view is meal-focused. Private medical records and clinical rationale remain with the dietitian.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <UtensilsCrossed size={18} className="text-primary-600" />
          <h2 className="text-sm font-black text-surface-900">Active Meals</h2>
        </div>
        {activeMeals.map(order => (
          <Link
            key={order.id}
            href={`/chef/order-details?order=${encodeURIComponent(order.id)}`}
            className="block rounded-2xl border border-surface-100 bg-white p-4 shadow-sm transition-colors hover:bg-primary-50/50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <ChefHat size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-surface-900">{order.meal}</p>
                <p className="mt-1 text-xs text-surface-500">Due {order.due} - {order.calories} kcal</p>
              </div>
              <span className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-black text-primary-700">
                {order.stage}/{order.totalStages}
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <HistoryCard icon={ClipboardList} title="Preparation History" items={['Achu Soup marked ready', 'Grilled Fish prepared on time', 'Beans portion confirmed']} />
        <HistoryCard icon={Truck} title="Delivery History" items={['Delivered May 12 at 10:30 AM', 'Delivered May 11 at 6:45 PM', 'No failed deliveries']} />
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-primary-600" />
          <h2 className="text-sm font-black text-surface-900">Approved Instructions</h2>
        </div>
        <div className="mt-4 space-y-3">
          {['Use reduced salt', 'Avoid frying', 'Steam vegetables thoroughly'].map(item => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-surface-100 bg-surface-50 p-3">
              <CheckCircle size={17} className="text-success" />
              <p className="text-sm font-semibold text-surface-700">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function HistoryCard({ icon: Icon, title, items }) {
  return (
    <div className="card-medical rounded-2xl border-surface-100 p-5">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-primary-600" />
        <h2 className="text-sm font-black text-surface-900">{title}</h2>
      </div>
      <div className="mt-4 space-y-2">
        {items.map(item => (
          <p key={item} className="rounded-xl bg-surface-50 px-3 py-2 text-xs font-semibold text-surface-500">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
