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
import { DIETITIAN_PATIENTS, statusTone } from '@/lib/dietitianPortalData';

const TABS = ['Active', 'Pending', 'Completed'];

export default function MyPatientsPage() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('Active');

  const patients = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return DIETITIAN_PATIENTS.filter(patient => {
      const matchesTab = tab === 'Active'
        ? patient.status === 'Active Plan'
        : tab === 'Pending'
        ? patient.status === 'Pending Review'
        : patient.status === 'Completed';
      const matchesQuery = !needle
        || patient.name.toLowerCase().includes(needle)
        || patient.condition.toLowerCase().includes(needle);
      return matchesTab && matchesQuery;
    });
  }, [query, tab]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <header>
        <span className="badge-clinical gap-2">
          <Users size={14} />
          Patient list
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-surface-900">My Patients</h1>
        <p className="mt-2 text-sm text-surface-500">Assigned patients, plan status, and active clinical categories.</p>
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
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-surface-100 bg-white text-primary-600 shadow-sm"
          aria-label="Filter patients"
        >
          <Filter size={18} />
        </button>
      </section>

      <section className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(item => {
          const active = tab === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`min-w-[104px] rounded-full border px-4 py-2 text-xs font-black transition-colors ${
                active
                  ? 'border-primary-200 bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                  : 'border-surface-100 bg-white text-surface-500 hover:bg-surface-50'
              }`}
            >
              {item}
            </button>
          );
        })}
      </section>

      <section className="space-y-3">
        {patients.map(patient => (
          <Link
            key={patient.id}
            href={`/dietitian/patient-overview?patient=${encodeURIComponent(patient.id)}`}
            className="block rounded-2xl border border-surface-100 bg-white p-4 shadow-sm transition-all hover:border-primary-100 hover:bg-primary-50/50 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                <UserRound size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-black text-surface-900">{patient.name}</h2>
                <p className="mt-1 text-xs text-surface-500">{patient.age} years - {patient.sex}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary-100 bg-primary-50 px-2 py-1 text-[10px] font-black text-primary-700">
                    <HeartPulse size={11} />
                    {patient.condition}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-black ${statusTone(patient.status)}`}>
                    <ShieldCheck size={11} />
                    {patient.status}
                  </span>
                  <span className="rounded-full bg-surface-50 px-2 py-1 text-[10px] font-black text-surface-500">
                    {patient.week}
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
