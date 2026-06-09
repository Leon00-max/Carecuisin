'use client';

import { CheckCircle, ChefHat, PackageCheck, Send, Truck } from 'lucide-react';

const STEPS = [
  { label: 'Sent', icon: Send },
  { label: 'Accepted', icon: CheckCircle },
  { label: 'Prepared', icon: ChefHat },
  { label: 'Delivered', icon: Truck },
];

export default function ReferralDetailsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-4">
      <header>
        <span className="badge-clinical gap-2"><PackageCheck size={14} /> Referral Details</span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Amara Nkeng Referral</h1>
        <p className="mt-2 text-sm text-surface-500">Chef Kwame - Eru with Pounded Yam & Chicken</p>
      </header>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="space-y-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const done = index < 3;
            return (
              <div key={step.label} className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${done ? 'bg-success/10 text-success' : 'bg-surface-50 text-surface-400'}`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-surface-900">{step.label}</p>
                  <p className="mt-1 text-xs text-surface-500">{done ? 'Completed' : 'Next action pending'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card-medical rounded-2xl border-primary-100 bg-primary-50 p-5">
        <h2 className="text-sm font-black text-surface-900">Safe Chef Instructions</h2>
        <p className="mt-2 text-sm leading-relaxed text-primary-700">
          Use reduced salt, controlled oil, measured portions, and deliver by 12:30 PM. Private clinical notes were not shared.
        </p>
      </section>
    </div>
  );
}
