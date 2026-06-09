'use client';

import { Bell, CalendarClock, ChefHat, FileCheck, UtensilsCrossed } from 'lucide-react';
import { DIETITIAN_NOTIFICATIONS } from '@/lib/dietitianPortalData';

function iconFor(category) {
  if (category === 'Chef') return ChefHat;
  if (category === 'Plan') return CalendarClock;
  if (category === 'Admin') return FileCheck;
  return UtensilsCrossed;
}

function toneFor(category) {
  if (category === 'Chef') return 'border-success/20 bg-success/10 text-success';
  if (category === 'Plan') return 'border-warning/20 bg-warning/10 text-warning';
  return 'border-primary-100 bg-primary-50 text-primary-600';
}

export default function DietitianNotificationsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-4">
      <header>
        <span className="badge-clinical gap-2"><Bell size={14} /> Notifications</span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Clinical Alerts</h1>
        <p className="mt-2 text-sm text-surface-500">Patient, chef, plan, and admin updates.</p>
      </header>

      <section className="space-y-3">
        {DIETITIAN_NOTIFICATIONS.map(item => {
          const Icon = iconFor(item.category);
          return (
            <article key={item.title} className="card-medical rounded-2xl border-surface-100 p-4">
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${toneFor(item.category)}`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-black text-surface-900">{item.title}</h2>
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary-500 ring-4 ring-primary-100" />
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-surface-500">{item.body}</p>
                  <p className="mt-3 text-xs font-semibold text-surface-400">{item.time}</p>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
