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
  MapPin,
  Settings,
  ShieldCheck,
  Star,
  Store,
  User,
} from 'lucide-react';
import { clearSession, getCurrentUser } from '@/lib/userStore';

export default function ChefProfilePage() {
  const router = useRouter();
  const [chefName, setChefName] = useState('Chef Kwame');

  useEffect(() => {
    queueMicrotask(() => {
      const chef = getCurrentUser();
      setChefName(chef?.fullName || 'Chef Kwame');
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
              CK
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-2xl font-black text-surface-900">{chefName}</h1>
                <CheckCircle size={18} className="shrink-0 text-success" />
              </div>
              <p className="mt-1 text-sm font-semibold text-surface-500">Verified Chef</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-black text-success">
                  <ShieldCheck size={13} />
                  Active
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-black text-primary-700">
                  <Star size={13} />
                  4.8 (128 reviews)
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/chef/notifications"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-surface-100 bg-surface-50 text-surface-500 transition-colors hover:text-primary-600"
            aria-label="Profile settings"
          >
            <Settings size={19} />
          </Link>
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-4">
        <h2 className="px-2 pb-3 text-sm font-black text-surface-900">Kitchen Information</h2>
        <div className="divide-y divide-surface-100">
          <MenuRow icon={Store} label="Kitchen Name" detail="Kwame's Healthy Kitchen" />
          <MenuRow icon={MapPin} label="Location" detail="Buea, Fako, Cameroon" />
          <MenuRow icon={CalendarDays} label="Availability" detail="Mon-Sun (6:00 AM - 8:00 PM)" />
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-4">
        <div className="flex items-center justify-between gap-4 px-2 pb-3">
          <h2 className="text-sm font-black text-surface-900">Documents and Verification</h2>
          <span className="inline-flex items-center gap-1 text-xs font-black text-success">
            All Verified
            <CheckCircle size={13} />
          </span>
        </div>
        <div className="divide-y divide-surface-100">
          <MenuRow icon={FileCheck} label="Hygiene Certification" detail="Approved by admin operations" />
          <MenuRow icon={ShieldCheck} label="Kitchen Verification" detail="Secure and active" />
        </div>
      </section>

      <section className="card-medical rounded-2xl border-surface-100 p-4">
        <div className="divide-y divide-surface-100">
          <MenuRow icon={CreditCard} label="Payouts & Earnings" detail="Weekly payout summary" href="/chef/earnings" />
          <MenuRow icon={Bell} label="Notifications" detail="Operational alerts" href="/chef/notifications" />
          <MenuRow icon={Star} label="Kitchen Performance" detail="Reliability and completion rate" href="/chef/performance" />
          <MenuRow icon={HelpCircle} label="Help & Support" detail="CareCuisin operations desk" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-2 py-4 text-left text-alert transition-colors hover:bg-alert/10"
          >
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
    return (
      <Link href={href} className="flex items-center gap-3 px-2 py-4 transition-colors hover:bg-surface-50">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className="flex w-full items-center gap-3 px-2 py-4 text-left transition-colors hover:bg-surface-50">
      {content}
    </button>
  );
}
