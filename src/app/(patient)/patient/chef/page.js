'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Clock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  UtensilsCrossed,
} from 'lucide-react';

const SPECIALTIES = ['Cameroonian clinical meals', 'Low sodium cooking', 'Diabetes-safe portions', 'Fresh delivery prep'];

export default function ChefProfilePage() {
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
        <span className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-black text-success">
          Hygiene verified
        </span>
      </header>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary-50 text-2xl font-black text-primary-700 ring-4 ring-primary-100">
            CA
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-2xl font-black text-surface-900">Chef Amadou</h1>
              <CheckCircle size={18} className="shrink-0 text-success" />
            </div>
            <p className="mt-1 text-sm font-semibold text-surface-500">Verified Clinical Chef</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-surface-500">
              <MapPin size={14} className="text-primary-500" />
              Molyko, Buea
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat icon={Star} label="Rating" value="4.8" />
          <Stat icon={UtensilsCrossed} label="Meals prepared" value="1,248" />
          <Stat icon={Clock} label="Prep status" value="On time" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card-medical rounded-2xl border-surface-100 p-5">
          <Building2 size={22} className="text-primary-600" />
          <h2 className="mt-4 text-sm font-black text-surface-900">Kitchen</h2>
          <p className="mt-2 text-sm leading-relaxed text-surface-500">
            CareCuisin Partner Kitchen, Molyko. Approved for patient meal preparation.
          </p>
        </div>

        <div className="card-medical rounded-2xl border-surface-100 p-5">
          <ShieldCheck size={22} className="text-success" />
          <h2 className="mt-4 text-sm font-black text-surface-900">Hygiene Status</h2>
          <p className="mt-2 text-sm leading-relaxed text-surface-500">
            Kitchen inspection and handling process verified by admin operations.
          </p>
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-primary-600" />
          <h2 className="text-sm font-black text-surface-900">Specialties</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {SPECIALTIES.map(item => (
            <span key={item} className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
              {item}
            </span>
          ))}
        </div>
      </section>

      <Link href="/patient/messages" className="btn-primary flex items-center justify-center gap-2 rounded-2xl">
        <MessageSquare size={17} />
        Message Care Team
      </Link>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-surface-100 bg-surface-50 p-4">
      <Icon size={18} className="text-primary-600" />
      <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-surface-400">{label}</p>
      <p className="mt-1 text-sm font-black text-surface-900">{value}</p>
    </div>
  );
}
