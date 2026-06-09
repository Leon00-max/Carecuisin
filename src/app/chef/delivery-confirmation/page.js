'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  PackageCheck,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { CHEF_MEAL_IMAGE } from '@/lib/chefPortalData';

export default function DeliveryConfirmationPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-4">
      <header>
        <Link
          href="/chef/queue"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-100 bg-white text-surface-500 shadow-sm transition-colors hover:text-primary-600"
          aria-label="Back to queue"
        >
          <ArrowLeft size={19} />
        </Link>
      </header>

      <section className="card-medical overflow-hidden rounded-2xl border-success/20 p-0 text-center">
        <div
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url("${CHEF_MEAL_IMAGE}")` }}
          aria-hidden="true"
        />
        <div className="p-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success ring-8 ring-success/10">
            <CheckCircle size={34} />
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-surface-900">Meal Delivered Successfully</h1>
          <p className="mt-2 text-sm leading-relaxed text-surface-500">
            Order ORD-250520 was confirmed and added to the patient care timeline.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Fact icon={PackageCheck} label="Meal" value="Achu Soup" />
            <Fact icon={Clock} label="Delivered" value="Today, 10:45 AM" />
            <Fact icon={ShieldCheck} label="Patient Ref" value="P-1045" />
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link href="/chef/history" className="btn-outline flex items-center justify-center gap-2 rounded-2xl bg-white">
          <Truck size={17} />
          View History
        </Link>
        <Link href="/chef/queue" className="btn-primary flex items-center justify-center gap-2 rounded-2xl">
          <PackageCheck size={17} />
          Return to Queue
        </Link>
      </section>
    </div>
  );
}

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-surface-100 bg-surface-50 p-4 text-left">
      <Icon size={18} className="text-primary-600" />
      <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-surface-400">{label}</p>
      <p className="mt-1 text-sm font-black text-surface-900">{value}</p>
    </div>
  );
}
