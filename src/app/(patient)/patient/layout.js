'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  UtensilsCrossed,
  TrendingUp,
  MessageSquare,
  User,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { clearSession, getCurrentUserId, getUserById } from '@/lib/userStore';

const NAV_ITEMS = [
  { href: '/patient/dashboard', label: 'Today', icon: Home },
  { href: '/patient/meal-plan', label: 'Meals', icon: UtensilsCrossed },
  { href: '/patient/progress', label: 'Progress', icon: TrendingUp },
  { href: '/patient/messages', label: 'Messages', icon: MessageSquare },
  { href: '/patient/profile', label: 'Profile', icon: User },
];

export default function PatientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const userId = getCurrentUserId();
    queueMicrotask(() => {
      setPatient(userId ? getUserById(userId) : null);
    });
  }, []);

  const patientName = patient?.fullName || 'Patient';
  const initials = patientName
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'P';

  const handleLogout = () => {
    clearSession();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-surface-50 text-surface-800">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="hidden md:flex w-64 shrink-0 flex-col justify-between border-r border-surface-100 bg-white/80 p-6">
          <div className="space-y-8">
            <Link href="/patient/dashboard" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-sm font-black text-white shadow-sm shadow-primary-200">
                CC
              </span>
              <div>
                <p className="text-sm font-black leading-none text-surface-900">CareCuisin</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-primary-600">
                  Wellness portal
                </p>
              </div>
            </Link>

            <div className="card-medical rounded-2xl border-surface-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-sm font-black text-primary-700">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-surface-900">{patientName}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success ring-4 ring-success/10" />
                    Care plan active
                  </p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                        : 'text-surface-500 hover:bg-surface-50 hover:text-surface-900'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-primary-600' : 'text-surface-400'} />
                    <span>{label}</span>
                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-primary-500 ring-4 ring-primary-100" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4 border-t border-surface-100 pt-5">
            <div className="rounded-2xl border border-success/20 bg-success/10 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-success">
                <ShieldCheck size={15} />
                Verified care space
              </div>
              <p className="mt-2 text-xs leading-relaxed text-surface-500">
                Your meals, messages, and health preferences stay coordinated with your care team.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-surface-500 transition-colors hover:bg-alert/10 hover:text-alert"
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto p-4 pb-24 md:p-8">
          {children}
        </main>
      </div>

      <BottomNav role="patient" />
    </div>
  );
}
