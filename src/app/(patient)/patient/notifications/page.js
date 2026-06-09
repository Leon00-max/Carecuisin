'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  CalendarClock,
  ChefHat,
  MessageSquare,
  ShieldCheck,
  Truck,
  UtensilsCrossed,
} from 'lucide-react';

const NOTIFICATIONS = [
  {
    title: 'Today\'s meal is prepared',
    body: 'Chef Amadou has marked your prescribed lunch as ready for delivery coordination.',
    time: '8 min ago',
    tone: 'success',
    icon: ChefHat,
  },
  {
    title: 'Dietitian note available',
    body: 'Dr. Ambe Florence added a public meal note for tomorrow\'s plan.',
    time: '24 min ago',
    tone: 'primary',
    icon: MessageSquare,
  },
  {
    title: 'Delivery window confirmed',
    body: 'Your meal is scheduled to arrive around 12:30 PM in Buea.',
    time: '1 hr ago',
    tone: 'primary',
    icon: Truck,
  },
  {
    title: 'Plan review reminder',
    body: 'Your next plan review is Friday, May 29, 2026 at 10:00 AM.',
    time: 'Yesterday',
    tone: 'surface',
    icon: CalendarClock,
  },
];

function toneClass(tone) {
  if (tone === 'success') return 'border-success/20 bg-success/10 text-success';
  if (tone === 'surface') return 'border-surface-100 bg-surface-50 text-surface-500';
  return 'border-primary-100 bg-primary-50 text-primary-600';
}

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-4">
      <header className="flex items-center justify-between gap-4">
        <Link
          href="/patient/dashboard"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-100 bg-white text-surface-500 shadow-sm transition-colors hover:text-primary-600"
          aria-label="Back"
        >
          <ArrowLeft size={19} />
        </Link>
        <span className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-black text-primary-700">
          4 new
        </span>
      </header>

      <section>
        <span className="badge-clinical gap-2">
          <Bell size={14} />
          Notifications
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">Care Updates</h1>
        <p className="mt-2 text-sm leading-relaxed text-surface-500">
          Meal, delivery, and care-team updates in one calm place.
        </p>
      </section>

      <section className="space-y-3">
        {NOTIFICATIONS.map((notification, index) => {
          const Icon = notification.icon;
          return (
            <article key={notification.title} className="card-medical rounded-2xl border-surface-100 p-4">
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${toneClass(notification.tone)}`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-black text-surface-900">{notification.title}</h2>
                    {index === 0 && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary-500 ring-4 ring-primary-100" />}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-surface-500">{notification.body}</p>
                  <p className="mt-3 text-xs font-semibold text-surface-400">{notification.time}</p>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link href="/patient/meal-plan" className="btn-outline flex items-center justify-center gap-2 rounded-2xl bg-white">
          <UtensilsCrossed size={17} />
          View Meals
        </Link>
        <Link href="/patient/messages" className="btn-primary flex items-center justify-center gap-2 rounded-2xl">
          <MessageSquare size={17} />
          Open Chat
        </Link>
      </section>

      <section className="rounded-2xl border border-success/20 bg-success/10 p-4">
        <div className="flex items-center gap-2 text-sm font-black text-success">
          <ShieldCheck size={17} />
          Trusted care alerts
        </div>
        <p className="mt-2 text-xs leading-relaxed text-surface-500">
          CareCuisin only sends patient notifications for meals, safety, delivery, and plan coordination.
        </p>
      </section>
    </div>
  );
}
