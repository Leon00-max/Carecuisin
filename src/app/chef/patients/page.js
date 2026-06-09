'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Filter,
  HeartPulse,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from 'lucide-react';
import { CHEF_PATIENTS } from '@/lib/chefPortalData';

export default function ChefPatientsPage() {
  const [query, setQuery] = useState('');

  const patients = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return CHEF_PATIENTS;
    return CHEF_PATIENTS.filter(patient => (
      patient.name.toLowerCase().includes(needle)
      || patient.category.toLowerCase().includes(needle)
      || patient.id.toLowerCase().includes(needle)
    ));
  }, [query]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <header>
        <span className="badge-clinical gap-2">
          <Users size={14} />
          Active patients
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">My Patients</h1>
        <p className="mt-2 text-sm leading-relaxed text-surface-500">
          Meal assignments and approved preparation context for your active care queue.
        </p>
      </header>

      <section className="flex gap-2">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search patients..."
            className="input-medical rounded-2xl pl-11"
          />
        </div>
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-surface-100 bg-white text-primary-600 shadow-sm transition-colors hover:bg-primary-50"
          aria-label="Filter patients"
        >
          <Filter size={18} />
        </button>
      </section>

      <section className="space-y-3">
        {patients.map(patient => (
          <Link
            key={patient.id}
            href={`/chef/patient-assignment?patient=${encodeURIComponent(patient.id)}`}
            className="block rounded-2xl border border-surface-100 bg-white p-4 shadow-sm transition-all hover:border-primary-100 hover:bg-primary-50/50 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                <UserRound size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-black text-surface-900">{patient.name}</h2>
                <p className="mt-1 text-xs text-surface-500">{patient.sex} - {patient.age} years</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary-100 bg-primary-50 px-2 py-1 text-[10px] font-black text-primary-700">
                    <HeartPulse size={11} />
                    {patient.category}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-black ${
                    patient.status === 'Active Plan'
                      ? 'border-success/20 bg-success/10 text-success'
                      : 'border-warning/20 bg-warning/10 text-warning'
                  }`}>
                    <ShieldCheck size={11} />
                    {patient.status}
                  </span>
                </div>
              </div>
              <ChevronRight size={18} className="text-primary-500" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
