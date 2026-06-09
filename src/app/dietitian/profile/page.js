'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  CreditCard,
  FileCheck,
  HelpCircle,
  LogOut,
  Settings,
  ShieldCheck,
  Star,
  Stethoscope,
  User,
} from 'lucide-react';
import { clearSession, getCurrentUser } from '@/lib/userStore';

const SPECIALTIES = ['Diabetes', 'Hypertension', 'Kidney Disease', 'Weight Management'];

export default function DietitianProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('Dr. Ambe Florence');

  useEffect(() => {
    queueMicrotask(() => {
      const user = getCurrentUser();
      setName(user?.fullName || 'Dr. Ambe Florence');
    });
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push('/auth/login');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-4">
      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary-50 text-2xl font-black text-primary-700 ring-4 ring-primary-100">
              AF
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-2xl font-black text-surface-900">{name}</h1>
                <CheckCircle size={18} className="shrink-0 text-success" />
              </div>
              <p className="mt-1 text-sm font-semibold text-surface-500">Registered Dietitian</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-black text-success">
                  <ShieldCheck size={13} />
                  Verified
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-black text-primary-700">
                  <Star size={13} />
                  4.9 (156 reviews)
                </span>
              </div>
            </div>
          </div>
          <Link href="/dietitian/notifications" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-surface-100 bg-surface-50 text-surface-500">
            <Settings size={19} />
          </Link>
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-5">
        <div className="flex items-center gap-2">
          <Stethoscope size={18} className="text-primary-600" />
          <h2 className="text-sm font-black text-surface-900">Professional Information</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Info label="License Number" value="RDC/CMR/2024/0456" />
          <Info label="Qualification" value="BSc Nutrition & Dietetics" />
          <Info label="Workplace" value="Buea Regional Hospital" />
          <Info label="Experience" value="8+ years" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {SPECIALTIES.map(item => (
            <span key={item} className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-black text-primary-700">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-4">
        <div className="divide-y divide-surface-100">
          <MenuRow icon={FileCheck} label="Documents" detail="Approved by admin" />
          <MenuRow icon={CalendarDays} label="Availability" detail="Consultation hours" href="/dietitian/availability" />
          <MenuRow icon={CreditCard} label="Payouts & Earnings" detail="View earnings" />
          <MenuRow icon={Bell} label="Notifications" detail="Clinical alerts" href="/dietitian/notifications" />
          <MenuRow icon={HelpCircle} label="Help & Support" detail="CareCuisin assistance" />
          <MenuRow icon={User} label="Account Settings" detail="Security and identity" />
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 px-2 py-4 text-left text-alert transition-colors hover:bg-alert/10">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-alert/20 bg-alert/10">
              <LogOut size={17} />
            </span>
            <span className="flex-1 text-sm font-black">Log Out</span>
            <LogOut size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-surface-100 bg-surface-50 p-4">
      <p className="text-[10px] font-black uppercase tracking-wider text-surface-400">{label}</p>
      <p className="mt-1 text-sm font-black text-surface-900">{value}</p>
    </div>
  );
}

function MenuRow({ icon: Icon, label, detail, href }) {
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-black text-surface-900">{label}</span>
        <span className="block truncate text-xs text-surface-500">{detail}</span>
      </span>
      <ChevronRight size={17} className="text-surface-400" />
    </>
  );

  if (href) {
    return <Link href={href} className="flex items-center gap-3 px-2 py-4 transition-colors hover:bg-surface-50">{content}</Link>;
  }
  return <button type="button" className="flex w-full items-center gap-3 px-2 py-4 text-left transition-colors hover:bg-surface-50">{content}</button>;
}
