'use client';

import {
  Bell,
  CalendarClock,
  ClipboardCheck,
  MessageSquare,
  PackageCheck,
  Timer,
} from 'lucide-react';
import { CHEF_NOTIFICATIONS } from '@/lib/chefPortalData';

function iconFor(category) {
  if (category === 'Referral') return ClipboardCheck;
  if (category === 'Deadline') return Timer;
  if (category === 'Instruction') return MessageSquare;
  return PackageCheck;
}

function toneFor(category) {
  if (category === 'Deadline') return 'border-warning/20 bg-warning/10 text-warning';
  if (category === 'Delivery') return 'border-success/20 bg-success/10 text-success';
  return 'border-primary-100 bg-primary-50 text-primary-600';
}

export default function ChefNotificationsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-4">
      <header>
        <span className="badge-clinical gap-2">
          <Bell size={14} />
          Operational alerts
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Notifications</h1>
        <p className="mt-2 text-sm leading-relaxed text-surface-500">
          Referral, deadline, instruction, and delivery updates.
        </p>
      </header>

      <section className="space-y-3">
        {CHEF_NOTIFICATIONS.map(notification => {
          const Icon = iconFor(notification.category);
          return (
            <article key={notification.title} className="card-medical rounded-2xl border-surface-100 p-4">
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${toneFor(notification.category)}`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-black text-surface-900">{notification.title}</h2>
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary-500 ring-4 ring-primary-100" />
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-surface-500">{notification.body}</p>
                  <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-surface-400">
                    <CalendarClock size={13} />
                    {notification.time}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
