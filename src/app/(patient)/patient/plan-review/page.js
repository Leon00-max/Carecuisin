'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle,
  ClipboardList,
  Clock,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  Video,
} from 'lucide-react';

const CHECKLIST = [
  'Review Week 3 meal adherence',
  'Discuss hydration and energy check-ins',
  'Adjust next week portions if needed',
  'Confirm chef preparation instructions',
];

export default function PlanReviewPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-4">
      <header className="flex items-center justify-between gap-4">
        <Link
          href="/patient/messages"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-100 bg-white text-surface-500 shadow-sm transition-colors hover:text-primary-600"
          aria-label="Back"
        >
          <ArrowLeft size={19} />
        </Link>
        <span className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-black text-primary-700">
          Scheduled
        </span>
      </header>

      <section className="card-medical rounded-2xl border-surface-100 p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
          <CalendarClock size={26} />
        </div>
        <p className="mt-5 text-xs font-black uppercase tracking-wider text-primary-600">Next Plan Review</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-surface-900">Friday, May 29, 2026</h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-surface-500">
          <Clock size={15} />
          10:00 AM with Dr. Ambe Florence
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/patient/messages" className="btn-primary flex items-center justify-center gap-2 rounded-2xl">
            <MessageSquare size={17} />
            Message Dietitian
          </Link>
          <button type="button" className="btn-outline flex items-center justify-center gap-2 rounded-2xl bg-white">
            <Video size={17} />
            Join Review
          </button>
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} className="text-primary-600" />
          <h2 className="text-sm font-black text-surface-900">Review Agenda</h2>
        </div>
        <div className="mt-4 space-y-3">
          {CHECKLIST.map(item => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-surface-100 bg-surface-50 p-3">
              <CheckCircle size={17} className="text-success" />
              <p className="text-sm font-semibold text-surface-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card-medical rounded-2xl border-surface-100 p-5">
          <Stethoscope size={22} className="text-primary-600" />
          <h2 className="mt-4 text-sm font-black text-surface-900">Dietitian Focus</h2>
          <p className="mt-2 text-sm leading-relaxed text-surface-500">
            Your dietitian will review patient-facing progress and keep sensitive clinical reasoning private.
          </p>
        </div>

        <div className="card-medical rounded-2xl border-surface-100 p-5">
          <ShieldCheck size={22} className="text-success" />
          <h2 className="mt-4 text-sm font-black text-surface-900">Care Privacy</h2>
          <p className="mt-2 text-sm leading-relaxed text-surface-500">
            Plan changes are coordinated with your chef using only safe preparation instructions.
          </p>
        </div>
      </section>
    </div>
  );
}
