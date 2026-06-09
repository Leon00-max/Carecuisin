'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CalendarClock,
  CheckSquare,
  ClipboardList,
  MessageSquare,
  Send,
  Stethoscope,
  Users,
  Video,
} from 'lucide-react';
import {
  CONSULTATIONS,
  DASHBOARD_TASKS,
  DIETITIAN_PATIENTS,
  DIETITIAN_STATS,
  statusTone,
} from '@/lib/dietitianPortalData';
import { getCurrentUser, getUsers } from '@/lib/userStore';

function initials(name) {
  return String(name || 'Patient')
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function metricTone(tone) {
  if (tone === 'success') return 'border-success/20 bg-success/10 text-success';
  if (tone === 'warning') return 'border-warning/20 bg-warning/10 text-warning';
  if (tone === 'surface') return 'border-surface-100 bg-surface-50 text-surface-600';
  return 'border-primary-100 bg-primary-50 text-primary-700';
}

export default function DietitianDashboard() {
  const [dietitianName, setDietitianName] = useState('Dr. Ambe Florence');
  const [patients, setPatients] = useState(DIETITIAN_PATIENTS);

  useEffect(() => {
    queueMicrotask(() => {
      const dietitian = getCurrentUser();
      const storedPatients = getUsers()
        .filter(user => user.role === 'patient')
        .map((user, index) => ({
          ...DIETITIAN_PATIENTS[index % DIETITIAN_PATIENTS.length],
          id: user.id,
          name: user.fullName || DIETITIAN_PATIENTS[index % DIETITIAN_PATIENTS.length].name,
        }));

      setDietitianName(dietitian?.fullName || 'Dr. Ambe Florence');
      setPatients(storedPatients.length ? storedPatients : DIETITIAN_PATIENTS);
    });
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-sm font-black text-white shadow-sm shadow-primary-200">
            CC
          </div>
          <div>
            <p className="text-sm font-black leading-none text-surface-900">CareCuisin</p>
            <p className="mt-1 text-xs font-semibold text-primary-600">Clinical nutrition workspace</p>
          </div>
        </div>
        <Link
          href="/dietitian/notifications"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-100 bg-white text-surface-500 shadow-sm transition-colors hover:text-primary-600"
          aria-label="Open notifications"
        >
          <Bell size={19} />
        </Link>
      </header>

      <section>
        <p className="text-2xl font-black tracking-tight text-surface-900">Good morning, {dietitianName}</p>
        <p className="mt-1 text-sm text-surface-500">You have {patients.filter(patient => patient.status !== 'Completed').length} active patients.</p>
      </section>

      <section className="card-medical rounded-2xl border-primary-100 bg-primary-50 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-black text-surface-900">Today&apos;s Schedule</h1>
            <p className="mt-1 text-xs text-primary-700">Your clinical workload at a glance.</p>
          </div>
          <span className="rounded-full border border-primary-100 bg-white px-3 py-1 text-xs font-black text-primary-700">
            Today
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DIETITIAN_STATS.map((item, index) => {
            const icons = [Users, ClipboardList, CalendarClock, Send];
            const Icon = icons[index];
            return (
              <div key={item.label} className={`rounded-2xl border bg-white p-4 ${metricTone(item.tone)}`}>
                <Icon size={18} />
                <p className="mt-3 text-2xl font-black">{item.value}</p>
                <p className="mt-1 text-xs font-bold text-surface-500">{item.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-black text-surface-900">Upcoming Consultations</h2>
          <Link href="/dietitian/availability" className="text-xs font-bold text-primary-600">View All</Link>
        </div>
        <div className="space-y-3">
          {CONSULTATIONS.map(item => (
            <div key={`${item.time}-${item.patient}`} className="flex items-center gap-3 rounded-2xl border border-surface-100 bg-surface-50 p-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <CalendarClock size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-surface-900">{item.patient}</p>
                <p className="mt-1 text-xs text-surface-500">{item.time} - {item.type}</p>
              </div>
              <Link
                href="/dietitian/messages"
                className="inline-flex items-center gap-1 rounded-full border border-primary-100 bg-white px-3 py-1 text-xs font-black text-primary-700"
              >
                {item.action === 'Video' ? <Video size={13} /> : <MessageSquare size={13} />}
                {item.action}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-surface-900">Recent Patients</h2>
          <Link href="/dietitian/patients" className="text-xs font-bold text-primary-600">View All</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {patients.slice(0, 4).map(patient => (
            <Link
              key={patient.id}
              href={`/dietitian/patient-overview?patient=${encodeURIComponent(patient.id)}`}
              className="block rounded-2xl border border-surface-100 bg-white p-4 shadow-sm transition-all hover:border-primary-100 hover:bg-primary-50/50 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-black text-primary-700">
                  {initials(patient.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-surface-900">{patient.name}</p>
                  <p className="mt-1 truncate text-xs text-surface-500">{patient.condition}</p>
                  <span className={`mt-2 inline-flex rounded-full border px-2 py-1 text-[10px] font-black ${statusTone(patient.status)}`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-black text-surface-900">My Tasks</h2>
          <Link href="/dietitian/plans" className="text-xs font-bold text-primary-600">View All</Link>
        </div>
        <div className="space-y-3">
          {DASHBOARD_TASKS.map(task => (
            <div key={task.label} className="flex items-center gap-3 rounded-2xl border border-surface-100 bg-surface-50 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <CheckSquare size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-surface-900">{task.label}</p>
                <p className="mt-1 text-xs text-surface-500">{task.detail}</p>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-black text-surface-500">
                {task.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-primary-100 bg-primary-50 p-4">
        <div className="flex items-start gap-3">
          <Stethoscope size={18} className="mt-0.5 shrink-0 text-primary-600" />
          <p className="text-xs leading-relaxed text-primary-700">
            You are the clinical decision-maker. Patients see safe public guidance while chefs receive preparation-safe instructions only.
          </p>
        </div>
      </section>
    </div>
  );
}
