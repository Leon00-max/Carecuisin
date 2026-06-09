'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ChefHat,
  Clock,
  Flame,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import { CHEF_MEAL_IMAGE, CHEF_ORDERS, orderStatusMeta } from '@/lib/chefPortalData';

export default function OrderDetailsPage() {
  const [orderId, setOrderId] = useState(CHEF_ORDERS[0].id);
  const [status, setStatus] = useState('preparing');

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('order') || CHEF_ORDERS[0].id;
      const found = CHEF_ORDERS.find(item => item.id === id) || CHEF_ORDERS[0];
      setOrderId(id);
      setStatus(found.status);
    });
  }, []);

  const order = useMemo(
    () => CHEF_ORDERS.find(item => item.id === orderId) || CHEF_ORDERS[0],
    [orderId]
  );
  const meta = orderStatusMeta(status);

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-4">
      <header className="flex items-center justify-between gap-4">
        <Link
          href="/chef/dashboard"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-100 bg-white text-surface-500 shadow-sm transition-colors hover:text-primary-600"
          aria-label="Back to orders"
        >
          <ArrowLeft size={19} />
        </Link>
        <span className={`rounded-full border px-3 py-1 text-xs font-black ${meta.className}`}>
          {meta.label}
        </span>
      </header>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoBlock label="Order ID" value={order.id} />
          <InfoBlock label="Due Time" value={order.due} align="right" />
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            <UserRound size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-wider text-surface-400">Patient Information</p>
            <h1 className="mt-1 text-lg font-black text-surface-900">{order.patientName}</h1>
            <p className="mt-1 text-sm text-surface-500">
              {order.sex} - {order.age} years - {order.condition}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-black text-success">
              <ShieldCheck size={13} />
              Active Plan
            </span>
          </div>
        </div>
      </section>

      <section className="card-medical overflow-hidden rounded-2xl border-surface-100 p-0">
        <div
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url("${CHEF_MEAL_IMAGE}")` }}
          aria-hidden="true"
        />
        <div className="p-5">
          <p className="text-xs font-black uppercase tracking-wider text-primary-600">Today&apos;s Meal</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-black leading-tight text-surface-900">{order.meal}</h2>
              <p className="mt-2 text-sm text-surface-500">{order.description}</p>
            </div>
            <span className="inline-flex w-fit items-center gap-1 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-black text-primary-700">
              <Flame size={13} />
              {order.calories} kcal
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(order.macros).map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-surface-100 bg-surface-50 p-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-surface-400">{label}</p>
                <p className="mt-1 text-sm font-black text-surface-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card-medical rounded-2xl border-primary-100 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-primary-600">
            <Stethoscope size={21} />
          </div>
          <div>
            <h2 className="text-sm font-black text-surface-900">Dietitian Note: For Preparation</h2>
            <p className="mt-2 text-sm leading-relaxed text-primary-700">{order.note}</p>
            <p className="mt-3 text-xs leading-relaxed text-primary-700">
              Private clinical reasoning is not shown here. This card contains cooking guidance only.
            </p>
          </div>
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="mb-4 flex items-center gap-2">
          <ChefHat size={18} className="text-primary-600" />
          <h2 className="text-sm font-black text-surface-900">Instructions</h2>
        </div>
        <div className="space-y-3">
          {order.instructions.map(item => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-surface-100 bg-surface-50 p-3">
              <CheckCircle size={17} className="shrink-0 text-success" />
              <p className="text-sm font-semibold text-surface-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setStatus('cancelled')}
          className="btn-outline flex items-center justify-center gap-2 rounded-2xl border-alert/20 bg-white text-alert hover:bg-alert/10"
        >
          <AlertCircle size={17} />
          Decline Order
        </button>
        <button
          type="button"
          onClick={() => setStatus('ready')}
          className="flex items-center justify-center gap-2 rounded-2xl bg-success px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <CheckCircle size={17} />
          Mark as Ready
        </button>
      </section>

      <section className="rounded-2xl border border-surface-100 bg-white p-4">
        <div className="flex items-start gap-3">
          <Clock size={18} className="mt-0.5 shrink-0 text-primary-600" />
          <p className="text-xs leading-relaxed text-surface-500">
            Keep this order sheet open while preparing. Accuracy, hygiene, and timing are part of the care promise.
          </p>
        </div>
      </section>
    </div>
  );
}

function InfoBlock({ label, value, align = 'left' }) {
  return (
    <div className={`rounded-2xl border border-surface-100 bg-surface-50 p-4 ${align === 'right' ? 'sm:text-right' : ''}`}>
      <p className="text-[10px] font-black uppercase tracking-wider text-surface-400">{label}</p>
      <p className="mt-1 text-sm font-black text-surface-900">{value}</p>
    </div>
  );
}
